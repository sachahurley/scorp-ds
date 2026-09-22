# Scorp DS — Design Tokens Reference

> This is the prescriptive reference that maps every UI context to the correct token.
> Source of truth: `packages/tokens/src/tokens.json` · Runtime CSS: `packages/tokens/src/styles/tokens.css`

**Last updated:** Sep 2026 (portfolio merge: gold accent, fire ramp, hairline border, plate silhouettes, dark re-pins)

## How Tokens Work

Scorp DS uses a three-layer token architecture:

1. **Foundation** (`global` in tokens.json) — raw color scales, typography, spacing, motion, opacity, z-index, focus geometry. Reference these only from semantic tokens (or documented global utilities), never raw scales from components.
2. **Semantic** (`light` / `dark` in tokens.json) — purpose-named tokens that reference foundation values. Components always use these for color roles, elevation, and focus ring *colors*.
3. **CSS Variables** — defined in `tokens.css` (kebab-case). Tailwind maps to them via `@scorp-ds/tokens` preset.

### CSS variable naming

Dot paths in this doc map to custom properties by flattening with hyphens:

| Example path | CSS variable |
|--------------|----------------|
| `surface.page` | `--surface-page` |
| `focus.ring.primary` | `--focus-ring-primary` |
| `button.primary.background-hover` | `--button-primary-background-hover` |
| `zIndex.modal` (JSON) | `--z-index-modal` |

## Semantic Aliases

| Alias | Resolves To | Use For |
|-------|------------|---------|
| `primary` | amber | Brand actions, CTAs, interactive highlights |
| `secondary` | sepia | Neutral actions, secondary surfaces |
| `success` | green | Positive states, confirmations |
| `info` | blue | Informational content |
| `warning` | purple | Caution states |
| `error` | red | Error states, destructive actions |

## Color Tokens

**Storybook:** **Foundation / Colors** — every scale from `tokens.json` (amber, sepia, green, blue, purple, red, primary/secondary/success/info/warning/error aliases, black/white, plus terminal accents from `tokens.css`) · **Semantic / Colors** — surfaces, text, borders, fields, buttons, and focus swatches (light/dark).

### Surface

| Token | Light (via) | Dark (via) | Use For |
|-------|------------|------------|---------|
| `surface.page` | secondary.50 | secondary.950 | Page/app background (dark pinned to 950 so sepia-950-baked dither art blends) |
| `surface.container` | secondary.50 | secondary.950 | Sections, panels |
| `surface.card` | white | secondary.975 | Cards, modal panels |
| `surface.raised` | white | secondary.975 | Lifted surface (often same as card) |
| `surface.container-stroke` | secondary.500 | secondary.800 | Hairline chrome |
| `surface.subtle` | secondary.100 | secondary.950 | Zebra / inset bands |
| `surface.muted` | secondary.200 | secondary.925 | Low-emphasis blocks |
| `surface.overlay` | rgba scrim | rgba scrim | Modal/drawer backdrop |
| `surface.inverse` | secondary.900 | secondary.200 | Inverse band (toolbar, callout) |

Resolved scrim (check `tokens.css` if you change JSON): light `rgba(10, 7, 4, 0.65)`, dark `rgba(0, 0, 0, 0.72)`.

**Tailwind (preset):** `bg-surface-page`, `bg-surface-card`, `bg-surface-overlay`, …

### Terminal colors (foundation, TUI tier 2)

ANSI-style accents for terminal-inspired UI. CSS: `--color-term-green`, `--color-term-amber`, `--color-term-cyan`, `--color-term-magenta`, `--color-term-red`, `--color-term-blue`, `--color-term-white`, `--color-term-dim`. Values differ in `.dark` (brighter on dark backgrounds).

**Tailwind:** `text-term-green`, `bg-term-amber`, …

**Storybook:** **Foundation / Colors** (terminal swatches).

### Accent + Fire (merged portfolio identity)

