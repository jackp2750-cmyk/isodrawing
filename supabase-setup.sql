-- SpoolMate cloud project storage and simple licence setup.
-- Paste this into Supabase SQL Editor, then run it once for your project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  license_status text not null default 'trial'
    check (license_status in ('trial', 'paid', 'grace', 'full', 'expired')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '30 days'),
  grace_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists grace_ends_at timestamptz;

alter table public.profiles
  add column if not exists dashboard_preferences jsonb not null default '{}'::jsonb;

alter table public.profiles
  drop constraint if exists profiles_dashboard_preferences_object_check;

alter table public.profiles
  add constraint profiles_dashboard_preferences_object_check
  check (jsonb_typeof(dashboard_preferences) = 'object');

alter table public.profiles
  drop constraint if exists profiles_license_status_check;

alter table public.profiles
  add constraint profiles_license_status_check
  check (license_status in ('trial', 'paid', 'grace', 'full', 'expired'));

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique default upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  role text not null default 'member'
    check (role in ('owner', 'admin', 'member')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table if not exists public.spool_projects (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  project_info jsonb not null default '{}'::jsonb,
  drawing_state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.spool_projects
  add column if not exists company_id uuid references public.companies(id) on delete set null;

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  company_id uuid references public.companies(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_email text,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_comments
  add column if not exists mentions text[] not null default '{}'::text[],
  add column if not exists photo_path text,
  add column if not exists resolved boolean not null default false,
  add column if not exists resolved_at timestamptz,
  add column if not exists resolved_by uuid references auth.users(id) on delete set null;

create table if not exists public.team_messages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_email text,
  body text not null check (char_length(trim(body)) between 1 and 500),
  pinned boolean not null default false,
  completed boolean not null default false,
  completed_at timestamptz,
  remove_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_invite_code_idx
  on public.companies (invite_code);

create index if not exists company_members_user_idx
  on public.company_members (user_id, status);

create index if not exists company_members_company_idx
  on public.company_members (company_id, status);

create index if not exists spool_projects_owner_updated_idx
  on public.spool_projects (owner_id, updated_at desc);

create index if not exists spool_projects_company_updated_idx
  on public.spool_projects (company_id, updated_at desc);

create index if not exists project_comments_project_created_idx
  on public.project_comments (project_id, created_at desc);

create index if not exists project_comments_project_resolved_idx
  on public.project_comments (project_id, resolved, created_at desc);

create index if not exists team_messages_company_created_idx
  on public.team_messages (company_id, completed, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists company_members_set_updated_at on public.company_members;
create trigger company_members_set_updated_at
before update on public.company_members
for each row execute function public.set_updated_at();

drop trigger if exists spool_projects_set_updated_at on public.spool_projects;
create trigger spool_projects_set_updated_at
before update on public.spool_projects
for each row execute function public.set_updated_at();

drop trigger if exists project_comments_set_updated_at on public.project_comments;
create trigger project_comments_set_updated_at
before update on public.project_comments
for each row execute function public.set_updated_at();

drop trigger if exists team_messages_set_updated_at on public.team_messages;
create trigger team_messages_set_updated_at
before update on public.team_messages
for each row execute function public.set_updated_at();

-- Drop old helper/RPC versions first so this setup can repair earlier installs cleanly.
-- Cascade only removes dependent RLS policies, which are recreated later in this file.
drop function if exists public.create_company(text);
drop function if exists public.join_company_by_code(text);
drop function if exists public.is_company_member(uuid, uuid) cascade;
drop function if exists public.is_company_admin(uuid, uuid) cascade;
drop function if exists public.is_company_owner(uuid, uuid) cascade;
drop function if exists public.has_active_license(uuid) cascade;

create or replace function public.has_active_license(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = $1
      and (
        license_status in ('paid', 'full')
        or (license_status = 'trial' and trial_ends_at > now())
        or (license_status = 'grace' and grace_ends_at > now())
      )
  );
$$;

create or replace function public.is_company_member(company_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members
    where public.company_members.company_id = $1
      and public.company_members.user_id = $2
      and company_members.status = 'approved'
  );
$$;

create or replace function public.is_company_admin(company_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members
    where public.company_members.company_id = $1
      and public.company_members.user_id = $2
      and company_members.status = 'approved'
      and company_members.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_company_owner(company_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members
    where public.company_members.company_id = $1
      and public.company_members.user_id = $2
      and company_members.status = 'approved'
      and company_members.role = 'owner'
  );
$$;

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
    raise exception 'You must be signed in to create a company.';
  end if;

  if not public.has_active_license(auth.uid()) then
    raise exception 'An active trial or licence is required to create a company.';
  end if;

  insert into public.companies (name, created_by)
  values (coalesce(left(nullif(trim(company_name), ''), 80), 'SpoolMate Company'), auth.uid())
  returning id, companies.invite_code into new_company_id, new_invite_code;

  insert into public.company_members (company_id, user_id, email, role, status)
  values (
    new_company_id,
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', ''),
    'owner',
    'approved'
  )
  on conflict on constraint company_members_pkey do update
    set role = 'owner',
        status = 'approved',
        email = excluded.email;

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
    raise exception 'You must be signed in to join a company.';
  end if;

  if not public.has_active_license(auth.uid()) then
    raise exception 'An active trial or licence is required to join a company.';
  end if;

  select id into target_company_id
  from public.companies
  where invite_code = upper(trim(join_code))
  limit 1;

  if target_company_id is null then
    raise exception 'No company found for that invite code.';
  end if;

  insert into public.company_members (company_id, user_id, email, role, status)
  values (
    target_company_id,
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', ''),
    'member',
    'pending'
  )
  on conflict on constraint company_members_pkey do update
    set email = excluded.email,
        status = case
          when public.company_members.status = 'rejected' then 'pending'
          else public.company_members.status
        end
  returning public.company_members.status into joined_status;

  return query select target_company_id, joined_status;
end;
$$;

drop function if exists public.set_project_comment_resolved(uuid, boolean);

create function public.set_project_comment_resolved(comment_id_value uuid, resolved_value boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_company_id uuid;
  target_author_id uuid;
  target_project_id text;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to update a spool message.';
  end if;

  if not public.has_active_license(auth.uid()) then
    raise exception 'An active trial or licence is required.';
  end if;

  select company_id, author_id, project_id
    into target_company_id, target_author_id, target_project_id
  from public.project_comments
  where id = comment_id_value;

  if not found then
    raise exception 'Spool message not found.';
  end if;

  if not (
    target_author_id = auth.uid()
    or (
      target_company_id is not null
      and public.is_company_member(target_company_id, auth.uid())
    )
    or exists (
      select 1
      from public.spool_projects
      where spool_projects.id = target_project_id
        and spool_projects.owner_id = auth.uid()
    )
  ) then
    raise exception 'You do not have permission to update this spool message.';
  end if;

  update public.project_comments
  set resolved = coalesce(resolved_value, false),
      resolved_at = case when coalesce(resolved_value, false) then now() else null end,
      resolved_by = case when coalesce(resolved_value, false) then auth.uid() else null end
  where id = comment_id_value;

  return true;
end;
$$;

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.spool_projects enable row level security;
alter table public.project_comments enable row level security;
alter table public.team_messages enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can create their trial profile" on public.profiles;
create policy "Users can create their trial profile"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
  and license_status = 'trial'
  and trial_ends_at <= now() + interval '31 days'
);

drop policy if exists "Company members can read companies" on public.companies;
create policy "Company members can read companies"
on public.companies
for select
to authenticated
using (
  created_by = (select auth.uid())
  or exists (
    select 1
    from public.company_members
    where company_members.company_id = companies.id
      and company_members.user_id = (select auth.uid())
      and company_members.status in ('pending', 'approved')
  )
);

drop policy if exists "Users can create companies through app" on public.companies;
create policy "Users can create companies through app"
on public.companies
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and public.has_active_license((select auth.uid()))
);

drop policy if exists "Company admins can update companies" on public.companies;
create policy "Company admins can update companies"
on public.companies
for update
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and public.is_company_admin(id, (select auth.uid()))
)
with check (
  public.has_active_license((select auth.uid()))
  and public.is_company_admin(id, (select auth.uid()))
);

drop policy if exists "Users can update their dashboard preferences" on public.profiles;
create policy "Users can update their dashboard preferences"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Company members can read memberships" on public.company_members;
create policy "Company members can read memberships"
on public.company_members
for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.is_company_member(company_id, (select auth.uid()))
  or public.is_company_admin(company_id, (select auth.uid()))
);

drop policy if exists "Users can request company membership" on public.company_members;
create policy "Users can request company membership"
on public.company_members
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and role = 'member'
  and public.has_active_license((select auth.uid()))
);

drop policy if exists "Admins can update company memberships" on public.company_members;
drop policy if exists "Owners can update company memberships" on public.company_members;
drop policy if exists "Admins can approve company members" on public.company_members;

create policy "Owners can update company memberships"
on public.company_members
for update
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and public.is_company_owner(company_id, (select auth.uid()))
)
with check (
  public.has_active_license((select auth.uid()))
  and public.is_company_owner(company_id, (select auth.uid()))
);

