# 9. Every "never" in CLAUDE.md gets a check that fails

- **Status:** accepted
- **Date:** 2026-09-22
- **Affects:** `eslint-rules/`, `eslint.config.mjs`, CI

## Context

`CLAUDE.md` stated a set of hard rules: no raw colours, no border radius, no sans-serif,
no raw colour scales, no legacy package import, JSDoc on every public component. All of
them were prose. ESLint was 23 lines of stock recommended config with zero custom rules,
so the only thing enforcing any of it was whoever happened to be reading.

Separately, `npm run lint`, `npm test` and `npm run type-check` all existed as working
scripts, and **no CI workflow invoked any of them**. 48 test files never ran on a pull
request.

## Decision

Two parts.

1. **Wire the existing checks into CI.** A `CI` workflow runs lint, type-check and unit
   tests on every push and pull request.
2. **Give every "never" a rule.** Seven `scorp/*` ESLint rules, scoped to
   `packages/components/src` (and the shape/type rules to stories and presets):
   `no-raw-color`, `no-raw-scale`, `no-rounded`, `no-sans`, `no-arbitrary-values`,
   `no-legacy-package`, `public-jsdoc`.

A rule is only added when the codebase **already satisfies it**. These are ratchets that
hold a clean baseline, not a backlog.

## Options rejected

- **Keep it as prose and rely on review.** The status quo, which had already let four
  violations through.
- **Use a generic Tailwind lint plugin.** None of these rules are generic: they encode
  this system's shape language and token architecture.
- **Warn instead of error.** A warning in a repo with no CI gate is a comment.

## Consequences

- `packages/tokens` is deliberately **excluded**: it is the one place raw values live.
- `no-arbitrary-values` needed the most care. Of 364 bracket classes in components, 331
  are the sanctioned `-[var(--token)]` form and 12 are `content-['']` markers; the rule
  fires only on bare numeric literals. Five genuine one-offs are allowlisted **with
  reasons** in `eslint.config.mjs`. Adding to that list is the pressure valve, and each
  entry has to justify itself.
- Class-based rules cannot see everything. Raw values hide in inline `style` objects and
  in JS string constants such as clip-path polygons; the Tooltip caret hid ~28 px values
  that way. Reviewers still have to look.
- `packages/site` type-checks against the built `@scorp-ds/components` dist, so CI
  builds components before type-check.
