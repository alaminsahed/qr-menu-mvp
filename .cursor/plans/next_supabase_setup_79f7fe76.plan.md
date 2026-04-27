---
name: Next Supabase Setup
overview: Scaffold a Next.js App Router project (TypeScript + Tailwind), integrate Supabase with basic auth starter wiring, and configure Prettier + ESLint for consistent formatting and linting.
todos:
  - id: scaffold-next
    content: Scaffold Next.js App Router + TypeScript + Tailwind project
    status: completed
  - id: wire-supabase-auth
    content: Add Supabase clients, env template, and starter auth flow
    status: completed
  - id: setup-quality-tools
    content: Configure Prettier and ESLint scripts/config
    status: completed
  - id: verify-setup
    content: Run lint/format/build checks to validate setup
    status: completed
isProject: false
---

# Next.js + Supabase Bootstrap Plan

## Scope

Set up a fresh Next.js project using App Router, TypeScript, and Tailwind; add Supabase auth starter structure; and configure Prettier + ESLint so formatting/linting is ready from day one.

## Implementation Steps

- Scaffold Next.js project in the target workspace folder with App Router, TypeScript, and Tailwind.
- Add Supabase dependencies and create environment template in `[.env.example](/home/alamin/Desktop/web-dev/qr-menu/.env.example)` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Create Supabase client helpers for browser/server usage in `[lib/supabase/client.ts](/home/alamin/Desktop/web-dev/qr-menu/lib/supabase/client.ts)` and `[lib/supabase/server.ts](/home/alamin/Desktop/web-dev/qr-menu/lib/supabase/server.ts)`.
- Add a minimal auth starter flow:
  - Sign-in page in `[app/login/page.tsx](/home/alamin/Desktop/web-dev/qr-menu/app/login/page.tsx)`
  - Auth callback route in `[app/auth/callback/route.ts](/home/alamin/Desktop/web-dev/qr-menu/app/auth/callback/route.ts)`
  - Protected sample page in `[app/protected/page.tsx](/home/alamin/Desktop/web-dev/qr-menu/app/protected/page.tsx)`
  - Optional middleware/session check in `[middleware.ts](/home/alamin/Desktop/web-dev/qr-menu/middleware.ts)` for protected routing behavior.
- Configure Prettier with `[.prettierrc](/home/alamin/Desktop/web-dev/qr-menu/.prettierrc)`, `[.prettierignore](/home/alamin/Desktop/web-dev/qr-menu/.prettierignore)`, and npm scripts (`format`, `format:check`).
- Ensure ESLint is enabled and aligned with Next.js defaults, then add scripts (`lint`, optionally `lint:fix`) in `[package.json](/home/alamin/Desktop/web-dev/qr-menu/package.json)`.
- Verify setup by running install + checks (`npm run lint`, `npm run format:check`, and build/dev smoke test).

## Deliverables

- Working Next.js + Supabase starter with login/callback/protected route flow.
- Prettier + ESLint configs and scripts ready for development.
- Clear env template and starter file organization for future features.

## Project Motive and Product Specification

### Overview

Build a lightweight QR-based digital menu and WhatsApp ordering system with Bangla and English support, optimized for fast adoption by small to mid-sized restaurants in Bangladesh.

### Objectives

- Improve customer ordering experience.
- Reduce waiting time.
- Provide a modern digital presence.
- Enable easy menu updates for restaurant owners.

### Target Audience

- Cafes and coffee shops.
- Burger and pizza restaurants.
- Mid-range dining restaurants.
- Small modern food businesses.

### Core Features

1. Digital menu (mobile-first, category-based, item image/name/price/description).
2. Multi-language menu content (English and Bangla fields).
3. Unique table-based QR flow (example: `/menu?table=5`).
4. Cart system with quantity updates and total calculation.
5. WhatsApp order with pre-filled message (table, items, total BDT).
6. Basic admin panel (add/edit/delete items, toggle availability).
7. Contact and location (Google Maps, phone, opening hours).
8. QR code generation for table ranges (printable format).

### Optional Features

- Dynamic item availability toggles.
- WhatsApp quick reply templates (received, preparing, delayed, ready).

### MVP Exclusions

- Online payment.
- Delivery management.
- Booking or reservation.
- Advanced analytics.
- WhatsApp bot automation.
- End-user authentication system.

### Technical Architecture

- Frontend/API: Next.js App Router.
- Backend/Database: Supabase (or Firebase fallback).
- Hosting: Vercel.

### Database Schema (Initial)

Table: `menu_items`

