-- IsoSpool Studio cloud project storage and simple licence setup.
-- Paste this into Supabase SQL Editor, then run it once for your project.

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

create table if not exists public.spool_projects (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  project_info jsonb not null default '{}'::jsonb,
  drawing_state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists spool_projects_owner_updated_idx
  on public.spool_projects (owner_id, updated_at desc);

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

drop trigger if exists spool_projects_set_updated_at on public.spool_projects;
create trigger spool_projects_set_updated_at
before update on public.spool_projects
for each row execute function public.set_updated_at();

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
    where id = user_id
      and (
        license_status in ('paid', 'full')
        or (license_status = 'trial' and trial_ends_at > now())
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.spool_projects enable row level security;

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

drop policy if exists "Users can read their own spool projects" on public.spool_projects;
create policy "Users can read their own spool projects"
on public.spool_projects
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
);

drop policy if exists "Users can create their own spool projects" on public.spool_projects;
create policy "Users can create their own spool projects"
on public.spool_projects
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
);

drop policy if exists "Users can update their own spool projects" on public.spool_projects;
create policy "Users can update their own spool projects"
on public.spool_projects
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
)
with check (
  owner_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
);

drop policy if exists "Users can delete their own spool projects" on public.spool_projects;
create policy "Users can delete their own spool projects"
on public.spool_projects
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and public.has_active_license((select auth.uid()))
);

grant select, insert on public.profiles to authenticated;
grant select, insert, update, delete on public.spool_projects to authenticated;
grant execute on function public.has_active_license(uuid) to authenticated;

-- To give someone a full licence, run this manually as the project owner:
-- update public.profiles set license_status = 'full' where email = 'person@example.com';
