# Select

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Select` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Select.tsx` |
| Story | `Components/Inputs/Select` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `7e7b8030cd2a66d2` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Select picks one value from a list of options inside a form. It takes native `<option>` children like a `<select>`, renders a custom plate trigger and listbox menu styled to match `Dropdown`, and keeps a hidden native `<select>` in sync so the value submits with the form. Use it when there are more options than fit comfortably as `Radio` buttons (roughly five or more) or space is tight. For a menu of actions rather than a value, use `Dropdown`; for two to four visible choices, use `Radio`.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Outer `w-full` wrapper (receives `className`), optional `<label>` (targets the trigger button), then: a hidden native `<select>` (`sr-only`, `aria-hidden`, `tabIndex=-1`), a ring wrapper (`plate-round p-px`) around the trigger `<button>` (selected label or "Select..." plus a `ChevronDown` icon that rotates 180 degrees when open), the open menu (ring layer in `--border-default` around a `role="listbox"` panel on `--surface-card`, `max-h-80` / 320px with scrolling), and an optional `FieldMessage`. Each option is a `<button type="button" role="option">` with a stable id, so the trigger can point `aria-activedescendant` at the highlighted one; the selected option shows a `Check` icon. Options that came from an `<optgroup>` are wrapped in a `role="group"` with a quiet heading row carrying the group label.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single style. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | Trigger 32px (`h-control-sm`), `px-4 py-1.5`, 16px icon box |
| `md` (default) | Trigger 40px (`h-control-md`), `px-4 py-2.5`, 20px icon box |
| `lg` | Trigger 48px (`h-control-lg`), `px-4 py-3.5`, 24px icon box |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Menu options are the same at every size: `px-4 py-3`, `text-sm` (44px rows). Group headings are `px-4 py-2`, `text-xs`, uppercase, in `--text-secondary`.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `<option>` / `<optgroup>` elements | none | Yes | Options, read from each child's `value`, text `children` and `disabled`. Children are flattened, so arrays, fragments and a static option mixed with a mapped list all work; `<optgroup>` children are read with the group's `label` and `disabled` inherited. An option with no `value` submits its text, as in a native select. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Trigger height. Legacy names are deprecated. |
| `label` | `ReactNode` | none | No | Visible label, associated with the trigger button via `htmlFor`/`id`. Preferred over `aria-label`. |
| `aria-label` | `string` | `"Select an option"` when there is no `label` | No | Accessible name for the trigger when no visible label is set. |
| `value` | `string \| number \| readonly string[]` | none | No | Controlled value (stringified). When set, selection does not change until the parent updates `value`. |
| `defaultValue` | `string \| number \| readonly string[]` | first option's value | No | Uncontrolled initial value. |
| `onChange` | `(event: ChangeEvent<HTMLSelectElement>) => void` | none | No | Called on selection with a synthetic event: only `target.value`, `target.name`, `currentTarget.value`, `currentTarget.name` are populated. |
| `name` | `string` | none | No | Name of the hidden native select, for form submission. |
| `helperText` | `ReactNode` | none | No | Hint under the trigger via `aria-describedby`; hidden while `errorMessage` is set. |
| `errorMessage` | `ReactNode` | none | No | Validation message; sets error styling and `aria-invalid` on the trigger and leads with AlertCircle. |
| `error` | `boolean` | `false` | No | Error styling without a message. Prefer `errorMessage`. |
| `disabled` | `boolean` | `false` | No | Disables the trigger; the ring dims to 50%. |
| `id` | `string` | generated (`{useId}-trigger`) | No | Id for the trigger button (not the hidden select). |
| `aria-describedby` | `string` | none | No | Merged in front of the message id on the trigger. |
| `className` | `string` | `""` | No | Applied to the outer wrapper. |
| `ref` | `Ref<HTMLSelectElement>` | none | No | Points at the hidden native `<select>`. |
| `...rest` | native `<select>` attributes (except `size`) | | No | Spread onto the hidden native select (for example `required`, `form`). |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--field-background` / `--field-background-error` | Color | light `#FFFFFF` / `#FEF2F2`, dark `#120D09` / `#450A0A` | Trigger fill |
| `--field-border` / `-hover` / `-focus` / `-error` | Color | light `#968A75` / `#695F4D` / `#FBBF24` / `#DC2626`, dark `#474030` / `#968A75` / `#E0A26A` / `#EF4444` | Trigger ring ramp |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Trigger and option text |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Chevron icon, helper text |
| `--border-default` | Color | light `#F0EBE4`, dark `#695F4D` | Menu ring |
| `--surface-card` | Color | light `#FFFFFF`, dark `#120D09` | Menu fill |
| `--surface-muted` | Color | light `#F7F5F2`, dark `#221E13` | Option hover and keyboard highlight (light `--surface-subtle` was 1.02:1 against the card fill, this is 1.09:1) |
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Keyboard-highlighted option text: 4.6:1 on the light highlight, 7.6:1 on the dark one, so the highlight is legible where the fill difference alone is quiet |
| `--z-index-dropdown` | Layer | `1000` | Menu stacking |
| `--border-focus` | Color | `#FBBF24` | Selected-option check icon |
| `secondary-800` / `dark:secondary-200` | Color | `#474030` / `#F7F5F2` | Label |
| `--control-height-sm/md/lg` | Size | `32px` / `40px` / `48px` | Trigger height |
| `--plate-round` | Shape | stepped 6px corner polygon | Trigger ring, trigger, menu ring, menu |
| `--duration-fast` | Motion | `120ms` | Color transitions |
| `--duration-normal` | Motion | `200ms` | Chevron rotation, menu enter animation |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Idle | default | Ring `--field-border`, fill `--field-background` |
| Hover | `:hover` on ring wrapper | Ring `--field-border-hover` |
| Focus | `:focus-within` on ring wrapper | Ring `--field-border-focus` |
| Open | internal `isOpen` | Menu rendered (`fade-in slide-in-from-top-2`), chevron `rotate-180`, `aria-expanded="true"` |
| Option hover | `:hover` | Option background `--surface-muted` |
| Option highlighted | arrow keys | `--surface-muted` fill plus `--accent` text, and `aria-activedescendant` on the trigger names the option |
| Option selected | current value | `aria-selected="true"`, Check icon in `--border-focus` |
| Option disabled | `<option disabled>` | `opacity-50`, skipped by arrow keys |
| Error | `error` or `errorMessage` | Ring `--field-border-error`, fill `--field-background-error` |
| Disabled | `disabled` | Ring wrapper `opacity-50`, chevron also `opacity-50`, `cursor-not-allowed`, cannot open |
| Grouped options | `<optgroup>` children | `role="group"` wrapper with an `--text-secondary` heading row |
| Closed by Tab | `Tab` while open | Menu unmounts, focus moves on normally |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default with label | Yes | Yes | `Default` |
| Error message | Yes | Yes | `Error` |
| Disabled | Yes | Yes | `Disabled` |
| aria-label only | Yes | Yes | `Aria label only` |
| sm / md / lg | Yes | Controls only | No all-sizes story |
| Helper text | Yes | Controls only | |
| Disabled option | Yes | Yes | `Option groups` |
| Option groups (`<optgroup>`) | Yes | Yes | `Option groups` |
| Open menu | Yes | Interactive only | |

