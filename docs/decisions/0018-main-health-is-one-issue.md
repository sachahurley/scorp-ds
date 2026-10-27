# 18. The health of `main` is one GitHub issue

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** `.github/workflows/main-health.yml`, `scripts/ds-health.sh`, the repo's issues

## Context

With checks required on pull requests (decision 0014), `main` can still go red: a Pages deploy
fails, a check is bypassed, or a dependency advisory is published after the last merge. Before
this, a red run on `main` surfaced only on the Actions page and in a GitHub email, and
`ds-health.sh` ran only when someone remembered to.

Aura DS solved the same problem with `ds-health-main-design.yml`: one issue, opened when the
trunk fails, commented on while it stays red, closed when it passes. Its schedule never fired,
because GitHub only runs schedules from the default branch and Aura's trunk is not it. Here
`main` is the default branch, so the schedule works.

## Decision

`main-health.yml` keeps one issue titled **main health check is failing**:

- It runs when CI, Storybook a11y or Deploy Storybook completes on `main`; weekly on Monday at
  13:00 UTC; and by hand.
- Each run looks at the **latest completed run of all three** workflows, not just the one that
  triggered it, so a green CI cannot close an issue that a red deploy opened. A `cancelled` run
  (a deploy superseded by a newer push) counts as green.
- The weekly and manual runs also run the full `ds-health.sh`. A failure there counts.
- `npm audit` is written to the run summary and **does not** open the issue (decision 0017).
- Any failure opens the issue or comments on it; all green closes it with a comment.

It is report-only: no push, no code change, default token, `issues: write` and nothing more.
That follows the CLAUDE.md autonomy rule for scheduled runs.

## Options rejected

- **Rely on GitHub's failure emails.** They go to whoever pushed, one per run, and say nothing
  when things recover. An issue has one state and a history.
- **One issue per failure.** Ten red runs on one cause become ten issues to close.
- **Check only the triggering workflow.** It closes the issue on the first green run of any
  watched workflow, while another is still red.
- **Run the full health check on every `workflow_run`.** It repeats what CI just did, at
  several minutes a time; the weekly run is for what a push cannot catch.

## Consequences

- An open issue with that title means `main` is red right now; nothing else does.
- Adding a workflow that should count means adding it to both `workflows:` and `WATCHED`.
- Renaming a watched workflow silently stops it being watched.
