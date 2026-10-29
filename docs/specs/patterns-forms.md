# Pattern: Forms

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/Forms` (preset `AccountSettingsForm`, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/presets/forms.tsx` (story shell: `packages/storybook/stories/Patterns/Forms.stories.tsx`) |
| Story | `Patterns/Forms` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A complete page-level form on one column: every field component used once (Input, Select, Radio, Checkbox, Switch, Textarea), in the order an account form usually asks for them, ending in one action row. It is the reference for the form rules in `composition-presets-guidelines.md`: a visible label on every field, a `fieldset` and `legend` around each choice group, the error message under its field, the switch setting row, and the action row with the single `type="submit"` primary last. Upstreamed from the showcase's Forms pattern page (2026-09-20).

Don't use this for: grouped settings inside a Card with footer actions (use the SettingsPanel pattern instead), a sign-in surface (use the AuthCard pattern instead), or a short task that interrupts the page (use `Modal` with the fields in its body instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is `AccountSettingsForm` in `presets/forms.tsx`; the story only adds the page shell (`--surface-page`, `p-6 md:p-10`, a `max-w-md` column, the eyebrow line, a `Divider` and the footnote). The form does not set its own width: the column does.

| Building block | Role |
|----------------|------|
| `<form>` | `space-y-6` (`spacing.6`) between every field: on a page-level form each field is its own group. `onSubmit` prevents the default in the specimen. |
| `Input` | "Display name", controlled, with `errorMessage="Display name is required"` while it is empty; "Email", `type="email"`. Both `size="md"` with a placeholder that shows an example, never the field name. |
| `Select` | "Timezone", `size="md"`, `defaultValue="pt"`, four native `<option>`s. |
| `fieldset` + `legend` (Theme) | Radio group. The legend takes the field label style (`mb-2 block font-mono text-sm text-secondary-800 dark:text-secondary-200`). |
| `Radio` | "Match system" (`defaultChecked`), "Light", "Dark", sharing `name="forms-theme"`, in a `Stack gap="2"`. |
| `fieldset` + `legend` (Email notifications) | Checkbox group, same legend style. |
| `Checkbox` | "Product updates" and "Weekly digest" (`defaultChecked`), "Marketing and promotions", in a `Stack gap="2"`. |
| Setting row | `Inline justify="between" gap="4" wrap={false}`: the setting's name (`text-sm`, `--text-primary`) and consequence (`text-xs`, `secondary-700` / `secondary-600`) on the left, the control on the right. |
| `Switch` | "Public profile", controlled, `size="md"`, `label` plus `hideLabel` (the visible name is the text beside it). |
| `Textarea` | "Bio", `rows={4}`, `size="md"`. |
| `Inline` | Action row, `justify="end" gap="3"`, `pt-2` on top of the form's `spacing.6`. |
| `Button` | `variant="ghost"` "Cancel" (`type="button"`) then `variant="primary"` "Save changes" (`type="submit"`), both `size="md"` to match the fields. |

---

## Storybook

- **AccountSettings** ("Account settings"): fullscreen story; the display-name field starts in its error state.
- **Theme:** Storybook **Theme** toolbar (sun/moon) for light/dark.
- **Test-runner:** included in `npm run test-storybook:ci` (axe, both themes).

---

## Accessibility notes

- Every field has a visible label from its own `label` prop; placeholders only show an example.
- The error message is rendered by Input under the field and linked with `aria-describedby`, and the input carries `aria-invalid`, so a screen reader hears why the field is invalid.
- Each radio and checkbox group is a `fieldset` whose `legend` is announced when focus enters the group.
- The Switch's accessible name is "Public profile" from `label` (visually hidden by `hideLabel`); the consequence text beside it is not linked to it.
- Keyboard: Tab moves through the fields in order; arrow keys move within the radio group; Space toggles checkboxes and the switch; Enter in a text field submits through the `type="submit"` button.
- Checkbox and Radio have 44px hit areas; the `md` fields and buttons are 40px tall.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-29 | The legend style is written out in the preset (`mb-2 block font-mono text-sm ...`): there is no `Fieldset` component or legend style token, so each pattern repeats it | None yet; a `Fieldset` primitive is a component change | open |
| 2026-10-29 | The switch's consequence text is not linked to the Switch with `aria-describedby` | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-10-29 | added | Spec written from source; the form moved to the `AccountSettingsForm` preset; the setting row and action row are `Inline`; no rendered change (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/forms.tsx`, `packages/storybook/stories/Patterns/Forms.stories.tsx`
