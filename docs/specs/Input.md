# Input

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Input` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Input.tsx` |
| Story | `Components/Inputs/Input` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Input is the single-line text field for short free-form values: names, emails, search terms, codes. It wraps a native `<input>` in the plate ring recipe and can render its own label, helper text, and validation message so every field announces itself the same way. Use the `quiet` variant for inline fields that should not look like a form box (passphrases, rename-in-place). For multi-line text use `Textarea`; for a fixed set of choices use `Select`, `Radio`, or `Checkbox`; for a numeric range use `Slider`.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Optional `<label>` (rendered only when `label` is set), the control, and an optional `FieldMessage` line. In the `box` variant the control is a ring wrapper (`plate-round p-px`, background = border color) holding the `<input>` (fill clipped 1px inset). When there is no label and no message, only the control is returned (no outer wrapper).

### Variants

| Enum Value | Description |
|-----------|-------------|
| `box` (default) | Plate field: ring wrapper in `--field-border*`, input filled with `--field-background`. |
| `quiet` | Underline recipe: transparent, no plate or wrapper, a 1px bottom border walks the same ramp; horizontal padding removed. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 32px (`h-control-sm`), `px-3 py-1.5` |
| `md` (default) | 40px (`h-control-md`), `px-4 py-2.5` |
| `lg` | 48px (`h-control-lg`), `px-5 py-3.5` |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Field height, matching Button. Legacy names are deprecated. |
| `variant` | `"box" \| "quiet"` | `"box"` | No | Plate field or underline field. |
| `label` | `ReactNode` | none | No | Visible label, associated via `htmlFor`/`id` (an id is generated if you do not pass one). Use this or `aria-label`. |
| `helperText` | `ReactNode` | none | No | Hint under the field, linked via `aria-describedby`. Hidden while `errorMessage` is set. |
| `errorMessage` | `ReactNode` | none | No | Validation message under the field. Sets the error styling and `aria-invalid`, replaces `helperText`, and leads with the AlertCircle icon. |
| `error` | `boolean` | `false` | No | Error styling and `aria-invalid` without a message. Prefer `errorMessage`. |
| `disabled` | `boolean` | `false` | No | Native disabled; the input dims to 50% with a `not-allowed` cursor. |
| `id` | `string` | generated when `label` is set | No | Id for the `<input>`. |
| `aria-describedby` | `string` | none | No | Merged in front of the message id. |
| `className` | `string` | `""` | No | Applied to the `<input>` element (not the ring wrapper). |
| `ref` | `Ref<HTMLInputElement>` | none | No | Forwarded to the `<input>`. |
| `...rest` | native `<input>` attributes (except `size`) | | No | `type`, `value`, `onChange`, `placeholder`, `name`, `required`, and so on. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--field-background` | Color | light `#FFFFFF`, dark `#120D09` | Box fill |
| `--field-background-error` | Color | light `#FEF2F2`, dark `#450A0A` | Box fill in error |
| `--field-border` | Color | light `#968A75`, dark `#474030` | Idle ring / underline |
| `--field-border-hover` | Color | light `#695F4D`, dark `#968A75` | Hover ring / underline |
| `--field-border-focus` | Color | light `#FBBF24`, dark `#E0A26A` | Focus ring (`focus-within`) / underline |
| `--field-border-error` | Color | light `#DC2626`, dark `#EF4444` | Error ring / underline |
| `--field-placeholder` | Color | `#BFB4A3` | Placeholder text |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Value text |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Helper text (via FieldMessage) |
| `secondary-800` / `dark:secondary-200` | Color | `#474030` / `#F7F5F2` | Label text |
| `error-700` / `dark:error-400` | Color | `#B91C1C` / `#F87171` | Error message (via FieldMessage) |
| `--control-height-sm/md/lg` | Size | `32px` / `40px` / `48px` | Field height |
| `--plate-round` | Shape | stepped 6px corner polygon | Ring wrapper and input clip (box variant) |
| `--duration-fast` | Motion | `120ms` | Ring color transition |
| `text-sm` / `text-xs` | Typography | `14px` / `12px` | Value and label / message |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Idle | default | Ring `--field-border`, fill `--field-background` |
| Hover | `:hover` on the wrapper | Ring `--field-border-hover` |
| Focus | `:focus-within` on the wrapper (box), `:focus` (quiet) | Ring or underline `--field-border-focus`; no outline |
| Error | `error` or `errorMessage` | Ring/underline `--field-border-error`, fill `--field-background-error` (box); hover and focus colors do not apply |
| Disabled | `disabled` | Input `opacity-50`, `cursor-not-allowed`; the ring wrapper is not dimmed |
| Helper text | `helperText` | FieldMessage in `--text-secondary` |
| Error message | `errorMessage` | FieldMessage in `error-700` / `error-400` with AlertCircle icon |
| Quiet | `variant="quiet"` | Transparent background, `border-b` ramp, `rounded-none` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default with label | Yes | Yes | `Default` |
| With value | Yes | Yes | `WithValue` |
| Helper text | Yes | Yes | `Helper text` |
| Error message | Yes | Yes | `Error` |
| Disabled | Yes | Yes | `Disabled` |
| sm / md / lg | Yes | Yes | `All sizes` |
| Quiet variant (incl. error) | Yes | Yes | `Quiet` |
| Boolean `error` on box | Yes | Controls only | `Playground` toggle |
| Hover / focus | Yes | Interactive only | |

