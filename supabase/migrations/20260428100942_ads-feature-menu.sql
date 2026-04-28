alter table public.menu_items
add column if not exists featured boolean not null default false;
create index if not exists menu_items_featured_idx
  on public.menu_items (featured desc);