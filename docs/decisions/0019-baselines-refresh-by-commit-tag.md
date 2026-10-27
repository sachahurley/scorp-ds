# 19. Visual baselines are refreshed by a commit tag

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** `.github/workflows/visual-regression.yml`, `ci.yml`, `storybook-a11y.yml`, every PR that changes rendered output

## Context

A PR that changed how anything renders needed new baselines, and the only route was: dispatch
Visual regression with `update`, wait, download the `visual-baselines` artifact, unzip it over
`packages/storybook/visual-baselines/`, commit, push. With `visual` now a required check
(decision 0014), that round trip sits in front of every rendered change.

Aura DS replaced the same round trip with a commit tag: `[update-goldens]` makes a workflow
regenerate the goldens on Linux and commit them back. Its bot pushes with the default
`GITHUB_TOKEN`, and **a push made with that token starts no workflows**. So the bot's commit had
no checks, and Aura's history carries a hand-made `Re-run checks after the goldens bot` commit
after each refresh: seven of them in its recent log.

## Decision

When the latest commit of a same-repo pull request has `[update-baselines]` in its message, the
`visual` job, instead of comparing:

1. checks out the branch itself (not the merge commit a `pull_request` run uses);
2. runs `visual-regression.mjs --update`, which writes only frames that changed (decision 0013),
   adds new ones and prunes removed ones;
3. commits them to the branch as `github-actions[bot]`, or does nothing if no frame moved;
4. dispatches `ci.yml`, `storybook-a11y.yml` and `visual-regression.yml` on the branch.
   `workflow_dispatch` is the one event the default token is allowed to start, and the checks it
   produces attach to the new commit, so the required checks report without a hand-made commit
   and without a personal access token.

The bot's own commit message does not contain the tag, so re-running checks on it compares.
Pull requests from forks never refresh: their token is read-only.

The manual `update` and `force` inputs stay, for a Chromium or runner upgrade and for a branch
with no pull request.

Review is unchanged: the new PNGs are in the PR's "Files changed" tab, where GitHub shows before
and after, and CLAUDE.md still requires a rendered change to be approved in both themes.

## Options rejected

- **A personal access token for the push.** Its push would trigger checks normally, but it is a
  long-lived secret with write access, tied to one person, that expires.
- **Copy Aura's bot as is.** It trades one manual step for another, and the empty commit it needs
  is easy to forget, leaving a PR waiting on checks that never come.
- **Refresh in a separate workflow.** It would need the same dispatch trick, plus its own build,
  for no gain over a step in the job that already built Storybook.
- **Refresh automatically whenever `visual` fails.** It would turn every regression into a new
  baseline. The tag is a person saying the change is intended.

## Consequences

- A rendered change is one push: commit the change with `[update-baselines]` in the message.
- The `visual` job gets `contents: write` and `actions: write`. They are used only on a refresh;
  a fork's token cannot use them.
- The checks on the bot's commit appear as `workflow_dispatch` runs in the Actions tab, not
  `pull_request` runs.
- Anyone who can push to a branch can refresh its baselines. Approval still happens at merge.
