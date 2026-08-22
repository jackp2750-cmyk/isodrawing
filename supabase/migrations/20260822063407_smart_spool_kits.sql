-- SpoolMate v3.66 Smart Spool Kits.
-- Extends Workshop Stock with BOM-backed reservations, picking and ordering.

create table if not exists public.workshop_stock_kit_lines (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.spool_projects(id) on delete cascade,
  requirement_key text not null,
  label text not null,
  detail text not null default '',
  unit text not null default 'ea',
  required_quantity numeric(14,3) not null,
  stock_item_id uuid references public.workshop_stock_items(id) on delete set null,
  reserved_quantity numeric(14,3) not null default 0,
  picked_quantity numeric(14,3) not null default 0,
  ordered_quantity numeric(14,3) not null default 0,
  status text not null default 'pending',
  note text not null default '',
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workshop_stock_kit_lines_project_requirement_unique
    unique (project_id, requirement_key),
  constraint workshop_stock_kit_lines_key_check
    check (char_length(trim(requirement_key)) between 1 and 160),
  constraint workshop_stock_kit_lines_label_check
    check (char_length(trim(label)) between 1 and 160),
  constraint workshop_stock_kit_lines_detail_check
    check (char_length(detail) <= 500),
  constraint workshop_stock_kit_lines_unit_check
    check (char_length(trim(unit)) between 1 and 20),
  constraint workshop_stock_kit_lines_note_check
    check (char_length(note) <= 500),
  constraint workshop_stock_kit_lines_status_check
    check (status in ('pending', 'reserved', 'picked', 'order', 'na')),
  constraint workshop_stock_kit_lines_quantity_check
    check (
      required_quantity > 0
      and reserved_quantity >= 0
      and picked_quantity >= 0
      and ordered_quantity >= 0
      and picked_quantity <= required_quantity
      and reserved_quantity <= required_quantity - picked_quantity
      and ordered_quantity <= required_quantity - picked_quantity - reserved_quantity
    ),
  constraint workshop_stock_kit_lines_na_check
    check (status <> 'na' or (reserved_quantity = 0 and picked_quantity = 0 and ordered_quantity = 0)),
  constraint workshop_stock_kit_lines_archived_reservation_check
    check (active or reserved_quantity = 0)
);

create index if not exists workshop_stock_kit_lines_project_active_idx
  on public.workshop_stock_kit_lines (project_id, active, status, updated_at desc);

create index if not exists workshop_stock_kit_lines_stock_active_idx
  on public.workshop_stock_kit_lines (stock_item_id, active)
  where stock_item_id is not null and reserved_quantity > 0;

drop trigger if exists workshop_stock_kit_lines_set_updated_at on public.workshop_stock_kit_lines;
create trigger workshop_stock_kit_lines_set_updated_at
before update on public.workshop_stock_kit_lines
for each row execute function public.set_updated_at();

create or replace function private.validate_spool_stock_kit_metadata_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.active = false
      and old.active = true
      and (old.reserved_quantity > 0 or old.picked_quantity > 0 or old.ordered_quantity > 0) then
    raise exception 'Release, return or clear this Smart Kit allocation before archiving it.';
  end if;

  if new.unit is distinct from old.unit
      and (old.reserved_quantity > 0 or old.picked_quantity > 0 or old.ordered_quantity > 0) then
    raise exception 'Release, return or clear this Smart Kit allocation before changing its unit.';
  end if;

  return new;
end;
$$;

drop trigger if exists workshop_stock_kit_lines_validate_metadata on public.workshop_stock_kit_lines;
create trigger workshop_stock_kit_lines_validate_metadata
before update on public.workshop_stock_kit_lines
for each row execute function private.validate_spool_stock_kit_metadata_update();

alter table public.workshop_stock_kit_lines enable row level security;

drop policy if exists "Workspace members can read spool kits" on public.workshop_stock_kit_lines;
create policy "Workspace members can read spool kits"
on public.workshop_stock_kit_lines
for select
to authenticated
using (
  exists (
    select 1
    from public.spool_projects
    where spool_projects.id = workshop_stock_kit_lines.project_id
      and (
        (spool_projects.company_id is null and spool_projects.owner_id = (select auth.uid()))
        or (
          spool_projects.company_id is not null
          and public.is_company_member(spool_projects.company_id, (select auth.uid()))
        )
      )
  )
);

