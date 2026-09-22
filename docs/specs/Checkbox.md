# Checkbox

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Checkbox` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Checkbox.tsx` |
| Story | `Components/Inputs/Checkbox` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Checkbox lets users turn an independent option on or off, or pick any number of items from a list, usually as part of a form that is submitted later. It is a native checkbox (visually hidden) with a plate-shaped box that fills gold and shows a 1-bit Check when selected (or a 1-bit Minus bar when `indeterminate`), plus optional label, helper text, and error message. Use `Switch` instead for settings that take effect immediately, and `Radio` when exactly one option of a set must be chosen.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

An outer `flex flex-col gap-1` wrapper (receives `className`) holding a `<label>` and an optional `FieldMessage` indented to line up with the label text. Inside the label: a hit-area span (unclipped, with a centered 44x44px `::before`), the `sr-only` native `<input type="checkbox">`, the visual box (outer plate = ring color, inner plate = fill clipped 1px inset, holding two stacked `aria-hidden` marks: `data-mark="check"` with the `Check` icon, revealed by `peer-checked`, and `data-mark="bar"` with the `Minus` icon, revealed by `peer-indeterminate`, which wins when both apply), and the optional label text.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single style; state is driven by the native input via `peer-checked` and `peer-indeterminate`. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 16x16px box, Check / Minus icon size `3` (12px), message indent `pl-6` |
| `md` (default) | 20x20px box, Check / Minus icon size `4` (16px), message indent `pl-7` |
| `lg` | 24x24px box, Check / Minus icon size `5` (20px), message indent `pl-8` |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Label text is `text-sm` at every size. The hit area is 44x44px at every size.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `label` | `string \| ReactNode` | none | No | Visible label; clicking it toggles the box. Without one, pass `aria-label`. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Box size. Legacy names are deprecated. |
| `checked` | `boolean` | none | No | Controlled state. Omit to use native uncontrolled behavior (`defaultChecked`). |
| `defaultChecked` | `boolean` | none | No | Native uncontrolled initial state (passed through). |
| `indeterminate` | `boolean` | `false` | No | Mixed state for a parent box whose children are partly checked ("select all" over a half-selected list). Sets the native `indeterminate` DOM property (there is no HTML attribute) through a ref merged with the forwarded one, re-asserted after every render, and draws the 1-bit Minus bar instead of the Check. The prop is the source of truth: a click still fires `onChange` / `onCheckedChange`, and the box stays mixed until you pass `false`. |
| `onCheckedChange` | `(checked: boolean) => void` | none | No | Called with the new checked state. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | none | No | Native change handler; called before `onCheckedChange`. |
| `helperText` | `ReactNode` | none | No | Secondary line under the label explaining the consequence of checking. Linked via `aria-describedby`. |
| `errorMessage` | `ReactNode` | none | No | Validation message; sets error styling and `aria-invalid`, replaces `helperText`, leads with AlertCircle. |
| `error` | `boolean` | `false` | No | Error styling without a message. Prefer `errorMessage`. |
| `disabled` | `boolean` | `false` | No | Native disabled; box and label dim, cursor `not-allowed`. |
| `aria-describedby` | `string` | none | No | Merged in front of the message id. |
| `className` | `string` | `""` | No | Applied to the outer wrapper. |
| `ref` | `Ref<HTMLInputElement>` | none | No | Forwarded to the native input (merged with the internal ref that sets `indeterminate`; function and object refs both work). |
| `...rest` | native `<input>` attributes (except `size`) | | No | `name`, `value`, `required`, `id`, `aria-label`, and so on, spread onto the input. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--field-border` / `-hover` | Color | light `#968A75` / `#695F4D`, dark `#474030` / `#968A75` | Unchecked ring and hover |
| `--field-border-error` | Color | light `#DC2626`, dark `#EF4444` | Error ring; checked-error fill |
| `--field-background` | Color | light `#FFFFFF`, dark `#120D09` | Unchecked inner fill |
| `--button-primary-background` / `-hover` | Color | light `#FBBF24` / `#F59E0B`, dark `#E0A26A` / `#D97706` | Checked and indeterminate ring and fill |
| `--button-primary-text` | Color | light `#000000`, dark `#1A150F` | Check and Minus icons |
| `--focus-ring-primary` / `--focus-ring-error` | Color | `#FBBF24` / light `#DC2626`, dark `#EF4444` | Inset focus ring |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `--touch-target` (`w-touch h-touch`) | Size | `44px` | Hit area |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Label text |
| `--text-secondary`, `error-700` / `dark:error-400` | Color | see FieldMessage | Helper and error message |
| `--plate-round` | Shape | stepped 6px corner polygon | Outer and inner box |
| `--duration-fast` | Motion | `120ms` | Color and mark opacity transitions |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Unchecked | default | Ring `--field-border`, fill `--field-background` |
| Hover | `:hover` on the box | Ring `--field-border-hover` (checked: `--button-primary-background-hover`) |
| Checked | native `:checked` (`peer-checked`) | Ring and fill `--button-primary-background`, Check icon visible in `--button-primary-text` |
| Indeterminate | `indeterminate` prop, rendered from native `:indeterminate` (`peer-indeterminate`) | Ring and fill `--button-primary-background` (hover `-hover`), Minus bar visible in `--button-primary-text`, Check hidden even if also checked |
| Focus visible | `peer-focus-visible` | Inset ring `--focus-ring-primary` (error: `--focus-ring-error`) |
| Error | `error` or `errorMessage` | Ring `--field-border-error`; checked or indeterminate fill turns `--field-border-error` with a white Check or Minus |
| Disabled | `disabled` | Box `opacity-50` and label `opacity-50` (stacked), `cursor-not-allowed` |
| Helper / error message | `helperText` / `errorMessage` | FieldMessage under the label |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Unchecked | Yes | Yes | `Unchecked` |
| Checked | Yes | Yes | `Checked` (uncontrolled `defaultChecked`) |
| Helper text | Yes | Yes | `Helper text` |
| Error message | Yes | Yes | `Error` |
| Disabled | Yes | Yes | `Disabled` |
| sm / md / lg | Yes | Yes | `All sizes` |
| Indeterminate | Yes | Yes | `Indeterminate` (args), `Select all (mixed)` (working parent/child list), `Indeterminate sizes` |
| Checked + error | Yes | No | |
| No visible label (`aria-label`) | Yes | No | Covered by tests only |

