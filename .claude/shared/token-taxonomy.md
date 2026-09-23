# Token Taxonomy: Shared Reference

> Read `.claude/ds-config.json` first for package name and paths. Substitute those
> values wherever you see `{project.package}`, `{paths.*}`, etc.

Scorp DS is a React/TypeScript/Tailwind system. Tokens do not live in per-domain
source files or generated classes: there is exactly one source file and one CSS file.

## Where tokens live

| File | Role |
|---|---|
| `packages/tokens/src/tokens.json` | Source of truth, W3C Design Token format |
| `packages/tokens/src/styles/tokens.css` | Runtime contract: CSS custom properties |
| `packages/tokens/tailwind.preset.js` | Maps custom properties to Tailwind classes |
| `packages/tokens/src/lib/token-parser.ts` | Resolves references for docs tooling |

**Both `tokens.json` and `tokens.css` are hand-maintained.** Nothing generates one
from the other, and nothing should: `tokens.css` carries comments no generator could
reproduce (measured contrast ratios, the deliberate dark `field.border` exception).
`packages/tokens` has no `build` script.

A token added to one file and not the other is caught by
`packages/tokens/src/lib/token-parser.test.ts`, which fails and names the offender.
Run `npm test` after any token change.

Import tokens from `@{project.package}/tokens` (the package barrel), never from an
internal path.

## The three layers in tokens.json

| Layer | Key | Holds |
|---|---|---|
| **Foundation** | `global` | Raw scales and geometry. No theme knowledge. |
| **Semantic (light)** | `light` | Purpose-named tokens referencing `global` |
| **Semantic (dark)** | `dark` | Same keys as `light`, different values |

`light` and `dark` must always carry the **same key set**. A key in one and not the
other is a bug.

### `global` groups

