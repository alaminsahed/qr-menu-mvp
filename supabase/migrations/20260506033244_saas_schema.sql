-- ============================================================
-- SaaS multi-tenant schema
-- Replaces all previous single-tenant migrations.
-- ============================================================

-- ── Drop old single-tenant tables (clean reset) ──────────────
drop table if exists public.menu_items cascade;
drop table if exists public.menu_categories cascade;
drop table if exists public.restaurant_settings cascade;
drop table if exists public.admin_users cascade;
drop table if exists public.restaurant_members cascade;
drop table if exists public.restaurants cascade;

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ── 1. restaurants (tenant) ─────────────────────────────────
create table if not exists public.restaurants (
  id         uuid        primary key default gen_random_uuid(),
  slug       text        not null unique,
  name       text        not null,
  status     text        not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists restaurants_slug_idx on public.restaurants (slug);

alter table public.restaurants enable row level security;

drop policy if exists "Public can read restaurants" on public.restaurants;
create policy "Public can read restaurants"
  on public.restaurants
  for select
  to anon, authenticated
  using (true);

-- ── 2. restaurant_members (replaces admin_users) ────────────
create table if not exists public.restaurant_members (
  id            uuid        primary key default gen_random_uuid(),
  restaurant_id uuid        not null references public.restaurants(id) on delete cascade,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  role          text        not null default 'owner',
  created_at    timestamptz not null default now(),
  unique(restaurant_id, user_id)
);

create index if not exists restaurant_members_user_id_idx on public.restaurant_members (user_id);
create index if not exists restaurant_members_restaurant_id_idx on public.restaurant_members (restaurant_id);

alter table public.restaurant_members enable row level security;

drop policy if exists "Members can read own membership" on public.restaurant_members;
create policy "Members can read own membership"
  on public.restaurant_members
  for select
  to authenticated
  using (user_id = auth.uid());

-- ── 3. restaurant_settings (one per restaurant) ──────────────
create table if not exists public.restaurant_settings (
  id                uuid        primary key default gen_random_uuid(),
  restaurant_id     uuid        not null unique references public.restaurants(id) on delete cascade,
  restaurant_name   text,
  logo_url          text,
  whatsapp_number   text        not null default '',
  phone             text        not null default '',
  address           text        not null default '',
  hours             text        not null default '',
  maps_url          text        not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.restaurant_settings enable row level security;

drop policy if exists "Public can read restaurant settings" on public.restaurant_settings;
create policy "Public can read restaurant settings"
  on public.restaurant_settings
  for select
  to anon, authenticated
  using (true);

-- ── 4. menu_categories (per tenant) ──────────────────────────
create table if not exists public.menu_categories (
  id            uuid        primary key default gen_random_uuid(),
  restaurant_id uuid        not null references public.restaurants(id) on delete cascade,
  slug          text        not null,
  name_en       text        not null,
  name_bn       text        not null,
  sort_order    integer     not null default 0,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(restaurant_id, slug)
);

create index if not exists menu_categories_restaurant_id_idx on public.menu_categories (restaurant_id);
create index if not exists menu_categories_sort_order_idx    on public.menu_categories (restaurant_id, sort_order asc);
create index if not exists menu_categories_active_idx        on public.menu_categories (restaurant_id, is_active);

alter table public.menu_categories enable row level security;

drop policy if exists "Public can read active categories" on public.menu_categories;
create policy "Public can read active categories"
  on public.menu_categories
  for select
  to anon, authenticated
  using (is_active = true);

-- ── 5. menu_items (per tenant) ───────────────────────────────
create table if not exists public.menu_items (
  id             uuid           primary key default gen_random_uuid(),
  restaurant_id  uuid           not null references public.restaurants(id) on delete cascade,
  slug           text           not null,
  category_id    uuid           not null references public.menu_categories(id) on delete restrict,
  name_en        text           not null,
  name_bn        text           not null,
  description_en text           not null default '',
  description_bn text           not null default '',
  price          numeric(10, 2) not null check (price >= 0),
  image_url      text           not null,
  featured       boolean        not null default false,
  available      boolean        not null default true,
  is_active      boolean        not null default true,
  created_at     timestamptz    not null default now(),
  updated_at     timestamptz    not null default now(),
  unique(restaurant_id, slug)
);

create index if not exists menu_items_restaurant_id_idx on public.menu_items (restaurant_id);
create index if not exists menu_items_category_id_idx   on public.menu_items (category_id);
create index if not exists menu_items_available_idx     on public.menu_items (restaurant_id, available);
create index if not exists menu_items_featured_idx      on public.menu_items (restaurant_id, featured desc);
create index if not exists menu_items_is_active_idx     on public.menu_items (restaurant_id, is_active);

alter table public.menu_items enable row level security;

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

-- ── 6. Storage bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
