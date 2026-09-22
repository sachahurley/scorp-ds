# Box

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Box` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Box.tsx` |
| Story | `Primitives/Layout/Box` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Box is the base surface primitive: token-backed padding, a semantic background, and the optional hairline plate ring, on the element of your choice. Reach for it when a wrapper needs a surface, an inset or a ring, so those three decisions come from the token scales instead of from ad-hoc classes. Keep writing a plain `div` when the wrapper only needs layout classes. Box is deliberately narrow: no width, height, display, flex, margin, radius or style API, no arbitrary values, and no raw color scales. Arranging children is Stack, Inline and Grid; page width is Container and Center.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

With `border="none"` (default), a single element (`as`, default `div`) carrying the background and padding classes.

With `border="hairline"`, two layers, the plate ring recipe: the outer element (`as`) is `plate-round bg-[var(--surface-container-stroke)] p-px`, and an inner `div` is `plate-round h-full w-full` plus the fill and the padding. `clip-path` slices a real CSS border, which is why the stroke is a layer and not a `border-*` utility.

### Variants (`border`)

| Enum Value | Description |
|-----------|-------------|
| `none` (default) | One element. No stroke, no clip. |
| `hairline` | Plate ring: stroke layer plus a fill layer clipped 1px inside it. A ringed Box with no `background` falls back to the `card` surface, so the ring reads as a stroke rather than a solid plate. |

### Variants (`background`, type `BoxBackground`)

| Enum Value | Description |
|-----------|-------------|
| `none` (default) | No background class; the parent surface shows through. |
| `page` | `bg-[var(--surface-page)]` |
| `container` | `bg-[var(--surface-container)]` |
| `card` | `bg-[var(--surface-card)]` |
| `subtle` | `bg-[var(--surface-subtle)]` |
| `muted` | `bg-[var(--surface-muted)]` |
| `raised` | `bg-[var(--surface-raised)]` |
| `inverse` | `bg-[var(--surface-inverse)]` plus `text-[var(--text-on-inverse)]`, so content stays readable |

### Sizes (`padding` / `paddingX` / `paddingY`, type `BoxSpace`)

`BoxSpace` is `StackGap`: one scale for a Box inset and a Stack gap.

| Enum Value | Description |
|-----------|-------------|
| `none` | `p-0` / `px-0` / `py-0` (0) |
| `"1"` | 4px |
| `"2"` | 8px |
| `"3"` | 12px |
| `"4"` | 16px |
| `"5"` | 20px |
| `"6"` | 24px |
| `"8"` | 32px |

An axis prop replaces `padding` on that axis outright (`padding="4" paddingX="6"` emits `px-6 py-4`), rather than relying on `p-4 px-6` resolving by stylesheet order.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | No | Content inside the padding and on top of the background. |
| `padding` | `BoxSpace` | none | No | Inset on all four sides, from the spacing scale. |
| `paddingX` | `BoxSpace` | none | No | Left/right inset; replaces `padding` on that axis. |
| `paddingY` | `BoxSpace` | none | No | Top/bottom inset; replaces `padding` on that axis. |
| `background` | `BoxBackground` | `"none"` | No | Semantic surface to paint. `inverse` also flips the text color. |
| `border` | `BoxBorder` (`"none" \| "hairline"`) | `"none"` | No | `hairline` draws the plate ring as two layers. |
| `as` | `BoxElement` (`"div" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "figure" \| "li" \| "span"`) | `"div"` | No | Element to render, for landmarks and list items. |
| `className` | `string` | none | No | Extra classes, merged with `cn()` (tailwind-merge), so `p-8` beats `padding="4"`. On a ringed Box it lands on the outer stroke layer. |
| `ref` | `Ref<HTMLElement>` | none | No | Forwarded to the outer element. |
| `...rest` | native attributes of the chosen element | | No | Spread onto the outer element (`id`, `role`, `aria-*`, `data-*`, handlers). |

