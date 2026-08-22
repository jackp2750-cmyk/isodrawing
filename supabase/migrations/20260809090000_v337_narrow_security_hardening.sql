-- SpoolMate v3.37 production hardening applied to the existing pre-v3.18
-- schema. This deliberately does not change company records, role constraints
-- or project ownership; those remain in the separately reviewed v3.18
-- business-workspace migration.

begin;

alter function public.set_updated_at() set search_path = public;

revoke all on function public.has_active_license(uuid) from public, anon;
revoke all on function public.is_company_member(uuid, uuid) from public, anon;
revoke all on function public.is_company_admin(uuid, uuid) from public, anon;
revoke all on function public.is_company_owner(uuid, uuid) from public, anon;
revoke all on function public.create_company(text) from public, anon;
revoke all on function public.join_company_by_code(text) from public, anon;
revoke all on function public.set_project_comment_resolved(uuid, boolean) from public, anon;

grant execute on function public.has_active_license(uuid) to authenticated;
grant execute on function public.is_company_member(uuid, uuid) to authenticated;
grant execute on function public.is_company_admin(uuid, uuid) to authenticated;
grant execute on function public.is_company_owner(uuid, uuid) to authenticated;
grant execute on function public.create_company(text) to authenticated;
grant execute on function public.join_company_by_code(text) to authenticated;
grant execute on function public.set_project_comment_resolved(uuid, boolean) to authenticated;

create index if not exists companies_created_by_idx
  on public.companies(created_by);
create index if not exists project_comments_author_id_idx
  on public.project_comments(author_id);
create index if not exists project_comments_company_id_idx
  on public.project_comments(company_id);
create index if not exists project_comments_resolved_by_idx
  on public.project_comments(resolved_by);
create index if not exists team_messages_author_id_idx
  on public.team_messages(author_id);

drop policy if exists "Admins can update company memberships" on public.company_members;
drop policy if exists "Owners can update company memberships" on public.company_members;
drop policy if exists "Admins can approve company members" on public.company_members;

create policy "Owners and admins can update company memberships"
on public.company_members
for update to authenticated
using (
  public.has_active_license((select auth.uid()))
  and (
    public.is_company_owner(company_id, (select auth.uid()))
    or (
      public.is_company_admin(company_id, (select auth.uid()))
      and role = 'member'
    )
  )
)
with check (
  public.has_active_license((select auth.uid()))
  and (
    public.is_company_owner(company_id, (select auth.uid()))
    or (
      public.is_company_admin(company_id, (select auth.uid()))
      and role = 'member'
    )
  )
);

commit;

notify pgrst, 'reload schema';