| Group | Contains |
|---|---|
| `color` | Scales `amber`, `sepia`, `green`, `blue`, `purple`, `red`, plus `black` / `white` and the semantic aliases below |
| `font` | `family`, `size`, `lineHeight`, `weight` |
| `plate` | `round`, `round-lg`, `round-lg-top` (stepped clip-path silhouettes) |
| `spacing` | Numeric scale (`0`–`24`) |
| `breakpoint` | `sm`, `md`, `lg`, `xl`, `docked` |
| `control` | `height` (drives `sm` / `md` / `lg` sizing) |
| `button` | `size` |
| `touch` | `target` (44px accessibility floor) |
| `focus` | `ring` geometry |
| `border` | `width` (`hairline` is the system's only rule weight) |
| `switch` | `track`, `knob` geometry |
| `duration`, `easing` | Motion |
| `zIndex` | `base`, `dropdown`, `sticky`, `overlay`, `modal`, `popover`, `tooltip` |
| `opacity` | Percentage scale |

**There are no radius tokens.** They were retired when plates became the shape
language. Use `plate-round` / `plate-round-lg`, never `rounded-{sm,md,lg,xl,2xl}`.

### Semantic aliases (in `global.color`)

`primary → amber`, `secondary → sepia`, `success → green`, `info → blue`,
`warning → purple`, `error → red`.

**Rule:** component code uses the alias (`primary-400`, `secondary-700`), never the
raw scale (`amber-400`), even though they resolve identically. This is what preserves
the ability to retheme.

### `light` / `dark` groups

`color` (terminal tier-2 accents), `accent`, `fire`, `surface`, `elevation`, `text`,
`border`, `control`, `field`, `focus`, `button`.

## CSS custom property naming

The JSON path, hyphen-joined, with camelCase segments kebab-cased:

| JSON path | Custom property |
|---|---|
| `global.color.amber.400` | `--color-amber-400` |
| `global.zIndex.modal` | `--z-index-modal` |
| `global.border.width.hairline` | `--border-width-hairline` |
| `light.surface.card` | `--surface-card` |
| `global.plate.round` | `--plate-round` |

Never use a `--scorp-*` prefix. The package import already provides the namespace.

CSS variable families, as listed in `ds-config.json: tokens.cssVariables`:

- `--color-{scale}-{step}`: foundation scales, including `primary`/`secondary` aliases
- `--surface-*`, `--text-*`, `--border-*`, `--field-*`, `--focus-ring-*`,
  `--focus-offset-color`, `--button-*`, `--elevation-*`: semantic surfaces and chrome
- `--opacity-*`, `--z-index-*`, `--breakpoint-*`, `--duration-*`, `--easing-*`,
  `--font-*`, `--line-height-*`, `--font-weight-*`, `--button-size-*`, `--plate-round*`,
  `--focus-ring-width`, `--focus-ring-offset`: global utilities
- `--color-term-*`: terminal tier-2 ANSI-style accents; values differ under `.dark`

## Foundation vs Semantic classification

| Type | Holds | Named by | Example |
|---|---|---|---|
| **Foundation** | Raw, unaliased values | Scale step | `--color-amber-400`, `--spacing-4` |
| **Semantic** | Purpose-named references | Usage | `--surface-card`, `--text-primary`, `--button-primary-background` |

**Rule:** if a token holds a raw value it is Foundation. If it is named by purpose it
is Semantic, and it must reference a Foundation token rather than restating a value.

## Figma collection structure

Two variable collections, mirroring the layers above.

### Collection 1: `Foundation`

| Group path | Content |
|---|---|
| `Colors/{Scale}` | Color scales (`amber`, `sepia`, `green`, `blue`, `purple`, `red`) |
| `Colors/Shared` | `black`, `white` |
| `Typography/FontSize` | Font size scale |
| `Typography/FontWeight` | Font weight scale |
| `Typography/LineHeight` | Line height scale |
| `Spacing/Scale` | Spacing scale |
| `Spacing/BorderWidth` | Border widths |
| `Opacity/Scale` | Opacity scale |
| `Motion/Duration`, `Motion/Easing` | Motion tokens |

### Collection 2: `Semantic`

| Group path | Content |
|---|---|
| `Colors/Surface` | Surface tokens |
| `Colors/Text` | Text tokens |
| `Colors/Border` | Border tokens |
| `Colors/Field` | Form field tokens |
| `Colors/Button` | Per-variant button tokens |
| `Colors/Focus` | Focus ring tokens |
| `Colors/Elevation` | Elevation tokens |
| `Colors/Terminal` | `--color-term-*` tier-2 accents |
| `Size/ControlHeight` | `sm` / `md` / `lg` control heights |
| `Size/TouchTarget` | 44px accessibility floor |
| `Shape/Plate` | Stepped plate silhouettes |

**No `Spacing/Radius` group.** Radius tokens do not exist in this system.

**Note:** semantic typography tokens are **Figma Text Styles**, not variables. Figma
has no variable type for composed typography.

Each collection needs a **light** and a **dark** mode, matching the `light` / `dark`
keys in `tokens.json`. Dark is the default theme.

## Figma variable naming

`/` separates groups:

- `Colors/Amber/amber400` (Foundation)
- `Colors/Surface/surfaceCard` (Semantic)
- `Typography/FontSize/fontSize14` (Foundation)
- `Shape/Plate/plateRound` (Semantic)

## Naming conventions (code)

- **Color tokens:** camelCase `{group}{Variant}{State}`, e.g. `textDefault`,
  `surfaceElevated`, `borderFocused`
- **Control sizing:** `sm` / `md` / `lg` (legacy `small` / `medium` / `large` aliases
  still resolve, with a dev warning)
- **Components:** PascalCase and **unprefixed**, e.g. `Button`, not `ScorpButton`. The
  `@{project.package}/components` import provides the namespace.
- **Files:** PascalCase for components (`Button.tsx`), kebab-case for utilities
  (`token-parser.ts`)

## Adding a token

1. Add to `packages/tokens/src/tokens.json` (`global` for base, `light`/`dark` for semantic)
2. Add the matching custom property to `packages/tokens/src/styles/tokens.css` **in the
   same commit**, in both `:root` and `.dark` if theme-specific
3. Run `npm test` and confirm the token-parser drift test passes
4. If it needs a Tailwind class, add it to `packages/tokens/tailwind.preset.js`
5. Update `design-tokens.md`
6. Add a visual example to the relevant Foundation story