Deliberately absent: width, height, display, flex, margin, radius, shadow, a general `style`/`sx` API, and any arbitrary value.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--spacing-1` to `--spacing-8` (via `p-*`, `px-*`, `py-*`) | Spacing | 4px, 8px, 12px, 16px, 20px, 24px, 32px | `padding`, `paddingX`, `paddingY` |
| `--surface-page` | Semantic surface | `#FDFCFB` light / `#1A150F` dark | `background="page"` |
| `--surface-container` | Semantic surface | `#FDFCFB` light / `#1A150F` dark | `background="container"` |
| `--surface-card` | Semantic surface | `#FFFFFF` light / `#120D09` dark | `background="card"`, and the fallback fill of a ringed Box |
| `--surface-subtle` | Semantic surface | `#FCFBFA` light / `#1A150F` dark | `background="subtle"` |
| `--surface-muted` | Semantic surface | `#F7F5F2` light / `#221E13` dark | `background="muted"` |
| `--surface-raised` | Semantic surface | `#FFFFFF` light / `#120D09` dark | `background="raised"` |
| `--surface-inverse` | Semantic surface | `#2B2718` light / `#F7F5F2` dark | `background="inverse"` |
| `--text-on-inverse` | Semantic text | per theme | Text color paired with `background="inverse"` |
| `--surface-container-stroke` | Semantic surface | `#BFB4A3` light / `#474030` dark | Stroke layer of `border="hairline"` |
| `--plate-round` (via `.plate-round`) | Shape | `clip-path` silhouette | Both layers of `border="hairline"` |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Flush, transparent | defaults | none |
| Padded | `padding` / `paddingX` / `paddingY` | `--spacing-*` |
| Surfaced | `background` | `--surface-*` (plus `--text-on-inverse` for `inverse`) |
| Ringed plate | `border="hairline"` | `--surface-container-stroke`, `--plate-round`, fill surface |

Box has no interactive states: it does not respond to hover, focus or press, and does not render a focusable element.

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Ringed plate (default story) | Yes | Yes | `Default` (`padding="4" border="hairline"`) |
| All backgrounds | Yes | Yes | `Backgrounds` (all seven surfaces) |
| Padding scale plus axis override | Yes | Yes | `Padding` |
| Border none vs hairline | Yes | Yes | `Border` |
| Realistic composition | Yes | Yes | `StatusPanel` (Box + Stack + Inline, `as="section"` with `aria-label`) |

Interactive controls: `padding`, `paddingX`, `paddingY`, `background`, `border`, `as`.

**Coverage:** 100% (5/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. Surfaces are semantic CSS variables, spacing maps to the 4px scale, and the 1px stroke is `p-px`, the width the plate ring recipe requires.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None. With `border="hairline"` Box renders one extra plain `div` as the fill layer.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/components/src/primitives/Stack.tsx` (type-only: `StackGap`)
- `packages/tokens/src/styles/tokens.css` (`--surface-*`, `--text-on-inverse`, `--plate-round`)
- `packages/tokens/tailwind.preset.js` (`.plate-round` utility)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none by default. `as` renders real landmarks (`section`, `nav`, `aside`, `header`, `footer`, `main`) and `role` / `aria-*` are forwarded, so a Box can be a labelled region without a wrapper element.
- Required labels: none, unless `as` or `role` creates a landmark that needs a name; give those an `aria-label`.
- Focus order: Box adds no focusable element and no `tabIndex`, so DOM order is unchanged.
- Touch target minimum: n/a; Box does not render controls.
- Color independence: `background` is decoration only. Never use the surface alone to carry meaning, and note that `inverse` is the only value that also changes the text color.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use Box when a wrapper needs padding, a surface or the ring; write a plain `div` when it only needs `flex`, a width or a position.
- Do use `as="section"` plus `aria-label` when the Box is a real region of the page.
- Do nest a Box inside a Container for a full-bleed band: the Box paints to the viewport edge, the Container holds the measure.
- Don't reach for `className` to add a radius or a shadow. Plates are the shape language, and there are no radius tokens.
- Don't put padding in `className` on a ringed Box; it lands on the stroke layer, not the fill. Use the `padding` props.
- Don't render menus or popovers inside a ringed Box: the clip bounds overflowing children, the same caveat as Card.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Box provides the surface, Stack / Inline / Grid provide the arrangement: put the layout primitive inside the Box, never the padding inside the Stack.
- Card is the documented pattern for a titled plate with header, body and footer rules. Box is the unopinionated version: use Card when the sections exist, Box when they do not.
- A page band is `Box` (background, full width) wrapping `Container` (measure, gutters).
- Migration: this PR does not refactor existing components onto Box. `Card`, `Window` and other plates still build the ring inline; they can move to Box when each is next touched.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | The spacing scale stops at `8` (32px), so a Box cannot express the 40px and larger page rhythm steps | Deferred: those steps belong to page sections, which use Container and Stack today | Open |
| 2026-09-22 | `className` on a ringed Box lands on the stroke layer, so padding passed that way sits outside the fill | Documented in Do / Don't; the `padding` props are the supported path | Won't fix |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-22 | feat | Primitive created |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/primitives/Box.tsx`
