# The checks were good; nothing made them block

- **Source:** read-only comparison of scorp-ds against Aura DS's quality tooling (`~/BF-Work/repo/aura_ds`, branch `design/card-system-build`)
- **Date:** 2026-10-27

## Finding

The two systems are strong in opposite places.

| | Aura DS | scorp-ds |
|---|---|---|
| Rule enforcement | Shell and Python greps; analyzer lints | Eight `scorp/*` ESLint rules on the AST |
| Debt | Ratchet baselines: 661 token-wiring, 126 spec-drift, 11 story-structure entries grandfathered | No baseline: a rule lands only once the code passes it |
| Coverage guards | Tests fail when a page has no states list, a Lab widget has no golden, an export has no story | None. 10 of 43 components have no test file |
| Accessibility | Contrast tests on named widgets | Axe on every story, both themes, in CI |
| Spec drift | Commit dates | API hashes, but the script exited 0 on drift and no workflow ran it |
| Trunk alerts | A workflow opens and closes a GitHub issue | None |
| Merge gate | CI on PRs and design branches | **`main` unprotected, no rulesets** |

Aura's own audit found its ratchets red for weeks while work landed, and named the cause:
the gate did not stop the merge. scorp-ds had the same gap with better checks behind it.

## Lesson

A check is only as strong as the thing that acts on its result. Before adding a check, confirm
something fails when it does: the script's exit code, the workflow that runs it, and the
branch rule that requires that workflow. Each of the three was missing somewhere here.

Decisions that followed: `../decisions/0015-ci-checks-are-required-to-merge.md`,
`../decisions/0016-spec-drift-is-a-ci-gate.md`.
