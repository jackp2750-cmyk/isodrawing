-- SpoolMate v3.39: sync non-sensitive Jobs dashboard preferences per user/workspace.

alter table public.profiles
  add column if not exists dashboard_preferences jsonb not null default '{}'::jsonb;

alter table public.profiles
  drop constraint if exists profiles_dashboard_preferences_object_check;

alter table public.profiles
  add constraint profiles_dashboard_preferences_object_check
  check (jsonb_typeof(dashboard_preferences) = 'object');

drop policy if exists "Users can update their dashboard preferences" on public.profiles;
create policy "Users can update their dashboard preferences"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Older installations granted table-wide profile updates. Remove that grant
-- before exposing only this non-sensitive preference column.
revoke update on public.profiles from authenticated;
grant update (dashboard_preferences) on public.profiles to authenticated;
