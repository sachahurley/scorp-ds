---
name: release-notes
description: Generate a formatted changelog, update CHANGELOG.md and package version, and tag the release
argument-hint: "[patch|minor|major|<version>] (default: minor)"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Release Notes — Generate Changelog & Tag Release

> Before running: read `.claude/ds-config.json` to get the package paths and stack for this project.

Generate a versioned changelog from git history, spec changes, and storybook updates. Update `CHANGELOG.md` and the package version file, and create a git tag.

## Reference Files

Read `.claude/ds-config.json: paths` and `.claude/ds-config.json: stack` to determine:
- **Package changelog** → `{paths.ds}/CHANGELOG.md`
- **Package version** -> root `package.json`
- **Spec changelog** → `docs/specs/CHANGELOG.md`
- **Stories** → `{paths.stories}/*`
- **CLAUDE.md** → Project rules

## Steps

### 1. Determine the current and next version

Read the root `package.json` `version` field.

Check for existing git tags:
```
git tag -l "v*" --sort=-v:refname
```

**Parse `$ARGUMENTS`:**
- If empty or not provided: default to `minor` bump
- If `patch`, `minor`, or `major`: apply semver bump to current version
- If a specific version string (e.g. `0.2.0`): use it directly
- Validate that the new version is greater than the current version. Abort if not.

**Version bump rules:**
- `patch`: 0.1.0 → 0.1.1
- `minor`: 0.1.0 → 0.2.0
- `major`: 0.1.0 → 1.0.0

**First release case:** If current version is `0.0.1` and no tags exist, default next version to `0.1.0` (unless overridden by `$ARGUMENTS`).

### 2. Gather git commits since last tag

Determine the commit range:
```bash
# If tags exist:
git log <latest-tag>..HEAD --oneline --format="%h %s"

# If no tags exist (first release):
git log --oneline --format="%h %s"
```

Parse each commit message using conventional commit format. Extract:
- **Type prefix**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`, `perf:`, `ci:`, `build:`
- **Description**: the remainder of the first line after the prefix

**Filtering rules:**
- Skip commits starting with `Merge branch`
- Cap at 100 commits. If more exist, include the 100 most recent and note "(N earlier commits omitted)"

Group commits by type. Sort groups: feat → fix → refactor → perf → docs → chore → style → test → ci → build.

### 3. Gather spec changes

Read `docs/specs/CHANGELOG.md`. Parse the table rows.

Determine the date range:
- If a previous tag exists: find the tag's date with `git log -1 --format=%ai <tag>`
- If no tags: include all rows

Filter rows to only those with a date after the last tag. For each matching row, format as:
```
- Spec: {ComponentName} {Version} — {Summary} ({Date})
```

### 4. Detect storybook updates

Find story files changed since the last tag:
```bash
# If tags exist:
git diff --name-only <latest-tag>..HEAD -- "{paths.stories}/*"
```

For each changed story file:
- Extract the story name from the filename
- Get the date of the most recent commit that touched it

Consolidate into a single bullet:
```
- Storybook: Updated {story1}, {story2}, {story3} stories ({date})
```

If more than 5 stories changed, list the first 5 and add "(and N more)".

### 5. Format the version section

Assemble the changelog block:

```markdown
## [v{VERSION}] {YYYY-MM-DD}

- feat: {description}
- feat: {description}
- fix: {description}
- Storybook: Updated {stories} stories ({date})
- Spec: {ComponentName} v1 — {summary} ({date})
```

Rules:
- Each git commit gets its own bullet, prefixed with its type
- Spec entries are prefixed with `Spec:`
- Storybook entry is a single consolidated bullet prefixed with `Storybook:`
- No sub-sections — flat bullet list
- Version header date is always today's date
- Commit dates are omitted (only spec and storybook bullets include dates)

### 6. Preview and confirm

Display the formatted version section to the user using `AskUserQuestion`. Also show:

```
### Release Preview

Version: {current} → {next}
Commits: {count}
Spec changes: {count}
Storybook updates: {count story files}

{formatted version section from Step 5}

Proceed with release? This will:
1. Update CHANGELOG.md
2. Update package version to {next}
3. Create git tag v{next}
```

**Wait for user confirmation.** Do NOT proceed without explicit approval.

### 7. Update CHANGELOG.md

Read the current `CHANGELOG.md`. Prepend the new version section at the top.

### 8. Update package version

**React/TS:** Edit the root `package.json` `version` field.

### 9. Create git tag

Ask the user for confirmation before tagging:

```
Ready to create git tag v{VERSION}. This will NOT push to remote.
Create tag? (y/n)
```

If confirmed:
```bash
git tag -a v{VERSION} -m "Release v{VERSION}"
```

Print:
```
Tag v{VERSION} created locally.
To push: git push origin v{VERSION}
```

**Never push the tag automatically.** The user must do it manually.

### 10. Output summary

```
## Release: v{VERSION}

### Changelog
- Commits included: {count}
- Spec changes included: {count}
- Storybook updates included: {count}

### Files Updated
- CHANGELOG.md — prepended v{VERSION} section
- Package version — bumped from {old} to {new}

### Git Tag
- Tag: v{VERSION}
- Status: Created locally / Skipped by user
- Push command: git push origin v{VERSION}
```

## Important

- **Always preview before writing.** Never update files without showing the user the changelog first and getting confirmation.
- **Never push tags or commits automatically.** Only create the local tag. The user pushes.
- **Skip merge commits.** Filter out any commit starting with "Merge branch".
- **Handle first release gracefully.** When no tags exist, include all commits (capped at 100).
- **Preserve existing changelog entries.** When prepending, never modify or remove previous version sections.
- **Date is always today's date** for the version header.
- **If `$ARGUMENTS` is empty**, default to a minor bump. Do not ask — just preview with the default.

## Related Skills

- `/update-spec` — Generates component specs (its local changelog entries feed into the Spec section)
- `/audit-cascade` — Trace token change blast radius before a release
- `/token-audit` — Verify design-tokens.md is in sync before releasing
- `/review-component` — Audit components for CLAUDE.md compliance before release
