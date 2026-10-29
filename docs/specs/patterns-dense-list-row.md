# Pattern: Dense list row

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/DenseListRow` (presets `JobRunList`, `JobRunListRow`, `DenseRowShell`; not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/presets/denseListRow.tsx` (story shell: `packages/storybook/stories/Patterns/DenseListRow.stories.tsx`) |
| Story | `Patterns/DenseListRow` |
| Version | `v2` |
| Status | `draft` |
| Last updated | 2026-10-29 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A repeatable compact row for jobs, inbox items or log-style lists: avatar, a primary line with an id, a truncating secondary line, a status badge, and trailing actions (a text button and an icon menu). It shows how to reach TUI density with existing components and semantic tokens only. The row chrome is `DenseRowShell` in the preset; product apps can extract a shared row component once the API settles.

Don't use this for: quiet navigation lists without per-row actions (use `ListRow` instead), data read across aligned columns with headers (use `Table` instead), or a log tail (use `LogView` instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is in `presets/denseListRow.tsx`; the story only adds the page shell (`--surface-page`, `p-6 md:p-10`, a `max-w-3xl` column, the eyebrow line, a `Divider` and the footnote).

| Building block | Role |
|----------------|------|
| `JobRunList` | The list: `Stack gap="2"` of `JobRunListRow`, from `jobRunRows` (one passed run, one queued) unless `rows` is passed. |
| `JobRunListRow` | One row from a `JobRunRowData` record: Avatar, text column, Badge, then the actions in fixed order. |
| `DenseRowShell` | Row chrome: `flex flex-wrap items-center gap-3`, 0.5px `--surface-container-stroke` border, `--surface-card` fill, `px-3 py-2`, `text-sm` mono. Square corners (no plate clip). |
| `Avatar` | Leading identity at `size="sm"` with `initials`; `presence` sets the status dot (the first row is `online`). |
| Text column | `min-w-0 flex-1`: an `Inline align="baseline" gap="2"` with the primary line (`font-medium`, truncating) and the `#` run number, then a `text-xs` truncating secondary line. Secondary text uses `text-secondary-900 dark:text-secondary-200`. |
| `Badge` | Status: `variant="success"` ("passed") and `variant="default"` ("queued"). |
| `Button` | `variant="outline" size="sm"` "Logs" (disabled when `logsDisabled`, as on the queued row); then `variant="icon" size="sm"` overflow menu, always last. |
| `TuiIcon` | `MoreVertical` inside the icon button (Button sizes it). |

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
- Keyboard: Tab reaches "Logs" then the menu button in each row, row by row.
- Rows are plain `div`s: in product code, render the list as `<ul>` / `<li>` so the count is announced.
- Controls are `sm` (32px), below the 44px touch target; acceptable for dense desktop tooling, not for touch-first lists.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Rows are `div`s in a `Stack` rather than list semantics; both menu buttons share the same label "Open menu" with no row context | None yet | open |
| 2026-10-29 | `DenseRowShell` is bespoke layout CSS in a preset: no component draws a square hairline row at this density (`Box border="hairline"` is the plate ring, `ListRow` is the plate row) | None yet; a row tier for dense actionable lists is a component change | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| v2 | 2026-10-29 | changed | Moved to `presets/denseListRow.tsx` (`JobRunList`, `JobRunListRow`, `DenseRowShell`, `jobRunRows`); the title line is `Inline`; no rendered change (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/denseListRow.tsx`, `packages/storybook/stories/Patterns/DenseListRow.stories.tsx`
