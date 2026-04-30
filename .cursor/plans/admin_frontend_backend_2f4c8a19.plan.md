---
name: admin-frontend-backend-plan
overview: Build a secure admin panel with Supabase-backed CRUD, auth-gated writes, and operational tools for menu, categories, restaurant settings, and QR table links.
todos:
  - id: admin-auth-foundation
    content: Implement admin login + session guard. Admin is defined by membership in `public.admin_users` (no signup flow).
    status: completed
  - id: admin-frontend-shell
    content: Build admin layout, navigation, dashboard shell, and reusable form/table UI primitives.
    status: completed
  - id: admin-menu-crud-ui
    content: Implement menu management UI with create/edit/delete and availability toggles.
    status: pending
  - id: admin-category-crud-ui
    content: Implement category management UI with create/edit/delete and sort controls.
    status: completed
  - id: admin-backend-mutations
    content: Add server actions or API handlers with validation, authorization checks, and cache revalidation.
    status: pending
  - id: admin-settings-qr
    content: Add restaurant settings editor and QR table-link generation/print view.
    status: pending
  - id: admin-hardening-tests
    content: Add error handling, optimistic update rollback, and integration test coverage for admin flows.
    status: pending
isProject: false
---

# Admin Frontend + Backend Plan

## Scope

Deliver a production-ready admin experience for restaurant owners to manage menu operations safely and quickly from mobile or desktop.

- Frontend: protected admin UI for menu, categories, settings, and QR tools.
- Backend: validated and authorized write paths through Supabase-backed handlers.
- Data integrity: enforce constraints, business rules, and cache consistency.

## Goals

- Allow non-technical owners to update menu content in under a minute.
- Keep write operations secure (authenticated + role-checked).
- Ensure public menu updates appear quickly after admin actions.
- Keep architecture extensible for future order-management modules.

## Architecture Direction

### Frontend (App Router)

- Use route-local admin components under `app/admin/_components` (feature-owned placement).
- Create sectioned routes:
  - `app/admin/page.tsx` (overview dashboard)
  - `app/admin/menu/page.tsx` (items management)
  - `app/admin/categories/page.tsx` (category management)
  - `app/admin/settings/page.tsx` (restaurant profile + contact/hours)
  - `app/admin/qr/page.tsx` (table links + printable QR sheet)
- Use server components for initial reads and client components for interactive forms/tables.

### Backend (Supabase + Next server layer)

- Keep all write paths server-side (server actions or route handlers).
- Add schema validation for every mutation payload.
- Add authorization guard at handler entry:
  - authenticated user
  - admin membership check via `public.admin_users`
- Revalidate affected admin/public paths after mutations.

## Data Model and Contracts

## Core Tables

- `menu_categories`
  - `id`, `slug`, `name_en`, `name_bn`, `sort_order`, `is_active`, timestamps
- `menu_items`
  - `id`, `slug`, `category_id`, bilingual names/descriptions, `price`, `image_url`, `available`, `is_active`, timestamps
- `restaurant_settings`
  - `id` (single-row or tenant-scoped), `restaurant_name`, `whatsapp_number`, `phone`, `address`, `hours`, `maps_url`, timestamps
- `admin_users`
  - `user_id` (auth user id) membership list used for admin-only access control

## Validation Rules (minimum)

- Price must be positive and bounded.
- `slug` fields must be normalized and unique.
- Category cannot be deleted while active items still reference it (or implement safe reassignment).
- WhatsApp number and phone fields require consistent format validation.

## Security and Access

- Public role: read-only on active menu data.
- Admin role: write access only through server-validated handlers.
- RLS policies:
  - allow public `select` on active menu rows
  - block direct anonymous writes
  - allow authenticated admin writes per policy using `public.admin_users` membership
- Never expose service role credentials to client components.

## Frontend Implementation Plan

1. Build admin route guard and redirect unauthenticated/non-admin users to `/login`.
2. Create shared admin shell (header, sidebar/tab nav, section container).
3. Implement menu items table with search/filter/sort and row actions.
4. Add create/edit forms with bilingual fields and inline validation.
5. Add availability toggle with optimistic UI and rollback on error.
6. Build category manager (CRUD + sort order controls).
7. Build settings form for restaurant profile and contact details.
8. Build QR utility:

- table range input
- generated menu links (`/menu?table=<n>`)
- printable grid view for physical QR cards

## Backend Implementation Plan

1. Finalize migrations for `menu_categories`, `menu_items`, `restaurant_settings`.
2. Add migration for `public.admin_users` (membership table) and its RLS policies.
3. Add server-side env validation and Supabase admin client helpers.
4. Implement read services for admin lists and public menu consumption.
5. Implement mutation endpoints/actions:

- create/update/delete menu item
- toggle availability
- create/update/delete category
- upsert restaurant settings

1. Add centralized error mapping for user-friendly admin errors.
2. Add cache invalidation strategy:

- revalidate admin pages immediately
- revalidate public menu routes/tags after relevant writes

## Suggested File Targets

- `app/admin/page.tsx`
- `app/admin/menu/page.tsx`
- `app/admin/categories/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/qr/page.tsx`
- `app/admin/_components/*`
- `lib/admin/*` (admin membership check helpers)
- `app/api/admin/menu/route.ts` (if API style)
- `app/api/admin/categories/route.ts` (if API style)
- `app/api/admin/settings/route.ts` (if API style)
- `lib/admin/schemas.ts`
- `lib/admin/services.ts`
- `lib/supabase/server.ts`

## Milestones

- Milestone 1: Admin auth guard + shell + dashboard skeleton.
- Milestone 2: Menu and category CRUD end-to-end (UI + backend + revalidation).
- Milestone 3: Settings + QR utilities + policy hardening.
- Milestone 4: Test coverage and release checklist.

## Test and Verification

- Unit tests for validation schemas and slug/format helpers.
- Integration tests for admin mutations (happy path + invalid payload + unauthorized).
- Manual smoke flow:
  - login as admin
  - create/edit/toggle/delete item
  - update settings
  - generate QR table links
  - confirm public menu reflects changes

## Risks and Mitigations

- Race conditions during concurrent edits -> use row version/timestamp conflict checks where practical.
- Inconsistent menu state after failed optimistic updates -> deterministic rollback + refetch strategy.
- Policy misconfiguration causing overexposure -> test RLS with anon/auth/admin roles before release.
