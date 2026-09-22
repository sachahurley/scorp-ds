# 6. Components reference semantic aliases, never raw colour scales

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled)
- **Affects:** every component; `global.color`; `scorp/no-raw-scale`

## Context

`global.color` holds six raw scales (`amber`, `sepia`, `green`, `blue`, `purple`, `red`)
and six semantic aliases (`primary`, `secondary`, `success`, `info`, `warning`, `error`)
that point at them. `primary-400` and `amber-400` resolve to exactly the same value, so
in the moment there is no reason to prefer one.

The reason only appears later, when the palette changes.

## Decision

Component code uses the **semantic alias only**. `bg-primary-400`, never `bg-amber-400`,
even though they are identical today.

Raw scale names are permitted in `packages/tokens` (which defines them) and in the
Foundation and Semantic token stories (whose purpose is to display them).

## Options rejected

- **Use raw scales and rename later.** A rename across ~50 components is exactly the
  migration this avoids, and it cannot distinguish "amber because primary" from "amber
  because it had to be amber".
- **Delete the raw scales.** They are needed: the aliases have to point at something,
  and the Foundation stories document the scales themselves.
- **Allow raw scales for one-off accents.** The exception swallows the rule; a one-off
  accent is a missing semantic token.

## Consequences

- The palette can be re-themed by repointing six aliases.
- Enforced by `scorp/no-raw-scale`. The codebase had zero violations when the rule
  landed.
- A colour with no fitting alias is a signal that a semantic token is missing, not a
  licence to reach for the scale.