Interactive controls: `size`, `error`, `helperText`, `errorMessage`, `disabled` via args on each story.

**Coverage:** 71% (5/7, open menu interactive only)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `min-w-52` (208px) on the menu and `max-h-80` (320px, about seven 44px rows) on the listbox: Tailwind spacing-scale utilities rather than arbitrary pixels; there are no menu width or height tokens.
- Menu layer is `z-[var(--z-index-dropdown)]`. The dropdown token (1000) is the right one, not popover (1050): the menu is absolutely positioned inside the field's own stacking context with no portal, so it only competes with siblings there, while the popover and modal layers own their own contexts.
- `mt-2` menu offset and `ml-2` chevron gap (Tailwind scale).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`ChevronDown` trigger arrow, `Check` selected marker)
- `FieldMessage` / `useFieldMessage` (`packages/components/src/lib/field.tsx`, internal)

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: trigger is a `type="button"` control with `aria-haspopup="listbox"`, `aria-expanded` and, while open, `aria-controls` pointing at the listbox; the menu is `role="listbox"` (labelled by the visible `label`, or by `aria-label`) with `role="option"` buttons carrying `aria-selected`. `<optgroup>` children become `role="group"` with a labelling heading. The native select is hidden from assistive tech. No control here submits a surrounding form.
- Required labels: `label` (associated with the trigger) or `aria-label`; falls back to the generic "Select an option".
- Description: helper or error text on the trigger via `aria-describedby`; `aria-invalid` in error.
- Keyboard: with focus in the component, Enter, Space, ArrowDown or ArrowUp opens and highlights the selected (or first enabled) option. While open: ArrowDown/ArrowUp move the highlight (wrapping, skipping disabled), Enter/Space select and close, Escape closes. Click outside closes.
- Focus management: focus stays on the trigger and `aria-activedescendant` names the highlighted option, so screen readers announce it while arrowing. Tab closes the menu and lets focus move on.
- Touch target minimum: options are 44px tall. The trigger is 32/40/48px; only `lg` meets 44px.
- Color independence: selection is marked with a Check icon, errors with the AlertCircle icon and text.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do always pass a visible `label` (or at least a specific `aria-label`); the fallback name is generic.
- Do pass `name` when the Select is inside a `<form>` so its value submits.
- Do add a first empty option ("Choose…") when no default makes sense, and validate with `errorMessage`.
- Don't use Select for actions; use `Dropdown`.
- Don't use Select for two or three choices that fit on screen; use `Radio`.
- Don't rely on `onChange` receiving a real DOM event: read only `event.target.value` and `event.target.name`.
- Do use `<optgroup label="...">` to group long option lists; groups render as labelled sections and a disabled group disables its options.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Heights match `Input` and `Button` at the same size; the menu styling matches `Dropdown`.
- The menu is absolutely positioned under the trigger with no portal or collision handling, so avoid placing Select inside containers with `overflow: hidden` or near the bottom of a scroll area.
- Select is `w-full`; set width on a parent (stories use `w-72`).

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | `error` was boolean only; no helper or error text | Added `helperText` and `errorMessage` on the trigger via aria-describedby and aria-invalid | Resolved |
| 2026-09-22 | Keyboard highlight is visual only (no `aria-activedescendant`, no `aria-controls`/labelled listbox) and `--surface-subtle` is nearly invisible against `--surface-card` in light mode | Option ids plus `aria-activedescendant` and `aria-controls` on the trigger, a labelled listbox, and the highlight moved to `--surface-muted` + `--accent` text | Resolved |
| 2026-09-22 | Options are only parsed from direct `<option>` children: `<optgroup>`, fragments, or a static option mixed with a mapped array are dropped | Children are flattened through `Children.forEach` with fragments unwrapped and `<optgroup>` read (label and `disabled` inherited); groups render as labelled `role="group"` sections | Resolved |
| 2026-09-22 | The hidden native `<select>` is still flat: it mirrors values, not `<optgroup>` structure. Submission is unaffected | None yet | Open |
| 2026-09-22 | The trigger is 32/40/48px tall, so only `lg` meets the 44px touch minimum | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | feat | Trigger arrow and selected-option check use 1-bit ChevronDown and Check icons |
| Unreleased | 2026-09-21 | fix | Added `helperText`, `errorMessage`, aria-invalid |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | `aria-activedescendant` / `aria-controls` and option ids, one raw-index keyboard model, Tab closes the menu, children flattened (fragments, arrays, `<optgroup>`), an option with no `value` falls back to its text, highlight moved to `--surface-muted` + `--accent`, menu uses `--z-index-dropdown`, `min-w-52` and `max-h-80`, stale "Unicode" comments removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Select.tsx`
