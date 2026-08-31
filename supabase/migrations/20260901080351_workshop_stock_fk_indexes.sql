begin;

-- Cover nullable user foreign keys used by ON DELETE and audit lookups.
create index if not exists workshop_stock_movements_actor_id_idx
  on public.workshop_stock_movements (actor_id)
  where actor_id is not null;

create index if not exists workshop_stock_kit_lines_created_by_idx
  on public.workshop_stock_kit_lines (created_by)
  where created_by is not null;

commit;
