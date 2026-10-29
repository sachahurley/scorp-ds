# Fieldset

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Fieldset` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Fieldset.tsx` |
| Story | `Components/Inputs/Fieldset` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |
| API hash | `0bc76f6155d4b5ef` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Fieldset names a group of related controls: radios that answer one question, a set of checkboxes, or a titled group of settings inside a Card. It renders a native `<fieldset>` and `<legend>`, so a screen reader announces the group's name when focus enters it, and it gives the legend one of the two voices the composition rules allow (`composition-presets-guidelines.md`, "Form rules"), so forms stop hand-writing legend classes. It draws no frame: forms already sit in a Card or a page column. A `description`, a group-level `errorMessage`, native `disabled` and, for radios, `role="radiogroup"` with the invalid state on the group (decision 0029, `Radio.md`) come with it.

Don't use this for: a single control (use that control's own `label` instead), a framed group with a header and footer (use Card instead), a heading over content that is not a set of controls (use a heading element, or Divider with a `label`, instead), or spacing between groups of fields (use Stack instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A native `<fieldset>` (browser chrome reset: `m-0 min-w-0 border-0 p-0`) holding, in order:

1. `<legend>`: `block p-0 font-mono` plus the voice from `variant`. Its `id` is generated and is the fieldset's `aria-labelledby`.
2. Description (optional): the shared `FieldMessage` in its helper tone (`text-xs`, `--text-secondary`), under the legend.
3. A `div` (`flex flex-col`) holding the children, with `gap` between them: the same markup as `Stack`, written out because vendored consumers cannot resolve a component importing a primitive.
4. Error message (optional): the shared `FieldMessage` in its error tone (AlertCircle icon plus text), `mt-2` under the children.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `eyebrow` | Eyebrow legend: `text-xs uppercase tracking-wider`, `--text-primary`, `mb-3`. Titles a group inside a settings card (SettingsPanel). Default. |
| `field` | Field-label legend: `text-sm`, `secondary-800` / `secondary-200`, `mb-2`, the same as Input's label. Asks one question in a form (Forms). |

With a `description`, the legend's margin drops to `mb-1` and the description takes the voice's `mb-3` / `mb-2`, so the space above the controls does not change.

### Gap

`gap` (`FieldsetGap`) is the Stack scale, the same steps as `StackGap`: `none`, `1` 4px, `2` 8px (default), `3` 12px, `4` 16px, `5` 20px, `6` 24px, `8` 32px.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `legend` | `ReactNode` | | Yes | The group's name, rendered as the `<legend>` and announced when focus enters the group. Wrap it in `VisuallyHidden` to hide it visually. |
| `children` | `ReactNode` | | Yes | The controls in the group, laid out in a column with `gap` between them. |
| `description` | `ReactNode` | `undefined` | No | One line under the legend, linked with `aria-describedby`. |
| `variant` | `FieldsetVariant` (`"eyebrow" \| "field"`) | `"eyebrow"` | No | Legend voice: `eyebrow` for a settings group, `field` for a question in a form. |
| `gap` | `FieldsetGap` | `"2"` | No | Space between the children: `2` for the options of one choice group, `4` for a group mixing Switch rows and Checkboxes. |
| `disabled` | `boolean` | `false` | No | Native fieldset `disabled`: every descendant control is disabled and the controls column drops to 50% opacity; the legend stays at full contrast, as Input keeps its label. |
| `error` | `boolean` | `false` | No | Group-level error without a message. Sets `aria-invalid` only with `role="radiogroup"`. |
| `errorMessage` | `ReactNode` | `undefined` | No | Group-level message under the controls, linked with `aria-describedby`. Implies `error`. |
| `role` | `"group" \| "radiogroup"` | native `group` | No | `radiogroup` for a set of Radios, so the group can carry `aria-invalid`. `group`, or no value, renders no `role` attribute. |
| `className` | `string` | `undefined` | No | Layout classes on the fieldset (width, margin). |

Also accepts native fieldset attributes (`id`, `name`, `form`, `aria-*`, `data-*`). A caller's `aria-describedby` is kept in front of the description and message ids; a caller's `aria-labelledby` replaces the legend link. The ref is forwarded to the `<fieldset>`.

Exported types: `FieldsetProps`, `FieldsetVariant`, `FieldsetGap`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | `eyebrow` legend |
| `text-secondary-800` / `dark:text-secondary-200` (`--color-sepia-800` / `--color-sepia-200`) | Color | `#474030` / `#F7F5F2` | `field` legend |
| `--text-secondary` | Color | `#695F4D` light, `#BFB4A3` dark | Description (FieldMessage helper tone) |
| `text-error-700` / `dark:text-error-400` (`--color-red-700` / `--color-red-400`) | Color | `#B91C1C` / `#F87171` | Error message (FieldMessage error tone) |
| `text-xs` (`--font-size-xs`) | Typography | 12px | `eyebrow` legend, description, error message |
| `text-sm` (`--font-size-sm`) | Typography | 14px | `field` legend |
| `font-mono` | Typography | Fragment Mono | Legend |
| `mb-1` / `mb-2` / `mb-3`, `mt-2` | Spacing | 4px / 8px / 12px, 8px | Legend and description spacing; space above the error message |
| `gap-0` to `gap-8` | Spacing | `--spacing-*` | `gap` between the children |
| `opacity-50` (`group-disabled/fieldset:`) | Opacity | 0.5 | The controls column when `disabled` |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Eyebrow legend | `variant="eyebrow"` | `--text-primary`, `text-xs`, `mb-3` |
| Field legend | `variant="field"` | `secondary-800` / `secondary-200`, `text-sm`, `mb-2` |
| Described | `description` | `--text-secondary`; legend margin `mb-1` |
| Error | `error`, `errorMessage` | Error message tokens; `aria-invalid` on a radiogroup. The children's error styling comes from their own `error` prop |
| Disabled | `disabled` | `opacity-50` on the controls column (not the legend); descendants natively disabled |
| Radio group | `role="radiogroup"` | None (semantics only) |

Not interactive itself: no hover, focus or pressed states.

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| `variant="eyebrow"` | Yes | Yes | `Playground`, `Disabled` |
| `variant="field"` | Yes | Yes | `WithDescription`, `RadioGroup` |
| `description` | Yes | Yes | `WithDescription` |
| `errorMessage` | Yes | Yes | `RadioGroup` |
| `error` without a message | Yes | No | Unit test only |
| `role="radiogroup"` | Yes | Yes | `RadioGroup` |
| `disabled` | Yes | Yes | `Disabled` |
| `gap` | Yes | Yes | `"4"` in `Playground`, `"3"` in `Disabled`, the default `"2"` elsewhere |

Interactive controls: `legend`, `description`, `errorMessage` (text); `variant`, `gap`, `role` (select); `disabled`, `error` (boolean).

**Coverage:** 88% (7/8)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `FieldMessage` / `useFieldMessage` from `lib/field.tsx` (description and error message; the error tone renders `TuiIcon` AlertCircle)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (`--text-primary`, `--text-secondary`)
- `packages/tokens/tailwind.preset.js` (`secondary-*` and `error-*` scales, `font-mono`, spacing)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `<fieldset>` (implicit `group`); `role="radiogroup"` when the prop asks for it, which HTML allows on a fieldset
- Required labels: `legend` is required by the type and names the group, through the native legend and an explicit `aria-labelledby` (kept so the `radiogroup` role is named the same way everywhere). A caller's `aria-labelledby` replaces it
- Description: `description` and `errorMessage` are linked with `aria-describedby`, after any caller-supplied ids
- Invalid state: `aria-invalid="true"` on the fieldset only when `role="radiogroup"` and `error` or `errorMessage` is set. ARIA 1.2 supports `aria-invalid` on `radiogroup` but not on `group` or `radio`, so a checkbox group announces its error through the message alone, and Radios never carry it (`Radio.md`, decision 0029)
- Disabled: native `disabled` disables every descendant control, so they leave the tab order and are announced as disabled
- Focus order: the fieldset is not focusable; Tab moves through the children in order, arrow keys move within a radio group
- Touch target minimum: owned by the children (Radio, Checkbox and Switch carry 44x44 hit areas)
- Color independence: the error message leads with the AlertCircle icon and states the problem in text

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do write the legend as the question ("Theme", "Plan") or the section title ("Notifications"); keep it short.
- Do use `variant="field"` in a page-level form, so the legend matches the Input labels around it, and the default `eyebrow` voice for a titled group inside a settings card.
- Do set `role="radiogroup"` around Radios, and put a group-level error in the Fieldset's `errorMessage`, with `error` on each Radio for the styling.
- Do disable a whole group with the Fieldset's `disabled`, not each child.
- Don't nest a Fieldset in a Fieldset; split the controls into two siblings.
- Don't wrap a single control in a Fieldset; its own `label` names it.
- Don't add a border or plate to frame a group; use Card, or a `Divider` before the group.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- In a page-level form, each Fieldset is one item of the form's `space-y-6`, and its options take the default `gap="2"` (Forms).
- In a settings Card holding several groups, a titled group follows a `Divider spacing="none"` in a `Stack gap="4"`; a group mixing Switch rows and Checkboxes takes `gap="4"` (SettingsPanel).
- Children are full controls (Radio, Checkbox, Switch, Input, Select); each keeps its own `label` and per-option `helperText` / `errorMessage`.
- Inside a disabled Fieldset, children that style `:disabled` themselves (Button) dim twice; keep buttons out of a group you disable.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-29 | An `error` on the Fieldset does not style its children; each Radio or Checkbox needs its own `error` for the error ring | None yet; passing the state down needs a context the controls do not read | open |
| 2026-10-29 | The default voice is `eyebrow`, while the commoner use (a radio question in a form) wants `variant="field"` | Kept so SettingsPanel adopts it with no prop; revisit if most call sites pass `field` | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-10-29 | added | New component: native fieldset and legend in the `eyebrow` or `field` voice, `description`, `gap`, `disabled`, `error` / `errorMessage`, `role="radiogroup"`. Adopted by the Forms and SettingsPanel presets with no rendered change |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Fieldset.tsx`
