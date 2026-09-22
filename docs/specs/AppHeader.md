# AppHeader

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `AppHeader` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/AppHeader.tsx` |
| Story | `Components/Navigation/AppHeader` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `71b5ae886aeae49e` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

APP HEADER COMPONENT (top bar)

The application top bar: a `<header>` with `brand`, `navigation`, and `actions`
slots. Below `md` the navigation folds behind a menu toggle (1-bit Menu icon,
swapping to X when open) with `aria-expanded` / `aria-controls` pointing at a
panel under the bar. `sticky` pins the bar on the `z-index.sticky` layer.

The navigation slot is wrapped in a named `<nav>` (inline on wide screens, in
the panel on narrow ones; only one is displayed at a time).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| static | Scrolls with the page |
| sticky | `sticky top-0` on `z-index.sticky` |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (single) | Bar row is at least `control.height.lg` (48px); toggle is a 48px ghost Button |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `brand` | `ReactNode` | - | Yes | Left slot. |
| `navigation` | `ReactNode` | - | No | Middle slot; folds into the menu below `md`. |
| `actions` | `ReactNode` | - | No | Right slot, always visible. |
| `mobileMenu` | `ReactNode` | `navigation` | No | Custom panel content. |
| `sticky` | `boolean` | `false` | No | Pin to top. |
| `menuOpen` / `defaultMenuOpen` / `onMenuOpenChange` | `boolean` / `boolean` / `fn` | closed | No | Panel state. |
| `menuLabel` | `string` | `"Menu"` | No | Toggle name. |
| `navLabel` | `string` | `"Main"` | No | Navigation landmark name. |
| `className` | `string` | - | No | Extra classes on `<header>`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `surface.container` | color | theme | Bar and panel fill |
| `border.hairline` | color | theme | Bottom edge, panel divider |
| `z-index.sticky` | z-index | sticky layer | Sticky bar |
| `control.height.lg` | size | 48px | Bar row min height, toggle |
| `button.ghost.*` | color | theme | Menu toggle (Button ghost) |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Menu closed | default | `aria-expanded=false`, Menu icon |
| Menu open | toggle | `aria-expanded=true`, X icon, panel shown |
| Sticky | `sticky` | Pinned on z-index.sticky |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Sticky | Yes | Yes |  |
| Mobile menu open | Yes | Yes |  |
| WithActions | Yes | Yes |  |
| BrandOnly | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (5/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- Button
- TuiIcon

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `banner` (header) containing a named `navigation`
- Required labels: toggle `aria-label` ("Menu"), `navLabel`
- Focus order: brand, navigation, actions, toggle; panel follows the bar
- Touch target minimum: 48px toggle
- Color independence: pass `aria-current="page"` on the active nav link

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use one AppHeader per page.
- Do keep actions to a few icon buttons.
- Don't put the only copy of critical actions in the mobile panel.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

[TODO: define how this component behaves with others]

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial component (navigation batch, ds-nav-terminal) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/AppHeader.tsx`
