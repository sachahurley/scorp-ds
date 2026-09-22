# Grid

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Grid` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Grid.tsx` |
| Story | `Primitives/Layout/Grid` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Grid is the two-dimensional layout primitive: a token-backed gap and a column count that can change per breakpoint. Use it for card galleries, token swatch walls and anything where items must line up across rows as well as along them. It owns only the tracks and the gaps, never padding or a surface, so wrap it in a Box or a Container when it needs either. A single wrapping row is Inline; a single column is Stack.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A single `<div class="grid ...">` around `children`. Each child fills one cell in source order.

### Variants (`columns`, type `GridColumns`)

`columns` is either a `GridColumnCount` (`1 | 2 | 3 | 4 | 5 | 6 | 8 | 12`) or a partial map from breakpoint to count.

| Enum Value | Description |
|-----------|-------------|
| number | One `grid-cols-{n}` class at every width. |
| `{ base?, sm?, md?, lg?, xl? }` | Mobile-first classes emitted in breakpoint order: `base` below 640px, then `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px. A map without `base` starts at one column (the component default). |

Breakpoint values match the Tailwind `screens` scale that the breakpoint tokens feed, so the primitive uses the standard prefixes and defines no widths of its own.

### Variants (`align`, type `GridAlign`)

| Enum Value | Description |
|-----------|-------------|
| `stretch` (default) | `items-stretch`. Every cell in a row takes the height of the tallest. |
| `start` | `items-start` |
| `center` | `items-center` |
| `end` | `items-end` |

### Sizes (`gap`, `rowGap`, `columnGap`, type `GridGap`)

`GridGap` is `StackGap`: one scale across the layout primitives.

| Enum Value | Description |
|-----------|-------------|
| `none` | 0 |
| `"1"` | 4px |
| `"2"` | 8px |
| `"3"` | 12px |
| `"4"` (default for `gap`) | 16px |
| `"5"` | 20px |
| `"6"` | 24px |
| `"8"` | 32px |

`gap` emits `gap-*`; `rowGap` emits `gap-y-*` and `columnGap` emits `gap-x-*`, both applied after `gap` so they override it on their axis.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | Yes | Cells to place in the tracks, in source order. |
| `columns` | `GridColumns` | `1` | No | Fixed track count, or a breakpoint map such as `{ base: 1, md: 2, lg: 3 }`. |
| `gap` | `GridGap` | `"4"` | No | Space between all tracks. |
| `rowGap` | `GridGap` | none | No | Row spacing when it differs from `gap`. |
| `columnGap` | `GridGap` | none | No | Column spacing when it differs from `gap`. |
| `align` | `GridAlign` | `"stretch"` | No | Vertical placement of cells within their row. |
| `className` | `string` | none | No | Extra classes, merged with `cn()` (tailwind-merge), so `grid-cols-6` beats `columns={2}`. |
| `ref` | `Ref<HTMLDivElement>` | none | No | Forwarded to the underlying `<div>`. |
| `...rest` | native `<div>` attributes | | No | Spread onto the `<div>` (`id`, `role`, `aria-*`, `data-*`, handlers). |

Out of scope on purpose: explicit row counts, `grid-template-areas`, per-cell span props, and auto-fit / `minmax` track sizing, all of which need arbitrary values. Use `className` on the Grid and on its children when a layout genuinely needs them.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--spacing-1` to `--spacing-8` (via `gap-*`, `gap-x-*`, `gap-y-*`) | Spacing | 4px, 8px, 12px, 16px, 20px, 24px, 32px | `gap`, `rowGap`, `columnGap` |
| Breakpoints `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px (Tailwind `screens`) | Layout | 640px, 768px, 1024px, 1280px | Responsive `columns` map |

Grid references no color, typography or motion tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Fixed columns | `columns={n}` | none |
| Responsive columns | `columns={{ ... }}` | breakpoint scale |
| Even gaps | `gap` | `--spacing-*` |
| Split gaps | `rowGap` / `columnGap` | `--spacing-*` |
| Cell alignment | `align` | none |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default grid | Yes | Yes | `Default` (3 columns, gap 4) |
| Fixed column counts | Yes | Yes | `Columns` (2, 3, 4) |
| Responsive map | Yes | Yes | `ResponsiveColumns` (`{ base: 1, md: 2, xl: 4 }`) |
| Split gaps | Yes | Yes | `SplitGaps` (`columnGap="2" rowGap="8"`) |
| All `align` values | Yes | Partly | `Align` shows `stretch`, `start`, `center`; `end` is available through the control |
| Realistic composition | Yes | Yes | `ProjectGallery` (`role="list"` with ringed Box cells) |

Interactive controls: `columns`, `gap`, `rowGap`, `columnGap`, `align`.

**Coverage:** 100% (6/6)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. Column classes are literal `grid-cols-*` utilities (written out so Tailwind can see them), and gaps map to the 4px spacing scale.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/components/src/primitives/Stack.tsx` (type-only: `StackGap`)
- Spacing scale and Tailwind `screens` (`packages/tokens/tailwind.preset.js`, `packages/tokens/src/styles/tokens.css`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none by default, but `role` and `aria-*` are forwarded, so a gallery can be a labelled `list` (with `role="listitem"` children) or a `region`.
- Required labels: none, unless a forwarded `role` needs a name.
- Focus order: source order, not visual order. Because a responsive grid reflows, never rely on column position to imply reading order, and keep the DOM in the order a keyboard user should meet the cells.
- Touch target minimum: n/a for the container; keep at least `gap="2"` between cells that contain controls.
- Color independence: n/a; Grid paints nothing.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do start responsive maps at `{ base: 1 }`: one column is the honest mobile layout.
- Do use `align="start"` when cells should keep their natural height, for example a list of short definitions.
- Do use `role="list"` plus `role="listitem"` when the cells are a list of things rather than a layout.
- Don't build a two-column form with Grid when the fields simply stack on mobile; a Stack is simpler and needs no breakpoints.
- Don't pass a column count that is not in `GridColumnCount`; type-check fails rather than emitting a class Tailwind never generated.
- Don't reorder cells visually with `order-*`; it breaks keyboard order.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Container (page measure) wraps Grid (tracks) wraps Box (each cell's surface and padding).
- Stack inside each cell gives the cell its own vertical rhythm; the Grid gap handles the space between cells.
- A sibling branch wires the breakpoint tokens into the Tailwind preset `screens`. Grid intentionally uses the standard `sm:` / `md:` / `lg:` / `xl:` prefixes, so it follows those tokens without importing anything.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | No `auto-fit` / `minmax` track sizing, so a gallery cannot size itself to its content | Deferred: it needs arbitrary values, which the primitives avoid | Open |
| 2026-09-22 | No per-cell span prop; a wide cell needs `className="col-span-2"` | Deferred until a real screen needs it | Open |
| 2026-09-22 | Counts `7`, `9`, `10`, `11` are not in `GridColumnCount` | Intentional: the supported counts divide a 12 track layout evenly | Won't fix |

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

`packages/components/src/primitives/Grid.tsx`
