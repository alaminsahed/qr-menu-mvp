---
name: Bengal Earth
colors:
  surface: "#faf9f5"
  surface-dim: "#dbdad6"
  surface-bright: "#faf9f5"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f4f4f0"
  surface-container: "#efeeea"
  surface-container-high: "#e9e8e4"
  surface-container-highest: "#e3e2df"
  on-surface: "#1b1c1a"
  on-surface-variant: "#57423c"
  inverse-surface: "#2f312e"
  inverse-on-surface: "#f2f1ed"
  outline: "#8a726b"
  outline-variant: "#dec0b8"
  surface-tint: "#a33d1f"
  primary: "#8c2d0f"
  on-primary: "#ffffff"
  primary-container: "#ac4425"
  on-primary-container: "#ffdcd3"
  inverse-primary: "#ffb5a0"
  secondary: "#47664b"
  on-secondary: "#ffffff"
  secondary-container: "#c8ecc9"
  on-secondary-container: "#4c6c50"
  tertiary: "#664800"
  on-tertiary: "#ffffff"
  tertiary-container: "#855e00"
  on-tertiary-container: "#ffdfaa"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdbd1"
  primary-fixed-dim: "#ffb5a0"
  on-primary-fixed: "#3b0900"
  on-primary-fixed-variant: "#832609"
  secondary-fixed: "#c8ecc9"
  secondary-fixed-dim: "#adcfae"
  on-secondary-fixed: "#03210c"
  on-secondary-fixed-variant: "#2f4d34"
  tertiary-fixed: "#ffdea7"
  tertiary-fixed-dim: "#f8bd45"
  on-tertiary-fixed: "#271900"
  on-tertiary-fixed-variant: "#5e4200"
  background: "#faf9f5"
  on-background: "#1b1c1a"
  surface-variant: "#e3e2df"
typography:
  h1:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  h2:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.3"
  h3:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: "600"
    lineHeight: "1.4"
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: "600"
    lineHeight: "1.2"
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style

This design system captures the warmth of Bangladeshi hospitality through a modern, minimalist lens. The personality is grounded and artisanal, bridging traditional culinary roots with a contemporary mobile-first experience.

The aesthetic centers on **Organic Minimalism**. It prioritizes high-resolution food photography, treating the dish as the primary hero. The UI stays out of the way, using ample whitespace and a restrained palette to create a premium yet approachable atmosphere. Layouts are optimized for single-handed mobile use, ensuring that "Order" and "Explore" actions are within easy reach. The emotional response is one of comfort, cleanliness, and appetite.

## Colors

The color palette is derived from the natural elements of the Bengal region:

- **Terracotta (Primary):** A deep, earthy red used for primary calls-to-action and key brand moments. It stimulates appetite and warmth.
- **Forest Green (Secondary):** A rich, grounding green used for headers, category indicators, and signifying freshness/vegetarian options.
- **Warm Yellow (Tertiary):** Used sparingly for highlights, ratings, and promotional badges to add a sunny, appetizing glow.
- **Off-White (Neutral):** A soft, cream-tinted white serves as the primary background to reduce eye strain and provide a more "paper-like" organic feel than pure white.
- **Deep Charcoal:** Used for primary body text to ensure high legibility while remaining softer than pure black.

## Typography

This design system uses a pairing of two sans-serifs to balance personality with utility.

**Epilogue** is utilized for headlines. Its slightly geometric yet expressive character provides the "touch of personality" required, making dish names feel curated and editorial.

**Be Vietnam Pro** is used for all functional text, descriptions, and labels. It is exceptionally readable on mobile screens and has a friendly, contemporary tone that complements the earthy visual style. Maintain generous line-height for dish descriptions to ensure the menu remains scannable and uncrowded.

## Layout & Spacing

The layout follows a **fluid-to-fixed** model optimized for mobile devices. On mobile, a 4-column grid is used with 20px outer margins to provide "breathing room" for food imagery.

Spacing follows a strict 4px/8px baseline rhythm. Vertical rhythm is critical; use `lg` (32px) spacing between different food categories (e.g., Starters vs. Mains) and `md` (24px) between individual menu items. All content containers should use a standard 16px internal padding to maintain a consistent "inner-safe-area."

## Elevation & Depth

To maintain a minimalist feel, this design system avoids heavy shadows. Instead, it uses **Ambient Tonal Depth**.

Surface-container tiers are created by placing cards on a slightly darker neutral background. Shadows should be extra-diffused (e.g., 20px blur, 4px Y-offset) with a very low opacity (5-8%) tinted with the primary Terracotta color. This creates a "lifted" effect that feels like soft sunlight hitting a table.

Interactive elements like "Add to Cart" buttons should feel tactile, gaining a slightly more pronounced shadow upon hover or press to mimic a physical button being depressed.

## Shapes

The shape language is friendly and organic. A **Rounded** (0.5rem base) corner radius is applied to standard input fields and small buttons. Larger components, such as product cards and category containers, utilize `rounded-xl` (1.5rem) to echo the curves of traditional clay pottery and plates.

Food images should always be presented in containers with a minimum of 1rem corner radius or as perfect circles for "featured" item thumbnails. Avoid sharp 90-degree angles to maintain the welcoming, appetizing aesthetic.

## Components

- **Menu Cards:** Featured items use a vertical stack with the image taking the top 60% of the card. Standard items use a horizontal layout with a small 80x80px rounded image on the right.
- **Primary Buttons:** Solid Terracotta fill with white text. Use large, pill-shaped footprints for the main "Order" actions.
- **Category Chips:** Outlined in Forest Green when inactive; solid Forest Green with white text when active. These should sit in a horizontally scrollable container at the top of the menu.
- **Price Labels:** Displayed in a semi-bold weight of the headline font. Avoid currency symbols where possible or make them smaller than the price digits.
- **Quantity Pickers:** A unified pill-shaped component with a light yellow background, featuring large '-' and '+' touch targets.
- **Status Badges:** Small, rounded labels for "Spicy," "Vegan," or "Popular." Use the Tertiary Yellow for "Popular" and a muted version of the Secondary Green for "Vegan."
- **Floating Cart:** A bottom-anchored, full-width "sticky" element that displays the current total and a "View Basket" call-to-action, using a slight background blur (Glassmorphism) to show the menu content scrolling beneath it.
