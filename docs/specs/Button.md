# Button

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Button` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Actions` |
| File | `packages/components/src/components/Button.tsx` |
| Story | `Components/Actions/Button` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Button triggers an action in place: submitting a form, opening a dialog, saving, deleting. It is the one plate-shaped call to action in the system, so every variant wears the stepped `--plate-round` silhouette, Fragment Mono, and an inset focus ring. Use `primary` for the single main action in a view, `secondary`, `ghost` or `outline` for supporting actions, and `destructive` for irreversible ones. `variant="link"` is still a button styled as text, for in-place actions like "Show more"; to navigate to another page use the `Link` component, or pass `href` when a navigation needs to look like a plate CTA.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `<button>` (or an `<a>` when `href` is set) containing optional `iconLeft`, the children, and optional `iconRight`. Icons are wrapped in a centered span sized to the button (16/20/24px). A button whose only child is a React element (or whose `variant` is `icon`) is detected as icon-only and rendered as a square plate.

While `loading`, that content is wrapped in an `opacity-0` span that stays in the layout (so the width holds and the label stays in the accessible name), and an `aria-hidden` overlay (`absolute inset-0`) centers a `Spinner` at the button's size (`sm` / `md` / `lg`; the deprecated `size="icon"` uses `md`).

### Variants

