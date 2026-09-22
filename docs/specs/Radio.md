# Radio

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Radio` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Radio.tsx` |
| Story | `Components/Inputs/Radio` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Radio lets users choose exactly one option from a small, visible set (roughly two to five). Each Radio is a single native radio input; radios with the same `name` form a group, and the browser handles exclusivity and arrow-key movement. The box wears the same plate silhouette as Checkbox (Scorp DS has no circles) and shows a square dot when selected, so the two controls still read differently. Use `Select` when the list is long or space is tight, and `Checkbox` when several options can be on at once.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

An outer `flex flex-col gap-1` wrapper (receives `className`) holding a `<label>` and, under it, the optional `FieldMessage`. Inside the label: a hit-area span (unclipped, centered 44x44px `::before`), the `sr-only` native `<input type="radio">`, the visual box (outer plate = ring color, inner plate = fill clipped 1px inset, square dot revealed on check), and the optional label text. The message is indented to line up with the label text (`pl-6` / `pl-7` / `pl-8` by size). There is no group component: wrap radios in a `<fieldset>` with a `<legend>` yourself.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single style; state is driven by the native input via `peer-checked`. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 16x16px box, 6px square dot (`w-1.5 h-1.5`) |
| `md` (default) | 20x20px box, 8px square dot (`w-2 h-2`) |
| `lg` | 24x24px box, 10px square dot (`w-2.5 h-2.5`) |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Label text is `text-sm` at every size; the hit area is 44x44px at every size.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `name` | `string` | none | Yes, for grouping | Shared by every radio in a group; the browser enforces one selection per name. |
| `value` | `string \| number \| readonly string[]` | none | Yes, for forms | The value submitted when this radio is selected. |
| `label` | `string \| ReactNode` | none | No | Visible label; clicking it selects the radio. Without one, pass `aria-label`. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Box size. Legacy names are deprecated. |
| `checked` | `boolean` | none | No | Controlled state. Omit to use native uncontrolled behavior (`defaultChecked` plus the group `name`). |
| `defaultChecked` | `boolean` | none | No | Native uncontrolled initial selection (passed through). |
| `onCheckedChange` | `(checked: boolean) => void` | none | No | Called with this radio's own checked state (read from `event.currentTarget`). Native radios only fire on becoming selected, so this is always called with `true`. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | none | No | Native change handler; called before `onCheckedChange`. |
| `error` | `boolean` | `false` | No | Error styling and `aria-invalid` without a message. Prefer `errorMessage`. |
| `helperText` | `ReactNode` | none | No | Secondary line under the label, linked with `aria-describedby`. Hidden while `errorMessage` is set. |
| `errorMessage` | `ReactNode` | none | No | Validation message under the label; sets the error state and `aria-invalid`, and leads with the AlertCircle icon. |
| `disabled` | `boolean` | `false` | No | Native disabled; box and label dim. |
| `className` | `string` | `""` | No | Applied to the outer wrapper. |
| `ref` | `Ref<HTMLInputElement>` | none | No | Forwarded to the native input. |
| `...rest` | native `<input>` attributes (except `size`) | | No | `required`, `id`, `aria-label`, `aria-describedby`, and so on, spread onto the input. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--field-border` / `-hover` | Color | light `#968A75` / `#695F4D`, dark `#474030` / `#968A75` | Unselected ring and hover |
| `--field-border-error` | Color | light `#DC2626`, dark `#EF4444` | Error ring; selected-error fill |
| `--field-background` | Color | light `#FFFFFF`, dark `#120D09` | Unselected inner fill |
| `--button-primary-background` / `-hover` | Color | light `#FBBF24` / `#F59E0B`, dark `#E0A26A` / `#D97706` | Selected ring and fill |
| `--button-primary-text` | Color | light `#000000`, dark `#1A150F` | Square dot |
| `--button-destructive-text` | Color | `#FDFCFB` both themes | Square dot in the selected error state (4.8:1 on the red fill) |
| `error-700` / `dark:error-400` | Color | `#B91C1C` / `#F87171` | Error message text (`FieldMessage`) |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Helper message text |
| `--focus-ring-primary` / `--focus-ring-error` | Color | `#FBBF24` / light `#DC2626`, dark `#EF4444` | Inset focus ring |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `--touch-target` (`w-touch h-touch`) | Size | `44px` | Hit area |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Label text |
| `--plate-round` | Shape | stepped 6px corner polygon | Outer and inner box |
| `--duration-fast` | Motion | `120ms` | Color and dot opacity transitions |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Unselected | default | Ring `--field-border`, fill `--field-background` |
| Hover | `:hover` on the box | Ring `--field-border-hover` (selected: `--button-primary-background-hover`) |
| Selected | native `:checked` (`peer-checked`) | Ring and fill `--button-primary-background`, dot visible in `--button-primary-text` |
| Focus visible | `peer-focus-visible` | Inset ring `--focus-ring-primary` (error: `--focus-ring-error`) |
| Error | `error` or `errorMessage` | Ring `--field-border-error`; selected fill `--field-border-error` with the dot in `--button-destructive-text` |
| Helper message | `helperText` | `--text-secondary`, `text-xs`, indented to the label |
| Error message | `errorMessage` | `error-700` / `dark:error-400` with the AlertCircle icon; replaces the helper line |
| Disabled | `disabled` | Box `opacity-50` and label `opacity-50` (stacked), `cursor-not-allowed` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Group (fieldset + legend, uncontrolled) | Yes | Yes | `Radio group` |
| Selected | Yes | Yes | First option in `Radio group` |
| Error | Yes | Yes | `Error` |
| Disabled | Yes | Yes | `Disabled` |
| Helper text / error message | Yes | Yes | `Helper and error text` |
| sm / md / lg | Yes | Controls only | No all-sizes story |
| Selected + error | Yes | No | |
| Controlled (`checked`) | Yes | No | |

