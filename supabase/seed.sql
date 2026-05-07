-- ── Demo restaurant ──────────────────────────────────────────
insert into public.restaurants (slug, name, status)
values ('demo', 'TapBite Demo', 'active')
on conflict (slug) do update
set
  name   = excluded.name,
  status = excluded.status,
  updated_at = now();

-- ── Demo restaurant settings ─────────────────────────────────
insert into public.restaurant_settings (
  restaurant_id,
  restaurant_name,
  whatsapp_number,
  phone,
  address,
  hours
)
values (
  (select id from public.restaurants where slug = 'demo'),
  'TapBite Demo',
  '+8801685765411',
  '+8801685765411',
  'Dhaka, Bangladesh',
  'Daily 10am – 11pm'
)
on conflict (restaurant_id) do update
set
  restaurant_name = excluded.restaurant_name,
  whatsapp_number = excluded.whatsapp_number,
  phone           = excluded.phone,
  address         = excluded.address,
  hours           = excluded.hours,
  updated_at      = now();

-- ── Categories ───────────────────────────────────────────────
insert into public.menu_categories (restaurant_id, slug, name_en, name_bn, sort_order, is_active)
values
  ((select id from public.restaurants where slug = 'demo'), 'burgers', 'Burgers', 'বার্গার', 1, true),
  ((select id from public.restaurants where slug = 'demo'), 'drinks',  'Drinks',  'ড্রিংকস', 2, true),
  ((select id from public.restaurants where slug = 'demo'), 'coffee',  'Coffee',  'কফি',     3, true)
on conflict (restaurant_id, slug) do update
set
  name_en    = excluded.name_en,
  name_bn    = excluded.name_bn,
  sort_order = excluded.sort_order,
  is_active  = excluded.is_active,
  updated_at = now();

-- ── Menu items ────────────────────────────────────────────────
insert into public.menu_items (
  restaurant_id,
  slug,
  category_id,
  name_en,
  name_bn,
  description_en,
  description_bn,
  price,
  image_url,
  featured,
  available,
  is_active
)
values
  (
    (select id from public.restaurants where slug = 'demo'),
    'naga-king-burger',
    (select id from public.menu_categories where restaurant_id = (select id from public.restaurants where slug = 'demo') and slug = 'burgers'),
    'Naga King Burger',
    'নাগা কিং বার্গার',
    'Smoked beef patty with Sylheti naga morich glaze.',
    'সিলেটি নাগা মরিচ গ্লেজসহ স্মোকড বিফ প্যাটি।',
    450,
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop',
    true,
    true,
    true
  ),
  (
    (select id from public.restaurants where slug = 'demo'),
    'shutki-spice-burger',
    (select id from public.menu_categories where restaurant_id = (select id from public.restaurants where slug = 'demo') and slug = 'burgers'),
    'Shutki Spice Burger',
    'শুটকি স্পাইস বার্গার',
    'Bold spicy dried fish infusion with pickled onions.',
    'ঝাল শুটকির ফ্লেভার ও পিকলড পেঁয়াজ।',
    380,
    'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop',
    false,
    true,
    true
  ),
  (
    (select id from public.restaurants where slug = 'demo'),
    'dhakaiya-paneer-bun',
    (select id from public.menu_categories where restaurant_id = (select id from public.restaurants where slug = 'demo') and slug = 'burgers'),
    'Dhakaiya Paneer Bun',
    'ঢাকাইয়া পনির বান',
    'Grilled marinated paneer with cilantro chutney.',
    'গ্রিলড মেরিনেটেড পনির ও ধনেপাতা চাটনি।',
    320,
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1000&auto=format&fit=crop',
    false,
    true,
    true
  ),
  (
    (select id from public.restaurants where slug = 'demo'),
    'mango-lassi-supreme',
    (select id from public.menu_categories where restaurant_id = (select id from public.restaurants where slug = 'demo') and slug = 'drinks'),
    'Mango Lassi Supreme',
    'ম্যাঙ্গো লাস্সি সুপ্রিম',
    'Creamy yogurt with mango pulp and saffron.',
    'ক্রিমি দই, ম্যাঙ্গো পাল্প এবং জাফরান।',
    180,
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop',
    false,
    true,
    true
  ),
  (
    (select id from public.restaurants where slug = 'demo'),
    'iced-coffee',
    (select id from public.menu_categories where restaurant_id = (select id from public.restaurants where slug = 'demo') and slug = 'coffee'),
    'Iced Coffee',
    'আইসড কফি',
    'Cold brew coffee with light sweetness.',
    'হালকা মিষ্টির কোল্ড ব্রু কফি।',
    220,
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1000&auto=format&fit=crop',
    false,
    false,
    true
  )
on conflict (restaurant_id, slug) do update
set
  category_id    = excluded.category_id,
  name_en        = excluded.name_en,
  name_bn        = excluded.name_bn,
  description_en = excluded.description_en,
  description_bn = excluded.description_bn,
  price          = excluded.price,
  image_url      = excluded.image_url,
  featured       = excluded.featured,
  available      = excluded.available,
  is_active      = excluded.is_active,
  updated_at     = now();
