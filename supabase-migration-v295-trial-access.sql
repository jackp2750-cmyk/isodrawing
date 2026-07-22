-- SpoolMate v2.95 trial/licence access migration.
-- Run once in the Supabase SQL Editor before publishing v2.95.
-- Expired accounts retain read/export access to permitted cloud data, while all
-- cloud writes remain protected by the active-licence check.

begin;

alter table public.profiles
  add column if not exists grace_ends_at timestamptz;

alter table public.profiles
  drop constraint if exists profiles_license_status_check;

alter table public.profiles
  add constraint profiles_license_status_check
  check (license_status in ('trial', 'paid', 'grace', 'full', 'expired'));

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

-- Some early SpoolMate databases predate these shared membership helpers. Keep
-- the migration self-contained so the policies below work on those installs.
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

-- Read access survives trial expiry. Ownership and approved-company membership
-- still isolate every row from unrelated accounts.
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

-- Harden write paths that previously relied mainly on the browser UI.
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

drop policy if exists "Owners can update company memberships" on public.company_members;
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

drop policy if exists "Admins can approve company members" on public.company_members;
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

grant execute on function public.has_active_license(uuid) to authenticated;
grant execute on function public.is_company_member(uuid, uuid) to authenticated;
grant execute on function public.is_company_admin(uuid, uuid) to authenticated;
grant execute on function public.is_company_owner(uuid, uuid) to authenticated;

commit;

notify pgrst, 'reload schema';

-- Owner action examples (run separately with the real target selected):
-- Permanent owner/developer licence:
-- update public.profiles set license_status = 'full', grace_ends_at = null where id = '<owner-user-uuid>'::uuid;
-- Seven-day failed-payment grace period:
-- update public.profiles set license_status = 'grace', grace_ends_at = now() + interval '7 days' where id = '<user-uuid>'::uuid;
