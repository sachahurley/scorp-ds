# Divider

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Divider` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Divider.tsx` |
| Story | `Components/Display/Divider` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |
| API hash | `049bc86a9acdcce7` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Divider is a thin rule that separates groups of content within the same surface: sections of a form, items in a toolbar, blocks inside a Card body. A `label` draws a box-drawing line with a centered label for TUI style section breaks. Use spacing alone when grouping is already clear, and use separate Cards when the groups are independent. Card and Modal already draw their own header and footer hairlines, so do not add a Divider there.

Don't use this for: space alone between items that are already clearly grouped (use the `gap` of Stack or Inline instead), or as the only signal that groups differ in meaning (use a heading instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A plain rule (`orientation="horizontal"` or `"vertical"`) is a single `div` with a 1px solid top or left border in `term-dim`. The labelled form (`label` set on a horizontal rule) is a flex row: a left run of 80 `─` characters (clipped by `overflow-hidden`), the label, and a right run of 80 `─`.

### Forms

| Prop | Value | Description |
|------|-------|-------------|
| `orientation` | `horizontal` | Full-width 1px rule (default). |
| `orientation` | `vertical` | Full-height 1px rule; the parent must give it height (e.g. `self-stretch` in a flex row). Ignores `label`. |
| `label` | any node | Labelled form: box-drawing line with a centered `text-xs` label. An empty label renders the plain horizontal rule. |
| `variant` | `horizontal`, `vertical`, `withText` | Deprecated (decision 0024). `horizontal` and `vertical` map onto `orientation`; `withText` shows `text` as the label. Logs a one-time dev warning. |
| `text` | any node | Deprecated alias for `label`, read only with `variant="withText"`. Logs a one-time dev warning. |

When both the old and new names are passed, `orientation` and `label` win.

### Sizes

`spacing` controls the margin around the rule: `my-*` on every horizontal form (labelled or not), `mx-*` on the vertical rule.

| Enum Value | Description |
|-----------|-------------|
| `none` | No margin |
| `sm` | 4px (`my-1` / `mx-1`) |
| `md` | 16px (`my-4` / `mx-4`) (default) |
| `lg` | 32px (`my-8` / `mx-8`) |
| `small`, `medium`, `large` | Deprecated aliases for `sm`, `md`, `lg`; log a one-time dev warning |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | No | Which way the rule runs. |
| `label` | `ReactNode` | `undefined` | No | Centered label; gives the labelled form on a horizontal rule, ignored on a vertical one. A string label also becomes the separator's `aria-label`. |
| `variant` | `"horizontal" \| "vertical" \| "withText"` | `undefined` | No | **Deprecated:** use `orientation`, and `label` for `withText`. Loses to `orientation` / `label`. |
| `text` | `ReactNode` | `undefined` | No | **Deprecated:** use `label`. Read only with `variant="withText"`. |
| `spacing` | `"none" \| ControlSizeProp` | `"md"` | No | Margin around the rule: none, `sm` 4px, `md` 16px, `lg` 32px; above and below a horizontal rule, either side of a vertical one. Legacy names are deprecated aliases. |
| `className` | `string` | `""` | No | Extra classes (width, `self-stretch`). |

Exported type: `DividerProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `border-term-dim` (`--color-term-dim`) | Color | `#78716C` light, `#888888` dark | Rule color for the plain horizontal and vertical rules |
| `text-term-dim` (`--color-term-dim`) | Color | `#78716C` light, `#888888` dark | Box-drawing lines and label in the labelled form |
| `text-xs` | Typography | 12px | Label |
| `px-2` | Spacing | 8px | Label side padding |
| `my-1` / `my-4` / `my-8` (`mx-*` when vertical) | Spacing | 4px / 16px / 32px | `spacing` scale |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Orientation | `orientation` (deprecated `variant`) | Border side, `aria-orientation` |
| Labelled | `label` (deprecated `variant="withText"` with `text`) | Box-drawing runs and label |
| Label fallback | empty `label` (or `withText` without `text`) | Renders the plain horizontal rule |
| Margin | `spacing` | Margin utility |

Static element: no interactive states.

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| `orientation="horizontal"` | Yes | Yes | `Horizontal` |
| `orientation="vertical"` | Yes | Yes | `Vertical` |
| `label` | Yes | Yes | `WithText` (shown as "With label") |
| `spacing="none"` | Yes | Yes | `Vertical` |
| `spacing="sm"` | Yes | No | Only via the `spacing` control |
| `spacing="md"` | Yes | Yes | Default in `Horizontal`, `WithText` |
| `spacing="lg"` | Yes | No | Only via the `spacing` control |
| Empty label fallback | Yes | No | Unit test only |
| Deprecated `variant` / `text` | Yes | No | Hidden from the controls; unit test only |

Interactive controls: `orientation` (select), `label` (text), `spacing` (select).

**Coverage:** 56% (5/9)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `"─".repeat(80)` box-drawing runs on each side of the label (a fixed count; very wide dividers can show a gap at the ends).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts` (`resolveSize`, `ControlSizeProp`)
- `packages/tokens/src/styles/tokens.css` (`--color-term-dim`)
- `packages/tokens/tailwind.preset.js` (`term.dim` color mapping)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="separator"` on every form; `aria-orientation` is `horizontal` or `vertical` for the plain rules (not set on the labelled form)
- Required labels: none; a string `label` becomes `aria-label`, and the box-drawing runs are `aria-hidden`. A non-string label leaves the separator unnamed
- Focus order: not focusable
- Touch target minimum: N/A (not interactive)
- Color independence: purely decorative structure; no meaning carried by color

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `label` with a short string for TUI section breaks ("Section", "or").
- Do give a vertical divider a height from its parent (`self-stretch` in a flex row) and `spacing="none"` when the parent already has a gap.
- Do prefer spacing over a Divider when groups are already visually distinct.
- Don't add Dividers inside Card or Modal headers and footers; they draw their own hairlines.
- Don't pass a non-string `label` if the label matters to screen readers; it will not be announced as the separator name.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Horizontal dividers are `w-full`; constrain width with the parent or `className`.
- In toolbars, place a vertical divider (`orientation="vertical"`) between button groups with `spacing="none"` and let the flex `gap` provide the margin.
- The labelled form inherits the parent font size for the box-drawing runs; keep it in `font-mono` contexts so the glyphs align.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `withText` (and its fallback rule) gets horizontal `mx-*` margins instead of vertical `my-*`, because spacing only checks `variant === "horizontal"` | Every horizontal form now takes `my-*`; only the vertical rule takes `mx-*` | Resolved 2026-10-28 |
| 2026-09-22 | Rule color uses the `term-dim` palette color rather than a semantic border token; `spacing` is a margin scale, not the control-height tokens the 2026-09-21 changelog row mentions | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` (a margin scale, not control-height tokens); small/medium/large are deprecated aliases |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-10-28 | feat | `orientation` and `label` replace `variant` and `text` (decision 0024); the old props are deprecated aliases with a one-time dev warning |
| Unreleased | 2026-10-28 | fix | The labelled form takes vertical `my-*` spacing like the plain horizontal rule, not side `mx-*` margins |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Divider.tsx`
