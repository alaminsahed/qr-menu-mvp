# Menu Screen UI Spec

## Purpose

Define the customer menu screen behavior and UI structure based on `restaurant_menu/code.html`.

## Route

- `/menu?table=<id>`

## Layout Structure

- Fixed top app bar:
  - restaurant name
  - language switch (`EN/BN`)
  - optional quick action (e.g., call waiter)
- Sticky category chips row below app bar.
- Featured section ("Today's Special") with large hero image.
- Category-based item list/cards.
- Floating bottom basket CTA with count and total.
- Bottom navigation (Menu, Basket).

## Core Components

- `LanguageToggle`
- `CategoryChips`
- `FeaturedItemHero`
- `MenuItemCard`
- `QuantityPicker` (or Add button when quantity is 0)
- `FloatingBasketBar`

## Menu Item Card Requirements

- Show:
  - item image
  - name (localized)
  - short description (localized)
  - price in BDT (`৳`)
  - add/quantity action
- Availability:
  - if `available=false`, disable actions and show unavailable state.

## Visual Style

- Brand feel: organic minimalism, food-first imagery, warm and premium.
- Color anchors:
  - `primary`: `#8c2d0f`
  - `secondary`: `#47664b`
  - `background`: `#faf9f5`
  - `on-surface`: `#1b1c1a`
- Typography:
  - headlines: `Epilogue`
  - body text: `Be Vietnam Pro`
- Spacing:
  - 4/8 rhythm, mobile margin `20px`, gutter `16px`

## Interaction Rules

- Active category chip is solid `secondary`; inactive is outlined neutral.
- Quantity controls must be tap-friendly (`>=44px` target preferred).
- Sticky basket should remain visible while browsing.
- Keep primary actions thumb-reachable on mobile.

## Data + Logic

- Parse table ID from query param and keep through basket flow.
- Group items by category.
- Toggle language and persist preference (cookie/local storage).
- Update cart summary in real time for floating basket CTA.

## Accessibility

- Maintain contrast for text and CTAs.
- Keep body text readable at mobile baseline size (16px).
- Provide descriptive `alt` text for food images.
