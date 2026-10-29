# Pattern: Settings panel

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/SettingsPanel` (preset `WorkspaceSettingsPanel`, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/presets/settingsPanel.tsx` (story shell: `packages/storybook/stories/Patterns/SettingsPanel.stories.tsx`) |
| Story | `Patterns/SettingsPanel` |
| Version | `v2` |
| Status | `draft` |
| Last updated | 2026-10-29 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A single-card settings surface: a group of profile fields (two text inputs and a select), a notifications group with a switch and checkboxes, and footer actions (reset and save). It is the reference for the spacing hierarchy in `composition-presets-guidelines.md` (tight within a group, loose between groups, a `Divider` before a titled group) and for building product forms from existing components and semantic tokens without new primitives.

Don't use this for: a long page-level form with one field per row and no Card (use the Forms pattern instead), a sign-in surface (use the AuthCard pattern instead), or settings split across independent sections (use one Card per section instead, never a Card inside a Card).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is `WorkspaceSettingsPanel` in `presets/settingsPanel.tsx`; the story only adds the page shell (`--surface-page`, `p-6 md:p-10`, a `max-w-xl` column, the eyebrow line).

| Building block | Role |
|----------------|------|
| `Card` | `title="Workspace"`, `subtitle="Profile, locale, and alert defaults"`, body, and `footerContent` with the actions. `className="flex w-full flex-col"`. Card supplies all padding. |
| `Stack` | Outer `gap="6"` between the two groups; `gap="3"` between the profile fields; `gap="4"` between the Divider and the notifications fieldset, and between the notifications controls. |
| `Input` | "Display name" and "Workspace slug", both `size="md"` with `defaultValue`. |
| `Select` | "Locale", `size="md"`, native `<option>` children (English, Français). |
| `Divider` | Section rule before the notifications group, `spacing="none"` so the surrounding `Stack` gaps own the space. |
| `fieldset` + `legend` | The notifications group. The legend "Notifications" uses the eyebrow style (`text-xs uppercase tracking-wider`, `--text-primary`, `mb-3`). |
| `Switch` | "Email digests" (`defaultChecked`). |
| `Checkbox` | "Push for deploy failures" (`defaultChecked`) and "Marketing updates". |
| `Inline` | Footer action row, `justify="end" gap="2"`. |
| `Button` | Footer: `variant="outline"` "Reset" then `variant="primary"` "Save changes", both `size="sm"`, `type="button"`. |

---

## Storybook

- **AccountPreferences** ("Account & notifications"): fullscreen story, `max-w-xl` centered column on `--surface-page`.
- **Theme:** Storybook **Theme** toolbar (sun/moon) for light/dark.
- **Test-runner:** included in `npm run test-storybook:ci` (axe on the composed story, both themes).

---

## Accessibility notes

- Every field has a visible `label` wired by the component (`Input`, `Select`, `Switch`, `Checkbox`).
- The notifications controls are a `fieldset` with a `legend`, so a screen reader announces "Notifications" when focus enters the group.
- The Divider is `role="separator"`; it carries no name, because the legend names the group after it.
- Footer buttons are explicit `type="button"` because the panel is not a form; in product code wrap the Card in a `<form>` and make Save `type="submit"`.
- Keyboard: Tab moves through the fields in reading order, then Reset, then Save; Space toggles the Switch and the Checkboxes.
- Switch and Checkbox carry 44px hit areas; the `sm` footer buttons (32px) do not.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | The notifications group has no `fieldset` / `legend` or heading semantics, and the section rule is hand-rolled instead of `Divider` | 2026-10-29: the group is a `fieldset` with a `legend`, and the rule is `<Divider spacing="none" />` (decision 0028) | closed |
| 2026-10-29 | The footer buttons are `sm` (32px), under the 44px touch target | Accepted for a dense desktop settings card; a touch-first screen uses `md` | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| v2 | 2026-10-29 | changed | Moved to the `WorkspaceSettingsPanel` preset; notifications group is a `fieldset` + `legend`; the section rule is `Divider`; the footer row is `Inline` (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/settingsPanel.tsx`, `packages/storybook/stories/Patterns/SettingsPanel.stories.tsx`