Interactive controls: `size`, `error`, `disabled` via args (they do not apply to the `Radio group` render story).

**Coverage:** 71% (5/7)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None. (The selected-error dot now uses `--button-destructive-text`.)

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `radio`; the visual box is `aria-hidden`. Grouping comes from a shared `name`; wrap groups in `<fieldset>` + `<legend>` for a group label.
- Required labels: `label` or `aria-label` per radio, plus a legend for the group.
- Keyboard: native. Tab enters the group at the selected radio; arrow keys move and select within the group.
- Focus: 2px inset ring on the plate when the native input is focus-visible.
- Touch target minimum: 44x44px at every size via the `::before` hit area inside the label.
- Description: `helperText` / `errorMessage` are tied to the input with `aria-describedby`, and `errorMessage` also sets `aria-invalid`.
- Color independence: selection shows a square dot, not just fill. An `errorMessage` adds the AlertCircle icon and text, so the error state is never color alone; bare `error` still is, so pair it with text.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do give every radio in a group the same `name` and a distinct `value`.
- Do wrap the group in a `<fieldset>` with a `<legend>` stating the question.
- Do preselect a sensible default when one exists.
- Don't use a single Radio on its own; a lone option cannot be deselected. Use `Checkbox`.
- Don't use Radio for more than about five options; use `Select`.
- Don't rely on `onCheckedChange(false)`: it never fires, because deselection happens natively on the other radio.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Box sizes and hit areas match `Checkbox`, so the two align in mixed forms.
- Stack vertically (`flex flex-col gap-2` as in the story); horizontal groups need enough gap that the 44px hit areas do not overlap.
- For a per-option message use `helperText` / `errorMessage`. For a group-level error, render the message yourself under the fieldset (there is still no RadioGroup) and set `error` on each radio.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Circle (`rounded-full`) broke the sharp-corner shape language | Plate ring recipe (stepped --plate-round), inset focus ring, square checked dot | Resolved |
| 2026-09-21 | 16px small circle below the 44px target; unlabeled radios ignored mouse clicks | 44px pseudo-element hit area at every size; control always wrapped in a label | Resolved |
| 2026-09-22 | No `helperText` / `errorMessage` (unlike Checkbox) and no RadioGroup wrapper, so group errors are color only unless the consumer adds text; `label`, `error` and `onCheckedChange` lack JSDoc | Added `helperText` / `errorMessage` through `lib/field.tsx` (same plumbing as Checkbox) and JSDoc on every public prop | Resolved |
| 2026-09-22 | Still no RadioGroup wrapper: a group-level error has to be rendered by the consumer under the fieldset | None yet | Open |
| 2026-09-22 | The selected-error dot was a hardcoded `bg-white` | Replaced with `--button-destructive-text` | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | fix | Radio uses the plate silhouette and a square dot |
| Unreleased | 2026-09-21 | fix | 44px hit area, unlabeled click fix |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | feat | `helperText` / `errorMessage` under the label (wired through `aria-describedby`), JSDoc on `label`, `error` and `onCheckedChange`, selected-error dot tokenized, and `onCheckedChange` now reads `event.currentTarget.checked`. The wrapper is `flex flex-col gap-1` so the message can sit under the label |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Radio.tsx`
