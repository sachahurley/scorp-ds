---
name: vendor-portfolio
description: Run after ANY scorp-ds merge to main — pulls the local checkout, re-vendors the DS into BOTH consumers (the portfolio and the Scorpion UI v2 showcase), and ships their vendor PRs so the live sites pick up the change. Both sites only read committed vendored copies, so skipping this leaves them on the old DS.
---

# Vendor consumers — ship a merged DS change to the live sites

> **Trigger rule:** every time a scorp-ds PR merges to `main`, run this skill
> immediately, unless the user explicitly says the change should not ship yet.
> Sacha will not remember to ask; the agent owns this follow-through.
> BOTH consumers get re-vendored in the same pass (decided 2026-09-20 after
> the showcase silently drifted): the portfolio (Part A) and the Scorpion UI
> v2 showcase (Part B).

The portfolio (`~/Projects/portfolio`, deployed to Vercel from its `main`)
carries a committed copy of scorp-ds under `vendor/`. The showcase
(`~/Desktop/scorpion-ui-v2`, deployed to GitHub Pages at
`sachahurley.github.io/scorpion-ui-v2`) vendors component sources +
tokens via its own `vendor:ds` script. Changes flow one way:

```
scorp-ds main (GitHub) → ~/Projects/scorp-ds (local main) ─┬→ portfolio vendor/ → portfolio main → Vercel
                                                           └→ scorpion-ui-v2 src/components/ui + vendor/ → main → gh-pages
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

## Part B — Scorpion UI v2 showcase

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

3. **Build, commit, PR, merge** (`npm run predeploy` = build + copy
   `dist/index.html` → `dist/404.html`; that copy is the SPA deep-link
   fallback for GitHub Pages — never remove it). The repo has no CI
   checks, so merge right after the PR is up.

4. **Deploy from main:**
   ```bash
   git switch main && git pull --ff-only && npm run deploy
   ```
   Then verify the published tree kept everything:
   ```bash
   git fetch origin gh-pages && git ls-tree origin/gh-pages --name-only | grep 404.html
   ```
   **Gotcha (bit us 2026-09-20):** the `gh-pages` npm tool's cache can
   publish a stale tree that silently drops files. If anything is missing,
   `rm -rf node_modules/.cache/gh-pages` and `npm run deploy` again.
   GitHub's CDN caches for ~10 min, so verify via the gh-pages branch, not
   by curling the URL.

## Notes

- GitHub pushes to the portfolio must use the `sachahurley` account
  (`sacha-hurley` gets 403).
- A `post-merge` git hook in `~/Projects/scorp-ds` prints this checklist as a
  reminder whenever main is pulled after a merge.
- Related: `/release-notes` (scorp-ds changelog) pairs well before vendoring.
