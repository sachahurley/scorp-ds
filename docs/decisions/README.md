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
