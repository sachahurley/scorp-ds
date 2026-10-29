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
| Last updated | 2026-10-29 |
| API hash | `75bde1cc62ee1974` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Input is the single-line text field for short free-form values: names, emails, search terms, codes. It wraps a native `<input>` in the plate ring recipe and can render its own label, helper text, and validation message so every field announces itself the same way. Use the `quiet` variant for inline fields that should not look like a form box (passphrases, rename-in-place). For multi-line text use `Textarea`; for a fixed set of choices use `Select`, `Radio`, or `Checkbox`; for a numeric range use `Slider`.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Optional `<label>` (rendered only when `label` is set), the control, and an optional `FieldMessage` line. In the `box` variant the control is a ring wrapper (`plate-round p-px`, background = border color) holding the `<input>` (fill clipped 1px inset). When there is no label and no message, only the control is returned (no outer wrapper).

With `trailingAction`, the control gains a `relative w-full` container holding the ring wrapper (or the quiet input) and, after it, the action:

```
div.relative.w-full
├── ring wrapper (plate-round p-px) > input (pr-8 / pr-10 / pr-12)
└── button[type=button] (absolute right-px top-px, quiet right-0 top-0; size-control-{size})
    ├── ::before  44px hit area, centered, transparent
    ├── icon      TuiIcon 16 / 20 / 24px, aria-hidden
    └── ::after   inset-0, clip-path plate-round (box only), the focus ring
```

- **Box:** a square at the control height (32 / 40 / 48px), the same box as an icon-only `Button` of that size, placed 1px in from the top and right: exactly over the input's right end, inside the 1px ring (the field is 2px taller than the control height). The ring stays whole around it, and its plate-clipped focus ring follows the input's own stepped corners.
- **Quiet:** the same square at `top-0 right-0`, over the underline; the focus ring is square, as quiet has no plate.
- **Why a sibling, not a child of the ring wrapper:** the wrapper is clipped to the plate, and a clip-path also clips hit-testing, so the 44px `::before` would be trimmed to the field height on `sm` and `md`.
- **Padding:** the input's right padding equals the action's width (`pr-8`, `pr-10`, `pr-12`; `!pr-*` on quiet, which strips horizontal padding with `!px-0`), so text stops where the button starts.
- **Icon:** a TuiIcon name renders at `4` / `5` / `6` (16 / 20 / 24px), the sizes Button uses for its icons; an element is rendered as given.

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

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | No | Field height, matching Button. |
| `variant` | `"box" \| "quiet"` | `"box"` | No | Plate field or underline field. |
| `label` | `ReactNode` | none | No | Visible label, associated via `htmlFor`/`id` (an id is generated if you do not pass one). Use this or `aria-label`. |
| `helperText` | `ReactNode` | none | No | Hint under the field, linked via `aria-describedby`. Hidden while `errorMessage` is set. |
| `errorMessage` | `ReactNode` | none | No | Validation message under the field. Sets the error styling and `aria-invalid`, replaces `helperText`, and leads with the AlertCircle icon. |
| `error` | `boolean` | `false` | No | Error styling and `aria-invalid` without a message. Prefer `errorMessage`. |
| `trailingAction` | `InputTrailingAction` | none | No | One icon button inside the end of the field (password reveal, clear, copy). See the table below. |
| `disabled` | `boolean` | `false` | No | Native disabled; the input dims to 50% with a `not-allowed` cursor. Disables the trailing action too. |
| `id` | `string` | generated when `label` is set | No | Id for the `<input>`. |
| `aria-describedby` | `string` | none | No | Merged in front of the message id. |
| `className` | `string` | `""` | No | Applied to the `<input>` element (not the ring wrapper). |
| `ref` | `Ref<HTMLInputElement>` | none | No | Forwarded to the `<input>`. |
| `...rest` | native `<input>` attributes (except `size`) | | No | `type`, `value`, `onChange`, `placeholder`, `name`, `required`, and so on. |

