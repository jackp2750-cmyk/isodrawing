begin;

-- Server-owned private-feature entitlements. The browser can only read the
-- signed-in user's own active rows; grants remain an administrator operation.
create table if not exists public.private_feature_access (
  feature_key text not null
    check (feature_key ~ '^[a-z][a-z0-9_]{2,63}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  active boolean not null default true,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (feature_key, user_id)
);

create index if not exists private_feature_access_user_id_idx
  on public.private_feature_access (user_id);
create index if not exists private_feature_access_granted_by_idx
  on public.private_feature_access (granted_by)
  where granted_by is not null;

alter table public.private_feature_access enable row level security;

drop trigger if exists private_feature_access_set_updated_at
  on public.private_feature_access;
create trigger private_feature_access_set_updated_at
before update on public.private_feature_access
for each row execute function public.set_updated_at();

drop policy if exists "Users can read their own private features"
  on public.private_feature_access;
create policy "Users can read their own private features"
on public.private_feature_access
for select
to authenticated
using ((select auth.uid()) = user_id and active);

revoke all on table public.private_feature_access from public, anon, authenticated;
grant select on table public.private_feature_access to authenticated;

-- Every active SpoolMate platform administrator receives the beta.
insert into public.private_feature_access (
  feature_key,
  user_id,
  active,
  granted_by
)
select
  'schematic_takeoff',
  admin.user_id,
  true,
  admin.user_id
from public.platform_support_admins as admin
where admin.active
on conflict (feature_key, user_id) do update
set active = true,
    granted_by = excluded.granted_by,
    updated_at = now();

-- Verified live Paragon beta account. The account in Auth uses .com.au.
insert into public.private_feature_access (
  feature_key,
  user_id,
  active,
  granted_by
)
select
  'schematic_takeoff',
  beta_user.id,
  true,
  (
    select admin.user_id
    from public.platform_support_admins as admin
    where admin.active
    order by admin.created_at
    limit 1
  )
from auth.users as beta_user
where lower(beta_user.email) = 'jpritchard@paragonplumbing.com.au'
  and beta_user.email_confirmed_at is not null
on conflict (feature_key, user_id) do update
set active = true,
    granted_by = excluded.granted_by,
    updated_at = now();

notify pgrst, 'reload schema';

commit;
