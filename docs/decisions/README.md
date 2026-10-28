# Decision records

Why the system is the way it is. Rules live in `CLAUDE.md`; the reasoning behind them
lives here.

**Read the relevant record before changing a pattern. Write a new one when you change
a pattern.** A record is never edited to reverse its meaning: supersede it with a new
record and mark the old one `superseded by`.

Start from `0000-template.md`. Number sequentially.

| # | Decision | Affects |
|---|---|---|
| [0001](0001-plates-replace-border-radius.md) | Plates replace border radius | Shape language, every softened corner |
| [0002](0002-focus-rings-are-inset.md) | Focus rings are inset box-shadows | Every focusable component |
| [0003](0003-one-bit-icon-set.md) | 1-bit pixel-art icon set | `TuiIcon`, the glyph audit |
| [0004](0004-dark-is-the-default-theme.md) | Dark is the default theme | Theming, contrast, the CI a11y matrix |
| [0005](0005-vendored-copies-not-a-published-package.md) | Consumers vendor a committed copy | Every merge to `main` |
| [0006](0006-components-use-semantic-aliases-only.md) | Semantic aliases only, never raw scales | Every component |
| [0007](0007-tokens-json-and-tokens-css-are-both-hand-maintained.md) | Both token files are hand-maintained | `packages/tokens` |
| [0008](0008-specs-live-in-the-repo-only.md) | Specs live in the repo only | `docs/specs/` |
| [0009](0009-claude-md-rules-are-enforced-by-lint.md) | Every "never" gets a check that fails | Lint, CI |
| [0010](0010-one-rule-weight.md) | One rule weight in the system | Dividers and separators |
| [0011](0011-unified-size-scale.md) | One size scale: `sm` \| `md` \| `lg` | Every sized component |
| [0012](0012-stories-drive-their-own-interactions.md) | Stories drive their own interactions via `play` | Visual regression, story authoring |
| [0013](0013-update-writes-only-changed-baselines.md) | `--update` writes only the baselines that changed | Visual regression, baseline refreshes |
| [0014](0014-case-studies-are-structured-pages.md) | Case studies are structured pages, not block lists | `CaseStudy`, the portfolio's case studies |
| [0015](0015-ci-checks-are-required-to-merge.md) | CI checks are required to merge into `main` | The `main` ruleset, every PR |
| [0016](0016-spec-drift-is-a-ci-gate.md) | Spec drift fails CI | `detect-spec-drift.sh`, CI, every spec |
| [0017](0017-coverage-is-a-ratchet.md) | Every component has a story and a test, held by a ratchet | `coverage.test.ts`, every new component |
| [0018](0018-pin-actions-and-let-dependabot-move-them.md) | Pin actions to commits; Dependabot moves them | Every workflow, dependencies |
| [0019](0019-main-health-is-one-issue.md) | The health of `main` is one GitHub issue | `main-health.yml`, issues |
| [0020](0020-baselines-refresh-by-commit-tag.md) | Visual baselines are refreshed by a commit tag | Visual regression, every rendered change |
| [0021](0021-consumers-are-built-before-merge.md) | Consumers are built against a change before it merges | `check-consumers.mjs`, API changes |
| [0022](0022-field-focus-is-a-colour-change.md) | Text-field focus is a colour change, not an inset ring | `Input`, `Textarea` |
| [0023](0023-semantic-tokens-are-referenced-by-variable.md) | Semantic tokens are referenced by variable; every variable is checked | Components, stories, presets, the preset |
| [0024](0024-one-prop-vocabulary.md) | One prop vocabulary, and one way to deprecate a name | Every component's public props |
| [0025](0025-motion-cap-is-for-interactive-states.md) | The 200ms cap is for interactive states; overlays may take longer | Transitions, `global.duration` |
| [0026](0026-a-spec-is-stable-when-it-meets-the-bar.md) | A spec is `stable` when it meets a checkable bar | `docs/specs/`, the catalog |
| [0027](0027-half-step-spacing-is-tokenised.md) | Half-step spacing gets tokens; off-scale steps are errors | `global.spacing`, the preset |
