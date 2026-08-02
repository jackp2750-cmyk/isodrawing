-- SpoolMate v3.18 business workspace and seat-entitlement migration.
-- Run once in Supabase SQL Editor after the v2.95 and v2.96 migrations.

alter table public.companies
  add column if not exists license_status text,
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists grace_ends_at timestamptz,
  add column if not exists included_seats integer,
  add column if not exists extra_seats integer;

-- Preserve all existing companies as permanently active. New businesses start
-- with their own 30-day trial and five included seats.
update public.companies
set license_status = coalesce(license_status, 'full'),
    trial_started_at = coalesce(trial_started_at, created_at, now()),
    trial_ends_at = coalesce(trial_ends_at, created_at + interval '30 days', now() + interval '30 days'),
    included_seats = coalesce(included_seats, 5),
    extra_seats = coalesce(extra_seats, 0);

alter table public.companies
  alter column license_status set default 'trial',
  alter column license_status set not null,
  alter column trial_started_at set default now(),
  alter column trial_started_at set not null,
  alter column trial_ends_at set default (now() + interval '30 days'),
  alter column trial_ends_at set not null,
  alter column included_seats set default 5,
  alter column included_seats set not null,
  alter column extra_seats set default 0,
  alter column extra_seats set not null;

alter table public.companies
  drop constraint if exists companies_license_status_check,
  drop constraint if exists companies_included_seats_check,
  drop constraint if exists companies_extra_seats_check;

alter table public.companies
  add constraint companies_license_status_check
    check (license_status in ('trial', 'paid', 'grace', 'full', 'expired')),
  add constraint companies_included_seats_check
    check (included_seats between 1 and 10000),
  add constraint companies_extra_seats_check
    check (extra_seats between 0 and 10000);

alter table public.company_members
  drop constraint if exists company_members_role_check,
  drop constraint if exists company_members_status_check;

alter table public.company_members
  add constraint company_members_role_check
    check (role in ('owner', 'admin', 'designer', 'checker', 'workshop', 'viewer', 'member')),
  add constraint company_members_status_check
    check (status in ('pending', 'invited', 'approved', 'suspended', 'rejected'));

-- Business drawings survive the departure or deletion of the employee who
-- created them. Personal drawings still require an owner.
alter table public.spool_projects
  drop constraint if exists spool_projects_owner_id_fkey;

alter table public.spool_projects
  alter column owner_id drop not null;

alter table public.spool_projects
  add constraint spool_projects_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete set null,
  drop constraint if exists spool_projects_workspace_owner_check;

alter table public.spool_projects
  add constraint spool_projects_workspace_owner_check
    check (owner_id is not null or company_id is not null);