- `id`
- `name_en`
- `name_bn`
- `price`
- `image_url`
- `category`
- `available` (boolean)

### System Workflow

1. Customer sits at table.
2. Customer scans QR.
3. Menu opens with table context.
4. Customer adds items to cart.
5. Customer clicks Order.
6. WhatsApp opens with pre-filled order message.
7. Restaurant receives the order in WhatsApp.

### Pricing Model (Business Context)

- Initial setup: 15,000-25,000 BDT.
- Premium package: 25,000-40,000 BDT.
- Yearly service: 3,000-6,000 BDT (hosting, domain, maintenance).

### Key Benefits

- No app installation required.
- Works on any smartphone.
- Easy for customers and restaurant staff.
- Instant ordering via WhatsApp.
- Bangla and English support.
- Easy menu updates.

### Sales Pitch

"Customers scan QR, view your menu in Bangla or English, and order instantly via WhatsApp. You can manage and update everything from your phone."

### Development Timeline

- Day 1: Menu UI and static structure.
- Day 2: Cart system and WhatsApp integration.
- Day 3: Admin panel and deployment.

### Future Enhancements

- Order dashboard.
- Multi-restaurant SaaS model.
- Table booking.
- Automated WhatsApp notifications.

### Conclusion

Focus on simplicity, speed, and real business value so restaurants can digitize ordering without complex infrastructure or training.

## Sectioned Execution Plan

### 1) Client Plan (Customer-Facing App)

#### Goals

- Deliver a fast QR-to-menu journey.
- Support Bangla and English content.
- Enable cart and one-click WhatsApp ordering.

#### Tasks

- Build public menu route with table context (`/menu?table=<id>`).
- Implement language toggle (EN/BN) with persistent user preference.
- Render category-based menu with item cards (name, image, price, description).
- Add item availability handling (hide/disable out-of-stock items).
- Implement cart state (add/remove/update quantity/clear cart).
- Calculate totals in BDT and show order summary.
- Build WhatsApp deep-link generator with pre-filled message:
  - table number
  - item lines (`qty x item`)
  - total amount
- Add contact and location section (maps link/embed, phone, hours).
- Optimize mobile-first UX (tap targets, sticky cart CTA, quick load).
- Add basic analytics events (menu viewed, item added, WhatsApp clicked).

#### Deliverables

- Production-ready customer menu flow from QR scan to WhatsApp order.

### 2) Admin Plan (Restaurant Management Panel)

#### Goals

- Give owners simple menu management from phone or desktop.
- Keep operations easy with low training overhead.

#### Tasks

- Create admin dashboard shell and navigation.
- Build CRUD for `menu_items`:
  - create item
  - edit item
  - delete item
  - list with search/filter by category
- Add availability toggle (`available` true/false) with instant UI update.
- Implement image URL input and preview (or upload later phase).
- Add category management strategy (fixed list for MVP or basic dynamic list).
- Add QR table manager:
  - generate table links (`/menu?table=1..N`)
  - render printable QR sheets/PDF-friendly view
- Add restaurant profile settings (name, WhatsApp number, phone, address, hours).
- Add bilingual content fields (`name_en`, `name_bn`, optional descriptions).
- Add form validation and friendly error states.

#### Deliverables

- Working admin panel for menu updates, availability, and QR generation.

### 3) Backend Plan (Data, APIs, and Integrations)

#### Goals

- Provide stable data layer and secure mutations.
- Keep architecture simple and maintainable for MVP.

#### Tasks

- Finalize Supabase schema for `menu_items` and create migration SQL.
- Add supporting table(s) if needed:
  - `restaurant_settings`
  - `menu_categories` (optional for MVP)
- Implement Row Level Security policy strategy for admin-safe writes.
- Create server-side data access layer:
  - fetch menu by language/category
  - fetch available items only for client
  - admin CRUD mutations
- Implement Server Actions or API route handlers for admin mutations.
- Add input validation schemas for all write operations.
- Add WhatsApp message formatter utility with stable text template.
- Add caching and revalidation strategy (`revalidatePath`/tags) after updates.
- Add environment config validation for required keys.
- Add seed script for initial menu data and categories.
- Add basic error logging and normalized error responses.

#### Deliverables

- Reliable backend foundation for menu serving and admin updates.

## Cross-Section Milestones

- Milestone 1: Client MVP (menu + cart + WhatsApp flow).
- Milestone 2: Admin MVP (menu CRUD + availability + QR print).
- Milestone 3: Backend hardening (validation, policies, seed, revalidation).
