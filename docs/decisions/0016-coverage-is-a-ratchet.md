# 16. Every component has a story and a test, held by a ratchet

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** `packages/components/src/__tests__/coverage.test.ts`, `coverage-baseline.json`, every new component or primitive

## Context

CLAUDE.md's "New Component" steps asked for a story and a spec but not a test, and nothing
checked any of them. On 2026-10-27, of the 50 entries in `docs/contracts/api-surface.json`
(43 components, 7 primitives):

- every one was imported by at least one story;
- 7 were imported by no unit test: Avatar, CaseStudy, DescriptionList, Divider, StatusLine,
  TuiIcon, Window.

Matching by file name instead overstated the gap at 10: `Link` is covered by
`ListRowLink.test.tsx`, `Skeleton` by `EmptyState.test.tsx`, `Textarea` by
`FieldFocusStates.test.tsx`.

Aura DS enforces the same thing with `check_export_has_story.dart` and
`component_page_tabs_test.dart`, against baselines that only fail on new entries. Its
`token-wiring-baseline.txt` grew to 661 entries that way: a one-way ratchet holds the line but
never pulls the debt down, and nothing notices when an entry is fixed.

## Decision

`coverage.test.ts` runs in `npm test`. For every entry in the API surface manifest it asserts:

1. some `*.stories.tsx` imports one of the entry's runtime exports from `@scorp-ds/components`;
2. some test in `packages/components/src/__tests__` imports one of its runtime exports.

Runtime exports are the manifest's `function` and `const` kinds; types do not count.

Existing gaps live in `coverage-baseline.json`, each with a reason. **The ratchet runs both
ways**: a gap not in the baseline fails, and a baseline entry that is now covered fails until
it is removed. The story list starts empty, so stories are zero-debt from day one.

Specs are not checked here: `scripts/detect-spec-drift.sh` already fails CI on a missing spec
(decision 0015).

## Options rejected

- **Match on file names** (`Button.test.tsx` for `Button`). Simple, and wrong in both
  directions: it misses real coverage in shared test files and is satisfied by an empty file.
- **A one-way baseline, like Aura's.** It lets the list go stale, since nothing makes anyone
  delete a fixed entry, and a stale list hides the next gap behind a name that looks handled.
- **Write the seven tests first, then add the rule with no baseline.** Cleaner, but it holds the
  rule hostage to seven unrelated PRs. CaseStudy is also mid-rework in #79.
- **Measure line coverage instead.** A percentage says how much ran, not whether each component
  was looked at. The question here is per component.

## Consequences

- A new component or primitive cannot merge without a story and a test that import it.
- Closing a gap is a two-line change: the test file, and deleting its baseline entry.
- The check is only as complete as the manifest. Something exported from the barrel but missing
  from `generate-api-surface.mjs`'s scan is invisible to it.
- An import is the floor, not the bar: a test that imports a component and asserts nothing
  passes. Review still decides whether a test is any good.
