# 8. Specs live in the repo only; Notion is not a mirror

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; decided in `#46`)
- **Affects:** `docs/specs/`, `/update-spec`, `/sync-specs`

## Context

Specs were mirrored into Notion, with a sync step registering each spec page under a
Scorp DS Specs hub (`4533085`). Two copies meant two truths, and the Notion side drifted
the moment a spec was edited in the repo.

## Decision

`docs/specs/*.md` is the **only** copy. Notion integration was removed in `#46`, and all
existing specs were rewritten from source in the same change.

Do not propose a Notion sync. Do not add one.

## Options rejected

- **Keep the mirror and sync harder.** More automation pointed at a problem caused by
  having two copies.
- **Make Notion the source and generate the repo copy.** Moves specs away from the code
  they describe and out of review.

## Consequences

- Specs are reviewed in PRs alongside the code they document.
- Spec sections are split: `AUTO-START`/`AUTO-END` blocks are regenerated from source,
  `HUMAN-SECTION` blocks are preserved across updates.
- All 50 components and primitives have a spec, and every spec's Properties table is
  populated. Keeping it that way is what `/sync-specs` and the drift script are for.
