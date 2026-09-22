# Table

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Table` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Table.tsx` |
| Story | `Components/Display/Table` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Table is a set of thin, semantic wrappers over native table elements (`Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`) with token-backed chrome for dense monospace data: build status, hosts, inventories, anything read across columns. It keeps real `<table>` semantics so screen readers can navigate by row and column. Use it when values need to line up and be compared; use `ListRow` for scannable lists with one text column, and `Card` for framed content. Sorting, selection, pagination and sticky headers are left to product code.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`Table` (`<table>`, optionally wrapped in a plate ring) > `TableHeader` (`<thead>`) / `TableBody` (`<tbody>`) / `TableFooter` (`<tfoot>`) > `TableRow` (`<tr>`) > `TableHead` (`<th>`) / `TableCell` (`<td>`).

- `Table` provides the density through React context; `TableHead` and `TableCell` read it for their padding.
- `bordered` wraps the table in two divs: `plate-round-lg p-px bg-[--surface-container-stroke]` (the ring) around `plate-round-lg bg-[--surface-card]` (the fill).
- Header and footer sections get a `surface-subtle` fill and a hairline `surface-container-stroke` rule (`--border-width-hairline`, 1px); every row gets the same bottom rule.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `bordered` | Frames the table on the large plate via the ring recipe (a CSS border cannot follow the clip). |
| `striped` | Even body rows use `surface-subtle`. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `compact` (default) | Cell padding `px-3 py-2` (12px / 8px). The data-grid rhythm. |
| `comfortable` | Cell padding `px-4 py-3` (16px / 12px). |
| `spacious` | Cell padding `px-5 py-4` (20px / 16px). For low-density reading. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### Table

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `density` | `TableDensity` (`"compact" \| "comfortable" \| "spacious"`) | `"compact"` | No | Cell padding rhythm, shared with every `TableHead` / `TableCell` via context. |
| `striped` | `boolean` | `false` | No | Zebra striping on even body rows. |
| `bordered` | `boolean` | `false` | No | Plate-ring frame around the table. |
| `className` | `string` | none | No | Merged onto the `<table>` with `cn()` (not onto the frame wrapper). |
| `ref` | `Ref<HTMLTableElement>` | none | No | Forwarded to the `<table>`. |
| `...rest` | native `<table>` attributes | | No | `aria-label`, `aria-describedby`, and so on. |

### Sub-components

| Component | Element | Defaults | Notes |
|-----------|---------|----------|-------|
| `TableHeader` | `<thead>` | `surface-subtle` fill, hairline bottom rule | Sticky headers are product-side (`className`). |
| `TableBody` | `<tbody>` | none | Target of `striped`. |
| `TableFooter` | `<tfoot>` | `surface-subtle` fill, hairline top rule | For summary rows. |
| `TableRow` | `<tr>` | hairline bottom rule, color transition | No built-in hover or selected state. |
| `TableHead` | `<th>` | `scope="col"`, density padding, `font-bold`, left aligned | Pass `scope="row"` for row headers. |
| `TableCell` | `<td>` | density padding, `align-middle`, secondary text | |

