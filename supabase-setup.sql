-- SpoolMate cloud project storage and simple licence setup.
-- Paste this into Supabase SQL Editor, then run it once for your project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  license_status text not null default 'trial'
    check (license_status in ('trial', 'paid', 'full', 'expired')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
using (public.is_company_admin(id, (select auth.uid())))
with check (public.is_company_admin(id, (select auth.uid())));

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
using (public.is_company_owner(company_id, (select auth.uid())))
with check (public.is_company_owner(company_id, (select auth.uid())));

create policy "Admins can approve company members"
on public.company_members
for update
to authenticated
using (
  public.is_company_admin(company_id, (select auth.uid()))
  and role = 'member'
)
with check (
  public.is_company_admin(company_id, (select auth.uid()))
  and role = 'member'
);

drop policy if exists "Users can leave company memberships" on public.company_members;
create policy "Users can leave company memberships"
on public.company_members
for delete
to authenticated
using (
  user_id = (select auth.uid())
  or public.is_company_owner(company_id, (select auth.uid()))
  or (
    public.is_company_admin(company_id, (select auth.uid()))
    and role = 'member'
  )
);

drop policy if exists "Users can read their own spool projects" on public.spool_projects;
create policy "Users can read their own spool projects"
on public.spool_projects
for select
to authenticated
using (
  public.has_active_license((select auth.uid()))
  and (
    owner_id = (select auth.uid())
    or (
      company_id is not null
      and public.is_company_member(company_id, (select auth.uid()))
    )
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
  public.has_active_license((select auth.uid()))
  and (
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
  author_id = (select auth.uid())
  or (
    company_id is not null
    and public.is_company_admin(company_id, (select auth.uid()))
  )
)
with check (
  author_id = (select auth.uid())
  or (
    company_id is not null
    and public.is_company_admin(company_id, (select auth.uid()))
  )
);

drop policy if exists "Users can delete their comments" on public.project_comments;
create policy "Users can delete their comments"
on public.project_comments
for delete
to authenticated
using (
  author_id = (select auth.uid())
  or (
    company_id is not null
    and public.is_company_admin(company_id, (select auth.uid()))
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
  public.has_active_license((select auth.uid()))
  and public.is_company_member(team_messages.company_id, (select auth.uid()))
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
grant select, insert, update on public.companies to authenticated;
grant select, insert, update, delete on public.company_members to authenticated;
grant select, insert, update, delete on public.spool_projects to authenticated;
grant select, insert, update, delete on public.project_comments to authenticated;
grant select, insert, update, delete on public.team_messages to authenticated;
grant execute on function public.has_active_license(uuid) to authenticated;
grant execute on function public.is_company_member(uuid, uuid) to authenticated;
grant execute on function public.is_company_admin(uuid, uuid) to authenticated;
grant execute on function public.is_company_owner(uuid, uuid) to authenticated;
grant execute on function public.create_company(text) to authenticated;
grant execute on function public.join_company_by_code(text) to authenticated;
grant execute on function public.set_project_comment_resolved(uuid, boolean) to authenticated;

-- To give someone a full licence, run this manually as the project owner:
-- update public.profiles set license_status = 'full' where email = 'person@example.com';
