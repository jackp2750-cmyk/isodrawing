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
    if v_item.owner_id is distinct from v_actor then
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
      if v_project.company_id is not null or v_project.owner_id is distinct from v_actor then
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
