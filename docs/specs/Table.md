# Table

> Spec created for semantic table primitives on 2026-04-03. Aligns with `packages/components/src/components/Table.tsx` and Storybook `Components/Display/Table`.

## Status

| Field | Value |
|-------|-------|
| Widget | `ScorpTable` |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Table.tsx` |
| Story | `Components/Display/Table` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-03 |
| Notion Page | `` |

---

## Intent

<!-- HUMAN-SECTION:intent -- This section is preserved across auto-updates -->

TABLE — semantic HTML table building blocks for dense, monospace data (jobs, hosts, logs, etc.).

Compose `Table`, `TableHeader`, `TableBody`, optional `TableFooter`, `TableRow`, `TableHead`, and `TableCell`. The root `Table` supports `bordered` (outer frame) and `striped` (even `tbody` rows use `surface-subtle`).

Consumers should wrap wide tables in `overflow-x-auto` at the product level; the component does not impose a scroll container.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Parts

| Part | HTML | Description |
|------|------|-------------|
| `Table` | `table` | `striped`, `bordered`, passes through native table attributes. |
| `TableHeader` | `thead` | Subtle background + bottom border. |
| `TableBody` | `tbody` | Body rows. |
| `TableFooter` | `tfoot` | Summary rows; top border + subtle background. |
| `TableRow` | `tr` | Row borders between rows. |
| `TableHead` | `th` | Default `scope="col"` for column headers. |
| `TableCell` | `td` | Data cells. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### TableProps

Extends `TableHTMLAttributes<HTMLTableElement>`:

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| striped | `boolean` | — | No | Zebra striping on `tbody` even rows. |
| bordered | `boolean` | — | No | Outer border via `--surface-container-stroke`. |
| className | `string` | — | No | Merged with `cn()`. |

`TableHeader`, `TableBody`, `TableFooter`, `TableRow` accept standard `HTMLAttributes` for their elements plus `className`.

### TableHeadProps

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| scope | `string` | `"col"` | No | Override for row headers (`row`). |

### TableCellProps

Standard `TdHTMLAttributes<HTMLTableCellElement>`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token / utility | Usage |
|-----------------|--------|
| `--text-primary` | Table base text, header emphasis. |
| `--surface-container-stroke` | Borders (table outer, rows, header/footer). |
| `--surface-subtle` | Header/footer background; striped even rows. |
| `secondary-800` / `secondary-200` | Default body cell text (`TableCell`). |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| Variant | Prop | Effect |
|---------|------|--------|
| Bordered | `bordered` | Full outer border on `<table>`. |
| Striped | `striped` | `tbody tr:nth-child(even)` background `surface-subtle`. |

Row hover / selection are left to product (`className` on `TableRow`).

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| Example | Story | Notes |
|---------|-------|-------|
| Job list + badges | `Default` | `bordered`, overflow wrapper. |
| Host list striped | `Striped` | `bordered` + `striped`. |

**Coverage:** Core table + striping demonstrated.

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No raw hex; spacing uses scale (`px-3`, `py-2`, `text-sm`). Border width `0.5px` matches other DS surfaces.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Internal

- `cn` from `packages/components/src/lib/utils.ts`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- **Semantics:** Native `table`, `thead`, `tbody`, `th`/`td`; use `scope="row"` on row headers when applicable.
- **Caption:** Product may pass `<caption>` as child of `Table` if a visible title is required for WCAG tables.
- **Sortable columns:** Not built-in; add `aria-sort` and buttons in product code when adding sort controls.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont -->

**Do** wrap wide tables in a horizontal scroll region. **Do** use `TableHead` for header cells. **Don't** use tables for arbitrary layout grids — reserve for tabular data.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition -->

Keep header cell count aligned with body cells. For sparse or responsive layouts, consider card lists instead of shrinking table typography below readable sizes.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-04-03 | Sticky header / column | Optional `className` on `TableHeader` / `th`; no first-class API yet. | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-04-03 | spec-created | Initial spec for table primitives. |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Table.tsx`
