# 26. A spec is `stable` when it meets a checkable bar

- **Status:** accepted
- **Date:** 2026-10-28
- **Affects:** `docs/specs/`, the spec `Status` row, the generated catalog

## Context

Every one of the 61 specs in `docs/specs/` says `Status: draft`, including Button,
which has a current API hash, full anatomy, token map, states, accessibility notes and
28 visual baselines behind it. A field that is the same everywhere tells a reader nothing. An
agent cannot tell a component it can rely on from a proposal (the chat composer specs
were also `draft`, for components that did not exist yet).

## Decision

A spec moves from `draft` to `stable` when all of these hold:

1. The component exists, and the spec's `API hash` matches `api-surface.json`.
2. The Intent section says what the component is for **and** names what to use instead
   when it does not fit.
3. It has an Accessibility section with keyboard behaviour and what carries the label.
4. The component has a story and a unit test that renders it.
5. Its Known Gaps table has no open row marked `blocking`.

`scripts/spec-status.mjs` reports which specs meet the bar. **Promotion is a human
edit**, made by Sacha, never by the script: the bar is necessary, not sufficient.

A spec for a component that does not exist yet stays `draft` and says `proposed` in its
Intent, so the catalog can leave it out.

## Options rejected

- **Promote automatically when the checks pass.** The checks cannot tell whether the
  intent is right, only whether it is there.
- **Drop the status field.** The catalog needs to tell a proposal from a shipped
  component, and the field is already in every spec.

## Consequences

- The generated catalog shows the status, so an agent can prefer stable components.
- Adding a "use instead" line to every spec becomes the main work of promotion.

## Amendment 2026-10-29

`npm run new:component` scaffolds a spec and a source file with `TODO(scaffold)`
placeholders. `scripts/spec-status.mjs` treats any remaining placeholder in the Intent or in
the component's JSDoc as short of the bar ("intent written", "source JSDoc written"), so a
scaffolded component cannot read as promotable before someone has written what it is for.
The five criteria above are unchanged; this makes criterion 2 checkable for scaffolds.
