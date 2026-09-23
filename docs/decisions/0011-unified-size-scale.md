# 11. One size scale (sm | md | lg), backed by control-height tokens

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; decided in `#42`)
- **Affects:** every sized component; `global.control.height`

## Context

Components had drifted into their own size vocabularies: some took
`small | medium | large`, some took `sm | md | lg`, and `Button` additionally took
`icon` as a size, which conflated shape with scale.

## Decision

One scale everywhere: **`sm` | `md` | `lg`**, resolving to `--control-height-sm` (32px),
`-md` (40px, the default) and `-lg` (48px).

Legacy names (`small`, `medium`, `large`) still resolve, via `resolveSize`, with a
one-time dev warning. `Button`'s `size="icon"` is deprecated the same way: icon-only
buttons are squared automatically, so `md` is the correct value.

## Options rejected

- **Hard-break the legacy names.** Three consumers vendor this system and would break on
  the next vendor run.
- **Keep both vocabularies indefinitely.** Two names for one concept is what caused the
  drift.
- **Add more steps (`xs`, `xl`).** Three steps cover every shipped use; more steps would
  be speculative.

## Consequences

- `resolveSize` is the single place the mapping lives, and the dev warning is how the
  legacy names eventually get removed.
- A component that needs a size outside the scale is a signal to question the design,
  not to add a step.
- Icon-only detection is by shape, not by a size value, so `size` stays one axis.