Interactive controls: `Playground` with `label`, `size`, `error`, `helperText`, `errorMessage`, `disabled`, `placeholder` (no `variant` control).

**Coverage:** 100% (8/8, hover and focus interactive only)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None in `Input.tsx`. The shared `FieldMessage` uses `h-[1lh]` (one line-height box to align the icon).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `FieldMessage` and `useFieldMessage` (`packages/components/src/lib/field.tsx`, internal), which render `TuiIcon` (`AlertCircle`, size 3) for errors.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css` (field, text, control-height, plate, duration tokens)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `textbox` (or whatever `type` implies).
- Required labels: `label` or `aria-label` / `aria-labelledby`. There is no dev warning when both are missing.
- Description: helper or error text is linked via `aria-describedby`; a consumer `aria-describedby` is kept and placed first.
- Invalid: `aria-invalid="true"` whenever `error` or `errorMessage` is set.
- Focus order: native. Focus shows as the ring (or underline) changing to `--field-border-focus`.
- Touch target minimum: `lg` (48px) meets 44px; `sm` and `md` rely on full-width fields for an adequate tap area.
- Color independence: error messages lead with the AlertCircle icon and text, so error does not depend on the red ring alone. The boolean `error` flag without a message is color only.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do give every field a visible `label` unless the context makes it obvious; then use `aria-label`.
- Do use `errorMessage` that says how to fix the problem ("Enter a full email address, like you@example.com.").
- Do use `helperText` for format hints instead of relying on the placeholder.
- Don't use the placeholder as the label; it disappears on input and is low contrast.
- Don't set `error` without a message on its own: color is the only signal then.
- Don't put `className` layout rules expecting to hit the wrapper; it targets the `<input>`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Heights match `Button`, `Select` and the `Dropdown` trigger at the same size, so fields and actions align in a row.
- Input is `w-full`; constrain width with the parent.
- In stacked forms, space fields with the parent (the component only adds `space-y-1` between its own label, field, and message).
- Use `quiet` only for inline, single-field contexts; keep `box` for forms so fields read as a group.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | `error` was boolean only; no helper or error text, no aria-invalid | Added `helperText` and `errorMessage`, wired via aria-describedby; aria-invalid set when in error | Resolved |
| 2026-09-22 | Focus is shown only as a 1px ring color change (no 2px inset ring like Button/Checkbox); in the error state focus has no visible change at all | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | feat | Error message leads with the 1-bit AlertCircle icon (was `[er]`), centered on the first line |
| Unreleased | 2026-09-21 | fix | Added `helperText`, `errorMessage`, aria-invalid |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Input.tsx`
