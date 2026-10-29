# Scorp DS — Design Tokens Reference

> This is the prescriptive reference that maps every UI context to the correct token.
> Source of truth: `packages/tokens/src/tokens.json` · Runtime CSS: `packages/tokens/src/styles/tokens.css`

**Last updated:** Sep 2026 (portfolio merge: gold accent, fire ramp, hairline border, plate silhouettes, dark re-pins)

> **Generated tables.** Every table between `<!-- AUTO-START:tokens-<group> -->` and `<!-- AUTO-END:tokens-<group> -->` is written by `npm run tokens-doc` (`scripts/generate-token-docs.mjs`) from `tokens.json`: name, CSS variable, value (light and dark for a semantic group) and the token's `$description` as the "Use for" text. To change a row, edit the token's `$description` and re-run; an edit inside the markers is overwritten, and CI fails while a table is stale (`npm run tokens-doc:check`). Everything outside the markers is hand-written.

## How Tokens Work

Scorp DS uses a three-layer token architecture:

1. **Foundation** (`global` in tokens.json) — raw color scales, typography, spacing, breakpoints, motion, opacity, z-index, focus geometry. Reference these only from semantic tokens (or documented global utilities), never raw scales from components.
2. **Semantic** (`light` / `dark` in tokens.json) — purpose-named tokens that reference foundation values. Components always use these for color roles, elevation, and focus ring *colors*.
3. **CSS Variables** — defined in `tokens.css` (kebab-case). Tailwind maps to them via `@scorp-ds/tokens` preset.

**Referencing tokens inside this repo** ([decision 0023](docs/decisions/0023-semantic-tokens-are-referenced-by-variable.md)): semantic tokens are written as their CSS variable, `<utility>-[var(--token-name)]` (`text-[var(--text-secondary)]`), with the name copied from `tokens.css`. Foundation scales use the preset classes through the semantic alias (`bg-error-50`, `text-secondary-800`), and geometry uses the preset classes (`h-control-md`, `size-touch`, `plate-round`). The **Tailwind (preset)** class lists in the semantic sections below (`text-foreground-*`, `border-line-*`, `bg-field-*`, `bg-surface-*`) are a convenience for consumer projects; components, stories and presets in this repo do not use them.

### CSS variable naming

Dot paths in this doc map to custom properties by flattening with hyphens:

| Example path | CSS variable |
|--------------|----------------|
| `surface.page` | `--surface-page` |
| `focus.ring.primary` | `--focus-ring-primary` |
| `button.primary.background-hover` | `--button-primary-background-hover` |
| `zIndex.modal` (JSON) | `--z-index-modal` |
| `font.lineHeight.tight` (JSON) | `--line-height-tight` (the `font-` prefix is implied) |

`getToken` / `getTokensForTheme` in `@scorp-ds/tokens` return exactly these names without the leading `--`, and a drift test fails the build if any name or value disagrees with `tokens.css`.

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

ANSI-style accents for terminal-inspired UI. CSS: `--color-term-green`, `--color-term-amber`, `--color-term-cyan`, `--color-term-magenta`, `--color-term-red`, `--color-term-blue`, `--color-term-white`, `--color-term-dim`. Values differ per theme, so they live in the `light` and `dark` sets of `tokens.json` (as `color.term.*`) rather than in `global`; dark is brighter for dark backgrounds.

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