create policy "Admins can approve company members"
on public.company_members
for update
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and public.is_company_admin(company_id, (select auth.uid()))
  and role = 'member'
)
with check (
  public.has_active_license((select auth.uid()))
  and public.is_company_admin(company_id, (select auth.uid()))
  and role = 'member'
);

drop policy if exists "Users can leave company memberships" on public.company_members;
create policy "Users can leave company memberships"
on public.company_members
for delete
to authenticated
using (
  user_id = (select auth.uid())
  or (
    public.has_active_license((select auth.uid()))
    and (
      public.is_company_owner(company_id, (select auth.uid()))
      or (
        public.is_company_admin(company_id, (select auth.uid()))
        and role = 'member'
      )
    )
  )
);

drop policy if exists "Users can read their own spool projects" on public.spool_projects;
create policy "Users can read their own spool projects"
on public.spool_projects
for select
to authenticated
using (
  owner_id = (select auth.uid())
  or (
    company_id is not null
    and public.is_company_member(company_id, (select auth.uid()))
  )
);

drop policy if exists "Users can create their own spool projects" on public.spool_projects;
create policy "Users can create their own spool projects"
on public.spool_projects
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
  and (
    company_id is null
    or public.is_company_member(company_id, (select auth.uid()))
  )
);

drop policy if exists "Users can update their own spool projects" on public.spool_projects;
create policy "Users can update their own spool projects"
on public.spool_projects
for update
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_admin(company_id, (select auth.uid()))
    )
  )
)
with check (
  public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_admin(company_id, (select auth.uid()))
    )
  )
);

