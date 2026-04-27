# Basket + WhatsApp Screen UI Spec

## Purpose

Define the basket and checkout-to-WhatsApp screen behavior and UI structure based on `your_basket_whatsapp_order/code.html`.

## Route

- `/basket` (with table context carried from `/menu`)

## Layout Structure

- Top app bar:
  - back action
  - title (`Your Basket`)
  - language switch (`EN/BN`)
- Basket items list with quantity controls and remove actions.
- Order method block:
  - At Restaurant (table input)
  - Delivery (address input)
- Summary block:
  - subtotal
  - service/delivery fee
  - final total
- Optional promo input area.
- Primary sticky action: `Order via WhatsApp`.

## Core Components

- `BasketItemRow`
- `QuantityPicker`
- `OrderMethodToggle`
- `OrderDetailsFields` (table/address)
- `OrderSummaryCard`
- `PromoCodeInput` (optional)
- `WhatsAppOrderButton`

## Basket Item Requirements

- Show:
  - item image
  - localized name
  - unit price
  - quantity controls
  - remove button
- Cart updates must immediately refresh summary totals.

## WhatsApp Order Requirements

- Button color: WhatsApp green `#25D366`.
- Disable button when cart is empty.
- Message payload should include:
  - table number (or delivery tag/address)
  - item lines (`<qty>x <item>`)
  - total (`Total: <amount> BDT`)
- Use encoded deep link to open WhatsApp.

## Interaction Rules

- Default order method can be `At Restaurant`.
- Show only relevant input field based on method.
- Keep main order button fixed and highly visible.
- Preserve language and table context from previous screen.

## Validation + UX States

- Require table number for dine-in orders.
- Require address for delivery orders.
- Show clear inline validation errors before WhatsApp redirect.
- Show empty-cart state with CTA back to menu.

## Visual Style

- Reuse same design tokens as menu screen for consistency:
  - `primary`: `#8c2d0f`
  - `secondary`: `#47664b`
  - `background`: `#faf9f5`
  - `on-surface`: `#1b1c1a`
- Use rounded containers and subtle shadows; avoid heavy elevation.
