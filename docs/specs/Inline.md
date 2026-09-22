# Inline

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Inline` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Inline.tsx` |
| Story | `Primitives/Layout/Inline` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Inline is the horizontal cluster: a row of items that wraps onto the next line instead of overflowing. Use it for button rows, tag lists, meta rows and icon plus label pairs, so the gap, the cross-axis alignment and the wrapping behaviour are decisions of the layout and not of each caller. It owns only gaps and alignment, never padding, a surface or typography. For a column use Stack; for items that must line up across rows as well as along them use Grid.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A single `<div class="flex flex-row ...">` around `children`.

### Variants (`align`, type `InlineAlign`)

| Enum Value | Description |
|-----------|-------------|
| `start` | `items-start`. Tops line up. |
| `center` (default) | `items-center`. Suits controls of mixed height. |
| `end` | `items-end`. Bottoms line up. |
| `baseline` | `items-baseline`. Text baselines line up, for a label plus value meta row. |

### Variants (`justify`, type `InlineJustify`)

| Enum Value | Description |
|-----------|-------------|
| `start` (default) | `justify-start`. The cluster stays tight at the start of the row. |
| `center` | `justify-center` |
| `end` | `justify-end` |
| `between` | `justify-between`. First and last item go to the edges of a full-width row. |

### Variants (`wrap`)

| Enum Value | Description |
|-----------|-------------|
| `true` (default) | `flex-wrap`. Items flow onto a new line; `gap` applies between lines too. |
| `false` | `flex-nowrap`. One line, so overflow must be handled by the caller. |

### Sizes (`gap`, type `InlineGap`)

`InlineGap` is `StackGap`: one scale for rows and columns.

| Enum Value | Description |
|-----------|-------------|
| `none` | `gap-0` (0) |
| `"1"` | `gap-1` (4px) |
| `"2"` (default) | `gap-2` (8px) |
| `"3"` | `gap-3` (12px) |
| `"4"` | `gap-4` (16px) |
| `"5"` | `gap-5` (20px) |
| `"6"` | `gap-6` (24px) |
| `"8"` | `gap-8` (32px) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | Yes | Items to place side by side; each keeps its own width. |
| `gap` | `InlineGap` | `"2"` | No | Space between items, used for both the row gap and the wrap gap. |
| `align` | `InlineAlign` | `"center"` | No | Cross-axis placement of items in the row. |
| `justify` | `InlineJustify` | `"start"` | No | How leftover horizontal space is distributed. |
| `wrap` | `boolean` | `true` | No | Whether items flow onto a new line when the row runs out of width. |
| `className` | `string` | none | No | Extra classes, merged with `cn()` (tailwind-merge), so `gap-8` beats `gap="2"`. |
| `ref` | `Ref<HTMLDivElement>` | none | No | Forwarded to the underlying `<div>`. |
| `...rest` | native `<div>` attributes | | No | Spread onto the `<div>` (`id`, `role`, `aria-*`, `data-*`, handlers). |

Inline is always a `<div>`: it has no `as`. A row that is a real landmark should be a Box with `as` around the Inline.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--spacing-1` to `--spacing-8` (via `gap-*`) | Spacing | 4px, 8px, 12px, 16px, 20px, 24px, 32px | Gap between items and between wrapped lines |

Inline references no color, typography or motion tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Wrapping row (default) | `wrap` | `gap-*` (row and line gaps) |
| Single line | `wrap={false}` | `gap-*` |
| Cross-axis alignment | `align` | none |
| Main-axis distribution | `justify` | none |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default row | Yes | Yes | `Default` |
| Gap scale | Yes | Yes | `Gap` (1, 2, 4, 6) |
| All `align` values | Yes | Yes | `Align` |
| All `justify` values | Yes | Yes | `Justify` |
| `wrap={false}` | Yes | Yes | `NoWrap` |
| Realistic composition | Yes | Yes | `CardFooter` (meta left, actions right) |

Interactive controls: `gap`, `align`, `justify`, `wrap`.

**Coverage:** 100% (6/6)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. Gaps map to Tailwind spacing utilities on the 4px scale, which match the `--spacing-*` tokens.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/components/src/primitives/Stack.tsx` (type-only: `StackGap`)
- Spacing scale (Tailwind `gap-*`, equal to `--spacing-*` in `packages/tokens/src/styles/tokens.css`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none by default, but `role` and `aria-*` are forwarded, so a button row can be a `toolbar` or a labelled `group` without a wrapper element.
- Required labels: none, unless you give the row a `role` that needs a name (`toolbar`, `group`, `region`).
- Focus order: visual order equals DOM order, including after wrapping, so keyboard order matches what is seen. There is no reverse direction.
- Touch target minimum: use at least `gap="2"` between adjacent controls so the 44px hit areas of neighbouring buttons do not collide.
- Color independence: n/a; Inline paints nothing.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use Inline for every horizontal cluster of controls, badges or meta text.
- Do use `align="baseline"` when the row mixes type sizes, so the text sits on one line rather than floating.
- Do add `className="w-full"` when using `justify="between"`: the row must be full width for the ends to separate.
- Don't turn `wrap` off to "keep it on one line" without handling overflow; a wrapped row is almost always the better failure mode.
- Don't use `axis="horizontal"` on Stack for new code. Inline is the row primitive, and it exposes `align`, `justify` and `wrap`.
- Don't add padding or a background through `className`; wrap the row in a Box.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Inline inside Stack is the standard screen shape: Stack for vertical rhythm, Inline for each row within it.
- Inline inside Box when the row needs an inset or a surface (a card footer, a status bar).
- Nest Inlines for a split row: an outer `justify="between"` Inline holding a left cluster and a right cluster, each its own Inline.
- `Stack axis="horizontal"` remains for existing callers; it is the same layout with fewer controls and no `wrap` switch.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `Stack axis="horizontal"` overlaps with Inline | Left in place: Stack keeps existing callers working, Inline is the documented row primitive for new code | Open |
| 2026-09-22 | No separate row gap for wrapped lines | Deferred: one `gap` covers both axes, which is the intent for a cluster | Open |

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

`packages/components/src/primitives/Inline.tsx`
