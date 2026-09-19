# Token audit report — 2026-04-04

**Scope:** Compare `design-tokens.md` to `packages/tokens/src/tokens.json` and note drift vs `packages/tokens/src/styles/tokens.css`.

## Summary

| Category | Count |
|----------|-------|
| Gaps fixed in this pass (spacing steps missing from doc) | 7 tokens documented (`0`, `5`, `10`, `12`, `16`, `20`, `24`) |
| JSON vs CSS value mismatches (documented, not auto-fixed) | Motion durations, radius |
| design-tokens.md vs tokens.json semantic tables | Aligned for surface / text / button (prior state) |

## Category A — Was missing from design-tokens.md (fixed)

| Token | Notes |
|-------|--------|
| `spacing.0` | Now in spacing table |
| `spacing.5` | Now in spacing table |
| `spacing.10` | Now in spacing table |
| `spacing.12` | Now in spacing table |
| `spacing.16` | Now in spacing table |
| `spacing.20` | Now in spacing table |
| `spacing.24` | Now in spacing table |

## Category C — Resolved value / layer mismatch

| Area | `tokens.json` | `tokens.css` (runtime) | Action |
|------|---------------|-------------------------|--------|
| `duration.*` | 150ms / 200ms / … | 50ms / 75ms / … | Documented dual view in `design-tokens.md`; consider regenerating CSS from parser or editing JSON to match shipped CSS |
| `radius.*` | 12px / 24px | 0px / 0px | Documented: JSON = reference, CSS = TUI product |

## Recommended next steps

1. Decide single source for motion: either **update `tokens.css`** to match `tokens.json`, or **change `tokens.json`** to match intentional TUI motion in CSS, then re-run this audit.
2. Run `pnpm --filter @scorp-ds/tokens build` if a code generator emits `tokens.css` in the future; today the file is maintained alongside JSON.
