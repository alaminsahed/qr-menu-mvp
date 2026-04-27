# Client Plan: HTML to React Conversion (QR Menu + WhatsApp)

## Goal

Convert the provided static UI prototypes into reusable React/Next.js components and pages, while preserving the mobile-first UX, enabling functional cart + WhatsApp ordering, and enforcing a token-based UI system so style updates happen from one place.

## Scope (Client Only)

- Public customer-facing pages and components.
- Convert `restaurant_menu/code.html` and `your_basket_whatsapp_order/code.html` into production-ready React components.
- Menu browsing, language switch, cart UX, order summary, and WhatsApp redirect.
- No admin CRUD screens and no deep backend policy work in this file.

## Conversion Sources

- Menu HTML prototype: `docs/ui/restaurant_menu/code.html`
- Basket HTML prototype: `docs/ui/your_basket_whatsapp_order/code.html`
- Visual system reference: `docs/ui/bengal_earth/DESIGN.md`
- Screen notes: `docs/ui/menu_screen.md`, `docs/ui/basket_screen.md`

## User Journey

1. Customer scans table QR (`/menu?table=5`).
2. Menu opens with table context.
3. Customer toggles Bangla/English if needed.
4. Customer adds items to cart and adjusts quantity.
5. Customer taps Order on WhatsApp.
6. WhatsApp opens with pre-filled order text.

## Component Conversion Plan

### 1. Shared UI Components (from repeated HTML patterns)

- `LanguageToggle` (EN/BN switch)
- `TopAppBar` (title + optional actions)
- `CategoryChips` (horizontal scroller, active state)
- `QuantityPicker` (+/- controls)
- `FloatingBasketBar` (count + total)
- `BottomNav` (Menu/Basket tabs)

### 2. Menu Screen Components (`restaurant_menu`)

- `FeaturedItemHero` (special section with image overlay)
- `MenuItemCard` (image, title, desc, price, actions)
- `MenuCategorySection` (heading + list/cards)
- `MenuPageShell` (sticky app bar/chips + content + floating CTA)

### 3. Basket Screen Components (`your_basket_whatsapp_order`)

- `BasketItemRow` (thumbnail, title, price, quantity, delete)
- `OrderMethodToggle` (dine-in vs delivery)
- `OrderDetailsFields` (table input / address textarea)
- `OrderSummaryCard` (subtotal, fee, total)
- `WhatsAppOrderButton` (deep-link trigger)

## Functional Requirements

### 1. Table-Aware Menu Entry

- Parse `table` from URL query params.
- Preserve table context through cart and checkout summary.
- Show fallback state if table is missing/invalid.

### 2. Multi-language Menu (EN/BN)

- Add language toggle (`EN` / `BN`).
- Render `name_en` or `name_bn` by selected language.
- Keep language preference in local storage or cookie.

### 3. Category-Based Menu View

- Group items by category (Burger, Drinks, etc.).
- Show item card fields: image, name, description, price, availability.
- Hide or disable unavailable items (`available = false`).

### 4. Cart and Pricing

- Add-to-cart from menu item cards.
- Increase/decrease quantity.
- Remove line item and clear cart.
- Calculate subtotal/total in BDT.

### 5. WhatsApp Order Flow

- Build message from:
  - table number
  - each line item (`<qty>x <item name>`)
  - total amount (`Total: <amount> BDT`)
- Encode and open WhatsApp deep link using restaurant number.
- Validate cart non-empty before enabling order action.

### 6. Basket Order Method

- Support `At Restaurant` and `Delivery` mode.
- Validate required fields based on selected mode before order submit.

## Technical Approach

- Use App Router server rendering for initial menu load.
- Keep cart as client state (context/store) for smooth interactions.
- Use shared utility to format currency and WhatsApp message text.
- Keep UI mobile-first with sticky cart CTA and simple navigation.
- Extract reusable presentational components first, then wire behavior/state.
- Centralize all design tokens (especially colors) in one shared theme file so updates apply globally.

## Design Token Strategy (Single Source of Truth)

- Keep all color values in one place (no hard-coded hex in components).
- Define semantic tokens for UI roles, not only brand names.
- Map Tailwind/theme classes to CSS variables so changing root values updates all screens.
- Keep reusable `ui-*` utility classes mapped to tokens for components/pages.

### Required Token Groups

- Background tokens:
  - app background
  - surface/card background
  - elevated/sticky background
- Text tokens:
  - primary text
  - secondary text
  - muted text
  - inverse text
- Action tokens:
  - primary button bg/text
  - secondary button bg/text
  - success/WhatsApp action
- Border and state tokens:
  - default border
  - soft border
  - disabled surface/text

### Token-Based UI Rule

- Components should consume semantic classes (`ui-card`, `ui-panel`, `ui-btn-*`, `ui-text-*`, `ui-input`) instead of ad-hoc per-file utility mixes.
- Design changes should be applied by editing token values in `app/globals.css`, not by touching multiple components.

## Tasks

### Phase A: HTML to JSX Structure

- [x] Create `/menu` and `/basket` pages that mirror source HTML layout structure.
- [x] Convert static HTML blocks into JSX with semantic React component boundaries.
- [x] Replace inline-only behavior with React props/state patterns.

### Phase B: Shared Components

- [x] Build `LanguageToggle`, `TopAppBar`, `CategoryChips`, `QuantityPicker`.
- [~] Build `FloatingBasketBar` and `BottomNav` with reusable props. (floating basket done, bottom nav pending)
- [x] Align shared components with Bengal Earth tokens (color/type/spacing).
- [x] Create a single token source file for colors and expose semantic variables/classes.
- [x] Replace direct hard-coded color usage in main client components with token-based classes.
- [x] Add shared token-based semantic UI classes (`ui-*`) for cards, panels, buttons, inputs, chips, and typography.

### Phase C: Screen Components

- [x] Build menu-specific components from `restaurant_menu` source.
- [x] Build basket-specific components from `your_basket_whatsapp_order` source.
- [x] Compose final `/menu` and `/basket` pages from reusable components.

### Phase D: Behavior Wiring

- [x] Add table query handling and context carry-over between screens.
- [x] Add language toggle and localized text selection.
- [x] Add cart store with add/remove/update/clear behavior.
- [x] Add order method toggle and conditional validation.
- [x] Add WhatsApp message generator and deep-link redirect.

### Phase E: Polish and Validation

- [~] Add loading/error/empty states. (error + empty done, loading pending)
- [x] Verify mobile sticky sections and tap targets.
- [x] Run screen-level QA checklist against original prototypes.
- [x] Theme validation: change one token value and confirm all related UI updates automatically.

## Current Status Summary

- Token-based UI foundation is implemented in `app/globals.css`.
- Menu and basket screens are componentized and functional.
- Shared semantic `ui-*` classes are active across key client components.
- Remaining optional polish:
  - implement `BottomNav` component
  - add explicit loading state handling for menu data

## Deliverables

- React componentized implementation of both source screens.
- Reusable UI component layer for future client features.
- Functional `/menu` and `/basket` flow with bilingual cart + WhatsApp order.
- Visual parity with prototype direction and mobile-first UX.
- Token-based UI system where global visual edits happen in one file.
