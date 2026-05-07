# Restaurant Onboarding Guide — A to Z

> **Platform:** TapBite (`tapbite.org`) — multi-tenant QR menu SaaS
> **Stack:** Next.js 16 · Supabase · Vercel  
> **Time required:** ~15 minutes per restaurant

---

## Overview

Each restaurant gets:

- A unique **slug** (e.g. `shonali`) → maps to `shonali.tapbite.org`
- A **row in `restaurants`** table (the tenant anchor)
- A **row in `restaurant_settings`** (logo, phone, address, etc.)
- A **Supabase Auth user** (the owner/admin login)
- A **row in `restaurant_members`** (links the user to the restaurant)
- (Optional) seed **menu categories** and **menu items**

The wildcard subdomain `*.tapbite.org` is already routed to Vercel. No per-restaurant Vercel config is needed after the initial DNS setup.

---

## Step 1 — Choose the Slug

The slug is permanent (it appears in the URL). Use lowercase letters, numbers, and hyphens only.

| Good | Bad |
|------|-----|
| `shonali-bhoj` | `Shonali Bhoj` |
| `spice-garden` | `spice_garden` |
| `dhaka-kitchen` | `dhaka kitchen` |

> **Rule:** No spaces, no underscores, no capitals.

---

## Step 2 — Database: Create the Restaurant Tenant

Open **Supabase Dashboard → SQL Editor** (or use the Supabase CLI).

### 2a. Insert the restaurant row

```sql
INSERT INTO public.restaurants (slug, name, status)
VALUES (
  'shonali-bhoj',          -- ← your chosen slug
  'Shonali Bhoj',          -- ← display name
  'active'
);
```

Copy the returned `id` UUID — you need it for all subsequent inserts.

```sql
-- Get the ID if you forgot to copy it
SELECT id FROM public.restaurants WHERE slug = 'shonali-bhoj';
```

### 2b. Insert restaurant settings

Replace `<restaurant_id>` with the UUID from 2a.

```sql
INSERT INTO public.restaurant_settings (
  restaurant_id,
  restaurant_name,
  logo_url,
  whatsapp_number,
  phone,
  address,
  hours,
  maps_url
)
VALUES (
  '<restaurant_id>',
  'Shonali Bhoj',
  '',                       -- upload logo later from Admin → Settings
  '8801700000000',          -- WhatsApp number (country code, no +)
  '01700-000000',           -- display phone
  '123 Mirpur Road, Dhaka', -- full address
  'Sat–Thu 11am–10pm',      -- opening hours text
  ''                        -- Google Maps embed URL (optional)
);
```

> **Logo:** leave `logo_url` empty for now. The owner can upload it from the Admin panel after login. The file goes to the `menu-images` Supabase Storage bucket.

---

## Step 3 — Auth: Create the Admin User

### Option A — Supabase Dashboard (recommended for first setup)

1. Go to **Authentication → Users → Add user** (Invite user button).
2. Enter the owner's email and a temporary password.
3. Copy the new **user UUID** shown in the list.

### Option B — Supabase SQL (service-role only)

```sql
-- Run only if you have direct access to auth.users (requires service role)
-- Prefer Dashboard Option A for safety.
SELECT id FROM auth.users WHERE email = 'owner@shonalibhoj.com';
```

---

## Step 4 — Database: Link User to Restaurant

Replace both UUIDs with the correct values.

```sql
INSERT INTO public.restaurant_members (restaurant_id, user_id, role)
VALUES (
  '<restaurant_id>',   -- from Step 2a
  '<user_id>',         -- from Step 3
  'owner'
);
```

> **Roles:** `owner` is the only role currently used. The RLS policy lets authenticated users read their own membership row.

---

## Step 5 — (Optional) Seed Initial Menu Categories

```sql
INSERT INTO public.menu_categories
  (restaurant_id, slug, name_en, name_bn, sort_order, is_active)
VALUES
  ('<restaurant_id>', 'starters',  'Starters',   'স্টার্টার',     1, true),
  ('<restaurant_id>', 'mains',     'Mains',       'প্রধান খাবার',  2, true),
  ('<restaurant_id>', 'drinks',    'Drinks',      'পানীয়',        3, true),
  ('<restaurant_id>', 'desserts',  'Desserts',    'মিষ্টান্ন',     4, true);
```

The owner can rename and reorder categories from **Admin → Categories** after login.

---

## Step 6 — (Optional) Seed Initial Menu Items

```sql
-- Get a category ID first
SELECT id FROM public.menu_categories
WHERE restaurant_id = '<restaurant_id>' AND slug = 'mains';

INSERT INTO public.menu_items (
  restaurant_id, slug, category_id,
  name_en, name_bn,
  description_en, description_bn,
  price, image_url,
  featured, available, is_active
)
VALUES (
  '<restaurant_id>',
  'beef-bhuna',
  '<category_id>',
  'Beef Bhuna',
  'বিফ ভুনা',
  'Slow-cooked spiced beef',
  'মশলাদার বিফ ভুনা',
  220.00,
  '',          -- leave empty; owner uploads image from Admin panel
  true,        -- featured on home screen
  true,
  true
);
```

---

