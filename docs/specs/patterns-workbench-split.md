# Pattern: Workbench split

> Pattern spec — not an exported component. Story: `Patterns/WorkbenchSplit`.

## Status

| Field | Value |
|-------|-------|
| Widget | `PatternWorkbenchSplit` |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/WorkbenchSplit.stories.tsx` |
| Story | `Patterns/WorkbenchSplit` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-03 |
| Notion Page | `` |

---

## Intent

**Two-pane layout** evoking terminal multiplexers: a **narrow index column** (file/buffer list with keyboard-style `▸` marker) and a **main inspector** built as a `Card` with filter + actions + monospace `pre` output.

Responsive: stacks vertically on small screens; `md:flex-row` side-by-side on larger breakpoints.

---

## Composition

| Building block | Role |
|----------------|------|
| `aside` + `nav` | Buffer list; native `button` rows for selection affordance (story-only, not `Button`). |
| `Card` | Main pane title + subtitle + toolbar + log body. |
| `Input` | Filter field (`aria-label`). |
| `Button` | Pause (secondary) + Export (primary). |
| `Stack` | Spacing inside card body. |
| `pre` | Log buffer (semantic monospace content). |

`Card` uses `!border-0` so the outer flex child supplies the visible frame.

---

## Storybook

- **InspectorLayout** — `min-h-[70vh]` split demo on `surface-page`.

---

## Accessibility notes

- Index column has `aria-label="Open buffers"`.
- Filter input has `aria-label="Filter log lines"`.
- Sidebar uses real `<button type="button">` elements for list items (story-local pattern).

---

## Storybook

- **Theme:** Storybook **Theme** toolbar for light/dark.
- **Test-runner:** covered by `npm run test-storybook:ci`.

## Reference

`packages/storybook/stories/Patterns/WorkbenchSplit.stories.tsx`
