create extension if not exists pgcrypto;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_bn text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  name_en text not null,
  name_bn text not null,
  description_en text not null default '',
  description_bn text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null,
  available boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_categories_sort_order_idx
  on public.menu_categories (sort_order asc);

create index if not exists menu_categories_active_idx
  on public.menu_categories (is_active);

create index if not exists menu_items_category_id_idx
  on public.menu_items (category_id);

create index if not exists menu_items_available_idx
  on public.menu_items (available);

create index if not exists menu_items_is_active_idx
  on public.menu_items (is_active);

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read active categories" on public.menu_categories;
create policy "Public can read active categories"
  on public.menu_categories
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public can read active menu items" on public.menu_items;
create policy "Public can read active menu items"
  on public.menu_items
  for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1
      from public.menu_categories c
      where c.id = category_id
        and c.is_active = true
    )
  );
