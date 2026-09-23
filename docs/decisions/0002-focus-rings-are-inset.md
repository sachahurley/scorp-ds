# 2. Focus rings are inset box-shadows, not outlines

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled)
- **Affects:** every focusable component

## Context

The obvious way to show focus is `outline`, and it is what the platform gives for free.
But plates clip their elements to a polygon ([0001](0001-plates-replace-border-radius.md)),
and `clip-path` removes anything painted outside the shape. An outline on a plate is
either invisible or sliced into fragments.

## Decision

Focus is an **inset** ring, drawn as a box-shadow:

```
focus:outline-none
focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]
```

`--focus-ring-width` is 2px. The ring colour is per-context
(`--focus-ring-primary`, `-secondary`, `-destructive`, `-icon`) so it stays visible
against whatever the component's own fill is.

## Options rejected

- **`outline` with `outline-offset`.** The straightforward choice, and the reason this
  decision exists: it does not survive `clip-path`.
- **A wrapper element carrying the outline.** Adds a node to every interactive
  component and still has to be clipped to match the plate.
- **Drop `focus-visible` and always show focus.** Fails the usual mouse-user complaint
  and does not fix the clipping.

## Consequences

- `outline-none` appears on every interactive component. That is normally an
  accessibility smell, so it must **always** be paired with the inset ring; a bare
  `outline-none` is a bug.
- The ring eats 2px of the component's inner edge rather than sitting outside it, so
  components need enough padding to absorb it.
- Storybook's axe pass runs in both themes, which is what catches a ring that has gone
  invisible against a particular fill.