drop policy if exists "Users can delete their own spool projects" on public.spool_projects;
create policy "Users can delete their own spool projects"
on public.spool_projects
for delete
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_admin(company_id, (select auth.uid()))
    )
  )
);

drop policy if exists "Users can read project comments" on public.project_comments;
create policy "Users can read project comments"
on public.project_comments
for select
to authenticated
using (
  author_id = (select auth.uid())
  or (
    company_id is not null
    and public.is_company_member(company_id, (select auth.uid()))
  )
  or exists (
    select 1
    from public.spool_projects
    where spool_projects.id = project_comments.project_id
      and spool_projects.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can add project comments" on public.project_comments;
create policy "Users can add project comments"
on public.project_comments
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
  and (
    (
      company_id is not null
      and public.is_company_member(company_id, (select auth.uid()))
    )
    or exists (
      select 1
      from public.spool_projects
      where spool_projects.id = project_comments.project_id
        and spool_projects.owner_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can manage their comments" on public.project_comments;
create policy "Users can manage their comments"
on public.project_comments
for update
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and (
    author_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_admin(company_id, (select auth.uid()))
    )
  )
)
with check (
  public.has_active_license((select auth.uid()))
  and (
    author_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_admin(company_id, (select auth.uid()))
    )
  )
);

drop policy if exists "Users can delete their comments" on public.project_comments;
create policy "Users can delete their comments"
on public.project_comments
for delete
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and (
    author_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_admin(company_id, (select auth.uid()))
    )
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'spool-photos',
  'spool-photos',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Team members can read spool photos" on storage.objects;
create policy "Team members can read spool photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'spool-photos'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1
      from public.company_members
      where company_members.company_id::text = (storage.foldername(name))[1]
        and company_members.user_id = (select auth.uid())
        and company_members.status = 'approved'
    )
  )
);

