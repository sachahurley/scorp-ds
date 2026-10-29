# 30. Every state a component's API supports has a story

- **Status:** accepted
- **Date:** 2026-10-29
- **Affects:** `design-system-doc-requirements.md`, every component with loading, empty or error states; extends [0012](0012-stories-drive-their-own-interactions.md)

## Context

The agent-readiness audit found that most data and overlay components showed only their
happy path. Combobox had an `emptyText` prop and no story that showed it; Table had no empty
or loading state at all, so an agent building a list screen invented one. A state with no
story has no visual baseline and no axe pass, and an agent reading Storybook or the catalog
cannot see that it exists.

## Decision

If a component's API supports a loading, empty or error state, it ships one story per state,
named for the state (`Table/Loading`, `Table/Empty`, `Combobox/No matches`, `Input/Error`).
A state reached by interaction gets a `play` function that drives it there, per 0012.
`design-system-doc-requirements.md` carries the rule and its checklist item (added in #111).

## Options rejected

- **One "all states" story per component.** One frame cannot show an open empty list and a
  loading table together, and a combined story hides which state broke.
- **Leave states to the spec prose.** Prose has no baseline and no accessibility pass.

## Consequences

- Adding a state to an API means adding its story in the same PR; reviewers check for it.
- Not yet checked mechanically: a future check could compare prop names (`loading`,
  `emptyState`, `error`) against story names.
