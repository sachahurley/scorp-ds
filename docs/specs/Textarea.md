# Textarea

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Textarea` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Textarea.tsx` |
| Story | `Components/Inputs/Textarea` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Textarea is the multi-line text field for longer free-form input: notes, feedback, descriptions. It shares Input's plate ring recipe, label, helper text, and error message behavior, and grows vertically (user-resizable) from a minimum height that matches the Input size. Use `Input` for single-line values; use Textarea whenever the answer may wrap or contain line breaks.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Optional `<label>`, a ring wrapper (`plate-round p-px`, background = border color) holding the `<textarea>` (fill clipped 1px inset, `resize-y`), and an optional `FieldMessage`. Without a label or message only the ring wrapper is returned.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single plate style. There is no `quiet` variant (unlike Input). |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | min-height 32px (`min-h-control-sm`), `px-3 py-1.5` |
| `md` (default) | min-height 40px (`min-h-control-md`), `px-4 py-2.5` |
| `lg` | min-height 48px (`min-h-control-lg`), `px-5 py-3.5` |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Actual height is usually driven by the native `rows` attribute; the size sets the floor and padding.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Minimum height and padding, matching Input. Legacy names are deprecated. |
| `label` | `ReactNode` | none | No | Visible label, associated via `htmlFor`/`id` (id generated when not passed). |
| `helperText` | `ReactNode` | none | No | Hint under the field (length, format), linked via `aria-describedby`. Hidden while `errorMessage` is set. |
| `errorMessage` | `ReactNode` | none | No | Validation message. Sets error styling and `aria-invalid`, replaces `helperText`, leads with the AlertCircle icon. |
| `error` | `boolean` | `false` | No | Error styling and `aria-invalid` without a message. Prefer `errorMessage`. |
| `disabled` | `boolean` | `false` | No | Native disabled; the textarea dims to 50%. |
| `id` | `string` | generated when `label` is set | No | Id for the `<textarea>`. |
| `aria-describedby` | `string` | none | No | Merged in front of the message id. |
| `className` | `string` | `""` | No | Applied to the `<textarea>` (not the wrapper). |
| `ref` | `Ref<HTMLTextAreaElement>` | none | No | Forwarded to the `<textarea>`. |
| `...rest` | native `<textarea>` attributes | | No | `rows`, `value`, `onChange`, `placeholder`, `maxLength`, `name`, and so on. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--field-background` | Color | light `#FFFFFF`, dark `#120D09` | Fill |
| `--field-background-error` | Color | light `#FEF2F2`, dark `#450A0A` | Fill in error |
| `--field-border` | Color | light `#968A75`, dark `#474030` | Idle ring |
| `--field-border-hover` | Color | light `#695F4D`, dark `#968A75` | Hover ring |
| `--field-border-focus` | Color | light `#FBBF24`, dark `#E0A26A` | Focus ring (`focus-within`) |
| `--field-border-error` | Color | light `#DC2626`, dark `#EF4444` | Error ring |
| `--field-placeholder` | Color | light `#695F4D`, dark `#BFB4A3` | Placeholder (6.28:1 on the white field, 9.45:1 on the dark field) |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Value text |
| `secondary-800` / `dark:secondary-200` | Color | `#474030` / `#F7F5F2` | Label |
| `--text-secondary`, `error-700` / `dark:error-400` | Color | see FieldMessage | Helper and error message |
| `--control-height-sm/md/lg` | Size | `32px` / `40px` / `48px` | Minimum height |
| `--plate-round` | Shape | stepped 6px corner polygon | Wrapper and textarea clip |
| `--focus-ring-primary` / `--focus-ring-error` | Color | `#FBBF24` / light `#DC2626`, dark `#EF4444` | Inset focus ring on the field |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `--duration-fast` | Motion | `120ms` | Ring color transition |
| `text-sm` | Typography | `14px` | Value and label |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Idle | default | Ring `--field-border`, fill `--field-background` |
| Hover | `:hover` on wrapper | Ring `--field-border-hover` |
| Focus | `:focus-within` on the wrapper plus `:focus-visible` on the textarea | Ring `--field-border-focus` and a 2px inset `--focus-ring-primary` ring inside the plate |
| Error | `error` or `errorMessage` | Ring `--field-border-error`, fill `--field-background-error`; focus still draws the 2px inset ring in `--focus-ring-error` |
| Disabled | `disabled` | The whole field dims: `opacity-50` on the ring wrapper plus `cursor-not-allowed` |
| Helper / error message | `helperText` / `errorMessage` | FieldMessage (error adds AlertCircle icon) |
| Resize | native | `resize-y` only (no horizontal resize) |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default with label | Yes | Yes | `Default` (rows 4) |
| Error message | Yes | Yes | `Error` (helper text is also passed, showing that the error replaces it) |
| Disabled | Yes | Yes | `Disabled` |
| sm / md / lg | Yes | Yes | `All sizes` |
| Helper text on its own | Yes | No | Only visible via the `helperText` control |
| Boolean `error` | Yes | Controls only | |
| Hover / focus | Yes | Interactive only | |