Interactive controls: `size`, `error`, `helperText`, `errorMessage`, `disabled`, `indeterminate` via args.

**Coverage:** 78% (7/9)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `text-white` on the Check and Minus icons in the checked / indeterminate error state (should be a token such as an on-error text color).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`Check`, `Minus`)
- `FieldMessage` / `useFieldMessage` (`packages/components/src/lib/field.tsx`, internal)

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `checkbox`; the visual box is `aria-hidden`, so only the input is exposed.
- Mixed state: `indeterminate` sets the native DOM property, so assistive tech announces the box as "mixed" (`aria-checked="mixed"` semantics) without an extra ARIA attribute.
- Required labels: `label` (the wrapping `<label>` names the input) or `aria-label` / `aria-labelledby`.
- Description: helper or error text via `aria-describedby`; `aria-invalid` in error.
- Keyboard: native Tab to focus and Space to toggle.
- Focus: 2px inset ring on the plate when the native input is focus-visible.
- Touch target minimum: 44x44px at every size via the `::before` hit area inside the label, so a tap near the box toggles it even without a visible label.
- Color independence: checked state shows a Check glyph (not just fill); indeterminate shows the Minus bar; errors carry the AlertCircle icon and text.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do write labels as positive statements ("Email me release notes", not "Don't email me").
- Do use `helperText` to explain the consequence of checking.
- Do group related checkboxes in a `<fieldset>` with a `<legend>`.
- Do use `onCheckedChange` for a boolean callback instead of reading `event.target.checked`.
- Do derive `indeterminate` from the children (some checked, not all) and clear it when every child is checked or cleared; the box stays mixed until the prop changes.
- Don't use Checkbox for an immediate on/off setting; use `Switch`.
- Don't use Checkbox for mutually exclusive choices; use `Radio`.
- Don't render a checkbox with neither `label` nor `aria-label`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Box sizes (16/20/24px) and the 44px hit area match `Radio`, so mixed lists align.
- Stack checkboxes vertically with at least `gap-2`. The 44px hit areas extend beyond the row, so at tight spacing they overlap and a tap between two rows can land on the neighbor; give touch-first lists more room (for example `gap-4`).
- In dense rows (tables, `ListRow`), use `aria-label` instead of a visible label and let the row carry the text.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | 16px small box below the 44px target; unlabeled boxes ignored mouse clicks; no helper or error text | 44px pseudo-element hit area at every size; control always wrapped in a label; added `helperText` and `errorMessage` | Resolved |
| 2026-09-22 | Disabled opacity is applied to both the label and the box, so the box renders at about 25% | None yet | Open |
| 2026-09-22 | No indeterminate (mixed) state for "select all" patterns | `indeterminate` prop: native property via a merged ref, 1-bit Minus bar | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | `indeterminate` prop: sets the native property via a merged ref (announced as mixed), draws the 1-bit Minus bar |
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | feat | Checkmark text glyph replaced by the 1-bit Check icon (sizes 3/4/5) |
| Unreleased | 2026-09-21 | fix | 44px hit area, unlabeled click fix, `helperText`, `errorMessage` |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Checkbox.tsx`