create or replace function public.company_seat_limit(target_company_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select greatest(1, included_seats + extra_seats)
  from public.companies
  where id = target_company_id
$$;

create or replace function public.company_seat_usage(target_company_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.company_members
  where company_id = target_company_id
    and status in ('pending', 'invited', 'approved')
$$;

create or replace function public.has_active_company_license(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.companies
    where id = target_company_id
      and (
        license_status in ('paid', 'full')
        or (license_status = 'trial' and trial_ends_at > now())
        or (license_status = 'grace' and grace_ends_at > now())
      )
  )
$$;

create or replace function public.has_active_workspace_license(user_id uuid, target_company_id uuid default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when target_company_id is null then public.has_active_license(user_id)
    else public.has_active_company_license(target_company_id)
      and public.is_company_member(target_company_id, user_id)
  end
$$;

create or replace function public.enforce_company_seat_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seat_limit integer;
  seat_usage integer;
begin
  if new.status not in ('pending', 'invited', 'approved') then
    return new;
  end if;
  if tg_op = 'UPDATE'
     and old.status in ('pending', 'invited', 'approved')
     and old.company_id = new.company_id then
    return new;
  end if;
  perform pg_advisory_xact_lock(hashtext(new.company_id::text));
  seat_limit := public.company_seat_limit(new.company_id);
  seat_usage := public.company_seat_usage(new.company_id);
  if seat_usage >= seat_limit then
    raise exception 'This business has used all % seats. Add an extra seat before inviting another person.', seat_limit;
  end if;
  return new;
end;
$$;

drop trigger if exists company_members_enforce_seat_capacity on public.company_members;
create trigger company_members_enforce_seat_capacity
before insert or update of company_id, status on public.company_members
for each row execute function public.enforce_company_seat_capacity();

create or replace function public.protect_company_entitlements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and (
    new.license_status is distinct from old.license_status
    or new.trial_started_at is distinct from old.trial_started_at
    or new.trial_ends_at is distinct from old.trial_ends_at
    or new.grace_ends_at is distinct from old.grace_ends_at
    or new.included_seats is distinct from old.included_seats
    or new.extra_seats is distinct from old.extra_seats
  ) then
    raise exception 'Business licence and seat entitlements can only be changed by the billing service.';
  end if;
  return new;
end;
$$;

drop trigger if exists companies_protect_entitlements on public.companies;
create trigger companies_protect_entitlements
before update on public.companies
for each row execute function public.protect_company_entitlements();

create or replace function public.create_company(company_name text)
returns table(company_id uuid, invite_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_company_id uuid;
  new_invite_code text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to create a business workspace.';
  end if;

  insert into public.companies (
    name, created_by, license_status, trial_started_at, trial_ends_at, included_seats, extra_seats
  )
  values (
    coalesce(left(nullif(trim(company_name), ''), 80), 'SpoolMate Business'),
    auth.uid(), 'trial', now(), now() + interval '30 days', 5, 0
  )
  returning id, companies.invite_code into new_company_id, new_invite_code;

  insert into public.company_members (company_id, user_id, email, role, status)
  values (
    new_company_id,
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', ''),
    'owner',
    'approved'
  );

  return query select new_company_id, new_invite_code;
end;
$$;

create or replace function public.join_company_by_code(join_code text)
returns table(company_id uuid, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_company_id uuid;
  joined_status text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to join a business workspace.';
  end if;

  select id into target_company_id
  from public.companies
  where upper(invite_code) = upper(trim(join_code))
  limit 1;

  if target_company_id is null then
    raise exception 'No business workspace found for that invite code.';
  end if;

  if not public.has_active_company_license(target_company_id) then
    raise exception 'That business workspace is currently read only.';
  end if;

  insert into public.company_members (company_id, user_id, email, role, status)
  values (
    target_company_id,
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', ''),
    'workshop',
    'pending'
  )
  on conflict on constraint company_members_pkey do update
    set email = excluded.email,
        status = case
          when public.company_members.status in ('rejected', 'suspended') then 'pending'
          else public.company_members.status
        end,
        updated_at = now()
  returning public.company_members.status into joined_status;

  return query select target_company_id, joined_status;
end;
$$;

-- Workspace-aware project writes. A personal licence applies only to personal
-- projects; a business licence plus approved membership applies to business projects.
drop policy if exists "Users can create their own spool projects" on public.spool_projects;
create policy "Users can create their own spool projects"
on public.spool_projects
for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and public.has_active_workspace_license((select auth.uid()), company_id)
);

drop policy if exists "Users can update their own spool projects" on public.spool_projects;
create policy "Users can update their own spool projects"
on public.spool_projects
for update to authenticated
using (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    (company_id is null and owner_id = (select auth.uid()))
    or (company_id is not null and public.is_company_member(company_id, (select auth.uid())))
  )
)
with check (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    (company_id is null and owner_id = (select auth.uid()))
    or (company_id is not null and public.is_company_member(company_id, (select auth.uid())))
  )
);

drop policy if exists "Users can delete their own spool projects" on public.spool_projects;
create policy "Users can delete their own spool projects"
on public.spool_projects
for delete to authenticated
using (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    (company_id is null and owner_id = (select auth.uid()))
    or (company_id is not null and public.is_company_admin(company_id, (select auth.uid())))
  )
);

-- Business membership and collaboration use the business entitlement, so an
-- employee can keep working even when their separate Personal trial has ended.
drop policy if exists "Company admins can update companies" on public.companies;
create policy "Company admins can update companies"
on public.companies
for update to authenticated
using (
  public.has_active_company_license(id)
  and public.is_company_admin(id, (select auth.uid()))
)
with check (
  public.has_active_company_license(id)
  and public.is_company_admin(id, (select auth.uid()))
);

drop policy if exists "Users can request company membership" on public.company_members;
create policy "Users can request company membership"
on public.company_members
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and role = 'workshop'
  and public.has_active_company_license(company_id)
);

drop policy if exists "Admins can update company memberships" on public.company_members;
drop policy if exists "Owners can update company memberships" on public.company_members;
create policy "Owners can update company memberships"
on public.company_members
for update to authenticated
using (
  public.has_active_company_license(company_id)
  and public.is_company_owner(company_id, (select auth.uid()))
)
with check (
  public.has_active_company_license(company_id)
  and public.is_company_owner(company_id, (select auth.uid()))
);

drop policy if exists "Admins can approve company members" on public.company_members;
create policy "Admins can approve company members"
on public.company_members
for update to authenticated
using (
  public.has_active_company_license(company_id)
  and public.is_company_admin(company_id, (select auth.uid()))
  and role not in ('owner', 'admin')
)
with check (
  public.has_active_company_license(company_id)
  and public.is_company_admin(company_id, (select auth.uid()))
  and role not in ('owner', 'admin')
);

drop policy if exists "Users can leave company memberships" on public.company_members;
create policy "Users can leave company memberships"
on public.company_members
for delete to authenticated
using (
  user_id = (select auth.uid())
  or (
    public.has_active_company_license(company_id)
    and (
      public.is_company_owner(company_id, (select auth.uid()))
      or (
        public.is_company_admin(company_id, (select auth.uid()))
        and role not in ('owner', 'admin')
      )
    )
  )
);

