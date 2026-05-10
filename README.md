# TapBite (QR Menu SaaS) - Business and Product Overview

TapBite is a multi-tenant QR menu platform built for restaurants in Bangladesh.  
It helps restaurants run dine-in and local delivery ordering through QR + WhatsApp without paying marketplace commission.

## 1) What business problem TapBite solves

Restaurants often lose margin and operational speed because:

- Third-party marketplaces charge high commission.
- Dine-in ordering depends heavily on waiter availability.
- Table orders can be mixed up during rush hours.
- Small restaurants cannot afford custom app development.

TapBite solves this by giving each restaurant:

- A branded digital menu
- Per-table QR ordering flow
- WhatsApp-based order submission
- Simple admin panel to manage categories, items, prices, and availability

## 2) Target customers

- Small and mid-size restaurants
- Cafes and food courts
- Operators that run both dine-in and local delivery
- Businesses that want digital ordering without building a separate app

## 3) Core value proposition

- **Zero marketplace commission:** direct customer ordering flow.
- **No app install required:** customers scan QR and order in browser/WhatsApp.
- **Per-table accuracy:** order links can carry table number context.
- **Fast setup:** new restaurant can be onboarded quickly with tenant setup.
- **Low cost model:** free trial plus affordable monthly/yearly pricing.

## 4) Business model (current)

From product messaging currently in the app:

- 3-month free trial
- Monthly plan: BDT 200
- Yearly plan: BDT 2,000

The positioning is low-cost, direct-order infrastructure for local restaurants.

## 5) How the product works (end-to-end)

### Customer flow

1. Guest scans a QR code (table or zone specific).
2. Guest opens the restaurant menu (`/menu`) in browser.
3. Guest selects items and order details.
4. Order is sent via WhatsApp with context (for example table number).
5. Restaurant fulfills for dine-in or delivery.

### Restaurant owner/staff flow

1. Owner logs in at `/login`.
2. Uses `/admin` area to manage:
   - Settings (restaurant info, branding, contact)
   - Categories
   - Menu items (including images, pricing, availability)
   - QR utilities/generation support
3. Publishes updates instantly for customers.

## 6) Multi-tenant business architecture

TapBite is designed as a SaaS where one codebase serves many restaurants.

- Each restaurant has a unique `slug`.
- Slug maps to subdomain (`<slug>.tapbite.org`).
- App resolves the tenant and loads only that restaurant's data.
- Data isolation is done via `restaurant_id` across domain tables.

Core tenant entities:

- `restaurants` (tenant identity and status)
- `restaurant_settings` (branding and contact config)
- `restaurant_members` (who can access admin)
- `menu_categories`
- `menu_items`

## 7) Operational onboarding summary

For a new restaurant, operations team typically performs:

1. Choose and register slug.
2. Insert tenant rows in database (`restaurants`, `restaurant_settings`).
3. Create auth user for owner.
4. Link user to tenant via `restaurant_members`.
5. Optionally seed initial categories/items.
6. Confirm subdomain + login works.
7. Hand over credentials and admin instructions.

Detailed runbook: `docs/restaurant-onboarding.md`

## 8) Key product modules in this repository

- Public marketing page: `app/page.tsx`
- Customer menu experience: `app/menu`
- Basket/ordering flow: `app/basket`
- Join request flow: `app/wishlist`
- Admin workspace: `app/admin`
- Tenant-aware APIs: `app/api`

## 9) Tech stack (for business and delivery context)

- **Frontend/App framework:** Next.js (App Router)
- **Database/Auth/Storage:** Supabase
- **Hosting/Domain routing:** Vercel + wildcard subdomain

This stack supports rapid onboarding and low operational overhead per tenant.

## 10) Local development quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## 11) Recommended documentation roadmap

To keep business clarity high as the product grows, add these docs next:

- `docs/pricing-and-packages.md` - final package rules and upsell options
- `docs/operations-sop.md` - support + onboarding standard operating procedure
- `docs/kpi-definitions.md` - activation, retention, and revenue metrics
- `docs/security-and-access-model.md` - member roles and data boundaries