drop policy if exists "Production roles can add spool kit requirements" on public.workshop_stock_kit_lines;
create policy "Production roles can add spool kit requirements"
on public.workshop_stock_kit_lines
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and stock_item_id is null
  and reserved_quantity = 0
  and picked_quantity = 0
  and ordered_quantity = 0
  and status = 'pending'
  and exists (
    select 1
    from public.spool_projects
    where spool_projects.id = workshop_stock_kit_lines.project_id
      and public.has_active_workspace_license((select auth.uid()), spool_projects.company_id)
      and (
        (spool_projects.company_id is null and spool_projects.owner_id = (select auth.uid()))
        or exists (
          select 1
          from public.company_members
          where company_members.company_id = spool_projects.company_id
            and company_members.user_id = (select auth.uid())
            and company_members.status = 'approved'
            and company_members.role in ('owner', 'admin', 'checker', 'workshop')
        )
      )
  )
);

drop policy if exists "Production roles can update spool kit requirements" on public.workshop_stock_kit_lines;
create policy "Production roles can update spool kit requirements"
on public.workshop_stock_kit_lines
for update
to authenticated
using (
  exists (
    select 1
    from public.spool_projects
    where spool_projects.id = workshop_stock_kit_lines.project_id
      and public.has_active_workspace_license((select auth.uid()), spool_projects.company_id)
      and (
        (spool_projects.company_id is null and spool_projects.owner_id = (select auth.uid()))
        or exists (
          select 1
          from public.company_members
          where company_members.company_id = spool_projects.company_id
            and company_members.user_id = (select auth.uid())
            and company_members.status = 'approved'
            and company_members.role in ('owner', 'admin', 'checker', 'workshop')
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.spool_projects
    where spool_projects.id = workshop_stock_kit_lines.project_id
      and public.has_active_workspace_license((select auth.uid()), spool_projects.company_id)
      and (
        (spool_projects.company_id is null and spool_projects.owner_id = (select auth.uid()))
        or exists (
          select 1
          from public.company_members
          where company_members.company_id = spool_projects.company_id
            and company_members.user_id = (select auth.uid())
            and company_members.status = 'approved'
            and company_members.role in ('owner', 'admin', 'checker', 'workshop')
        )
      )
  )
);

create or replace function private.spool_kit_project_for_actor(
  p_project_id text,
  p_actor uuid
)
returns public.spool_projects
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project public.spool_projects%rowtype;
  v_role text;
begin
  if p_actor is null then
    raise exception 'You must be signed in to manage a Smart Kit.';
  end if;

  select *
  into v_project
  from public.spool_projects
  where id = nullif(trim(p_project_id), '');

  if not found then
    raise exception 'Save this spool to the cloud before preparing its Smart Kit.';
  end if;

  if v_project.company_id is null then
    if v_project.owner_id is distinct from p_actor then
      raise exception 'Only the owner can manage this Personal spool kit.';
    end if;
  else
    select role
    into v_role
    from public.company_members
    where company_id = v_project.company_id
      and user_id = p_actor
      and status = 'approved';

    if v_role is null or v_role not in ('owner', 'admin', 'checker', 'workshop') then
      raise exception 'Your business role cannot manage Smart Kits.';
    end if;
  end if;

  if not public.has_active_workspace_license(p_actor, v_project.company_id) then
    raise exception 'The active workspace is read only. Renew the licence before changing Smart Kits.';
  end if;

  return v_project;
end;
$$;

create or replace function private.configure_spool_stock_kit_line_internal(
  p_line_id uuid,
  p_stock_item_id uuid default null,
  p_reserved_quantity numeric default 0,
  p_ordered_quantity numeric default 0,
  p_not_required boolean default false,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_line public.workshop_stock_kit_lines%rowtype;
  v_project public.spool_projects%rowtype;
  v_item public.workshop_stock_items%rowtype;
  v_reserved_elsewhere numeric(14,3) := 0;
  v_available numeric(14,3) := 0;
  v_status text;
begin
  select *
  into v_line
  from public.workshop_stock_kit_lines
  where id = p_line_id
    and active = true
  for update;

  if not found then
    raise exception 'That Smart Kit requirement was not found.';
  end if;

  v_project := private.spool_kit_project_for_actor(v_line.project_id, v_actor);

  if v_line.picked_quantity > 0
      and p_stock_item_id is distinct from v_line.stock_item_id then
    raise exception 'Return the picked quantity before changing the matched stock item.';
  end if;

  if coalesce(p_reserved_quantity, 0) < 0 or coalesce(p_ordered_quantity, 0) < 0 then
    raise exception 'Reserved and ordered quantities cannot be negative.';
  end if;

  if p_not_required then
    if v_line.picked_quantity > 0 then
      raise exception 'Return the picked stock before marking this requirement not required.';
    end if;
    update public.workshop_stock_kit_lines
    set stock_item_id = null,
        reserved_quantity = 0,
        ordered_quantity = 0,
        status = 'na',
        note = left(coalesce(p_note, ''), 500),
        updated_at = now()
    where id = v_line.id;

    return jsonb_build_object('lineId', v_line.id, 'status', 'na');
  end if;

  if coalesce(p_reserved_quantity, 0) + coalesce(p_ordered_quantity, 0)
      > v_line.required_quantity - v_line.picked_quantity then
    raise exception 'Reserved plus ordered stock exceeds the remaining kit requirement.';
  end if;

  if coalesce(p_reserved_quantity, 0) > 0 and p_stock_item_id is null then
    raise exception 'Choose a workshop stock item before reserving it.';
  end if;

  if p_stock_item_id is not null then
    select *
    into v_item
    from public.workshop_stock_items
    where id = p_stock_item_id
      and archived = false
    for update;

    if not found then
      raise exception 'That workshop stock item is unavailable or archived.';
    end if;

    if v_project.company_id is null then
      if v_item.company_id is not null or v_item.owner_id is distinct from v_actor then
        raise exception 'Personal spool kits can only reserve your Personal workshop stock.';
      end if;
    elsif v_item.company_id is distinct from v_project.company_id then
      raise exception 'The selected stock belongs to a different Business workspace.';
    end if;

    select coalesce(sum(reserved_quantity), 0)
    into v_reserved_elsewhere
    from public.workshop_stock_kit_lines
    where stock_item_id = v_item.id
      and active = true
      and status <> 'na'
      and id <> v_line.id;

    v_available := greatest(0, v_item.quantity_on_hand - v_reserved_elsewhere);
    if coalesce(p_reserved_quantity, 0) > v_available then
      raise exception 'Only % % remains available after other Smart Kit reservations.', v_available, v_item.unit;
    end if;
  end if;

  v_status := case
    when v_line.picked_quantity >= v_line.required_quantity then 'picked'
    when coalesce(p_ordered_quantity, 0) > 0 then 'order'
    when coalesce(p_reserved_quantity, 0) > 0 then 'reserved'
    else 'pending'
  end;

  update public.workshop_stock_kit_lines
  set stock_item_id = p_stock_item_id,
      reserved_quantity = coalesce(p_reserved_quantity, 0),
      ordered_quantity = coalesce(p_ordered_quantity, 0),
      status = v_status,
      note = left(coalesce(p_note, ''), 500),
      updated_at = now()
  where id = v_line.id;

  return jsonb_build_object(
    'lineId', v_line.id,
    'status', v_status,
    'reservedQuantity', coalesce(p_reserved_quantity, 0),
    'pickedQuantity', v_line.picked_quantity,
    'orderedQuantity', coalesce(p_ordered_quantity, 0),
    'availableQuantity', v_available
  );
end;
$$;

create or replace function private.record_spool_stock_kit_pick_internal(
  p_line_id uuid,
  p_quantity numeric,
  p_return boolean default false,
  p_note text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_line public.workshop_stock_kit_lines%rowtype;
  v_project public.spool_projects%rowtype;
  v_item public.workshop_stock_items%rowtype;
  v_reserved numeric(14,3);
  v_picked numeric(14,3);
  v_status text;
  v_movement_type text;
  v_change numeric(14,3);
  v_before numeric(14,3);
  v_after numeric(14,3);
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Enter a quantity greater than zero.';
  end if;

  select *
  into v_line
  from public.workshop_stock_kit_lines
  where id = p_line_id
    and active = true
  for update;

  if not found then
    raise exception 'That Smart Kit requirement was not found.';
  end if;

  v_project := private.spool_kit_project_for_actor(v_line.project_id, v_actor);

  if v_line.stock_item_id is null then
    raise exception 'Match workshop stock to this requirement first.';
  end if;

  select *
  into v_item
  from public.workshop_stock_items
  where id = v_line.stock_item_id
    and archived = false
  for update;

  if not found then
    raise exception 'The matched workshop stock item is unavailable or archived.';
  end if;

  v_before := v_item.quantity_on_hand;
  if p_return then
    if p_quantity > v_line.picked_quantity then
      raise exception 'The return exceeds the quantity picked for this kit line.';
    end if;
    v_after := v_before + p_quantity;
    v_reserved := v_line.reserved_quantity + p_quantity;
    v_picked := v_line.picked_quantity - p_quantity;
    v_movement_type := 'returned_from_spool';
    v_change := p_quantity;
  else
    if p_quantity > v_line.reserved_quantity then
      raise exception 'Reserve this quantity before picking it.';
    end if;
    if p_quantity > v_before then
      raise exception 'Only % % is physically available to pick.', v_before, v_item.unit;
    end if;
    v_after := v_before - p_quantity;
    v_reserved := v_line.reserved_quantity - p_quantity;
    v_picked := v_line.picked_quantity + p_quantity;
    v_movement_type := 'used_on_spool';
    v_change := -p_quantity;
  end if;

  v_status := case
    when v_picked >= v_line.required_quantity then 'picked'
    when v_line.ordered_quantity > 0 then 'order'
    when v_reserved > 0 then 'reserved'
    else 'pending'
  end;

  update public.workshop_stock_items
  set quantity_on_hand = v_after,
      updated_at = now()
  where id = v_item.id;

  update public.workshop_stock_kit_lines
  set reserved_quantity = v_reserved,
      picked_quantity = v_picked,
      status = v_status,
      note = left(coalesce(nullif(trim(p_note), ''), note), 500),
      updated_at = now()
  where id = v_line.id;

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
    v_line.project_id,
    v_actor,
    v_movement_type,
    v_change,
    v_before,
    v_after,
    left(coalesce(nullif(trim(p_note), ''), 'Smart Kit: ' || v_line.label), 500)
  );

  return jsonb_build_object(
    'lineId', v_line.id,
    'itemId', v_item.id,
    'status', v_status,
    'reservedQuantity', v_reserved,
    'pickedQuantity', v_picked,
    'orderedQuantity', v_line.ordered_quantity,
    'quantityOnHand', v_after,
    'movementType', v_movement_type
  );
end;
$$;

-- Replace the v3.65 movement helper so ordinary spool use cannot consume
-- quantity already promised to a Smart Kit.
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
  v_reserved numeric(14,3) := 0;
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
  if p_movement_type in ('used_on_spool', 'stocktake') then
    select coalesce(sum(reserved_quantity), 0)
    into v_reserved
    from public.workshop_stock_kit_lines
    where stock_item_id = v_item.id
      and active = true
      and status <> 'na';
  end if;

  if p_movement_type = 'stocktake' then
    if p_quantity < v_reserved then
      raise exception 'The count is below % % already reserved for Smart Kits. Release or correct those reservations first.', v_reserved, v_item.unit;
    end if;
    v_after := p_quantity;
    v_change := v_after - v_before;
  elsif p_movement_type = 'used_on_spool' then
    if p_quantity <= 0 then
      raise exception 'Enter how much stock was used.';
    end if;
    if p_quantity > greatest(0, v_before - v_reserved) then
      raise exception 'Only % % is unreserved. % % is held for Smart Kits.', greatest(0, v_before - v_reserved), v_item.unit, v_reserved, v_item.unit;
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
    'reservedQuantity', v_reserved,
    'unit', v_item.unit,
    'movementType', p_movement_type,
    'projectId', p_project_id
  );
end;
$$;

create or replace function public.configure_spool_stock_kit_line(
  p_line_id uuid,
  p_stock_item_id uuid default null,
  p_reserved_quantity numeric default 0,
  p_ordered_quantity numeric default 0,
  p_not_required boolean default false,
  p_note text default ''
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select private.configure_spool_stock_kit_line_internal(
    p_line_id,
    p_stock_item_id,
    p_reserved_quantity,
    p_ordered_quantity,
    p_not_required,
    p_note
  );
$$;

create or replace function public.record_spool_stock_kit_pick(
  p_line_id uuid,
  p_quantity numeric,
  p_return boolean default false,
  p_note text default ''
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select private.record_spool_stock_kit_pick_internal(
    p_line_id,
    p_quantity,
    p_return,
    p_note
  );
$$;

grant select, insert on public.workshop_stock_kit_lines to authenticated;
grant update (label, detail, unit, required_quantity, note, active, updated_at)
  on public.workshop_stock_kit_lines to authenticated;

revoke all on function private.spool_kit_project_for_actor(text, uuid)
  from public, anon, authenticated;
revoke all on function private.validate_spool_stock_kit_metadata_update()
  from public, anon, authenticated;
revoke all on function private.configure_spool_stock_kit_line_internal(uuid, uuid, numeric, numeric, boolean, text)
  from public, anon, authenticated;
revoke all on function private.record_spool_stock_kit_pick_internal(uuid, numeric, boolean, text)
  from public, anon, authenticated;

grant execute on function private.configure_spool_stock_kit_line_internal(uuid, uuid, numeric, numeric, boolean, text)
  to authenticated;
grant execute on function private.record_spool_stock_kit_pick_internal(uuid, numeric, boolean, text)
  to authenticated;

revoke all on function public.configure_spool_stock_kit_line(uuid, uuid, numeric, numeric, boolean, text)
  from public, anon, authenticated;
revoke all on function public.record_spool_stock_kit_pick(uuid, numeric, boolean, text)
  from public, anon, authenticated;

grant execute on function public.configure_spool_stock_kit_line(uuid, uuid, numeric, numeric, boolean, text)
  to authenticated;
grant execute on function public.record_spool_stock_kit_pick(uuid, numeric, boolean, text)
  to authenticated;
