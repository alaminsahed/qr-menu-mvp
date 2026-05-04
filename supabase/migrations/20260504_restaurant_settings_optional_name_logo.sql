alter table public.restaurant_settings
  alter column restaurant_name drop not null;

alter table public.restaurant_settings
  add column if not exists logo_url text;

comment on column public.restaurant_settings.logo_url is
  'Public URL for restaurant logo (Supabase Storage public URL).';