drop policy if exists "Users can add project comments" on public.project_comments;
create policy "Users can add project comments"
on public.project_comments
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    (company_id is not null and public.is_company_member(company_id, (select auth.uid())))
    or exists (
      select 1 from public.spool_projects
      where spool_projects.id = project_comments.project_id
        and spool_projects.company_id is null
        and spool_projects.owner_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can manage their comments" on public.project_comments;
create policy "Users can manage their comments"
on public.project_comments
for update to authenticated
using (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    author_id = (select auth.uid())
    or (company_id is not null and public.is_company_admin(company_id, (select auth.uid())))
  )
)
with check (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    author_id = (select auth.uid())
    or (company_id is not null and public.is_company_admin(company_id, (select auth.uid())))
  )
);

drop policy if exists "Users can delete their comments" on public.project_comments;
create policy "Users can delete their comments"
on public.project_comments
for delete to authenticated
using (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    author_id = (select auth.uid())
    or (company_id is not null and public.is_company_admin(company_id, (select auth.uid())))
  )
);

drop policy if exists "Approved members can add team messages" on public.team_messages;
create policy "Approved members can add team messages"
on public.team_messages
for insert to authenticated
with check (
  author_id = (select auth.uid())
  and public.has_active_company_license(team_messages.company_id)
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
);

drop policy if exists "Authors and admins can update team messages" on public.team_messages;
create policy "Authors and admins can update team messages"
on public.team_messages
for update to authenticated
using (
  public.has_active_company_license(team_messages.company_id)
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    author_id = (select auth.uid())
    or public.is_company_admin(team_messages.company_id, (select auth.uid()))
  )
)
with check (
  public.has_active_company_license(team_messages.company_id)
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    author_id = (select auth.uid())
    or public.is_company_admin(team_messages.company_id, (select auth.uid()))
  )
);

drop policy if exists "Authors and admins can delete team messages" on public.team_messages;
create policy "Authors and admins can delete team messages"
on public.team_messages
for delete to authenticated
using (
  public.has_active_company_license(team_messages.company_id)
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    author_id = (select auth.uid())
    or public.is_company_admin(team_messages.company_id, (select auth.uid()))
  )
);

drop policy if exists "Team members can add spool photos" on storage.objects;
create policy "Team members can add spool photos"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'spool-photos'
  and (
    (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and public.has_active_license((select auth.uid()))
    )
    or (
      public.has_active_company_license(((storage.foldername(name))[1])::uuid)
      and public.is_company_member(((storage.foldername(name))[1])::uuid, (select auth.uid()))
    )
  )
);

drop policy if exists "Authors and admins can manage spool photos" on storage.objects;
create policy "Authors and admins can manage spool photos"
on storage.objects
for update to authenticated
using (
  bucket_id = 'spool-photos'
  and (
    (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and owner_id = (select auth.uid()::text)
      and public.has_active_license((select auth.uid()))
    )
    or (
      public.has_active_company_license(((storage.foldername(name))[1])::uuid)
      and public.is_company_member(((storage.foldername(name))[1])::uuid, (select auth.uid()))
      and (
        owner_id = (select auth.uid()::text)
        or public.is_company_admin(((storage.foldername(name))[1])::uuid, (select auth.uid()))
      )
    )
  )
)
with check (
  bucket_id = 'spool-photos'
  and (
    (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and owner_id = (select auth.uid()::text)
      and public.has_active_license((select auth.uid()))
    )
    or (
      public.has_active_company_license(((storage.foldername(name))[1])::uuid)
      and public.is_company_member(((storage.foldername(name))[1])::uuid, (select auth.uid()))
      and (
        owner_id = (select auth.uid()::text)
        or public.is_company_admin(((storage.foldername(name))[1])::uuid, (select auth.uid()))
      )
    )
  )
);

drop policy if exists "Authors and admins can delete spool photos" on storage.objects;
create policy "Authors and admins can delete spool photos"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'spool-photos'
  and (
    (
      (storage.foldername(name))[1] = (select auth.uid())::text
      and owner_id = (select auth.uid()::text)
      and public.has_active_license((select auth.uid()))
    )
    or (
      public.has_active_company_license(((storage.foldername(name))[1])::uuid)
      and public.is_company_member(((storage.foldername(name))[1])::uuid, (select auth.uid()))
      and (
        owner_id = (select auth.uid()::text)
        or public.is_company_admin(((storage.foldername(name))[1])::uuid, (select auth.uid()))
      )
    )
  )
);

revoke all on function public.company_seat_limit(uuid) from public, anon, authenticated;
revoke all on function public.company_seat_usage(uuid) from public, anon, authenticated;
revoke all on function public.has_active_company_license(uuid) from public, anon, authenticated;
revoke all on function public.has_active_workspace_license(uuid, uuid) from public, anon, authenticated;
revoke all on function public.create_company(text) from public, anon, authenticated;
revoke all on function public.join_company_by_code(text) from public, anon, authenticated;

grant execute on function public.company_seat_limit(uuid) to authenticated;
grant execute on function public.company_seat_usage(uuid) to authenticated;
grant execute on function public.has_active_company_license(uuid) to authenticated;
grant execute on function public.has_active_workspace_license(uuid, uuid) to authenticated;
grant execute on function public.create_company(text) to authenticated;
grant execute on function public.join_company_by_code(text) to authenticated;