| Token | Light (via) | Dark (via) | Use For |
|-------|------------|------------|---------|
| `accent` | amber.700 | amber.gold (#E0A26A) | Brand accent: links, active nav, XP bar, selection. Light uses amber.700 (AA for body text on paper). Theme eggs may override `--accent` inline at runtime; the contract is the variable, not the value |
| `fire.bright` | secondary.400 | secondary.400 | Flame/impact effects, bright band |
| `fire.mid` | secondary.600 | secondary.600 | Flame mid band |
| `fire.dim` | secondary.800 | secondary.800 | Flame dim band |

The named foundation step `amber.gold` (`--color-amber-gold`, #E0A26A) sits between amber-400 and amber-600. Fire is theme-invariant (dither-art sepia tones).

**Tailwind:** `text-accent`, `bg-accent`, `bg-fire-bright`, `bg-fire-mid`, `bg-fire-dim`.

### Text

| Token | Light (via) | Dark (via) | Use For |
|-------|------------|------------|---------|
| `text.primary` | secondary.900 | secondary.50 | Body, headings |
| `text.secondary` | secondary.700 | secondary.500 | Supporting copy (dark stepped down one so body sits below accent). Light was 600 until 2026-09-21: 3.3:1 on the page, below AA; 700 is 6.1:1 |
| `text.tertiary` | secondary.600 | secondary.600 | Meta, timestamps at large size, decorative labels. 3:1 class, not for small body text; use `text.secondary` there. Light was 500 (2:1) until 2026-09-21 |
| `text.disabled` | secondary.400 | secondary.700 | Disabled labels |
| `text.link` | primary.700 | primary.400 | Links |
| `text.link-hover` | primary.800 | primary.300 | Link hover |
| `text.on-inverse` | secondary.50 | secondary.900 | Text on `surface.inverse` |

**Tailwind:** `text-foreground-primary`, `text-foreground-link`, …

### Border

| Token | Use For |
|-------|---------|
| `border.default` | Default dividers, controls |
| `border.muted` | Soft separators |
| `border.strong` | Emphasized outlines |
| `border.hairline` | Quiet chrome hairline just off the page surface (dark: near-black sepia-900) |
| `border.error` | Validation |
| `border.focus` | Focus outline color (pair with global ring width) |

**Tailwind:** `border-line-default`, `border-line-muted`, …

### Field (inputs)

| Token | Use For |
|-------|---------|
| `field.background` | Input fill |
| `field.border` | Default border. Light: sepia-600 (3.3:1 on white, meets the 3:1 control-boundary rule; was sepia-300 at 1.2:1). Dark: hairline sepia-900, the portfolio ramp |
| `field.border-hover` | Hovered (light: sepia-700; dark: sepia-600) |
| `field.border-focus` | Focused (dark: accent gold) |
| `field.border-error` | Invalid |
| `field.placeholder` | Placeholder text color |
| `field.background-error` | Invalid field background |

**Tailwind:** `bg-field-bg`, `bg-field-bg-error`, `border-field-border`, `border-field-border-focus`, `text-field-placeholder`, …

### Focus

| Token | Use For |
|-------|---------|
| `focus.ring.primary` | Default focus ring |
| `focus.ring.secondary` | Neutral focus |
| `focus.ring.error` | Invalid field |
| `focus.ring.destructive` | Destructive control |
| `focus.ring.icon` | Icon / square button focus ring |
| `focus.offset-color` | Ring offset gap fill |

**Global (foundation) — pair with semantic ring colors:**

| CSS variable | Role |
|--------------|------|
| `--focus-ring-width` | Ring thickness |
| `--focus-ring-offset` | Gap between control and ring |

**Storybook:** **Semantic / Focus** — live ring previews, light/dark tables, and `:focus-visible` example.

### Button

| Variant | Role tokens (CSS vars) |
|---------|-------------------------|
| Primary | `--button-primary-background`, `--button-primary-background-hover`, `--button-primary-text` |
| Secondary | `--button-secondary-background`, `--button-secondary-background-hover`, `--button-secondary-text` |
| Ghost | `--button-ghost-background`, `--button-ghost-background-hover`, `--button-ghost-text` |
| Outline | `--button-outline-border`, `--button-outline-background`, `--button-outline-background-hover`, `--button-outline-text` |
| Destructive | `--button-destructive-background`, `--button-destructive-background-hover`, `--button-destructive-text` |
| Link (text) | `--button-link-text`, `--button-link-text-hover` |
| Icon (square control) | `--button-icon-background`, `--button-icon-background-hover`, `--button-icon-text`, `--button-icon-disabled-background`, `--button-icon-disabled-text` |

Sizes remain `button.size.*` in `tokens.json` (height, padding-x, padding-y per size).

## Elevation tokens (semantic)

Theme-aware depth for cards and raised surfaces. Each level defines a **shadow** and **border** pair as CSS variables (`--elevation-{0–3}-shadow`, `--elevation-{0–3}-border`).

| Level | Use for |
|-------|---------|
| `elevation.0` | Flush with canvas — no lift |
| `elevation.1` | Slight lift (e.g. default card) |
| `elevation.2` | Mid lift (menus, popovers) |
| `elevation.3` | Strong lift (modals, emphasis) |

> **TUI note:** `packages/tokens/src/styles/tokens.css` ships **flat** elevation: shadow tokens resolve to `none`; borders carry visual depth. `tokens.json` may list richer shadows for other pipelines — runtime product UI follows the CSS file.

**Storybook:** **Semantic / Elevation** — side-by-side light/dark previews and full token table.

## Opacity tokens (foundation)

Global alpha steps (`global.opacity` in `tokens.json`). Same numeric values in light and dark.

| Step (suffix) | CSS variable | Resolved (0–1) |
|---------------|--------------|----------------|
| `0` | `--opacity-0` | 0 |
| `5` | `--opacity-5` | 0.05 |
| `10` | `--opacity-10` | 0.1 |
| `20` | `--opacity-20` | 0.2 |
| `30` | `--opacity-30` | 0.3 |
| `40` | `--opacity-40` | 0.4 |
| `50` | `--opacity-50` | 0.5 |
| `60` | `--opacity-60` | 0.6 |
| `70` | `--opacity-70` | 0.7 |
| `80` | `--opacity-80` | 0.8 |
| `90` | `--opacity-90` | 0.9 |
| `100` | `--opacity-100` | 1 |

**Use for:** scrims, disabled washes, subtle overlays — combine with semantic colors (e.g. `surface.overlay`), not raw hex.

**Storybook:** **Semantic / Opacity** — visual strips and reference table.

## Z-index tokens (foundation)

Global stacking scale (`global.zIndex`). Theme-independent — same numbers in light and dark.

| Token (JSON path) | CSS variable | Value |
|-------------------|--------------|-------|
| `zIndex.base` | `--z-index-base` | 0 |
| `zIndex.dropdown` | `--z-index-dropdown` | 1000 |
| `zIndex.sticky` | `--z-index-sticky` | 1020 |
| `zIndex.overlay` | `--z-index-overlay` | 1030 |
| `zIndex.modal` | `--z-index-modal` | 1040 |
| `zIndex.popover` | `--z-index-popover` | 1050 |
| `zIndex.tooltip` | `--z-index-tooltip` | 1060 |

**Storybook:** **Foundation / Z-index** — stacking demo with leader lines and full token table.

## Typography Tokens

| Token | CSS variable | Value | Use For |
|-------|--------------|-------|---------|
| `font.family.mono` | `--font-family-mono` | `'Fragment Mono', 'Scorp Symbols', ui-monospace, monospace` | All text — Scorp DS is monospace everywhere. Scorp Symbols (inlined in tokens.css) paints only glyphs Fragment Mono lacks, width-matched to its cell; see `packages/tokens/src/fonts/README.md` |
| `font.size.3xs` | `--font-size-3xs` | 10px | Dense game chrome; use sparingly |
| `font.size.2xs` | `--font-size-2xs` | 11px | Tooltips, meta captions |
| `font.size.xs` | `--font-size-xs` | 12px | Labels, captions |
| `font.size.sm` | `--font-size-sm` | 14px | Body text, buttons |
| `font.size.base` | `--font-size-base` | 16px | Default body |
| `font.size.lg` | `--font-size-lg` | 18px | Lead text |
| `font.size.xl` | `--font-size-xl` | 20px | Section headings |
| `font.size.2xl` | `--font-size-2xl` | 24px | Page subheadings |
| `font.size.3xl` | `--font-size-3xl` | 48px | Page headings |
| `font.size.4xl` | `--font-size-4xl` | 64px | Display / marketing |
| `font.size.5xl` | `--font-size-5xl` | 80px | Display / marketing |
| `font.size.6xl` | `--font-size-6xl` | 96px | Display / marketing |

**Tailwind (preset):** `font-mono`, `text-xs` through `text-6xl` map to the variables above (`@scorp-ds/tokens/tailwind.preset.js`).

### Line height (`global.font.lineHeight`)

| Token | CSS variable | Value |
|-------|--------------|-------|
| `lineHeight.none` | `--line-height-none` | 1 |
| `lineHeight.tight` | `--line-height-tight` | 1.25 |
| `lineHeight.snug` | `--line-height-snug` | 1.375 |
| `lineHeight.normal` | `--line-height-normal` | 1.5 |
| `lineHeight.relaxed` | `--line-height-relaxed` | 1.625 |
| `lineHeight.loose` | `--line-height-loose` | 2 |

### Font weight (`global.font.weight`)

| Token | CSS variable | Value |
|-------|--------------|-------|
| `weight.regular` | `--font-weight-regular` | 400 |
| `weight.medium` | `--font-weight-medium` | 500 |
| `weight.bold` | `--font-weight-bold` | 700 |

**Storybook:** **Foundation / Typography** — live type samples at token sizes.

## Spacing Tokens

Base unit: **4px** per step (see `global.spacing` in `tokens.json`). Tailwind spacing classes (`p-4`, `gap-6`) map to these steps.

| Token | Value | Use For |
|-------|-------|---------|
| `spacing.0` | 0 | Flush layouts |
| `spacing.1` | 4px | Tight gaps |
| `spacing.2` | 8px | Small padding, icon gaps |
| `spacing.3` | 12px | Input padding, compact items |
| `spacing.4` | 16px | Standard padding |
| `spacing.5` | 20px | Comfortable inline spacing |
| `spacing.6` | 24px | Card padding, section gaps |
| `spacing.8` | 32px | Large section spacing |
| `spacing.10` | 40px | Hero / section padding |
| `spacing.12` | 48px | Major section breaks |
| `spacing.16` | 64px | Page-level rhythm |
| `spacing.20` | 80px | Marketing / landing blocks |
| `spacing.24` | 96px | Maximum layout rhythm |

**Storybook:** **Foundation / Spacing** — visual spacing scale.

## Motion Tokens

**Source of truth in `tokens.json`** (`global.duration`):

| Token | Duration (JSON) | Use For |
|-------|-----------------|--------|
| `duration.instant` | 0ms | No animation |
| `duration.fast` | 120ms | Hover, color transitions (plate hovers; was 150ms pre-merge) |
| `duration.normal` | 200ms | Show/hide, expand/collapse |
| `duration.slow` | 300ms | Modal enter/exit |
| `duration.slower` | 500ms | Full-page transitions |

**Runtime CSS:** `--duration-*` in `packages/tokens/src/styles/tokens.css` matches the table above (kept in sync with `tokens.json`). Prefer `duration-[var(--duration-fast)]` or Tailwind `duration-200` when it maps to the same scale.

Easing curves live in `global.easing` as `--easing-linear`, `--easing-ease-in`, `--easing-ease-out`, `--easing-ease-in-out`.

**Storybook:** **Foundation / Motion** — interactive duration demos and easing variable list.

## Plate Tokens (shape language)

The radius tokens are **retired**. Corners are stepped one-bit "plate" silhouettes, applied as `clip-path` polygons:

| Token | CSS variable | Silhouette | Use For |
|-------|--------------|-----------|---------|
| `plate.round` | `--plate-round` | 6px stepped corner (2px steps) | Controls, list rows, tooltips, toasts |
| `plate.round-lg` | `--plate-round-lg` | 12px stepped corner (4px steps, the small plate at 2x) | Cards, tables, modals, bottom sheets |

> **Ring recipe:** `clip-path` slices real borders, so a bordered plate is two layers: the element itself is the **ring color** clipped to the polygon, and a `::before` (or inner element) is the **fill** clipped to the same polygon 1px inset. Outside focus outlines get swallowed by the clip; use an **inset ring** (`box-shadow: inset 0 0 0 2px …`) on plate-clipped controls.

**Tailwind:** `plate-round`, `plate-round-lg` (utilities from the preset plugin).

---

## Storybook reference (token docs)

| Topic | Story |
|-------|--------|
| Raw color scales + terminal | **Foundation / Colors** |
| Type, line height, weight | **Foundation / Typography** |
| Spacing steps | **Foundation / Spacing** |
| Duration + easing | **Foundation / Motion** |
| Z-index scale | **Foundation / Z-index** |
| Semantic color roles | **Semantic / Colors** |
| Elevation | **Semantic / Elevation** |
| Focus rings + geometry | **Semantic / Focus** |
| Opacity steps | **Semantic / Opacity** |