Interactive controls: `size`, `error`, `helperText`, `errorMessage`, `disabled` via autodocs args (no dedicated `Playground` story; `label` has no control).

**Coverage:** 80% (4/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None in `Textarea.tsx`. The shared `FieldMessage` uses `h-[1lh]`.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `FieldMessage` / `useFieldMessage` (`packages/components/src/lib/field.tsx`, internal), rendering `TuiIcon` `AlertCircle` for errors.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `textbox` (multi-line).
- Required labels: `label` or `aria-label` / `aria-labelledby`; no dev warning when missing.
- Description: helper or error text via `aria-describedby` (consumer ids kept first); `aria-invalid="true"` in error.
- Focus order: native. Focus shows as the ring changing to `--field-border-focus` plus the system's 2px inset `--focus-ring-primary` ring inside the plate, matching Input. In the error state the inset ring is drawn in `--focus-ring-error`, so focus is visible in every state.
- Placeholder contrast: `--field-placeholder` is 6.28:1 on the light field and 9.45:1 on the dark field, clearing AA. Placeholders must still never carry essential information: they disappear on input, so the field name belongs in `label` and format hints in `helperText`.
- Touch target minimum: height comes from `rows`; at default rows the area exceeds 44px.
- Color independence: error messages carry the AlertCircle icon and text; the boolean `error` flag alone is color only.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do set `rows` to the expected answer length so users see how much you are asking for.
- Do state length limits in `helperText` when you pass `maxLength`.
- Do pair a visible `label` with every textarea.
- Don't use Textarea for single-line values; use `Input`.
- Don't disable resizing with custom CSS unless the layout truly cannot grow.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Shares Input's ring recipe, label style and FieldMessage, so the two stack cleanly in one form.
- The wrapper is `w-full`; set width on the parent. `className` targets the `<textarea>` itself.
- Place submit actions (`Button`) below the textarea, aligned with the form's action row.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | `error` was boolean only; no helper or error text, no aria-invalid | Added `helperText` and `errorMessage`, wired via aria-describedby; aria-invalid set when in error | Resolved |
| 2026-09-22 | Focus is a 1px ring color change only (no 2px inset ring); no visible focus change in the error state | The field draws the system's 2px inset focus ring (`--focus-ring-primary`, `--focus-ring-error` in the error state) | Resolved |
| 2026-09-22 | Disabled dimmed only the inner field, leaving a full-strength ring wrapper | `opacity-50` moved to the ring wrapper, so the border and fill dim together | Resolved |
| 2026-09-22 | `--field-placeholder` was sepia-500, about 2:1 on the white field | Light placeholder is now sepia-700 at 6.28:1; the rule that placeholders never carry essential information is documented in the component header and this spec | Resolved |

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
| Unreleased | 2026-09-22 | fix | 2px inset focus ring in every state (error included), disabled dims the ring wrapper, and `--field-placeholder` raised to 6.28:1 in light |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Textarea.tsx`