| Enum Value | Description |
|-----------|-------------|
| `primary` (default) | Gold CTA fill from `--button-primary-*`. One per view. |
| `secondary` | Quiet plate. On hover the text flips dark in both themes: light lightens the fill to sepia-600 with sepia-950 text, dark flips to the gold fill. |
| `ghost` | Transparent until hover, then a muted fill. For low-emphasis actions in toolbars and rows. |
| `outline` | Ring recipe: the element is the border color clipped to the plate, a `::before` layer is the opaque page fill clipped 1px inset, so the border follows the stepped corners. |
| `destructive` | Red fill for delete and other irreversible actions. |
| `link` | Transparent, accent text, underline on hover. Still a `<button>`: for in-place actions only. |
| `icon` | Dedicated square icon plate using `--button-icon-*`, with its own disabled colors at full opacity. Always icon-only. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 32px tall (`h-control-sm`), `px-4`, 16px icons, 6px icon gap. Icon-only: 32x32 (`size-control-sm`). |
| `md` (default) | 40px tall (`h-control-md`), `px-5`, 20px icons, 8px icon gap. Icon-only: 40x40. |
| `lg` | 48px tall (`h-control-lg`), `px-6`, 24px icons, 10px icon gap. Icon-only: 48x48. |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg`; resolved by `resolveSize` with a one-time dev warning. |
| `icon` | Deprecated: 40x40 square with a dev warning. Icon-only buttons are squared automatically, so use `md`. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "link" \| "outline" \| "destructive" \| "icon"` | `"primary"` | No | Visual style. See Variants. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large" \| "icon"` | `"md"` | No | Height from the control-height tokens. Legacy names and `"icon"` are deprecated. |
| `disabled` | `boolean` | `false` | No | Disables the button (50% opacity, `not-allowed` cursor). On an anchor it removes `href`, sets `aria-disabled`, and blocks pointer events. Wins over `loading`. |
| `loading` | `boolean` | `false` | No | Busy state for async actions. Shows a Spinner over the hidden label, sets `aria-busy` and `aria-disabled`, and swallows clicks (`preventDefault`, so a submit button does not resubmit its form; `onClick` is not called). No native `disabled`, so the button stays focusable, and the width does not change. Works on icon-only buttons and the `href` anchor form. |
| `iconLeft` | `ReactNode` | none | No | Icon before the label, typically a `TuiIcon`. React elements are wrapped in a size-matched box. |
| `iconRight` | `ReactNode` | none | No | Icon after the label (for example `ExternalLink` or `ChevronRight`). |
| `href` | `string` | none | No | Renders an `<a>` with identical plate styling instead of a `<button>`. Use for plate-styled navigation CTAs. |
| `target` | `string` | none | No | Anchor target, only with `href` (for example `"_blank"`). |
| `rel` | `string` | none | No | Anchor rel, only with `href`. Pair `target="_blank"` with `"noopener noreferrer"`. |
| `aria-label` | `string` | none | Required for icon-only | Accessible name. A dev warning fires when an icon-only button has neither `aria-label` nor `aria-labelledby`. |
| `aria-labelledby` | `string` | none | No | Alternative to `aria-label` for icon-only buttons. |
| `className` | `string` | `""` | No | Extra classes appended to the button or anchor. |
| `children` | `ReactNode` | none | No | Label text, or a single icon element for an icon-only button. |
| `ref` | `Ref<HTMLButtonElement>` | none | No | Forwarded to the `<button>` (or the `<a>` when `href` is set). |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | none | No | Click handler. Not called while `loading`. |
| `...rest` | native `<button>` attributes | | No | `type`, `form`, and so on. Note `type` is not defaulted, so a Button inside a `<form>` submits unless you pass `type="button"`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--button-primary-background` / `-hover` | Color | light `#FBBF24` / `#F59E0B`, dark `#E0A26A` / `#D97706` | Primary fill and hover |
| `--button-primary-text` | Color | light `#000000`, dark `#1A150F` | Primary label |
| `--button-secondary-background` / `-hover` | Color | light `#695F4D` / `#968A75`, dark `#221E13` / `#E0A26A` | Secondary fill and hover |
| `--button-secondary-text` / `-text-hover` | Color | light `#FDFCFB` / `#1A150F`, dark `#E0A26A` / `#1A150F` | Secondary label and hover label |
| `--button-ghost-background` / `-hover` | Color | `transparent`; hover light `#F7F5F2`, dark `#221E13` | Ghost fill |
| `--button-ghost-text` | Color | light `#2B2718`, dark `#FDFCFB` | Ghost label |
| `--button-outline-border` | Color | `#BFB4A3` | Outline ring (element background) |
| `--button-outline-background` / `-hover` | Color | light `#FDFCFB` / `#FCFBFA`, dark `#1A150F` / `#221E13` | Outline inner fill on `::before` |
| `--button-outline-text` | Color | light `#2B2718`, dark `#FDFCFB` | Outline label |
| `--button-destructive-background` / `-hover` | Color | `#DC2626` / `#B91C1C` | Destructive fill |
| `--button-destructive-text` | Color | `#FDFCFB` | Destructive label |
| `--button-link-text` / `-hover` | Color | light `#B45309` / `#92400E`, dark `#FBBF24` / `#FCD34D` | Link variant text |
| `--button-icon-background` / `-hover` | Color | light `#FCFBFA` / `#F7F5F2`, dark `#221E13` / `#2B2718` | Icon plate fill |
| `--button-icon-text` | Color | light `#2B2718`, dark `#E0A26A` | Icon plate glyph |
| `--button-icon-disabled-background` / `-text` | Color | light `#FDFCFB`, dark `#1A150F`; text `#968A75` | Icon variant disabled state |
| `--focus-ring-primary` | Color | `#FBBF24` | Focus ring for `primary` and `link` |
| `--focus-ring-secondary` | Color | `#695F4D` | Focus ring for `secondary`, `ghost`, `outline` |
| `--focus-ring-destructive` | Color | light `#DC2626`, dark `#EF4444` | Focus ring for `destructive` |
| `--focus-ring-icon` | Color | `#FBBF24` | Focus ring for `icon` |
| `--focus-ring-width` | Size | `2px` | Inset ring thickness |
| `--control-height-sm/md/lg` (`h-control-*`, `size-control-*`) | Size | `32px` / `40px` / `48px` | Heights and icon-only squares |
| `--plate-round` (`plate-round`) | Shape | stepped 6px corner polygon | Clip silhouette on every variant |
| `--duration-fast` | Motion | `120ms` | Color transitions |
| `text-sm` (`--font-size-sm`) | Typography | `14px` | Label size |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Hover | `:hover` | `--button-{variant}-background-hover`, secondary also `--button-secondary-text-hover`; link underlines and uses `--button-link-text-hover`; outline swaps the `::before` fill |
| Active | `:active` | `brightness-95` filter on every variant except `link` |
| Focus visible | `:focus-visible` | Inset `box-shadow` of `--focus-ring-width` in `--btn-ring` (per-variant focus token). Outline draws it on `::before` |
| Disabled | `disabled` prop | `opacity-50`, `cursor-not-allowed`; `icon` uses `--button-icon-disabled-*` at full opacity |
| Disabled anchor | `disabled` + `href` | `href` removed, `aria-disabled="true"`, `pointer-events-none opacity-50` |
| Loading | `loading` prop (ignored when `disabled`) | Variant colors unchanged; `relative cursor-progress`; content at `opacity-0` with a centered `Spinner` in `currentColor` (the variant's text token); `aria-busy="true"` and `aria-disabled="true"`; clicks prevented; still focusable |
| Icon-only | single element child or `variant="icon"` | Square `size-control-*`, no padding |
| Anchor | `href` | Renders `<a>` with the same classes plus `no-underline` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| primary | Yes | Yes | `Primary`, `All Variants` |
| secondary | Yes | Yes | `Secondary` |
| ghost | Yes | Yes | `Ghost` |
| outline | Yes | Yes | `Outline` |
| destructive | Yes | Yes | `Destructive` |
| link | Yes | Yes | `All Variants` only |
| icon | Yes | Yes | `Icon (aria-label)`, `Icon buttons (all variants)` |
| sm / md / lg | Yes | Yes | `All Sizes`, icon grid |
| Disabled | Yes | Yes | `Disabled`, last column of icon grid |
| Icon-only on every variant | Yes | Yes | `Icon buttons (all variants)` |
| iconLeft / iconRight props | Yes | No | Only an inline icon child in `As link (href)` |
| href anchor | Yes | Yes | `As link (href)` |
| Loading | Yes | Yes | `Loading` (interactive save demo, icon-only, all three sizes) |
| Hover / focus | Yes | Interactive only | No static story |

Interactive controls: `Playground` with `variant`, `size`, `disabled`, `loading`, `children`.

**Coverage:** 93% (13/14)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `active:brightness-95`: raw filter value for the pressed state.
- `w-4 h-4` / `w-5 h-5` / `w-6 h-6` icon boxes and `gap-1.5` / `gap-2` / `gap-2.5`: Tailwind spacing scale, not dedicated tokens.
- `bg-transparent` on the link variant (not a token, but semantically neutral).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Spinner` (`./Spinner`), rendered in the loading overlay.

Icons are passed in by the consumer (typically `TuiIcon`).

### Foundation Files Referenced

- `packages/components/src/lib/size.ts` (`resolveSize`, `ControlSizeProp`)
- `packages/tokens/src/styles/tokens.css` (button, focus-ring, control-height, plate, duration tokens)
- `packages/tokens/tailwind.preset.js` (`plate-round`, `h-control-*`, `size-control-*`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `button`; `link` when `href` is set.
- Required labels: visible text, or `aria-label` / `aria-labelledby` for icon-only buttons (dev warning when missing).
- Focus order: native tab order. Focus shows as a 2px inset ring because the plate clip swallows outside outlines.
- Keyboard: native Enter and Space on `<button>`; Enter on the anchor form.
- Loading: `aria-busy="true"` plus `aria-disabled="true"` announce the busy, unavailable state while the button stays in the tab order and keeps focus (native `disabled` would drop focus mid-submit). The label stays in the accessible name at `opacity-0`; the Spinner overlay is `aria-hidden`, so its own `role="status"` is not announced a second time.
- Touch target minimum: only `lg` (48px) meets 44x44. `sm` (32px) and `md` (40px) have no expanded hit area.
- Color independence: variants differ by fill, but meaning must come from the label (for example "Delete account", not a red "OK").

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use one `primary` per view; demote the rest to `secondary`, `ghost` or `outline`.
- Do pass `type="button"` for buttons inside a form that should not submit it.
- Do give every icon-only button an `aria-label` that names the action ("Open menu", not "Menu icon").
- Do use `href` (with `rel="noopener noreferrer"` for `_blank`) for plate-styled navigation CTAs.
- Do use `loading` for async submits instead of `disabled` or swapping the label for "Saving..."; it keeps focus and width stable.
- Don't use `variant="link"` for navigation; use `Link` so it has anchor semantics.
- Don't use `size="icon"` or the `small|medium|large` names in new code.
- Don't pass a single wrapper element (for example `<span>Save</span>`) as children: it is detected as icon-only and squared. Pass plain text.
- Don't override the shape with `rounded-*` or outside focus outlines.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Heights match `Input`, `Select` and the `Dropdown` trigger at the same size, so a Button sits flush next to a field in a row.
- In dialog and sheet footers, order the secondary action first and the primary last.
- `Dropdown` uses the secondary button look for its default trigger; to use a real Button as a trigger, prefer the default trigger until the custom-trigger wrapper issue in `Dropdown` is fixed.
- Pair icons from `TuiIcon`; the Button sizes the icon box, so do not set a size on the icon itself unless you want a smaller glyph.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | `size="icon"` duplicated automatic icon-only squaring; `link` variant purpose undocumented | `size="icon"` deprecated with a dev warning (use "medium"); JSDoc explains link variant vs Link | Resolved |
| 2026-09-22 | `sm` (32px) and `md` (40px) are below the 44px touch target and have no pseudo-element hit area like Checkbox/Radio/Switch | None yet | Open |
| 2026-09-22 | Icon-only detection treats any single React element child as an icon, so `<span>Label</span>` renders as a square | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | fix | Light secondary hover text is now `--button-secondary-text-hover` sepia-950 on the sepia-600 fill (5.3:1, was white at 3.3:1) |
| Unreleased | 2026-09-21 | feat | `loading` prop: Spinner over the label, `aria-busy` + `aria-disabled`, clicks blocked, stays focusable, width stable (icon-only too) |
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | fix | Deprecated `size="icon"`; documented `variant="link"` |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Button.tsx`