`InputTrailingAction` (exported as a type):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `icon` | `IconSlot` | Yes | A TuiIcon name (`"Eye"`) or an element. A name is sized to the field: 16px at `sm`, 20px at `md`, 24px at `lg`. Swap it with state for a toggle (`"Eye"` / `"EyeOff"`). |
| `label` | `string` | Yes | The button's accessible name (`aria-label`). Name the action ("Show password", "Clear search"). Keep it fixed for a toggle; the state goes on `pressed`. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | Yes | Called on click, Enter or Space. |
| `pressed` | `boolean` | No | Makes the action a toggle: sets `aria-pressed`. Leave undefined for a one-shot action, which then carries no `aria-pressed`. |

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
| `--field-border-focus` | Color | light `#FBBF24`, dark `#E0A26A` | Focus ring (`focus-within`) / underline; the whole focus indicator |
| `--field-border-error` | Color | light `#DC2626`, dark `#EF4444` | Error ring / underline |
| `--field-placeholder` | Color | light `#695F4D`, dark `#BFB4A3` | Placeholder text (6.28:1 on the white field, 9.45:1 on the dark field) |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Value text |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Helper text (via FieldMessage) |
| `secondary-800` / `dark:secondary-200` | Color | `#474030` / `#F7F5F2` | Label text |
| `error-700` / `dark:error-400` | Color | `#B91C1C` / `#F87171` | Error message (via FieldMessage) |
| `--control-height-sm/md/lg` | Size | `32px` / `40px` / `48px` | Field height |
| `--plate-round` | Shape | stepped 6px corner polygon | Ring wrapper and input clip (box variant) |
| `--duration-fast` | Motion | `120ms` | Ring color transition; trailing action icon color transition |
| `--text-secondary` / `--text-primary` | Color | see above | Trailing action icon at rest / on hover (the color Select and Combobox use for their chevron) |
| `--focus-ring-width` / `--focus-ring-primary` | Focus | `2px` / light and dark `#FBBF24` | Trailing action's inset focus ring |
| `--touch-target` | Size | `44px` | Trailing action hit area (`before:w-touch before:h-touch`) |
| `text-sm` / `text-xs` | Typography | `14px` / `12px` | Value and label / message |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Idle | default | Ring `--field-border`, fill `--field-background` |
| Hover | `:hover` on the wrapper | Ring `--field-border-hover` |
| Focus | `:focus-within` on the wrapper (quiet: `:focus` on the input) | Ring / underline `--field-border-focus`. A colour change only: no inset ring, the border stays 1px |
| Error | `error` or `errorMessage` | Ring/underline `--field-border-error`, fill `--field-background-error` (box); hover does not apply, focus wins and turns the ring `--field-border-focus` |
| Disabled | `disabled` | The whole field dims: `opacity-50` on the ring wrapper (so the border dims with the fill) plus `cursor-not-allowed` |
| Helper text | `helperText` | FieldMessage in `--text-secondary` |
| Error message | `errorMessage` | FieldMessage in `error-700` / `error-400` with AlertCircle icon |
| Quiet | `variant="quiet"` | Transparent background, `border-b` ramp, `rounded-none` |
| Trailing action, rest / hover | `trailingAction` | Icon `--text-secondary`, `--text-primary` on hover; no fill, so it sits on the field's fill (error fill included) |
| Trailing action, focus | `:focus-visible` on the button | 2px inset ring in `--focus-ring-primary` on `::after`, clipped to the plate (square on quiet). The field ring returns to idle, since focus has left the input |
| Trailing action, pressed | `pressed: true` | `aria-pressed="true"`; no visual of its own, the caller swaps the icon |
| Trailing action, disabled | `disabled` | Native disabled on the button, `opacity-50`, `cursor-not-allowed`, no hover color |

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
| Focus | Yes | Yes | `Focus` (play function, Tab) |
| Trailing action, sm / md / lg, quiet, disabled | Yes | Yes | `Trailing action` |
| Trailing action focus | Yes | Yes | `Trailing action: focus` (play function, Tab twice: input, then action) |
| Boolean `error` on box | Yes | Controls only | `Playground` toggle |
| Hover | Yes | Interactive only | |

Interactive controls: `Playground` with `label`, `size`, `error`, `helperText`, `errorMessage`, `disabled`, `placeholder` (no `variant` or `trailingAction` control).

**Coverage:** 100% (11/11, hover interactive only)

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

