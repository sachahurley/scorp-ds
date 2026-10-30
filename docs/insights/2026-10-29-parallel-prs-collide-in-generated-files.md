# Parallel PRs collide in generated files, not in source

- **Source:** landing about 25 agent-readiness PRs into `main` on 2026-10-28 and 2026-10-29, most of them prepared in parallel by agents in separate worktrees
- **Date:** 2026-10-29

## Finding

Source conflicts between the parallel PRs were rare, because each agent owned a disjoint set of
files. The conflicts that did happen were almost all in files no one writes by hand:
`docs/contracts/api-surface.json`, `docs/component-references/catalog.md`, and the `API hash`
row of each spec. Three things made them worse than they looked:

1. **A green PR is not green on today's `main`.** `main` is not required to be up to date
   (ruleset `strict: false`), so a PR whose checks passed an hour ago can still produce a stale
   manifest once merged. Every merge was preceded by merging the PR into a probe of the current
   `main`, regenerating, and running every check; if regeneration changed anything, the PR was
   rebased and re-run instead of merged.
2. **The manifest's value order was not stable.** Values reached through an alias were listed in
   the type checker's creation order, so adding a literal anywhere could reorder, and re-hash,
   components nobody touched (#123 moved Box, Center and Container). Fixed in #130: values sort
   by where they appear in source.
3. **Re-attributing CI's baseline commit on a rebased branch can roll other frames back.**
   Checking out the whole `visual-baselines/` folder from the bot's commit restores every frame
   as it was on that commit's older base; on #103 that reverted #98's 14 CaseStudy frames.
   Check out only the files the bot commit touched.

## Lesson

Resolve generated files by regenerating, never by hand-merging. Merge a PR only after it has been
verified against the `main` it is about to land on. Anything a PR copies from another commit
(frames, lockfiles) is copied file by file, by name.
