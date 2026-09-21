# Pattern: Dense list row

> Pattern spec — not an exported component. Story: `Patterns/DenseListRow`.

## Status

| Field | Value |
|-------|-------|
| Widget | `PatternDenseListRow` |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/DenseListRow.stories.tsx` |
| Story | `Patterns/DenseListRow` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-03 |
| Notion Page | https://www.notion.so/3e29a6335da1812daae9c9b9dff08bc3 |

---

## Intent

Repeatable **compact row** for jobs, inbox items, or log-style lists: **avatar**, **primary + secondary lines**, **status badge**, and **actions** (text button + icon menu).

Uses a local `RowShell` div in the story for row chrome; product apps may extract a shared row component when the API stabilizes.

---

## Composition

| Building block | Role |
|----------------|------|
| `Avatar` | Leading identity (`initials`, optional `status`). |
| `Badge` | Status (`success`, `error`, `warning`). |
| `Button` | Secondary “Logs”; `variant="icon"` + `TuiIcon` for overflow. |
| `TuiIcon` | `MoreVertical` for menu affordance. |
| `Divider` | Separates list from footnote copy. |

---

## Storybook

- **JobRunRow** — two sample rows (passed + queued) with truncation and wrap-friendly flex.

---

## Accessibility notes

- Icon-only menu buttons use `aria-label="Open menu"`.
- `TuiIcon` is decorative in context of labeled button.

---

## Storybook

- **Theme:** Storybook **Theme** toolbar for light/dark.
- **Test-runner:** covered by `npm run test-storybook:ci`.

## Reference

`packages/storybook/stories/Patterns/DenseListRow.stories.tsx`
