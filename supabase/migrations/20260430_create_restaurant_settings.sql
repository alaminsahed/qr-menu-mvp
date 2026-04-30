create table if not exists public.restaurant_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null,
  whatsapp_number text not null default '',
  phone text not null default '',
  address text not null default '',
  hours text not null default '',
  maps_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.restaurant_settings enable row level security;

drop policy if exists "Public can read restaurant settings" on public.restaurant_settings;
create policy "Public can read restaurant settings"
  on public.restaurant_settings
  for select
  to anon, authenticated
  using (true);
