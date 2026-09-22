---
name: vendor-portfolio
description: Run after ANY scorp-ds merge to main — pulls the local checkout, re-vendors the DS into ALL THREE consumers (the portfolio, the Scorpion Design System showcase, and scorp-protodash), and ships their vendor PRs so the live sites pick up the change. Every consumer only reads a committed vendored copy, so skipping one leaves it on the old DS.
---

# Vendor consumers — ship a merged DS change to the live sites

> **Trigger rule:** every time a scorp-ds PR merges to `main`, run this skill
> immediately, unless the user explicitly says the change should not ship yet.
> Sacha will not remember to ask; the agent owns this follow-through.
> ALL THREE consumers get re-vendored in the same pass: the portfolio
> (Part A), the Scorpion Design System showcase (Part B, added 2026-09-20
> after it silently drifted), and scorp-protodash (Part C, added 2026-09-21
> at Sacha's request).

The portfolio (`~/Projects/portfolio`, deployed to Vercel from its `main`)
carries a committed copy of scorp-ds under `vendor/`. The showcase
(repo `scorpion-design-system`, local checkout `~/Desktop/scorpion-ui-v2`,
deployed to GitHub Pages at
`sachahurley.github.io/scorpion-design-system`) vendors component sources +
tokens via its own `vendor:ds` script. scorp-protodash (GitHub
`sachahurley/scorp-protodash`, Vercel) pins `@scorp-ds/*` to a committed
copy under `vendor/`, like the portfolio. Changes flow one way:

```
scorp-ds main (GitHub) → ~/Projects/scorp-ds (local main) ─┬→ portfolio vendor/ → portfolio main → Vercel
                                                           ├→ scorpion-design-system src/components/ui + vendor/ → main → CI → gh-pages
                                                           └→ scorp-protodash vendor/ → protodash main → Vercel
```

## Part A — Portfolio

1. **Refresh the local DS checkout** (the vendor script reads `../scorp-ds`):
   ```bash
   git -C ~/Projects/scorp-ds switch main && git -C ~/Projects/scorp-ds pull --ff-only
   ```
   If the checkout is dirty or on another branch, preserve that state first
   (WIP commit on a branch — never bare-stash; the stash is shared across
   worktrees).

2. **Work on a portfolio feature branch off origin/main** (main is sacred):
   ```bash
   cd ~/Projects/portfolio && git fetch origin \
     && git worktree add /tmp/pf-vendor -b ds-vendor-<short-desc> origin/main
   ```

3. **Re-vendor and check:**
   ```bash
   cd /tmp/pf-vendor && npm run vendor:ds && npm run ds:check
   ```
   `ds:check` must print IN SYNC. If `git status vendor/` shows no changes,
   the site already has this DS version — stop here and clean up.

4. **Build, commit, PR, merge:**
   ```bash
   npm install && npm run build
   git add -A && git commit   # describe which DS change this vendors
   git push -u origin <branch> && gh pr create --base main ...
   ```
   Wait for the Vercel check to pass, then merge (Sacha has standing
   preference for the agent handling merges; production is instantly
   revertible via Vercel). Remove the temp worktree afterwards.

5. **Report** the deployed DS version (scorp-ds commit hash) back to Sacha.

## Part B — Scorpion Design System showcase

1. **Branch off main** (repo lives at `~/Desktop/scorpion-ui-v2`; its
   `vendor:ds` reads scorp-ds `origin/main` via git from `$SCORP_DS_DIR`,
   default `~/Projects/scorp-ds`, and fetches it itself — the checkout's
   current branch does not matter):
   ```bash
   cd ~/Desktop/scorpion-ui-v2 && git switch main && git pull --ff-only \
     && git switch -c ds-vendor-<short-desc>
   ```

2. **Re-vendor and verify:**
   ```bash
   npm run vendor:ds && npm run ds:check   # must print IN SYNC
   ```
   If nothing changed, the showcase already has this DS version — stop.

3. **Build, commit, PR, merge.** The build copies `dist/index.html` →
   `dist/404.html`, the SPA deep-link fallback for GitHub Pages — never
   remove it. Merge once the PR's `ds-check` passes.

4. **Merging deploys.** The repo's "Deploy to GitHub Pages" workflow runs on
   every push to main; do not run `npm run deploy` locally. Watch the run,
   then verify the published tree:
   ```bash
   gh run list -R sachahurley/scorpion-design-system --workflow "Deploy to GitHub Pages" --limit 1
   git fetch origin gh-pages && git ls-tree origin/gh-pages --name-only | grep 404.html
   ```
   GitHub's CDN caches for ~10 min, so verify via the gh-pages branch, not
   by curling the URL.

## Part C — scorp-protodash

The main checkout is the Conductor repo `~/conductor/repos/aura-protodash`
(the folder name is historical; its origin is `sachahurley/scorp-protodash`).
Never vendor inside a Conductor workspace: use a temp worktree.

1. **Work on a feature branch off origin/main** (after Part A step 1 has
   refreshed `~/Projects/scorp-ds`; this script builds the DS there and
   stamps `VERSION` with that checkout's HEAD, so it must be on main):
   ```bash
   cd ~/conductor/repos/aura-protodash && git fetch origin \
     && git worktree add /tmp/pd-vendor -b ds-vendor-<short-desc> origin/main
   ```

2. **Re-vendor, then run the full check:**
   ```bash
   cd /tmp/pd-vendor && npm run vendor:ds && npm install && npm run ds:check && npm run check && npm run build
   ```
   `ds:check` must print IN SYNC. `npm run check` = prototype check + lint + typecheck + tests. If
   `git status vendor/` is empty, protodash already has this DS version —
   stop and clean up.

3. **Commit, PR, merge** once the PR's `check` and `ds-check` workflows and Vercel pass
   (Vercel deploys main). Then remove the worktree:
   ```bash
   git -C ~/conductor/repos/aura-protodash worktree remove /tmp/pd-vendor
   ```

## Notes

- GitHub pushes to the portfolio must use the `sachahurley` account
  (`sacha-hurley` gets 403).
- A `post-merge` git hook in `~/Projects/scorp-ds` prints this checklist as a
  reminder whenever main is pulled after a merge.
- All three consumers run a scheduled `ds-check` GitHub Action (daily, on PRs
  and on pushes to main) that goes red when their vendored copy drifts from
  scorp-ds main, so a missed vendor pass surfaces within a day.
- Related: `/release-notes` (scorp-ds changelog) pairs well before vendoring.
