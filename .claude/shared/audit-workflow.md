# Audit Workflow — Shared Reference

Standard workflow for read-only audit skills (`/review-component`, `/storybook-check`, `/token-audit`).

## Workflow Pattern

1. **Read the reference document(s)** — the rules to audit against
2. **Read the target file(s)** — what's being audited
3. **Run each check** — compare target against rules, noting pass/fail with specific line numbers
4. **Report results** — structured output with summary, per-check results, and recommended fixes

## Output Template

```
## {Audit Type}: [target name]

### Summary
- Total checks: N
- Passed: X
- Failed: Y
- Deferred: Z (if applicable)

### Results

#### 1. {Check Name} — PASS/FAIL
[Details with line numbers if failed]

#### 2. {Check Name} — PASS/FAIL
...

### Recommended Fixes
1. [Specific fix with file path and line number]
2. ...
```

## Rules

- **Do NOT modify any files.** These are read-only audits.
- **Always include line numbers** for any issues found.
- **Skip deprecated tokens** — they are intentionally excluded.
- **Report deferred rules as "DEFERRED"**, not "FAIL" (rules marked as future/deferred in the spec).
