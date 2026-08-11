-- SpoolMate v3.38 private platform-support console.
-- Apply after the business-workspace migration. This migration deliberately
-- does not nominate an administrator: add the operator's auth.users UUID to
-- platform_support_admins separately after verifying the correct account.

begin;

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

-- The deny-all client policies document the boundary. The protected
-- support-admin Edge Function validates the signed-in operator and uses its
-- server-only service client for these tables.
revoke all on table public.platform_support_admins from public, anon, authenticated;
revoke all on table public.support_admin_audit_log from public, anon, authenticated;
revoke all on sequence public.support_admin_audit_log_id_seq from public, anon, authenticated;
revoke all on function public.protect_support_admin_audit_log() from public, anon, authenticated;
grant execute on function public.protect_support_admin_audit_log() to service_role;

commit;

notify pgrst, 'reload schema';
