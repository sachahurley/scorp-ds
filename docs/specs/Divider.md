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
| Status | `stable` |
| Last updated | 2026-10-29 |
| API hash | `05ac33e012d192f9` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Divider is a thin rule that separates groups of content within the same surface: sections of a form, items in a toolbar, blocks inside a Card body. A `label` draws a rule with a centred label for TUI style section breaks (`─── Section ───`). Use spacing alone when grouping is already clear, and use separate Cards when the groups are independent. Card and Modal already draw their own header and footer hairlines, so do not add a Divider there.

Don't use this for: space alone between items that are already clearly grouped (use the `gap` of Stack or Inline instead), or as the only signal that groups differ in meaning (use a heading instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A plain rule (`orientation="horizontal"` or `"vertical"`) is a single `div` with a solid top or left border at the hairline weight (`--border-width-hairline`, decision 0010) in `term-dim`. The labelled form (`label` set on a horizontal rule) is a flex row, `items-center`: an empty left side, the label, and an empty right side. Each side is `flex-1 min-w-4` with the same hairline top border as the plain rule, so it fills the width left beside the label, has no intrinsic width of its own, and never pushes the row past its parent. The label is `truncate min-w-0`: one line, cut with an ellipsis when the row is too narrow, and each side keeps at least a 16px run.

**Why hairline sides, not box-drawing glyphs.** The sides used to be two runs of 80 `─` characters. A text run has a fixed width it cannot shrink below, so in any shrink-to-fit parent (a centred layout, a flex row, a grid `auto` column) the divider asked for about 160 characters and ran off the right edge, and on a very wide row the 80 glyphs could also run out and leave a gap. Clipping the glyphs (`overflow-hidden min-w-0`) would fix the narrow case but keep a second way of drawing the same line, at the glyph's stroke weight and baseline rather than the rule's. Drawing the sides with the hairline border makes the labelled rule exactly the plain rule with a label set into it: same weight, same colour, same 1px line at any width. The TUI look is kept by the monospace label and the gap either side of it; at 1px a `─` and a hairline render the same.

**Truncate, not wrap.** A wrapped label would make the row two or more lines tall, and the rule would sit centred on the block rather than on a line of text, which no longer reads as a terminal section break. A section label should be short; when one is not, it truncates and the full string stays the separator's accessible name.

### Forms

| Prop | Value | Description |
|------|-------|-------------|
| `orientation` | `horizontal` | Full-width 1px rule (default). |
| `orientation` | `vertical` | Full-height 1px rule; the parent must give it height (e.g. `self-stretch` in a flex row). Ignores `label`. |
| `label` | any node | Labelled form: hairline sides that fill the free width, with a centred `text-xs` label that truncates when too long. An empty label renders the plain horizontal rule. |

### Sizes

`spacing` controls the margin around the rule: `my-*` on every horizontal form (labelled or not), `mx-*` on the vertical rule.

| Enum Value | Description |
|-----------|-------------|
| `none` | No margin |
| `sm` | 4px (`my-1` / `mx-1`) |
| `md` | 16px (`my-4` / `mx-4`) (default) |
| `lg` | 32px (`my-8` / `mx-8`) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | No | Which way the rule runs. |
| `label` | `ReactNode` | `undefined` | No | Centred label; gives the labelled form on a horizontal rule, ignored on a vertical one. A string label also becomes the separator's `aria-label`. A label wider than the row truncates with an ellipsis. |
| `spacing` | `"none" \| ControlSize` | `"md"` | No | Margin around the rule: none, `sm` 4px, `md` 16px, `lg` 32px; above and below a horizontal rule, either side of a vertical one. |
| `className` | `string` | `""` | No | Extra classes (width, `self-stretch`), merged with `cn()` so they win over the defaults: `w-64` replaces `w-full`. |

