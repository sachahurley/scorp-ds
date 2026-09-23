# 7. Keep tokens.json and tokens.css both hand-maintained, guarded by a drift test

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; drift test added in `#51`)
- **Affects:** `packages/tokens`, every token change

## Context

The normal arrangement is one source of truth and a generated stylesheet. Scorp DS has
two hand-written files: `tokens.json` (W3C format, what tooling reads) and
`styles/tokens.css` (what ships to the browser).

That looks like an obvious thing to fix, and it keeps getting proposed. It is
deliberate.

## Decision

Both files stay hand-maintained. `packages/tokens` has **no `build` script** and nothing
generates one file from the other.

A token must be added to both **in the same commit**. The CSS variable name is the JSON
path hyphen-joined with camelCase segments kebab-cased (`zIndex.modal` becomes
`--z-index-modal`).

`packages/tokens/src/lib/token-parser.test.ts` parses both and asserts they agree in
both directions, on names and on values, for both themes. A token in one file and not
the other fails the test **and names the offender**.

## Options rejected

- **Generate `tokens.css` from `tokens.json`.** The reason this is refused:
  `tokens.css` carries commentary no generator could reproduce, including measured
  contrast ratios per token and the deliberate dark `field.border` exception at 1.76:1
  with the note explaining why it is allowed to fail the usual bar. Generating the file
  would destroy the record of why a value is what it is.
- **Generate `tokens.json` from `tokens.css`.** Same loss in the other direction:
  `$type` and `$description` have no home in CSS.
- **Drop `tokens.json` and keep only CSS.** Tooling and the Figma sync need structured
  types and references.
- **Accept the drift risk and rely on review.** What was there before `#51`, and the
  reason the drift test exists.

## Consequences

- Adding a token is two edits, not one. The test makes forgetting the second edit loud
  and immediate rather than silent.
- The comments in `tokens.css` are **part of the system's memory**, not decoration. They
  should be extended, not stripped.
- Any future "let's just generate this" proposal should be answered with this record.