- `renderIconSlot` (`packages/components/src/lib/icon-slot.tsx`) for the trailing action's icon.

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
- Focus order: native. Focus shows as the 1px ring (or quiet underline) changing to `--field-border-focus`, the same indicator Select and Combobox use, plus the text caret. Fields deliberately do not draw the 2px inset ring Button, Checkbox and ListRow use (`docs/decisions/0022`). Focus wins over error, so an errored field still visibly changes; the error stays carried by the fill and the message.
- Placeholder contrast: `--field-placeholder` is 6.28:1 on the light field and 9.45:1 on the dark field, clearing AA. Placeholders must still never carry essential information: they disappear on input, so the field name belongs in `label` and format hints in `helperText`.
- Touch target minimum: `lg` (48px) meets 44px; `sm` and `md` rely on full-width fields for an adequate tap area.
- Color independence: error messages lead with the AlertCircle icon and text, so error does not depend on the red ring alone. The boolean `error` flag without a message is color only.
- Trailing action: a native `<button type="button">` (so it never submits the form), named by `label` through `aria-label`; the icon is `aria-hidden`. `label` is required by the type, so an unnamed action is a compile error (`docs/decisions/0029`). With `pressed` defined it is a toggle button with `aria-pressed`; keep `label` fixed and let `aria-pressed` carry the state ("Show password, toggle button, pressed"), rather than swapping the label, which would announce a different control each time.
- Trailing action keyboard: it follows the input in the tab order (Tab from the field reaches it, Shift+Tab returns). Enter and Space activate it, as on any button. Enter in the field still submits the form, because the action is not a submit button.
- Trailing action focus: the system's 2px inset ring in `--focus-ring-primary` (`docs/decisions/0002`), clipped to the plate. The action is a button, not a text field, so the colour-change rule for fields (`0022`) does not apply to it.
- Trailing action touch target: a 44px `::before` centered on the button at every size; at `lg` the 48px button already exceeds it. On `sm` and `md` the hit area reaches a few pixels past the field's top and bottom and into the text area to its left, so a tap there hits the action rather than placing the caret.

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
- Do use `trailingAction` for a control that acts on the field's own value: reveal a password, clear a search, copy a key.
- Do keep a toggle's `label` fixed ("Show password") and pass `pressed`; swap the icon (`Eye` / `EyeOff`), not the name.
- Don't hand-place a `<button>` over an Input with absolute positioning and your own `pr-*`: it misses the hit area, the focus ring and the per-size offsets.
- Don't use `trailingAction` for an action that belongs to the form (submit, next step); put a `Button` beside the field instead.
- Don't use it for a decorative icon: it always renders a button. A non-interactive trailing icon is not supported yet.

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
| 2026-09-22 | Focus is shown only as a 1px ring color change (no 2px inset ring like Button/Checkbox); in the error state focus has no visible change at all | The field draws the system's 2px inset focus ring (`--focus-ring-primary`, `--focus-ring-error` in the error state); the quiet variant gets a 2px inset bottom ring | Resolved |
| 2026-10-28 | The 2px inset ring on top of the 1px accent border read as a 3px border, so a focused field looked bigger and heavier than Select and Combobox | Focus is a colour change only (`docs/decisions/0022`); focus wins over error so the error state still shows it | Resolved |
| 2026-09-22 | Disabled dimmed only the inner field, leaving a full-strength ring wrapper | `opacity-50` moved to the ring wrapper, so the border and fill dim together | Resolved |
| 2026-09-22 | `--field-placeholder` was sepia-500, about 2:1 on the white field | Light placeholder is now sepia-700 at 6.28:1; the rule that placeholders never carry essential information is documented in the component header and this spec | Resolved |
| 2026-10-29 | No slot for a control inside the field, so AuthCard hand-placed its password toggle (20px hit area, no focus ring, offsets that only fit `md`) | `trailingAction`: a real button at every size and on quiet, 44px hit area, inset focus ring, input padded clear | Resolved |

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
| Unreleased | 2026-10-28 | fix | Focus is a colour change only: the 2px inset ring and the quiet underline thickening are gone; focus wins over error |
| Unreleased | 2026-10-29 | change | Decision 0031 removed the deprecated `small \| medium \| large` size names and their dev warning; `size` takes `sm \| md \| lg` only. Rendering unchanged |
| Unreleased | 2026-10-29 | feat | `trailingAction` (`InputTrailingAction`, exported): one icon button inside the end of the field, with `aria-pressed` for toggles, a 44px hit area and the inset focus ring. Additive; a field without it renders as before. The `variant` JSDoc loses an em dash |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Input.tsx`
