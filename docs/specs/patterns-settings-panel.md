# Pattern: Settings panel

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/SettingsPanel` (story-only, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/SettingsPanel.stories.tsx` |
| Story | `Patterns/SettingsPanel` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A single-card settings surface: a group of profile fields (two text inputs and a select), a notifications subsection with a switch and checkboxes, and footer actions (reset and save). It is the reference for spacing hierarchy with `Stack` (tight within a group, loose between groups) and for building product forms from existing components and semantic tokens without new primitives.

<!-- /HUMAN-SECTION:intent -->

---

## Composition

| Building block | Role |
|----------------|------|
| `Card` | `title="Workspace"`, `subtitle="Profile, locale, and alert defaults"`, body, and `footerContent` with the actions. `className="flex w-full flex-col"`. |
| `Stack` | Outer `gap="6"` between groups; `gap="3"` inside the profile group; `gap="4"` inside notifications. |
| `Input` | "Display name" and "Workspace slug", both `size="md"` with `defaultValue`. |
| `Select` | "Locale", `size="md"`, native `<option>` children (English, Français). |
| Section rule | Story-local `div` with a 0.5px top border in `--surface-container-stroke`, `pt-4`, and a `text-xs uppercase` "Notifications" label. |
| `Switch` | "Email digests" (`defaultChecked`). |
| `Checkbox` | "Push for deploy failures" (`defaultChecked`) and "Marketing updates". |
| `Button` | Footer, right-aligned with `gap-2`: `variant="outline"` "Reset" then `variant="primary"` "Save changes", both `size="sm"`. |

---

## Storybook

- **AccountPreferences** ("Account & notifications"): fullscreen story, `max-w-xl` centered column on `--surface-page`.
- **Theme:** Storybook **Theme** toolbar (sun/moon) for light/dark.
- **Test-runner:** included in `npm run test-storybook:ci` (axe on the composed story, both themes).

---

## Accessibility notes

- Every field has a visible `label` wired by the component (`Input`, `Select`, `Switch`, `Checkbox`).
- Footer buttons are explicit `type="button"` so the story does not submit; in product code wrap the body in a `<form>` and make Save `type="submit"`.
- The "Notifications" label is a styled `<p>`, not a heading or `<legend>`; in product code use a `<fieldset>` with a `<legend>` so the group is announced.
- Switch and Checkbox carry 44px hit areas; the `sm` footer buttons (32px) do not.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | The notifications group has no `fieldset` / `legend` or heading semantics, and the section rule is hand-rolled instead of `Divider` | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/stories/Patterns/SettingsPanel.stories.tsx`
