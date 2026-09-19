---
name: vendor-portfolio
description: Run after ANY scorp-ds merge to main — pulls the local checkout, re-vendors the DS into the portfolio, and ships the vendor PR so the live site picks up the change. The site only reads its committed vendor/ copy, so skipping this leaves the site on the old DS.
---

# Vendor Portfolio — ship a merged DS change to the live site

> **Trigger rule:** every time a scorp-ds PR merges to `main`, run this skill
> immediately, unless the user explicitly says the change should not ship yet.
> Sacha will not remember to ask; the agent owns this follow-through.

The portfolio (`~/Projects/portfolio`, deployed to Vercel from its `main`)
carries a committed copy of scorp-ds under `vendor/`. Changes flow one way:

```
scorp-ds main (GitHub) → ~/Projects/scorp-ds (local main) → portfolio vendor/ → portfolio main → Vercel
```

## Steps

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

## Notes

- GitHub pushes to the portfolio must use the `sachahurley` account
  (`sacha-hurley` gets 403).
- A `post-merge` git hook in `~/Projects/scorp-ds` prints this checklist as a
  reminder whenever main is pulled after a merge.
- Related: `/release-notes` (scorp-ds changelog) pairs well before vendoring.
