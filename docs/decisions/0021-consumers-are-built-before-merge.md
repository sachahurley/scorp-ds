# 21. Consumers are built against a change before it merges

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** `scripts/check-consumers.mjs`, every PR that changes `docs/contracts/api-surface.json`, `/vendor-portfolio`

## Context

Three sites vendor a committed copy of scorp-ds (decision 0005): the portfolio, the Scorpion
Design System showcase and scorp-protodash. Each has a `ds:check`, but it only answers "does my
vendored copy match the DS?", not "does my code still compile against it?". A renamed prop, a
narrowed union or a dropped export therefore first fails after scorp-ds has merged, as a red
build in a vendor PR that `/vendor-portfolio` is trying to ship, when the fix has to go back
through scorp-ds.

Aura DS hit the same failure: its v0.23.0 merge dropped five settings, a component and three
more settings that the live app used, and nothing noticed. It answered with
`check_app_api_compat.py`, which collects the API names the app uses and checks each against
the DS.

## Decision

`npm run consumers:check` builds every consumer against **this checkout**, before merge. For each
consumer it:

1. adds a throwaway, detached git worktree of the consumer's `origin/main`;
2. runs `npm ci`, the consumer's own `vendor:ds` pointed at this checkout (`SCORP_DS_DIR`,
   plus `SCORP_DS_REF` for the showcase, which reads through git), then its `ds:check` and its
   build or `check`;
3. removes the worktree, pass or fail.

It never commits, never pushes, and never touches the consumers' own checkouts. A consumer whose
vendor script cannot read a branch is reported `SKIPPED` with the reason, never checked against
`origin/main` in silence.

Run it on any PR whose diff changes `docs/contracts/api-surface.json`, and say so in the PR.

## Options rejected

- **Port Aura's name list.** In Dart that script stands in for a compiler run nobody could do
  cheaply. Here the consumers are TypeScript and their own `tsc -b` is the exact check, generics,
  unions and defaults included. A name list would catch less and need maintaining.
- **Run it in CI.** It needs read access to three other repos and three installs per PR. Worth
  revisiting once local runs show what it catches; until then a local script costs nothing to
  change.
- **Keep catching it at vendor time.** That is the status quo, and its cost is a fix that has to
  travel back through a scorp-ds PR after the breaking change is already on `main`.

## Consequences

- A breaking change shows up as a consumer's own compiler error, in the scorp-ds PR.
- A full run takes several minutes: three installs and three builds.
- The showcase is checked at this checkout's HEAD commit, so commit before running. The other two
  include uncommitted changes.
- Consumer paths default to the ones in CLAUDE.md, overridable with `PORTFOLIO_DIR`,
  `SHOWCASE_DIR` and `PROTODASH_DIR`. A missing consumer exits 2.