## Step 7 — Vercel: Subdomain Setup

> **This step is a one-time platform setup.** Once the wildcard domain is configured, every new restaurant slug works automatically — you do NOT repeat this step per restaurant.

### 7a. Check if wildcard domain is already configured

In **Vercel Dashboard → your project → Settings → Domains**, you should see:

```
*.tapbite.org
tapbite.org
```

If both are listed and verified, **skip to Step 8**.

### 7b. Add wildcard domain (first time only)

1. Go to **Vercel → Project → Settings → Domains**.
2. Click **Add**.
3. Enter `*.tapbite.org` and click **Add**.
4. Vercel shows DNS records to add. Add them in your DNS provider:

| Type | Name | Value |
|------|------|-------|
| `A` | `*` | `76.76.21.21` (Vercel's IP) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> **DNS propagation** takes 5–60 minutes. Vercel will mark the domain as verified once it detects the records.

### 7c. Environment variables (one-time check)

In **Vercel → Project → Settings → Environment Variables**, confirm these exist:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `tapbite.org` |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service role key |

> `NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG` is only needed for local dev (defaults to `demo`). Do not set it in production unless you want a fallback tenant.

---

## Step 8 — How Routing Works (No Action Required)

Understanding this helps you debug issues.

```
Request: shonali-bhoj.tapbite.org/menu
         ↓
Vercel wildcard → Next.js app (proxy.ts middleware)
         ↓
proxy.ts reads host header → extracts slug "shonali-bhoj"
         ↓
Sets x-tenant-slug: shonali-bhoj header
         ↓
resolveRestaurantId() in lib/tenant.ts queries:
  SELECT id FROM restaurants WHERE slug = 'shonali-bhoj'
         ↓
All DB queries filter by restaurant_id → isolated tenant data
```

If `shonali-bhoj` is not in `restaurants`, the page returns no data (empty menu). Always complete Step 2 before testing the subdomain.

---

## Step 9 — Test the Onboarding

### 9a. Test the public menu page

Open `https://shonali-bhoj.tapbite.org/menu` in a browser.

Expected: the menu page loads and shows the restaurant name (or empty categories if no items added yet).

### 9b. Test the admin login

1. Open `https://shonali-bhoj.tapbite.org/login`
2. Log in with the credentials from Step 3.
3. Confirm the admin panel loads at `/admin`.

### 9c. Verify membership in DB

```sql
SELECT
  r.name,
  r.slug,
  rm.role,
  u.email
FROM public.restaurant_members rm
JOIN public.restaurants r ON r.id = rm.restaurant_id
JOIN auth.users u ON u.id = rm.user_id
WHERE r.slug = 'shonali-bhoj';
```

---

## Step 10 — Hand Off to the Restaurant Owner

Send the owner:

1. **Login URL:** `https://shonali-bhoj.tapbite.org/login`
2. **Email:** their email address
3. **Temporary password:** the one you set in Step 3
4. **Ask them to:**
   - Change password immediately (Supabase Auth → Profile or password reset flow)
   - Upload their logo from **Admin → Settings**
   - Add or edit menu items from **Admin → Menu**
   - Generate QR codes from **Admin → QR**

---

## Quick Reference Checklist

```
[ ] 1. Choose slug (lowercase, hyphens only)
[ ] 2a. INSERT INTO restaurants (slug, name, status)
[ ] 2b. INSERT INTO restaurant_settings (whatsapp, phone, address, hours)
[ ] 3. Create Auth user in Supabase Dashboard
[ ] 4. INSERT INTO restaurant_members (restaurant_id, user_id, role='owner')
[ ] 5. (optional) Seed menu categories
[ ] 6. (optional) Seed menu items
[ ] 7. Verify *.tapbite.org wildcard is on Vercel (one-time)
[ ] 8. Open https://<slug>.tapbite.org/menu — confirm it loads
[ ] 9. Open https://<slug>.tapbite.org/login — confirm admin works
[ ] 10. Send credentials to restaurant owner
```

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Subdomain shows blank menu | `restaurants` row missing or wrong slug | Check `SELECT * FROM restaurants WHERE slug = '...'` |
| Admin login redirects to `/login` | User not in `restaurant_members` | Insert the membership row (Step 4) |
| 404 on subdomain | DNS not propagated or wildcard not added to Vercel | Wait ~1 hour; check Vercel Domains tab |
| "Missing required env variable" error | Env vars not set in Vercel | Add vars in Vercel → Settings → Environment Variables |
| Logo not showing | `logo_url` is empty | Owner uploads from Admin → Settings |
| Menu empty after adding items | `is_active = false` or category `is_active = false` | Set both to `true` in DB or via Admin panel |

---

## Database Schema Quick Reference

```
restaurants           ← one row per tenant (slug = subdomain)
  └── restaurant_settings   ← one row per restaurant (1:1)
  └── restaurant_members    ← links auth.users to restaurants
  └── menu_categories       ← per tenant, sorted by sort_order
        └── menu_items      ← per tenant + per category
```

All tables have `restaurant_id` as the tenant isolation column. Row Level Security (RLS) is enabled on all tables. Public (anon) users can read active categories and items. Only authenticated members can write (via service role in API routes).
