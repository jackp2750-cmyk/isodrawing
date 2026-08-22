-- SpoolMate v2.79 team conversation update.
-- Paste this entire file into Supabase SQL Editor > New query, then press Run once.

alter table public.project_comments
  add column if not exists mentions text[] not null default '{}'::text[],
  add column if not exists photo_path text,
  add column if not exists resolved boolean not null default false,
  add column if not exists resolved_at timestamptz,
  add column if not exists resolved_by uuid references auth.users(id) on delete set null;

create index if not exists project_comments_project_resolved_idx
  on public.project_comments (project_id, resolved, created_at desc);

drop function if exists public.set_project_comment_resolved(uuid, boolean);

create function public.set_project_comment_resolved(comment_id_value uuid, resolved_value boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $spoolmate$
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

  select pc.company_id, pc.author_id, pc.project_id
    into target_company_id, target_author_id, target_project_id
  from public.project_comments as pc
  where pc.id = comment_id_value;

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
      from public.spool_projects as sp
      where sp.id = target_project_id
        and sp.owner_id = auth.uid()
    )
  ) then
    raise exception 'You do not have permission to update this spool message.';
  end if;

  update public.project_comments as pc
  set resolved = coalesce(resolved_value, false),
      resolved_at = case when coalesce(resolved_value, false) then now() else null end,
      resolved_by = case when coalesce(resolved_value, false) then auth.uid() else null end
  where pc.id = comment_id_value;

  return true;
end;
$spoolmate$;

grant execute on function public.set_project_comment_resolved(uuid, boolean) to authenticated;

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
      from public.company_members as cm
      where cm.company_id::text = (storage.foldername(name))[1]
        and cm.user_id = (select auth.uid())
        and cm.status = 'approved'
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
      from public.company_members as cm
      where cm.company_id::text = (storage.foldername(name))[1]
        and cm.user_id = (select auth.uid())
        and cm.status = 'approved'
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
      from public.company_members as cm
      where cm.company_id::text = (storage.foldername(name))[1]
        and cm.user_id = (select auth.uid())
        and cm.status = 'approved'
        and cm.role in ('owner', 'admin')
    )
  )
);

select 'SpoolMate Supabase update installed successfully' as result;
