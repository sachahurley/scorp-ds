# 15. Spec drift fails CI

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** `scripts/detect-spec-drift.sh`, `scripts/ds-health.sh`, the `CI` workflow, every spec in `docs/specs/`

## Context

Spec drift detection was rebuilt on API hashes: `generate-api-surface.mjs` records an
`apiHash` per component in `docs/contracts/api-surface.json`, and each spec records the hash
it was written against in its `API hash` row. 50 of the 57 files in `docs/specs/` carry one;
the other seven (the changelog, five pattern specs and `token-parser`) describe nothing in
the manifest and are checked for presence only.

Two things kept that from catching anything:

1. `detect-spec-drift.sh` counted drift into `DRIFT_COUNT` and printed it, but only exited
   nonzero on setup errors. It exited 0 with drift.
2. No workflow ran it. CI checked that the manifest was current, but not that the specs
   matched the manifest, so a component's public API could change, the manifest be
   regenerated, and its spec stay stale with every check green.

`ds-health.sh` printed `✓ Spec drift check complete` regardless of the result.

A third problem surfaced the first time CI ran it: the hash was read with a `sed` capture
around backticks (`\``), which macOS sed treats as a literal backtick and GNU sed as "start of
buffer". On Linux nothing matched, so all 50 specs read as stale. And a spec with no hash row
aborted the script under `pipefail` instead of being reported. The check had never worked
anywhere but a Mac. It now reads the hash with `grep -oE`.

## Decision

`detect-spec-drift.sh` exits 1 when any source file has no spec, any component spec has no
`API hash` row, or a recorded hash differs from the manifest. Status-upgrade candidates are
still printed and never fail the run.

CI runs it in the `checks` job directly after `generate-api-surface.mjs --check`. The order is
the point: the comparison only means something once the manifest is known to be current.
`ds-health.sh` reports a failure when the script does.

To clear drift: bring the spec back in line (`/update-spec <Name>`), then record the new hash
with `node scripts/stamp-spec-api-hash.mjs <Name>`.

## Options rejected

- **Warn in CI instead of failing.** Decision 0009: a warning nobody is required to read is a
  comment.
- **A baseline of grandfathered drift.** There is no drift today, so there is nothing to
  grandfather. A baseline would only make room for more.
- **Stamp hashes automatically in CI.** That would make every spec "current" by definition and
  turn the check into a formality. The stamp is a person saying the spec was reviewed.

## Consequences

- A PR that changes a component's props, types, union members, defaults or exports must update
  that component's spec in the same PR.
- A change that does not alter the public surface (styling, internals, comments) does not
  touch the hash and needs no spec change.
- The `lab` layer is reported as `SKIPPED` until `packages/components/src/lab` exists; when it
  does, Lab components are checked like the rest.
