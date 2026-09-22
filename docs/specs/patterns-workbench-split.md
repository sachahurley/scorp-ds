# Pattern: Workbench split

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/WorkbenchSplit` (story-only, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/WorkbenchSplit.stories.tsx` |
| Story | `Patterns/WorkbenchSplit` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A two-pane layout that evokes terminal multiplexers: a narrow index column (a buffer list with a chevron marker on the active item) beside a main inspector `Card` holding a filter field, actions and monospace log output. It stacks vertically on small screens and sits side by side from the `md` breakpoint, using plain flex and tokens rather than a bespoke layout component. Use it as the reference for tool-style screens with a list of sources and a detail view.

<!-- /HUMAN-SECTION:intent -->

---

## Composition

| Building block | Role |
|----------------|------|
| Outer flex | `flex min-h-[70vh] flex-col gap-4`, `md:flex-row md:gap-0`. |
| `aside` | Index pane: `md:w-56`, `--surface-subtle` fill, 0.5px `--surface-container-stroke` border (right and bottom dropped from `md`), `aria-label="Open buffers"`. Header row `~/var/log` in `text-xs uppercase`. |
| `nav` + native `button` rows | Story-local list items (not `Button` or `ListRow`): `px-2 py-2`, square, active row on `--surface-card` with `--text-primary`, inactive rows `secondary-900 / secondary-200` with a `--surface-card` hover. |
| `TuiIcon` | `ChevronRight` (size 4) in a fixed `w-5` marker slot, shown only on the active row, so labels stay aligned. |
| `Card` | Main pane: `title="sessions.log"`, `subtitle="Tail · last 200 lines"`, `className="h-full min-h-[50vh] shadow-none"`. The card draws its own plate ring. |
| `Stack` | `gap="3"` around the toolbar; `gap="2"` (with `mt-4`) around the log and footnote. |
| `Input` | Filter field, `size="sm"`, `placeholder="Filter…"`, `aria-label="Filter log lines"`, `min-w-[12rem] flex-1`. |
| `Button` | `variant="secondary"` "Pause" and `variant="primary"` "Export", both `size="sm"`. |
| `pre` | Log buffer: `max-h-[40vh] overflow-auto`, 0.5px stroke border, `--surface-page` fill, `text-xs leading-relaxed`. |

---

## Storybook

- **InspectorLayout** ("Log inspector"): fullscreen split on `--surface-page`.
- **Theme:** Storybook **Theme** toolbar for light/dark.
- **Test-runner:** covered by `npm run test-storybook:ci`.

---

## Accessibility notes

- The index column is an `aside` with `aria-label="Open buffers"`; the list inside is a `nav`.
- The filter input has `aria-label="Filter log lines"` (no visible label).
- Sidebar items are real `<button type="button">` elements; the chevron marker is `aria-hidden`, so the active buffer is shown visually (fill, text color, chevron) but not announced. Add `aria-current="true"` (or `aria-pressed`) in product code.
- The `pre` log scrolls on overflow; if it must be keyboard-scrollable, give it `tabIndex={0}` and a label.
- Sidebar buttons are about 37px tall (`py-2` plus a 21px `text-sm` line), under the 44px target.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Active sidebar item has no `aria-current`; the story footnote says the main pane is "a Card without extra borders", but `Card` draws a plate ring next to the square-bordered `aside`; sidebar rows could use `ListRow` with `selected` | None yet | open |

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

`packages/storybook/stories/Patterns/WorkbenchSplit.stories.tsx`
