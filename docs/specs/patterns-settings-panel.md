# Pattern: Settings panel

> Pattern spec — not an exported component. Story: `Patterns/SettingsPanel`.

## Status

| Field | Value |
|-------|-------|
| Widget | `PatternSettingsPanel` |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/SettingsPanel.stories.tsx` |
| Story | `Patterns/SettingsPanel` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-03 |
| Notion Page | `` |

---

## Intent

Demonstrates a **single-card settings surface**: grouped fields (text, select), a **notifications** subsection with toggles and checkboxes, and **footer actions** (reset + save).

Shows recommended spacing (`Stack`), semantic tokens only, and TUI-style hierarchy without new primitives.

---

## Composition

| Building block | Role |
|----------------|------|
| `Card` | Title + subtitle + body + `footerContent` actions. |
| `Stack` | Vertical rhythm between field groups. |
| `Input` | Display name, workspace slug. |
| `Select` | Locale. |
| `Switch` | Binary notification preference. |
| `Checkbox` | Optional channels. |
| `Button` | Ghost reset + primary save in footer. |

---

## Storybook

- **AccountPreferences** — full-screen story with `max-w-xl` centered column on `surface-page`.

---

## Accessibility notes

- Every input uses `label` or associated naming via components.
- Footer buttons are explicit `type="button"` for Storybook (non-submitting).

---

## Storybook

- **Theme:** use the Storybook **Theme** toolbar (sun/moon) for light/dark.
- **Test-runner:** included in `npm run test-storybook:ci` (axe on the composed story).

## Reference

`packages/storybook/stories/Patterns/SettingsPanel.stories.tsx`