drop policy if exists "Team members can add spool photos" on storage.objects;
create policy "Team members can add spool photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'spool-photos'
  and public.has_active_license((select auth.uid()))
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1
      from public.company_members
      where company_members.company_id::text = (storage.foldername(name))[1]
        and company_members.user_id = (select auth.uid())
        and company_members.status = 'approved'
    )
  )
);

drop policy if exists "Authors and admins can manage spool photos" on storage.objects;
create policy "Authors and admins can manage spool photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'spool-photos'
  and public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid()::text)
    or exists (
      select 1
      from public.company_members
      where company_members.company_id::text = (storage.foldername(name))[1]
        and company_members.user_id = (select auth.uid())
        and company_members.status = 'approved'
        and company_members.role in ('owner', 'admin')
    )
  )
)
with check (
  bucket_id = 'spool-photos'
  and public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid()::text)
    or exists (
      select 1
      from public.company_members
      where company_members.company_id::text = (storage.foldername(name))[1]
        and company_members.user_id = (select auth.uid())
        and company_members.status = 'approved'
        and company_members.role in ('owner', 'admin')
    )
  )
);

drop policy if exists "Authors and admins can delete spool photos" on storage.objects;
create policy "Authors and admins can delete spool photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'spool-photos'
  and public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid()::text)
    or exists (
      select 1
      from public.company_members
      where company_members.company_id::text = (storage.foldername(name))[1]
        and company_members.user_id = (select auth.uid())
        and company_members.status = 'approved'
        and company_members.role in ('owner', 'admin')
    )
  )
);

drop policy if exists "Approved members can read team messages" on public.team_messages;
create policy "Approved members can read team messages"
on public.team_messages
for select
to authenticated
using (
  public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    remove_after is null
    or remove_after > now()
  )
);

drop policy if exists "Approved members can add team messages" on public.team_messages;
create policy "Approved members can add team messages"
on public.team_messages
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
);

drop policy if exists "Authors and admins can update team messages" on public.team_messages;
create policy "Authors and admins can update team messages"
on public.team_messages
for update
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    author_id = (select auth.uid())
    or public.is_company_admin(team_messages.company_id, (select auth.uid()))
  )
)
with check (
  public.has_active_license((select auth.uid()))
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    author_id = (select auth.uid())
    or public.is_company_admin(team_messages.company_id, (select auth.uid()))
  )
);

drop policy if exists "Authors and admins can delete team messages" on public.team_messages;
create policy "Authors and admins can delete team messages"
on public.team_messages
for delete
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
  and (
    author_id = (select auth.uid())
    or public.is_company_admin(team_messages.company_id, (select auth.uid()))
  )
);

grant select, insert on public.profiles to authenticated;
revoke update on public.profiles from authenticated;
grant update (dashboard_preferences) on public.profiles to authenticated;
grant select, insert, update on public.companies to authenticated;
grant select, insert, update, delete on public.company_members to authenticated;
grant select, insert, update, delete on public.spool_projects to authenticated;
grant select, insert, update, delete on public.project_comments to authenticated;
grant select, insert, update, delete on public.team_messages to authenticated;
revoke all on function public.has_active_license(uuid) from public, anon, authenticated;
revoke all on function public.is_company_member(uuid, uuid) from public, anon, authenticated;
revoke all on function public.is_company_admin(uuid, uuid) from public, anon, authenticated;
revoke all on function public.is_company_owner(uuid, uuid) from public, anon, authenticated;
revoke all on function public.create_company(text) from public, anon, authenticated;
revoke all on function public.join_company_by_code(text) from public, anon, authenticated;
revoke all on function public.set_project_comment_resolved(uuid, boolean) from public, anon, authenticated;

