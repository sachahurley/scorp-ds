# 15. CI checks are required to merge into `main`

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** the `main` branch ruleset, every pull request, every check in `.github/workflows/`

## Context

By October 2026 the repo had real checks: lint with eight `scorp/*` rules, type-check,
unit tests, the API surface manifest, an axe pass over every story in both themes, a
glyph audit, and 542 visual baselines. None of them could stop a merge. The GitHub API
returned `Branch not protected` for `main` and an empty list of rulesets, so a red check
was a suggestion that a merge could ignore.

Aura DS ran the same experiment for us. Its tooling audit of 2026-10-19
(`aura_ds/docs/audit-task1-tooling-2026-10-19.md`) found three ratchets red for weeks
while work kept landing: 96 new token-wiring violations in 20 files, 17 spec-drift
entries outside the baseline, and 11 story-structure failures. Its conclusion: *"A ratchet
only works if a red gate stops the merge."* Every check here is a ratchet in the same
sense (decision 0009 holds a clean baseline), so the same failure was available to us.

## Decision

A ruleset on `main` requires a pull request and requires these status checks to pass:

| Check | Workflow | What it covers |
|---|---|---|
| `checks` | `CI` | Lint, type-check, unit tests, API surface manifest, spec drift |
| `storybook-test-runner` | `Storybook a11y` | Glyph audit, axe on every non-skipped story, light and dark |
| `visual` | `Visual regression` | Every story's screenshot against its baseline, light and dark |

The names are job ids, which is what GitHub matches. **Renaming a job, or a workflow
adding a `paths` filter, silently changes what is required**: a required check that never
reports leaves every pull request waiting forever. Change the ruleset in the same PR.

Branches do **not** have to be up to date with `main` before merging. Force pushes to and
deletion of `main` are blocked. The repository admin keeps bypass, as the emergency exit
for a broken runner, not the normal way to merge.

## Options rejected

- **Leave the checks advisory and rely on review.** That is the position Aura measured
  failing, and the one this repo was already in.
- **Require only the fast `checks` job.** It fails in about a minute, but accessibility
  and appearance are what this system is for; a merge that breaks them is the one most
  worth stopping.
- **Require branches to be up to date.** With three checks of up to 17 minutes, each
  merge would force a rebase and a fresh run on every other open pull request. The
  checks are deterministic against the merge commit, so the cost buys little.
- **No admin bypass.** A Chromium or GitHub runner change can turn `visual` red with no
  change of ours; with no bypass, fixing that would need a ruleset edit mid-incident.

## Consequences

- A red check now blocks the merge button. Merges stay human-approved, as before.
- Visual regression takes about 17 minutes, so a pull request is mergeable no sooner than
  that.
- Visual baseline refreshes must land in the same pull request as the change that causes
  them, or that pull request cannot merge.
- Using the bypass should be rare enough to mention in the PR description.