Exported type: `DividerProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `border-term-dim` (`--color-term-dim`) | Color | `#78716C` light, `#888888` dark | Rule color for every form, including both sides of the labelled form |
| `border-t-[length:var(--border-width-hairline)]` (`border-l-*` when vertical) | Border | 1px | Rule weight for every form (decision 0010) |
| `text-term-dim` (`--color-term-dim`) | Color | `#78716C` light, `#888888` dark | Label in the labelled form |
| `min-w-4` (`--spacing-4`) | Sizing | 16px | Shortest run each side of a label keeps |
| `text-xs` | Typography | 12px | Label |
| `px-2` | Spacing | 8px | Label side padding |
| `my-1` / `my-4` / `my-8` (`mx-*` when vertical) | Spacing | 4px / 16px / 32px | `spacing` scale |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Orientation | `orientation` | Border side, `aria-orientation` |
| Labelled | `label` | Hairline sides and label |
| Long label | `label` wider than the row | Label truncates with an ellipsis; sides keep `min-w-4` |
| Label fallback | empty `label` | Renders the plain horizontal rule |
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
| `label` | Yes | Yes | `WithText` (shown as "With label", in a `w-96` container) |
| `label` in a narrow container | Yes | Yes | `LabelNarrow` (`w-48`) |
| Long `label` truncation | Yes | Yes | `LabelLong` (`w-64`) |
| `spacing="none"` | Yes | Yes | `Vertical` |
| `spacing="sm"` | Yes | No | Only via the `spacing` control |
| `spacing="md"` | Yes | Yes | Default in `Horizontal`, `WithText` |
| `spacing="lg"` | Yes | No | Only via the `spacing` control |
| Empty label fallback | Yes | No | Unit test only |

Interactive controls: `orientation` (select), `label` (text), `spacing` (select).

**Coverage:** 64% (7/11)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None. The fixed 80-glyph box-drawing runs were replaced by hairline borders on 2026-10-29.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts` (`ControlSize`)
- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/tokens/src/styles/tokens.css` (`--color-term-dim`, `--border-width-hairline`)
- `packages/tokens/tailwind.preset.js` (`term.dim` color mapping)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="separator"` on every form; `aria-orientation` is `horizontal` or `vertical` for the plain rules (not set on the labelled form)
- Required labels: none; a string `label` becomes `aria-label` (the full string, even when the visible label is truncated), and the two side rules are `aria-hidden`. A non-string label leaves the separator unnamed
- Focus order: not focusable
- Touch target minimum: N/A (not interactive)
- Color independence: purely decorative structure; no meaning carried by color

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `label` with a short string for TUI section breaks ("Section", "or"). A long one truncates with an ellipsis rather than wrapping.
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
- The labelled form fills its parent and never overflows it, at any width: give it width with the parent (or `className`), not with a long label.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `withText` (and its fallback rule) gets horizontal `mx-*` margins instead of vertical `my-*`, because spacing only checks `variant === "horizontal"` | Every horizontal form now takes `my-*`; only the vertical rule takes `mx-*` | Resolved 2026-10-28 |
| 2026-10-29 | A labelled Divider ignored its container width and ran off the right edge: each side was a fixed run of 80 `─` characters that could not shrink below its text width, so even the `WithText` story overflowed its frame (found in #114). `className` widths also lost to the default `w-full` | Each side is now a `flex-1 min-w-4` hairline border with no intrinsic width; a long label truncates; classes merge with `cn()` so a `className` width wins | Resolved 2026-10-29 |
| 2026-09-22 | Rule color uses the `term-dim` palette color rather than a semantic border token; `spacing` is a margin scale, not the control-height tokens the 2026-09-21 changelog row mentions | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-29 | docs | Promoted to `stable`: meets the decision 0026 bar and was reviewed by Sacha |
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` (a margin scale, not control-height tokens); small/medium/large are deprecated aliases |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-10-28 | feat | `orientation` and `label` replace `variant` and `text` (decision 0024); the old props are deprecated aliases with a one-time dev warning |
| Unreleased | 2026-10-28 | fix | The labelled form takes vertical `my-*` spacing like the plain horizontal rule, not side `mx-*` margins |
| Unreleased | 2026-10-29 | change | Decision 0031 removed the deprecated `variant` and `text` props and the `small \| medium \| large` spacing names, with their dev warnings; use `orientation`, `label` and `sm \| md \| lg`. Rendering unchanged |
| Unreleased | 2026-10-29 | fix | The labelled form fills its container and never overflows it: its sides are hairline borders (decision 0010) instead of fixed 80-glyph box-drawing runs, a long label truncates with an ellipsis, and every form draws at `--border-width-hairline`. `className` now merges with `cn()`, so a width class overrides `w-full` |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Divider.tsx`
