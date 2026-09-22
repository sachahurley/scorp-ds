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
| Last updated | 2026-09-22 |
| API hash | `1f3ca9013505cd7d` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Divider is a thin rule that separates groups of content within the same surface: sections of a form, items in a toolbar, blocks inside a Card body. The `withText` variant draws a box-drawing line with a centered label for TUI style section breaks. Use spacing alone when grouping is already clear, and use separate Cards when the groups are independent. Card and Modal already draw their own header and footer hairlines, so do not add a Divider there.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`horizontal` and `vertical` are a single `div` with a 1px solid top or left border in `term-dim`. `withText` is a flex row: a left run of 80 `─` characters (clipped by `overflow-hidden`), the label, and a right run of 80 `─`.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `horizontal` | Full-width 1px rule (default). |
| `vertical` | Full-height 1px rule; the parent must give it height (e.g. `self-stretch` in a flex row). |
| `withText` | Box-drawing line with a centered `text-xs` label. Falls back to a plain horizontal rule when `text` is empty. |

### Sizes

`spacing` controls the margin around the rule (`my-*` for `horizontal`, `mx-*` otherwise).

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
| `variant` | `"horizontal" \| "vertical" \| "withText"` | `"horizontal"` | No | Orientation or labelled style. |
| `text` | `ReactNode` | `undefined` | No | Label for `withText`; ignored by other variants. A string label also becomes the separator's `aria-label`. |
| `spacing` | `"none" \| ControlSizeProp` | `"md"` | No | Margin around the rule: none, `sm` 4px, `md` 16px, `lg` 32px. Legacy names are deprecated aliases. |
| `className` | `string` | `""` | No | Extra classes (width, `self-stretch`). |

Exported type: `DividerProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `border-term-dim` (`--color-term-dim`) | Color | `#78716C` light, `#888888` dark | Rule color for `horizontal` and `vertical` |
| `text-term-dim` (`--color-term-dim`) | Color | `#78716C` light, `#888888` dark | Box-drawing lines and label in `withText` |
| `text-xs` | Typography | 12px | `withText` label |
| `px-2` | Spacing | 8px | Label side padding |
| `my-1` / `my-4` / `my-8` (or `mx-*`) | Spacing | 4px / 16px / 32px | `spacing` scale |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Orientation | `variant` | Border side, `aria-orientation` |
| Labelled | `variant="withText"` with `text` | Box-drawing runs and label |
| Label fallback | `withText` without `text` | Renders the plain horizontal rule |
| Margin | `spacing` | Margin utility |

Static element: no interactive states.

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| `horizontal` | Yes | Yes | `Horizontal` |
| `vertical` | Yes | Yes | `Vertical` |
| `withText` | Yes | Yes | `WithText` |
| `spacing="none"` | Yes | Yes | `Vertical` |
| `spacing="sm"` | Yes | No | Only via the `spacing` control |
| `spacing="md"` | Yes | Yes | Default in `Horizontal`, `WithText` |
| `spacing="lg"` | Yes | No | Only via the `spacing` control |
| `withText` fallback without text | Yes | No | |

Interactive controls: `variant` (select), `spacing` (select).

**Coverage:** 63% (5/8)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `"─".repeat(80)` box-drawing runs on each side of the `withText` label (a fixed count; very wide dividers can show a gap at the ends).

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

- Semantic role: `role="separator"` on every variant; `aria-orientation` is `horizontal` or `vertical` for the plain rules (not set on `withText`)
- Required labels: none; a string `text` becomes `aria-label`, and the box-drawing runs are `aria-hidden`. A non-string label leaves the separator unnamed
- Focus order: not focusable
- Touch target minimum: N/A (not interactive)
- Color independence: purely decorative structure; no meaning carried by color

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `withText` with a short string label for TUI section breaks ("Section", "or").
- Do give a `vertical` divider a height from its parent (`self-stretch` in a flex row) and `spacing="none"` when the parent already has a gap.
- Do prefer spacing over a Divider when groups are already visually distinct.
- Don't add Dividers inside Card or Modal headers and footers; they draw their own hairlines.
- Don't pass a non-string `text` if the label matters to screen readers; it will not be announced as the separator name.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Horizontal dividers are `w-full`; constrain width with the parent or `className`.
- In toolbars, place a `vertical` divider between button groups with `spacing="none"` and let the flex `gap` provide the margin.
- `withText` inherits the parent font size for the box-drawing runs; keep it in `font-mono` contexts so the glyphs align.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `withText` (and its fallback rule) gets horizontal `mx-*` margins instead of vertical `my-*`, because spacing only checks `variant === "horizontal"`; rule color uses the `term-dim` palette color rather than a semantic border token; `spacing` is a margin scale, not the control-height tokens the 2026-09-21 changelog row mentions | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` (a margin scale, not control-height tokens); small/medium/large are deprecated aliases |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Divider.tsx`
