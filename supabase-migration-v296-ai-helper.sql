-- SpoolMate v2.96: private daily allowance counters for Ask SpoolMate.
-- Run once in Supabase SQL Editor before deploying the ai-help Edge Function.

begin;

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

commit;