grant execute on function public.has_active_license(uuid) to authenticated;
grant execute on function public.is_company_member(uuid, uuid) to authenticated;
grant execute on function public.is_company_admin(uuid, uuid) to authenticated;
grant execute on function public.is_company_owner(uuid, uuid) to authenticated;
grant execute on function public.create_company(text) to authenticated;
grant execute on function public.join_company_by_code(text) to authenticated;
grant execute on function public.set_project_comment_resolved(uuid, boolean) to authenticated;

-- To give someone a full licence, run this manually as the project owner:
-- update public.profiles set license_status = 'full' where email = 'person@example.com';

-- Ask SpoolMate daily AI allowance. This table is private to the protected Edge Function.
create table if not exists public.ai_help_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  used_on date not null default (timezone('utc', now())::date),
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  unique (user_id, used_on)
);

alter table public.ai_help_usage enable row level security;
revoke all on table public.ai_help_usage from anon, authenticated;

create or replace function public.consume_ai_help_allowance(
  p_user_id uuid,
  p_daily_limit integer
)
returns table (
  allowed boolean,
  used_count integer,
  remaining_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer := greatest(coalesce(p_daily_limit, 0), 0);
  v_used integer;
begin
  if p_user_id is null or v_limit = 0 then
    return query select false, 0, 0;
    return;
  end if;

  insert into public.ai_help_usage (user_id, used_on, request_count, updated_at)
  values (p_user_id, timezone('utc', now())::date, 1, now())
  on conflict (user_id, used_on) do update
    set request_count = ai_help_usage.request_count + 1,
        updated_at = now()
    where ai_help_usage.request_count < v_limit
  returning request_count into v_used;

  if v_used is null then
    select request_count
      into v_used
      from public.ai_help_usage
      where user_id = p_user_id
        and used_on = timezone('utc', now())::date;
    return query select false, coalesce(v_used, v_limit), 0;
    return;
  end if;

  return query select true, v_used, greatest(v_limit - v_used, 0);
end;
$$;

create or replace function public.release_ai_help_allowance(p_user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.ai_help_usage
  set request_count = greatest(request_count - 1, 0),
      updated_at = now()
  where user_id = p_user_id
    and used_on = timezone('utc', now())::date;
$$;

revoke all on function public.consume_ai_help_allowance(uuid, integer) from public, anon, authenticated;
revoke all on function public.release_ai_help_allowance(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_help_allowance(uuid, integer) to service_role;
grant execute on function public.release_ai_help_allowance(uuid) to service_role;

-- Private SpoolMate-wide support access. Customer Business Owner/Admin roles
-- are intentionally unrelated to this table. Add the verified operator UUID
-- only after setup; never put a service key in the browser app.
create table if not exists public.platform_support_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'SpoolMate operator'
    check (char_length(display_name) between 1 and 80),
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_admin_audit_log (
  id bigint generated always as identity primary key,
  request_id uuid not null default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  target_user_id uuid references auth.users(id) on delete set null,
  target_company_id uuid references public.companies(id) on delete set null,
  action text not null check (char_length(action) between 2 and 80),
  reason text not null check (char_length(reason) between 8 and 500),
  before_state jsonb not null default '{}'::jsonb,
  after_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists support_admin_audit_admin_created_idx
  on public.support_admin_audit_log (admin_user_id, created_at desc);
create index if not exists platform_support_admins_created_by_idx
  on public.platform_support_admins (created_by)
  where created_by is not null;
create index if not exists support_admin_audit_target_user_created_idx
  on public.support_admin_audit_log (target_user_id, created_at desc)
  where target_user_id is not null;
create index if not exists support_admin_audit_target_company_created_idx
  on public.support_admin_audit_log (target_company_id, created_at desc)
  where target_company_id is not null;

alter table public.platform_support_admins enable row level security;
alter table public.support_admin_audit_log enable row level security;
drop policy if exists "No client access to platform support admins" on public.platform_support_admins;
create policy "No client access to platform support admins"
on public.platform_support_admins
for all to anon, authenticated
using (false)
with check (false);
drop policy if exists "No client access to support audit log" on public.support_admin_audit_log;
create policy "No client access to support audit log"
on public.support_admin_audit_log
for all to anon, authenticated
using (false)
with check (false);
create or replace function public.protect_support_admin_audit_log()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Support audit records cannot be deleted.';
  end if;
  if coalesce(old.after_state ->> 'status', '') <> 'started' then
    raise exception 'Completed support audit records cannot be changed.';
  end if;
  if new.id is distinct from old.id
     or new.request_id is distinct from old.request_id
     or new.admin_user_id is distinct from old.admin_user_id
     or new.target_user_id is distinct from old.target_user_id
     or new.target_company_id is distinct from old.target_company_id
     or new.action is distinct from old.action
     or new.reason is distinct from old.reason
     or new.before_state is distinct from old.before_state
     or new.created_at is distinct from old.created_at then
    raise exception 'Only the result of a started support audit can be completed.';
  end if;
  return new;
end;
$$;
drop trigger if exists support_admin_audit_immutable on public.support_admin_audit_log;
create trigger support_admin_audit_immutable
before update or delete on public.support_admin_audit_log
for each row execute function public.protect_support_admin_audit_log();
revoke all on table public.platform_support_admins from public, anon, authenticated;
revoke all on table public.support_admin_audit_log from public, anon, authenticated;
revoke all on sequence public.support_admin_audit_log_id_seq from public, anon, authenticated;
revoke all on function public.protect_support_admin_audit_log() from public, anon, authenticated;
grant execute on function public.protect_support_admin_audit_log() to service_role;

-- SpoolMate v3.65 workshop stock, printable QR labels and spool usage ledger.
-- Requires the business-workspace helpers introduced in v3.18.

create extension if not exists pgcrypto;

create table if not exists public.workshop_stock_items (
  id uuid primary key default gen_random_uuid(),
  -- Nullable so stock owned by a business survives when its original creator
  -- leaves. Personal stock is explicitly removed by the delete-account flow.
  owner_id uuid references auth.users(id) on delete set null,
  company_id uuid references public.companies(id) on delete cascade,
  stock_code text not null,
  name text not null,
  description text not null default '',
  category text not null default 'General',
  location text not null default '',
  unit text not null default 'ea',
  quantity_on_hand numeric(14,3) not null default 0,
  minimum_quantity numeric(14,3) not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workshop_stock_items_code_check
    check (char_length(trim(stock_code)) between 1 and 80),
  constraint workshop_stock_items_name_check
    check (char_length(trim(name)) between 1 and 160),
  constraint workshop_stock_items_description_check
    check (char_length(description) <= 1000),
  constraint workshop_stock_items_category_check
    check (char_length(trim(category)) between 1 and 80),
  constraint workshop_stock_items_location_check
    check (char_length(location) <= 120),
  constraint workshop_stock_items_unit_check
    check (char_length(trim(unit)) between 1 and 20),
  constraint workshop_stock_items_quantity_check
    check (quantity_on_hand >= 0),
  constraint workshop_stock_items_minimum_check
    check (minimum_quantity >= 0)
);

create unique index if not exists workshop_stock_items_company_code_unique
  on public.workshop_stock_items (company_id, lower(stock_code))
  where company_id is not null;

create unique index if not exists workshop_stock_items_personal_code_unique
  on public.workshop_stock_items (owner_id, lower(stock_code))
  where company_id is null;

create index if not exists workshop_stock_items_company_active_idx
  on public.workshop_stock_items (company_id, archived, category, name);

create index if not exists workshop_stock_items_owner_active_idx
  on public.workshop_stock_items (owner_id, archived, category, name);

create table if not exists public.workshop_stock_movements (
  id bigint generated always as identity primary key,
  stock_item_id uuid not null references public.workshop_stock_items(id) on delete cascade,
  project_id text references public.spool_projects(id) on delete set null,
  -- Preserve the movement audit when a business team member leaves without
  -- blocking their account deletion.
  actor_id uuid references auth.users(id) on delete set null,
  movement_type text not null,
  quantity_change numeric(14,3) not null,
  quantity_before numeric(14,3) not null,
  quantity_after numeric(14,3) not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  constraint workshop_stock_movements_type_check
    check (movement_type in ('received', 'used_on_spool', 'returned_from_spool', 'stocktake')),
  constraint workshop_stock_movements_balance_check
    check (quantity_before >= 0 and quantity_after >= 0),
  constraint workshop_stock_movements_note_check
    check (char_length(note) <= 500)
);

create index if not exists workshop_stock_movements_item_created_idx
  on public.workshop_stock_movements (stock_item_id, created_at desc);

create index if not exists workshop_stock_movements_project_created_idx
  on public.workshop_stock_movements (project_id, created_at desc)
  where project_id is not null;

drop trigger if exists workshop_stock_items_set_updated_at on public.workshop_stock_items;
create trigger workshop_stock_items_set_updated_at
before update on public.workshop_stock_items
for each row execute function public.set_updated_at();

alter table public.workshop_stock_items enable row level security;
alter table public.workshop_stock_movements enable row level security;

drop policy if exists "Workspace members can read workshop stock" on public.workshop_stock_items;
create policy "Workspace members can read workshop stock"
on public.workshop_stock_items
for select
to authenticated
using (
  (company_id is null and owner_id = (select auth.uid()))
  or (
    company_id is not null
    and public.is_company_member(company_id, (select auth.uid()))
  )
);

drop policy if exists "Workspace members can add workshop stock" on public.workshop_stock_items;
create policy "Workspace members can add workshop stock"
on public.workshop_stock_items
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and quantity_on_hand = 0
  and public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    company_id is null
    or exists (
      select 1
      from public.company_members
      where company_members.company_id = workshop_stock_items.company_id
        and company_members.user_id = (select auth.uid())
        and company_members.status = 'approved'
        and company_members.role in ('owner', 'admin', 'checker', 'workshop')
    )
  )
);

drop policy if exists "Stock creators and admins can update workshop stock details" on public.workshop_stock_items;
create policy "Stock creators and admins can update workshop stock details"
on public.workshop_stock_items
for update
to authenticated
using (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    (company_id is null and owner_id = (select auth.uid()))
    or (
      company_id is not null
      and (
        owner_id = (select auth.uid())
        or public.is_company_admin(company_id, (select auth.uid()))
      )
    )
  )
)
with check (
  public.has_active_workspace_license((select auth.uid()), company_id)
  and (
    (company_id is null and owner_id = (select auth.uid()))
    or (
      company_id is not null
      and (
        owner_id = (select auth.uid())
        or public.is_company_admin(company_id, (select auth.uid()))
      )
    )
  )
);

drop policy if exists "Workspace members can read stock movements" on public.workshop_stock_movements;
create policy "Workspace members can read stock movements"
on public.workshop_stock_movements
for select
to authenticated
using (
  exists (
    select 1
    from public.workshop_stock_items
    where workshop_stock_items.id = workshop_stock_movements.stock_item_id
      and (
        (workshop_stock_items.company_id is null and workshop_stock_items.owner_id = (select auth.uid()))
        or (
          workshop_stock_items.company_id is not null
          and public.is_company_member(workshop_stock_items.company_id, (select auth.uid()))
        )
      )
  )
);

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.record_workshop_stock_movement_internal(
  p_item_id uuid,
  p_movement_type text,
  p_quantity numeric,
  p_project_id text default null,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_item public.workshop_stock_items%rowtype;
  v_project public.spool_projects%rowtype;
  v_before numeric(14,3);
  v_after numeric(14,3);
  v_change numeric(14,3);
  v_member_role text;
begin
  if v_actor is null then
    raise exception 'You must be signed in to change workshop stock.';
  end if;

  if p_movement_type not in ('received', 'used_on_spool', 'returned_from_spool', 'stocktake') then
    raise exception 'Unsupported workshop stock movement.';
  end if;

  if p_quantity is null or p_quantity < 0 then
    raise exception 'Enter a stock quantity of zero or more.';
  end if;

  select *
  into v_item
  from public.workshop_stock_items
  where id = p_item_id
    and archived = false
  for update;

  if not found then
    raise exception 'That workshop stock item was not found.';
  end if;

  if v_item.company_id is null then
    if v_item.owner_id <> v_actor then
      raise exception 'You do not have access to this personal stock item.';
    end if;
  else
    select role
    into v_member_role
    from public.company_members
    where company_id = v_item.company_id
      and user_id = v_actor
      and status = 'approved';

    if v_member_role is null or v_member_role not in ('owner', 'admin', 'checker', 'workshop') then
      raise exception 'Your business role cannot change workshop stock.';
    end if;
  end if;

  if not public.has_active_workspace_license(v_actor, v_item.company_id) then
    raise exception 'The active workspace is read only. Renew the licence before changing stock.';
  end if;

  if p_project_id is not null then
    select *
    into v_project
    from public.spool_projects
    where id = p_project_id;

    if not found then
      raise exception 'Save this spool to the cloud before assigning workshop stock.';
    end if;

    if v_item.company_id is null then
      if v_project.company_id is not null or v_project.owner_id <> v_actor then
        raise exception 'Personal workshop stock can only be assigned to your personal cloud spools.';
      end if;
    elsif v_project.company_id is distinct from v_item.company_id then
      raise exception 'That spool belongs to a different business workspace.';
    end if;
  end if;

  if p_movement_type = 'used_on_spool' and p_project_id is null then
    raise exception 'Choose a cloud spool before using workshop stock.';
  end if;

  v_before := v_item.quantity_on_hand;
  if p_movement_type = 'stocktake' then
    v_after := p_quantity;
    v_change := v_after - v_before;
  elsif p_movement_type = 'used_on_spool' then
    if p_quantity <= 0 then
      raise exception 'Enter how much stock was used.';
    end if;
    v_change := -p_quantity;
    v_after := v_before + v_change;
  else
    if p_quantity <= 0 then
      raise exception 'Enter how much stock was added.';
    end if;
    v_change := p_quantity;
    v_after := v_before + v_change;
  end if;

  if v_after < 0 then
    raise exception 'Not enough stock is available. Current quantity: % %.', v_before, v_item.unit;
  end if;

  update public.workshop_stock_items
  set quantity_on_hand = v_after,
      updated_at = now()
  where id = v_item.id;

  insert into public.workshop_stock_movements (
    stock_item_id,
    project_id,
    actor_id,
    movement_type,
    quantity_change,
    quantity_before,
    quantity_after,
    note
  ) values (
    v_item.id,
    nullif(trim(p_project_id), ''),
    v_actor,
    p_movement_type,
    v_change,
    v_before,
    v_after,
    left(coalesce(p_note, ''), 500)
  );

  return jsonb_build_object(
    'itemId', v_item.id,
    'quantityBefore', v_before,
    'quantityAfter', v_after,
    'quantityChange', v_change,
    'unit', v_item.unit,
    'movementType', p_movement_type,
    'projectId', p_project_id
  );
end;
$$;

create or replace function public.record_workshop_stock_movement(
  p_item_id uuid,
  p_movement_type text,
  p_quantity numeric,
  p_project_id text default null,
  p_note text default ''
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select private.record_workshop_stock_movement_internal(
    p_item_id,
    p_movement_type,
    p_quantity,
    p_project_id,
    p_note
  );
$$;

grant select, insert on public.workshop_stock_items to authenticated;
grant update (stock_code, name, description, category, location, unit, minimum_quantity, archived, updated_at)
  on public.workshop_stock_items to authenticated;
grant select on public.workshop_stock_movements to authenticated;

revoke all on function private.record_workshop_stock_movement_internal(uuid, text, numeric, text, text)
  from public, anon, authenticated;
grant execute on function private.record_workshop_stock_movement_internal(uuid, text, numeric, text, text)
  to authenticated;

revoke all on function public.record_workshop_stock_movement(uuid, text, numeric, text, text)
  from public, anon, authenticated;
grant execute on function public.record_workshop_stock_movement(uuid, text, numeric, text, text)
  to authenticated;
