---
name: design-token-applier
description: Converts hardcoded UI styling into design tokens and consistent utility usage. Use when a user asks to replace hardcoded colors, spacing, radius, shadows, or typography with project tokens (CSS variables/Tailwind tokens), or asks for consistent UI styling across components.
---

# Design Token Applier

## Goal

Replace hardcoded visual styles with the project's token system while preserving current UI behavior.

## Use When

- A component uses raw hex/rgb/hsl values repeatedly.
- Spacing/radius/shadow/font sizes are hardcoded inconsistently.
- The user asks for "tokenize this UI", "remove hardcoded styles", or "make styling consistent".

## Workflow

1. **Scan styles**
   - Identify hardcoded values in `className`, inline `style`, and CSS files.
   - Group by category: color, spacing, typography, radius, border, shadow.

2. **Map to existing tokens first**
   - Prefer existing CSS variables in `app/globals.css` and existing utility classes.
   - Reuse current naming conventions before introducing anything new.

3. **Apply replacements**
   - Replace hardcoded values with token-backed classes/variables.
   - Keep visual output as close as possible to the current UI.
   - Avoid mixing multiple patterns for the same concern in one component.

4. **Add tokens only when necessary**
   - If no suitable token exists, add a new token in the central token location.
   - Use semantic naming (role-based), not raw color naming.
   - Add minimal tokens required for this change.

5. **Verify**
   - Run lints on edited files.
   - Check for regressions in contrast/readability and spacing rhythm.

## Project Conventions

- Prefer token-driven classes like `bg-app`, `text-primary-ui`, `border-default`.
- Keep shared tokens centralized in `app/globals.css`.
- Prefer `rem`-friendly scale and existing spacing rhythm over arbitrary values.
- Do not add a new token if an equivalent token already exists.

## Output Format

When finishing, summarize:

- Which hardcoded patterns were replaced.
- Which existing tokens were reused.
- Which new tokens (if any) were introduced and why.
- Any remaining hardcoded values that were intentionally kept.
