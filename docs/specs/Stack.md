# Stack

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Stack` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Stack.tsx` |
| Story | `Primitives/Layout/Stack` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Stack is the layout primitive for spacing a group of elements along one axis with a gap from the spacing scale. Use it inside screens, patterns and compound components instead of one-off `flex` plus arbitrary gap values: vertical for form fields and sections, horizontal for toolbars and button groups. It only lays children out; it has no visual styling, semantics or padding of its own. For two-dimensional layouts use CSS grid directly.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A single `<div class="flex ...">` around `children`.

### Variants (`axis`)

| Enum Value | Description |
|-----------|-------------|
| `vertical` (default) | `flex-col`. Children stretch to the container width. |
| `horizontal` | `flex-row flex-wrap items-center`. Children wrap onto new lines and are vertically centered. |

### Sizes (`gap`, type `StackGap`)

| Enum Value | Description |
|-----------|-------------|
| `none` | `gap-0` (0) |
| `"1"` | `gap-1` (4px) |
| `"2"` | `gap-2` (8px) |
| `"3"` | `gap-3` (12px) |
| `"4"` (default) | `gap-4` (16px) |
| `"5"` | `gap-5` (20px) |
| `"6"` | `gap-6` (24px) |
| `"8"` | `gap-8` (32px) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | Yes | Elements to lay out. |
| `gap` | `StackGap` (`"none" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "8"`) | `"4"` | No | Space between children, from the spacing scale. |
| `axis` | `"vertical" \| "horizontal"` | `"vertical"` | No | Layout direction. Horizontal also wraps and centers items. |
| `className` | `string` | none | No | Extra classes, merged with `cn()` (tailwind-merge), so overrides such as `items-start` win. |
| `ref` | `Ref<HTMLDivElement>` | none | No | Forwarded to the underlying `<div>`. |
| `...rest` | native `<div>` attributes | | No | Spread onto the `<div>` (`id`, `role`, `aria-*`, `data-*`, handlers), so a stack can be a labelled region or a scroll anchor without a wrapper. |

Stack still has no `as` element: it is always a `<div>`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--spacing-1` to `--spacing-8` (via `gap-*`) | Spacing | `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px` | Gap between children |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Vertical | `axis="vertical"` | `gap-*` |
| Horizontal | `axis="horizontal"` | `gap-*` (applies to both row and wrap gaps) |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Vertical | Yes | Yes | `Vertical` (gap `"4"`) |
| Horizontal | Yes | Yes | `Horizontal` (gap `"3"`) |
| All gap values | Yes | Via controls | `gap` select control |

Interactive controls: `gap` (select: none, 1, 2, 3, 4, 5, 6, 8), `axis` (select).

**Coverage:** 100% (2/2)

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
- Spacing scale (Tailwind `gap-*`, equal to `--spacing-*` in `packages/tokens/src/styles/tokens.css`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none by default (a plain `<div>`), but `role` and `aria-*` are forwarded, so a stack can be a `group` or `region` with its own `aria-label` instead of needing a wrapper element.
- Required labels: none, unless you give the stack a `role` that requires one.
- Focus order: visual order equals DOM order (no `reverse` option), so keyboard order matches what is seen.
- Touch target minimum: n/a; use at least `gap="2"` between adjacent small controls so hit areas do not overlap.
- Color independence: n/a.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `gap="3"` for fields within a group and `gap="6"` between groups (as the SettingsPanel pattern does).
- Do use `axis="horizontal"` for button groups and toolbars; it wraps on narrow screens.
- Do nest Stacks for hierarchy rather than adding margins to children.
- Don't add `gap-[...]` or `space-y-*` overrides through `className`; pick a `gap` value.
- Don't use Stack when you need a `ref`, an `id` or ARIA attributes on the container; use a plain element with the same classes.
- Don't use Stack for grids or for alignment across rows; use CSS grid or `Table`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Used by `Patterns/SettingsPanel` (nested `gap="6"` / `"3"` / `"4"`), `Patterns/WorkbenchSplit`, `Patterns/DenseListRow`, `Patterns/MusicPlayer` (queue, `gap="1"`) and the `Tabs` form-field story (`gap="3"`).
- Inside `Card` bodies, Stack provides the vertical rhythm; the card provides the padding.
- Components that own their margins (`CaseStudyBlocks`) should not be placed in a Stack with a gap.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | No `ref` forwarding, no native attribute spread, no `as`, and no `gap="5"` (20px) although `--spacing-5` exists; no unit tests | Stack forwards a `ref`, spreads native attributes, and accepts `gap="5"`; unit tests cover all three. An `as` element is still not supported | Partly resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-04-04 | spec-created | Initial primitive spec |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | feat | Forwards a `ref`, spreads native attributes (`id`, `role`, `aria-*`), and adds the 20px `gap="5"` step |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/primitives/Stack.tsx`
