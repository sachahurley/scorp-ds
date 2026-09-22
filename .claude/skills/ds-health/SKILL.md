---
name: ds-health
description: Run a full health check across all design system layers: spec drift, design tokens, storybook, spec staleness vs source, static analysis, tests, and hardcoded values. Produces a dashboard-style report with prioritized action items.
argument-hint: "[quick | tokens | <empty for all>]"
allowed-tools: Read, Grep, Glob, Bash
---

# Design System Health Check

> Before running: read `.claude/ds-config.json` to get the stack type, paths, and class prefix for this project.

Run all system checks and produce a unified status dashboard. This is a **read-only** audit — no files are modified.

## Scope Modes

- **No argument** (`/ds-health`): Run all checks.
- **`quick`** (`/ds-health quick`): Skip the storybook token audit. Fastest option.
- **`tokens`** (`/ds-health tokens`): Run only token-related checks.

## Checks

### Check 1: Spec Drift

Run `bash scripts/detect-spec-drift.sh` and capture stdout. Parse summary lines.

Status:
- OK if no stale or missing specs
- FAIL otherwise (list filenames from the output)

### Check 2: Design Token Docs

Compare `design-tokens.md` against the actual foundation files. Use the same logic as `/token-audit`.

Read all foundation files from `.claude/ds-config.json: paths.foundation`. Extract all public, non-deprecated semantic tokens. Compare against tokens referenced in `design-tokens.md`.

Status:
- OK if 0 discrepancies
- WARN if 1-3 discrepancies
- FAIL if 4+ discrepancies

### Check 3: Storybook Token Compliance (skipped in `quick` mode)

Scan the storybook directories from `.claude/ds-config.json: paths` for hardcoded values and token misuse. Use the same logic as `/storybook-audit`.

Key patterns to grep for:
- Raw color literals (hex values, `Color(0x`, `rgb(`, `#` in TS component files)
- Raw spacing numbers in EdgeInsets or CSS
- Raw font sizes
- Raw border radii

Status:
- OK if 0 violations
- WARN if 1-5 violations
- FAIL if 6+ violations

### Check 4: Spec Staleness vs Source

Read every spec file in `docs/specs/*.md`. For each spec, extract the "Last updated" date from the Status table (older specs may still say "Last synced"; treat it the same) and compare against the source file's last git commit date.

Flag as stale if:
- The source file commit date is after the "Last updated" date, OR
- The "Last updated" date is more than 30 days before today

Status:
- OK if 0 stale specs
- WARN if 1-4 stale specs
- FAIL if 5+ stale specs

### Check 5: Static Analysis

Read `.claude/ds-config.json: stack` to determine the check:

- **flutter**: Run `flutter analyze --no-pub` from the ds directory
- **react-ts**: Run `tsc --noEmit && eslint src`

Status:
- OK if exits cleanly
- FAIL if issues found (report count)

### Check 6: Tests

Read `.claude/ds-config.json: stack` to determine the check:

- **flutter**: Run `flutter test --no-pub` from the ds directory
- **react-ts**: Run `pnpm test`

Status:
- OK if all pass (report pass count)
- FAIL if any fail (report fail count)

### Check 7: Hardcoded Value Scan

Grep component and primitive directories for raw values in component code. Same checks as `/review-component` but applied broadly.

Status:
- OK if 0 violations
- WARN if 1-5 violations
- FAIL if 6+ violations

## Output Format

```
## Design System Health Check — YYYY-MM-DD

| System               | Status  | Details                             |
|----------------------|---------|-------------------------------------|
| Spec drift           | ✓ OK    | 82/82 up to date                    |
| Design token docs    | ⚠ WARN  | 2 missing from docs                 |
| Storybook tokens     | ✓ OK    | 0 violations across 47 files        |
| Spec staleness       | ⚠ WARN  | 5 stale (3 code drift, 2 time)      |
| Static analysis      | ✓ OK    | No issues found                     |
| Tests                | ✓ OK    | 148 passed                          |
| Hardcoded values     | ✓ OK    | 0 violations in components          |

### Action Items

> Only list items for FAIL and WARN statuses. Omit if everything is OK.

1. **Design token docs** — 2 tokens in code missing from design-tokens.md. Run `/token-audit` for details.
2. **Spec staleness**: 5 specs are older than their source. Run `/sync-specs` or `/update-spec <name>` for each.
```

## Important

- **Do NOT modify any files.** Read-only audit.
- Always run static analysis with `--no-pub` (Flutter) to skip dependency resolution.
- In `quick` mode, skip Check 3 entirely and note it was skipped.
- In `tokens` mode, run only Checks 2 and 4.

## Related Skills

- `/token-audit` — Deep dive on design token doc sync
- `/storybook-audit` — Deep dive on storybook token compliance
- `/sync-specs`: Batch-update stale specs in docs/specs/
- `/review-component` — Audit a single component for CLAUDE.md compliance
- `/a11y-audit` — WCAG AA accessibility audit
