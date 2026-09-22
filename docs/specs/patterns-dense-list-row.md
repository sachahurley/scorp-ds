# Pattern: Dense list row

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/DenseListRow` (story-only, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/DenseListRow.stories.tsx` |
| Story | `Patterns/DenseListRow` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A repeatable compact row for jobs, inbox items or log-style lists: avatar, a primary line with an id, a truncating secondary line, a status badge, and trailing actions (a text button and an icon menu). It shows how to reach TUI density with existing components and semantic tokens only. The row chrome is a story-local `RowShell` div; product apps can extract a shared row component once the API settles. For quiet navigation lists without per-row actions, use `ListRow` instead.

<!-- /HUMAN-SECTION:intent -->

---

## Composition

| Building block | Role |
|----------------|------|
| `RowShell` (story-local) | `flex flex-wrap items-center gap-3`, 0.5px `--surface-container-stroke` border, `--surface-card` fill, `px-3 py-2`, `text-sm` mono. Square corners (no plate clip). |
| `Avatar` | Leading identity at `size="sm"` with `initials`; the first row also shows `status="online"`. |
| Text column | `min-w-0 flex-1`: primary line (`font-medium`, truncating) plus a run number, then a `text-xs` truncating secondary line. Secondary text uses `text-secondary-900 dark:text-secondary-200`. |
| `Badge` | Status: `variant="success"` ("passed") and `variant="default"` ("queued"). |
| `Button` | `variant="outline" size="sm"` "Logs" (disabled on the queued row); `variant="icon" size="sm"` overflow menu. |
| `TuiIcon` | `MoreVertical` inside the icon button (default size 4). |
| `Stack` | `gap="2"` between rows. |
| `Divider` | Separates the rows from the footnote copy. |

---

## Storybook

- **JobRunRow** ("Job run (status + actions)"): two rows (passed + queued) on `--surface-page`, `max-w-3xl`, fullscreen layout.
- **Theme:** Storybook **Theme** toolbar for light/dark.
- **Test-runner:** covered by `npm run test-storybook:ci` (axe in both themes).

---

## Accessibility notes

- Icon-only menu buttons use `aria-label="Open menu"`; the `TuiIcon` inside is `aria-hidden`.
- Status is carried by the badge text ("passed", "queued"), not color alone.
- The disabled "Logs" button is a native disabled button (removed from the tab order).
- Rows are plain `div`s: in product code, render the list as `<ul>` / `<li>` so the count is announced.
- Controls are `sm` (32px), below the 44px touch target; acceptable for dense desktop tooling, not for touch-first lists.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Rows are `div`s in a `Stack` rather than list semantics; both menu buttons share the same label "Open menu" with no row context | None yet | open |

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

`packages/storybook/stories/Patterns/DenseListRow.stories.tsx`
