# Pattern: Workbench split

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/WorkbenchSplit` (preset `LogInspectorSplit`, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/presets/workbenchSplit.tsx` (story shell: `packages/storybook/stories/Patterns/WorkbenchSplit.stories.tsx`) |
| Story | `Patterns/WorkbenchSplit` |
| Version | `v2` |
| Status | `draft` |
| Last updated | 2026-10-29 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A two-pane layout that evokes terminal multiplexers: a narrow index pane (a buffer list) beside the focused inspector pane holding a filter field, actions and a log tail. Both panes are `Window`s; the panes stack vertically on small screens and sit side by side from the `md` breakpoint. Use it as the reference for tool-style screens with a list of sources and a detail view.

Don't use this for: an app's primary page navigation (use the SideNavigation pattern instead), a content page made of grouped sections (use `Card` instead of `Window`), or a single log with no index (use `LogView` in one `Window` instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is `LogInspectorSplit` in `presets/workbenchSplit.tsx`; the story only adds the page shell (`--surface-page`, `p-4 md:p-6`, the eyebrow line).

| Building block | Role |
|----------------|------|
| Split | `flex min-h-[70vh] flex-col gap-4 md:flex-row`: the panes stack below `md` and sit side by side from `md`, `spacing.4` apart either way. Plain flex, because no primitive changes axis at a breakpoint. |
| `Window` (index) | `title="~/var/log"`, `titleAs="h3"`, `className="w-full shrink-0 md:w-60"`, `bodyClassName="p-2"`. |
| `SideNav` + `SideNavItem` | The buffer list, `aria-label="Open buffers"`. The SideNav drops its own frame inside the Window (`className="w-full border-0 bg-transparent p-0"`). One `FileText` row per buffer (`workbenchBuffers`); rows are buttons (`onClick`, no `href`), and the active one holds the hover fill and `aria-current="page"`. |
| `Window` (inspector) | `title` = the active buffer's name, `status="tail · last 200 lines"`, `variant="active"` (accent ring and ChevronRight marker), `scroll={false}` because the LogView scrolls itself, `className="min-w-0 flex-1"`. |
| `Stack` | `gap="3"` (`h-full`) around the toolbar, the log and the footnote. |
| `Inline` | Toolbar, `gap="2"`: the field first, then secondary, then primary. |
| `Input` | Filter field, `size="sm"`, `placeholder="Filter…"`, `aria-label="Filter log lines"`, `min-w-48 flex-1` so it takes the spare width. |
| `Button` | `variant="secondary"` "Pause" then `variant="primary"` "Export", both `size="sm"`, `type="button"`. |
| `LogView` | The tail (`workbenchLogLines`), `aria-label="Selected log"`, `className="h-[40vh]"`, framed (its own plate ring). |

---

## Storybook

- **InspectorLayout** ("Log inspector"): fullscreen split on `--surface-page`.
- **Theme:** Storybook **Theme** toolbar for light/dark.
- **Test-runner:** covered by `npm run test-storybook:ci`.

---

## Accessibility notes

- Each pane is a `section` named by its title (`aria-labelledby`); the index pane's list is a `nav` named "Open buffers".
- The active buffer row carries `aria-current="page"` and holds the hover fill, so it is not shown by color alone; the active pane adds the ChevronRight marker to its accent ring.
- The filter input has `aria-label="Filter log lines"` (no visible label).
- The LogView is `role="log"` named "Selected log".
- Keyboard: Tab moves through the buffer rows, then the filter, Pause, Export and the log.
- SideNavItem rows meet the 44px target (`min-h-touch`); the `sm` toolbar controls (32px) do not.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Active sidebar item has no `aria-current`; the story footnote says the main pane is "a Card without extra borders", but `Card` draws a plate ring next to the square-bordered `aside`; sidebar rows could use `ListRow` with `selected` | Superseded by the move to `Window`, `SideNav` and `LogView`: rows are `SideNavItem` with `aria-current`, both panes are Windows | closed |
| 2026-10-29 | The split is plain flex in the preset: `Stack` has no responsive `axis`, so a layout that stacks below `md` and sits side by side above it has no primitive | None yet; a responsive axis on Stack is a component change | open |
| 2026-10-29 | Selecting a buffer retitles the inspector but keeps the same specimen lines | Specimen only; product code swaps the lines | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| v2 | 2026-10-29 | changed | Moved to the `LogInspectorSplit` preset; the toolbar is `Inline`; Composition rewritten for the Window, SideNav and LogView build; no rendered change (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/workbenchSplit.tsx`, `packages/storybook/stories/Patterns/WorkbenchSplit.stories.tsx`