<!-- AUTO-START:tokens-border -->
| Token | CSS variable | Light | Dark | Use for |
|-------|--------------|-------|------|---------|
| `border.default` | `--border-default` | `secondary.300` (#F0EBE4) | `secondary.700` (#695F4D) | Default dividers and control outlines. |
| `border.muted` | `--border-muted` | `secondary.200` (#F7F5F2) | `secondary.800` (#474030) | Soft separators. |
| `border.strong` | `--border-strong` | `secondary.600` (#968A75) | `secondary.500` (#BFB4A3) | Emphasised outlines. |
| `border.hairline` | `--border-hairline` | `secondary.300` (#F0EBE4) | `secondary.900` (#2B2718) | Quiet chrome hairline sitting just off the page surface. Dark theme resolves near-black (sepia-900). |
| `border.error` | `--border-error` | `error.500` (#EF4444) | same | Validation: the outline of an invalid control. |
| `border.focus` | `--border-focus` | `primary.400` (#FBBF24) | same | Focus outline colour. Pair with the global focus.ring.width. |
<!-- AUTO-END:tokens-border -->

**Tailwind:** `border-line-default`, `border-line-muted`, …

### Field (inputs)

| Token | Use For |
|-------|---------|
| `field.background` | Input fill |
| `field.border` | Default border. Light: sepia-600 (3.3:1 on white, meets the 3:1 control-boundary rule; was sepia-300 at 1.2:1). Dark: hairline sepia-800, the portfolio ramp (was sepia-900 at 1.2:1). 800 is 1.76:1 on the page: a deliberate exception to the 3:1 control-boundary rule to keep the hairline look |
| `field.border-hover` | Hovered (light: sepia-700; dark: sepia-600) |
| `field.border-focus` | Focused (dark: accent gold) |
| `field.border-error` | Invalid |
| `field.placeholder` | Placeholder text color. Light: sepia-700, **6.28:1** on the white field, clearing AA (was sepia-500 at 2.04:1). Dark: sepia-500, 9.45:1 on the field. Placeholders still never carry essential information (they vanish on input), so put format hints in `helperText` and the name in `label` |
| `field.background-error` | Invalid field background |

**Tailwind:** `bg-field-bg`, `bg-field-bg-error`, `border-field-border`, `border-field-border-focus`, `text-field-placeholder`, …

### Control (rails)

| Token | Use For |
|-------|---------|
| `control.track` | Unfilled control rail: the Switch off track and the Slider rail. sepia-600 in both themes: **3.31:1** on the light page and **3.39:1** against the white knob, **5.34:1** / **5.69:1** in dark, so the control clears the 3:1 non-text rule (WCAG 1.4.11). Replaces sepia-300 (1.16:1) on the Switch and `surface.muted` (1.06:1 light / 1.09:1 dark) on the Slider. The filled portion of a Slider uses `accent` (4.9:1 light, 8.24:1 dark on the page) |

**Tailwind:** `bg-control-track`, or `bg-[var(--control-track)]`.

### Focus

<!-- AUTO-START:tokens-focus -->
| Token | CSS variable | Light | Dark | Use for |
|-------|--------------|-------|------|---------|
| `focus.ring.primary` | `--focus-ring-primary` | `primary.400` (#FBBF24) | same | Default focus ring. |
| `focus.ring.secondary` | `--focus-ring-secondary` | `secondary.700` (#695F4D) | same | Neutral focus ring. |
| `focus.ring.error` | `--focus-ring-error` | `error.600` (#DC2626) | `error.500` (#EF4444) | Focus ring on an invalid field. |
| `focus.ring.destructive` | `--focus-ring-destructive` | `error.600` (#DC2626) | `error.500` (#EF4444) | Focus ring on a destructive control. |
| `focus.ring.icon` | `--focus-ring-icon` | `primary.400` (#FBBF24) | same | Focus ring on an icon or square button. |
| `focus.offset-color` | `--focus-offset-color` | `secondary.50` (#FDFCFB) | `secondary.1000` (#0A0704) | Fill of the gap between a control and its focus ring. |
<!-- AUTO-END:tokens-focus -->

**Global (foundation) — pair with semantic ring colors:**

<!-- AUTO-START:tokens-focus-geometry -->
| Token | CSS variable | Value | Use for |
|-------|--------------|-------|---------|
| `focus.ring.width` | `--focus-ring-width` | `2px` | Focus ring thickness. Pair with a semantic focus.ring colour. |
| `focus.ring.offset` | `--focus-ring-offset` | `2px` | Gap between the control and its focus ring. |
<!-- AUTO-END:tokens-focus-geometry -->

**Storybook:** **Semantic / Focus** — live ring previews, light/dark tables, and `:focus-visible` example.

### Button

| Variant | Role tokens (CSS vars) |
|---------|-------------------------|
| Primary | `--button-primary-background`, `--button-primary-background-hover`, `--button-primary-text` |
| Secondary | `--button-secondary-background`, `--button-secondary-background-hover`, `--button-secondary-text`, `--button-secondary-text-hover` (light hover flips to dark sepia-950 text on the sepia-600 fill, 5.3:1, mirroring the dark-theme flip) |
| Ghost | `--button-ghost-background`, `--button-ghost-background-hover`, `--button-ghost-text` |
| Outline | `--button-outline-border`, `--button-outline-background`, `--button-outline-background-hover`, `--button-outline-text` |
| Destructive | `--button-destructive-background`, `--button-destructive-background-hover`, `--button-destructive-text` |
| Link (text) | `--button-link-text`, `--button-link-text-hover` |
| Icon (square control) | `--button-icon-background`, `--button-icon-background-hover`, `--button-icon-text`, `--button-icon-disabled-background`, `--button-icon-disabled-text` |

Sizes live in `global.button.size.{sm,md,lg}` (height, padding-x, padding-y) and ship as `--button-size-{sm,md,lg}-{height,padding-x,padding-y}`. The heights alias `control.height.*`; the padding pairs are Button's own geometry. Button itself styles with the Tailwind classes, so these are published for inspection rather than consumption. The old `small | medium | large` key names were renamed to match the `sm | md | lg` control scale.

## Elevation tokens (semantic)

Theme-aware depth for cards and raised surfaces. Each level defines a **shadow** and **border** pair as CSS variables (`--elevation-{0–3}-shadow`, `--elevation-{0–3}-border`).

| Level | Use for |
|-------|---------|
| `elevation.0` | Flush with canvas — no lift |
| `elevation.1` | Slight lift (e.g. default card) |
| `elevation.2` | Mid lift (menus, popovers) |
| `elevation.3` | Strong lift (modals, emphasis) |

> **TUI note:** elevation is **flat**: every shadow token is `none` in both `tokens.json` and `tokens.css`, and the border pair carries the depth. The two files used to disagree here (the JSON listed real box shadows); the drift test in `packages/tokens/src/lib/token-parser.test.ts` now fails if they ever diverge again.

**Storybook:** **Semantic / Elevation** — side-by-side light/dark previews and full token table.

## Opacity tokens (foundation)

Global alpha steps (`global.opacity` in `tokens.json`). Same numeric values in light and dark.

<!-- AUTO-START:tokens-opacity -->
| Token | CSS variable | Value |
|-------|--------------|-------|
| `opacity.0` | `--opacity-0` | `0` |
| `opacity.5` | `--opacity-5` | `0.05` |
| `opacity.10` | `--opacity-10` | `0.1` |
| `opacity.20` | `--opacity-20` | `0.2` |
| `opacity.30` | `--opacity-30` | `0.3` |
| `opacity.40` | `--opacity-40` | `0.4` |
| `opacity.50` | `--opacity-50` | `0.5` |
| `opacity.60` | `--opacity-60` | `0.6` |
| `opacity.70` | `--opacity-70` | `0.7` |
| `opacity.80` | `--opacity-80` | `0.8` |
| `opacity.90` | `--opacity-90` | `0.9` |
| `opacity.100` | `--opacity-100` | `1` |
<!-- AUTO-END:tokens-opacity -->

**Use for:** scrims, disabled washes, subtle overlays — combine with semantic colors (e.g. `surface.overlay`), not raw hex.

**Storybook:** **Semantic / Opacity** — visual strips and reference table.

## Z-index tokens (foundation)

Global stacking scale (`global.zIndex`). Theme-independent — same numbers in light and dark.

<!-- AUTO-START:tokens-z-index -->
| Token | CSS variable | Value |
|-------|--------------|-------|
| `zIndex.base` | `--z-index-base` | `0` |
| `zIndex.dropdown` | `--z-index-dropdown` | `1000` |
| `zIndex.sticky` | `--z-index-sticky` | `1020` |
| `zIndex.overlay` | `--z-index-overlay` | `1030` |
| `zIndex.modal` | `--z-index-modal` | `1040` |
| `zIndex.popover` | `--z-index-popover` | `1050` |
| `zIndex.tooltip` | `--z-index-tooltip` | `1060` |
<!-- AUTO-END:tokens-z-index -->

**Storybook:** **Foundation / ZIndex**: stacking demo with leader lines and full token table.

## Typography Tokens

| Token | CSS variable | Value | Use For |
|-------|--------------|-------|---------|
| `font.family.mono` | `--font-family-mono` | `'Fragment Mono', 'Scorp Symbols', ui-monospace, monospace` | All text: Scorp DS is monospace everywhere. Scorp Symbols (inlined in tokens.css) paints only glyphs Fragment Mono lacks, width-matched to its cell; see `packages/tokens/src/fonts/README.md` |

### Font size (`global.font.size`)

<!-- AUTO-START:tokens-font-size -->
| Token | CSS variable | Value | Use for |
|-------|--------------|-------|---------|
| `font.size.3xs` | `--font-size-3xs` | `10px` | Dense game chrome (character sheet, tile browser). Use sparingly; below a11y body-text sizes. |
| `font.size.2xs` | `--font-size-2xs` | `11px` | Tooltips, meta captions. Adopted from the portfolio scale. |
| `font.size.xs` | `--font-size-xs` | `12px` | Labels, captions. |
| `font.size.sm` | `--font-size-sm` | `14px` | Body text, buttons. |
| `font.size.base` | `--font-size-base` | `16px` | Default body. |
| `font.size.lg` | `--font-size-lg` | `18px` | Lead text. |
| `font.size.xl` | `--font-size-xl` | `20px` | Section headings. |
| `font.size.2xl` | `--font-size-2xl` | `24px` | Page subheadings. |
| `font.size.pageTitle` | `--font-size-page-title` | `36px` | The h1 of a long-form page (CaseStudyHeader at sm and up). Role-named because it sits between 2xl (24px) and 3xl (48px), where the t-shirt scale has no step. |
| `font.size.3xl` | `--font-size-3xl` | `48px` | Page headings. |
| `font.size.4xl` | `--font-size-4xl` | `64px` | Display and marketing. |
| `font.size.5xl` | `--font-size-5xl` | `80px` | Display and marketing. |
| `font.size.6xl` | `--font-size-6xl` | `96px` | Display and marketing. |
<!-- AUTO-END:tokens-font-size -->

**Tailwind (preset):** `font-mono`, `text-xs` through `text-6xl` map to the variables above (`@scorp-ds/tokens/tailwind.preset.js`).

### Line height (`global.font.lineHeight`)

<!-- AUTO-START:tokens-line-height -->
| Token | CSS variable | Value |
|-------|--------------|-------|
| `font.lineHeight.none` | `--line-height-none` | `1` |
| `font.lineHeight.tight` | `--line-height-tight` | `1.25` |
| `font.lineHeight.snug` | `--line-height-snug` | `1.375` |
| `font.lineHeight.normal` | `--line-height-normal` | `1.5` |
| `font.lineHeight.relaxed` | `--line-height-relaxed` | `1.625` |
| `font.lineHeight.loose` | `--line-height-loose` | `2` |
<!-- AUTO-END:tokens-line-height -->

### Font weight (`global.font.weight`)

<!-- AUTO-START:tokens-font-weight -->
| Token | CSS variable | Value |
|-------|--------------|-------|
| `font.weight.regular` | `--font-weight-regular` | `400` |
| `font.weight.medium` | `--font-weight-medium` | `500` |
| `font.weight.bold` | `--font-weight-bold` | `700` |
<!-- AUTO-END:tokens-font-weight -->

There is no 600 step, so `font-semibold` is off-token: use `font-medium` or `font-bold`. The Tailwind preset repoints `font-normal` / `font-medium` / `font-bold` at these variables.

**Storybook:** **Foundation / Typography** — live type samples at token sizes.

## Spacing Tokens

Base unit: **4px** per step (see `global.spacing` in `tokens.json`, `--spacing-*` in `tokens.css`).

The Tailwind preset maps every step, whole and half, onto its variable: `p-4` is `var(--spacing-4)`, `py-1.5` is `var(--spacing-1-5)`. The values equal Tailwind's defaults, so the classes render as they always did, but a token edit now reaches every `p-*`, `m-*` and `gap-*` class. Half steps are hyphenated in the token name because DTCG names cannot hold a dot. Padding, margin, gap and space utilities in components must use a step from this table: `p-7`, `gap-9` and the like fail `scorp/no-off-scale-spacing`, and the four derived exceptions are allowlisted with reasons in `eslint.config.mjs` ([decision 0027](docs/decisions/0027-half-step-spacing-is-tokenised.md)). Width, height and position utilities stay on Tailwind's scale.

<!-- AUTO-START:tokens-spacing -->
| Token | CSS variable | Value | Use for |
|-------|--------------|-------|---------|
| `spacing.0` | `--spacing-0` | `0` | Flush layouts. |
| `spacing.0-5` | `--spacing-0-5` | `2px` | Half step for dense chrome (badge and key insets). Tailwind class: 0.5. Decision 0027. |
| `spacing.1` | `--spacing-1` | `4px` | Tight gaps. |
| `spacing.1-5` | `--spacing-1-5` | `6px` | Half step: tight row padding. Tailwind class: 1.5. |
| `spacing.2` | `--spacing-2` | `8px` | Small padding, icon gaps. |
| `spacing.2-5` | `--spacing-2-5` | `10px` | Half step: compact control padding. Tailwind class: 2.5. |
| `spacing.3` | `--spacing-3` | `12px` | Input padding, compact items. |
| `spacing.3-5` | `--spacing-3-5` | `14px` | Half step: dense list row padding. Tailwind class: 3.5. |
| `spacing.4` | `--spacing-4` | `16px` | Standard padding. |
| `spacing.5` | `--spacing-5` | `20px` | Comfortable inline spacing. |
| `spacing.6` | `--spacing-6` | `24px` | Card padding, section gaps. |
| `spacing.8` | `--spacing-8` | `32px` | Large section spacing. |
| `spacing.10` | `--spacing-10` | `40px` | Hero and section padding. |
| `spacing.12` | `--spacing-12` | `48px` | Major section breaks. |
| `spacing.16` | `--spacing-16` | `64px` | Page-level rhythm. |
| `spacing.20` | `--spacing-20` | `80px` | Marketing and landing blocks. |
| `spacing.24` | `--spacing-24` | `96px` | Maximum layout rhythm. |
<!-- AUTO-END:tokens-spacing -->

**Storybook:** **Foundation / Spacing** — visual spacing scale.

## Breakpoint Tokens (foundation)

The widths at which the interface is allowed to change (`global.breakpoint`). `sm | md | lg | xl` carry Tailwind's default pixel values, so every existing responsive class keeps behaving exactly as before; the Tailwind preset declares its `screens` as literal values (`tailwind.preset.js`, top of file) rather than reading `tokens.json`, on purpose: consumer sites vendor the preset as one standalone file with no `src/` beside it. The token-parser drift test asserts the literals match `tokens.json` and `tokens.css`, so the utilities and the custom properties cannot drift apart. Media queries cannot read custom properties, which is why the `--breakpoint-*` variables exist only for JavaScript that has to make the same decision.

<!-- AUTO-START:tokens-breakpoint -->
| Token | CSS variable | Value | Use for |
|-------|--------------|-------|---------|
| `breakpoint.sm` | `--breakpoint-sm` | `640px` | Small: the first responsive step (sm: utilities). Matches Tailwind's default so existing responsive classes keep their behaviour. |
| `breakpoint.md` | `--breakpoint-md` | `768px` | Medium: tablet portrait (md: utilities). |
| `breakpoint.docked` | `--breakpoint-docked` | `960px` | Component breakpoint, not a layout step: Modal's docked variant pins bottom-center at or above this width and falls back to the centered modal below it. Read at runtime from --breakpoint-docked. |
| `breakpoint.lg` | `--breakpoint-lg` | `1024px` | Large: tablet landscape and small laptops (lg: utilities). |
| `breakpoint.xl` | `--breakpoint-xl` | `1280px` | Extra large: desktop (xl: utilities). |
<!-- AUTO-END:tokens-breakpoint -->

Where each step is used (hand-written: tokens.json does not record call sites):

| Token | Tailwind | Used by |
|-------|----------|---------|
| `breakpoint.sm` | `sm:` | CaseStudy (`sm:mt-24`, `sm:grid-cols-2`) |
| `breakpoint.md` | `md:` | AppHeader (`md:block` desktop nav, `md:hidden` menu button) |
| `breakpoint.docked` | none | Modal `docked` variant (read from JS; a component breakpoint, not a layout step) |
| `breakpoint.lg` | `lg:` | Card (`lg:p-6`) |
| `breakpoint.xl` | `xl:` | Nothing yet |

Tailwind's `2xl:` default (1536px) survives because the preset declares `screens` under `theme.extend`; it is deliberately not a token, so prefer `xl:` unless a composition genuinely needs it.

**Storybook:** **Foundation / Breakpoints** — proportional ruler, the per-component map, and the token table.

## Control Size Tokens

One size scale for sized components: `sm | md | lg` ([decision 0011](docs/decisions/0011-unified-size-scale.md)). The old `small | medium | large` names were removed ([decision 0031](docs/decisions/0031-the-0024-aliases-are-removed.md)). Exceptions, where a component's scale differs:

| Component | Prop | Values |
|-----------|------|--------|
| Avatar | `size` | `sm \| md \| lg \| xl` |
| Container | `size` | `sm \| md \| lg \| xl \| full` (a max-width, not a control height) |
| EmptyState | `size` | `sm \| md` |
| Kbd | `size` | `sm \| md` |
| Meter | `size` | `sm \| md` |
| TuiIcon | `size` | `"3" \| "4" \| "5" \| "6" \| "8"` (Tailwind size steps) |
| Table | `density` | `compact \| comfortable \| spacious` (no `size` prop) |
| Divider | `spacing` | `none \| sm \| md \| lg` (margin around the rule, not a size) |

<!-- AUTO-START:tokens-control-size -->
| Token | CSS variable | Value | Use for |
|-------|--------------|-------|---------|
| `control.height.sm` | `--control-height-sm` | `32px` | Small control height: Button, Input, Select, Dropdown trigger, and the Textarea min-height. |
| `control.height.md` | `--control-height-md` | `40px` | Default control height for the same set. |
| `control.height.lg` | `--control-height-lg` | `48px` | Large control height: the large variants. |
| `control.menuMaxHeight` | `--control-menu-max-height` | `300px` | Fallback maximum height for a floating menu list (combobox, dropdown, select) before the popover has measured available viewport space. |
| `touch.target` | `--touch-target` | `44px` | Minimum tap target: hit areas on small controls (Checkbox, Radio, Switch) expand to this, and the Slider row is this tall. |
<!-- AUTO-END:tokens-control-size -->

**Tailwind (preset):** `h-control-{sm,md,lg}`, `min-h-control-*`, `size-control-*` for the heights; `w-touch`, `h-touch`, `size-touch` for the touch target.

## Switch Geometry Tokens

The Switch's track box, knob box and knob travel live in `global.switch`, so nothing about the geometry is typed into the component. `travel = track width - knob size - inset`, which is why the two x offsets are the only numbers the glide needs.

| Size | Track (`--switch-track-height/width-*`) | Knob (`--switch-knob-size-*`) | Knob x off / on (`--switch-knob-inset/travel-*`) |
|------|------------------------------------------|-------------------------------|--------------------------------------------------|
| `sm` | 24 x 44px (width aliases `touch.target`) | 20px | 2px / 22px |
| `md` | 32 x 56px (height aliases `control.height.sm`) | 24px | 3px / 29px |
| `lg` | 40 x 72px (height aliases `control.height.md`) | 32px | 3px / 37px |

## Border Width Tokens

| Token | CSS variable | Value | Tailwind |
|-------|--------------|-------|----------|
| `border.width.hairline` | `--border-width-hairline` | 1px | `border-b-[length:var(--border-width-hairline)]` (the preset also exposes `border-hairline`) |

The system draws exactly one rule weight. It replaces the ad hoc `0.5px` rules, which browsers snapped to 0 or 1 device pixel unevenly.

## Motion Tokens

**Source of truth in `tokens.json`** (`global.duration`):

<!-- AUTO-START:tokens-duration -->
| Token | CSS variable | Value | Use for |
|-------|--------------|-------|---------|
| `duration.instant` | `--duration-instant` | `0ms` | No animation. |
| `duration.fast` | `--duration-fast` | `120ms` | Hover and colour transitions: the workhorse interactive duration (plate hovers). Was 150ms pre-merge. |
| `duration.normal` | `--duration-normal` | `200ms` | Show and hide, expand and collapse. The cap for an interactive state change (decision 0025). |
| `duration.slow` | `--duration-slow` | `300ms` | An overlay entering or leaving the viewport (modal, sheet, toast, drawer). Never an interactive state change (decision 0025). |
| `duration.slower` | `--duration-slower` | `500ms` | Full-page transitions. Reserved (decision 0025). |
<!-- AUTO-END:tokens-duration -->

**Runtime CSS:** `--duration-*` in `packages/tokens/src/styles/tokens.css` matches the table above (kept in sync with `tokens.json`). Use the variable, `duration-[var(--duration-fast)]`; a raw duration (`duration-200`, `duration-[250ms]`) is off-token. Interactive state changes use `instant`, `fast` or `normal` (200ms at most); `slow` is for an overlay entering or leaving the viewport, and `slower` is reserved ([decision 0025](docs/decisions/0025-motion-cap-is-for-interactive-states.md)).

Easing curves live in `global.easing`:

<!-- AUTO-START:tokens-easing -->
| Token | CSS variable | Value |
|-------|--------------|-------|
| `easing.linear` | `--easing-linear` | `linear` |
| `easing.easeIn` | `--easing-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `easing.easeOut` | `--easing-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `easing.easeInOut` | `--easing-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
<!-- AUTO-END:tokens-easing -->

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
| Responsive breakpoints | **Foundation / Breakpoints** |
| Duration + easing | **Foundation / Motion** |
| Z-index scale | **Foundation / ZIndex** |
| Semantic color roles | **Semantic / Colors** |
| Elevation | **Semantic / Elevation** |
| Focus rings + geometry | **Semantic / Focus** |
| Opacity steps | **Semantic / Opacity** |