All sub-components accept their native HTML attributes, `className` (merged with `cn()`) and a forwarded `ref`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Table base text and `TableHead` |
| `secondary-800` / `secondary-200` | Color | `#474030` light / `#F7F5F2` dark | `TableCell` text |
| `--surface-subtle` | Color | light `#FCFBFA`, dark `#1A150F` | Header / footer fill, striped rows |
| `--surface-container-stroke` | Color | light `#BFB4A3`, dark `#474030` | Row and section rules, bordered ring |
| `--surface-card` | Color | light `#FFFFFF`, dark `#120D09` | Bordered inner fill |
| `--plate-round-lg` (`plate-round-lg`) | Shape | stepped 12px corner polygon | Bordered frame silhouette |
| `--border-width-hairline` | Size | `1px` | Row and section rules (the system's single rule weight) |
| `--font-weight-bold` (`font-bold`) | Typography | `700` | Column headers |
| `--duration-normal` | Motion | `200ms` | Row color transition |
| `text-sm` | Typography | `14px` | All table text |
| `--spacing-2` to `--spacing-5` | Spacing | `8px` to `20px` | Density padding |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Density | `density` | Cell padding (see Sizes) |
| Striped | `striped` | Even `tbody` rows `--surface-subtle` |
| Bordered | `bordered` | Ring `--surface-container-stroke`, fill `--surface-card`, `plate-round-lg` |
| Row hover / selected | Not built in | Product adds via `TableRow` `className` |
| Rules | always | `--border-width-hairline` on `thead`, `tfoot` and every `tr` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Bordered | Yes | Yes | Every story |
| Striped | Yes | Yes | `Striped` |
| compact / comfortable / spacious | Yes | Yes | `Densities` |
| Unbordered | Yes | No | |
| `TableFooter` | Yes | No | |
| Badge in cells | n/a | Yes | `Default` (status column) |

Interactive controls: none (the meta has no `component` or `argTypes`; stories use `render`).

**Coverage:** 60% (3/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `TableCell` uses `secondary-800` / `secondary-200` scale steps rather than a semantic text token.

Rules and the header weight were tokenized on 2026-09-22: `border-*-[length:var(--border-width-hairline)]` replaces the 0.5px rules, and `font-bold` (700) replaces `font-semibold` (600, not in the weight scale). The arbitrary-value form is used instead of the preset's `border-hairline` class because tailwind-merge reads a named border suffix as a colour and drops it next to `border-[var(--surface-container-stroke)]`.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/tokens/src/styles/tokens.css` (surface, text, plate, duration tokens)
- `packages/tokens/tailwind.preset.js` (`plate-round-lg` utility)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `table`, `rowgroup`, `row`, `columnheader`, `cell`.
- Required labels: give the table a name with `aria-label`, `aria-labelledby`, or a `<caption>` child. `TableHead` defaults to `scope="col"`; use `scope="row"` for row headers.
- Focus order: not focusable. Interactive content in cells follows document order.
- Touch target minimum: n/a for the table; controls placed in cells must meet 44x44 on their own.
- Color independence: striping and rules are decorative; status cells should carry text (the story's `Badge` shows the status word).
- Overflow: wrap in `overflow-x-auto` on small viewports (the frame wrapper does not scroll by itself).

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do set `density` on `Table` only; cells pick it up from context.
- Do wrap wide tables in `overflow-x-auto` and give the table an accessible name.
- Do right-align numeric columns with `className="text-right"` on both the head and the cells.
- Do use `bordered` for the frame instead of adding borders or `rounded-*` to the table.
- Don't use Table for layout or for single-column lists; use `ListRow` or `Stack`.
- Don't put a `Card` around a bordered table; pick one frame.
- Don't rely on striping alone to separate rows in meaning (for example "failed" rows); use a status `Badge` or text.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- `Badge size="sm"` fits a compact cell without changing row height.
- Cell text inherits `text-sm`; override single columns (IDs, SHAs) with a secondary scale step, as the `Default` story does.
- Put row actions in the last column with `Button variant="ghost"` or `variant="icon"` at `sm`, each with an `aria-label`.
- For interactive rows (select, open detail), put a real `<button>` or `Link` inside a cell rather than making the `<tr>` clickable.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `font-semibold` (600) and `0.5px` rules are off-token values | Headers use `font-bold` (`--font-weight-bold`, 700); rules use the new `global.border.width.hairline` token (1px) | Resolved |
| 2026-09-22 | No unit tests; no `Playground` story or `component` in the story meta, so autodocs has no props table | Unit tests added for the chrome tokens and `scope="col"`; the story meta still has no `component` or `Playground` | Partly resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | Column headers use the `font-bold` token and rules use `--border-width-hairline`, replacing the off-token 600 weight and 0.5px rules |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Table.tsx`
