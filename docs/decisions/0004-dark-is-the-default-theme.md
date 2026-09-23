# 4. Dark is the default theme

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled)
- **Affects:** `ThemeProvider`, Storybook preview, every semantic token pair, the CI a11y matrix

## Context

Scorp DS carries the portfolio identity, and that identity is dark: warm amber on deep
sepia. Light exists and is fully supported, but it is the secondary reading of the
system, not the baseline.

A design system with two themes has to pick which one is "the design", because that is
the one that gets looked at while decisions are made and the one whose contrast gets
tuned first.

## Decision

`ThemeProvider` sets `defaultTheme="dark"` with `enableSystem`. Storybook renders dark
by default; light is the explicit opt-in via the Theme toolbar.

Both themes are **equally binding**. Every semantic token exists in both `light` and
`dark` with the same key set, and CI runs the full axe pass twice, once per theme.

## Options rejected

- **Light default.** The conventional choice, and wrong for this identity.
- **System default with no opinion.** Leaves the system with no canonical appearance and
  makes "does this look right?" unanswerable.
- **Dark only.** Consumers need light; the portfolio uses both.

## Consequences

- Components must read `resolvedTheme`, not `theme`. With `enableSystem`, `theme` can be
  `"system"` while the page renders dark; `ThemeToggle` derives its knob, its label and
  its accessible name from the resolved value so it always agrees with the screen.
- Light-theme contrast has historically been the weaker side and has needed dedicated
  passes (`#40`, `#49`). Any new semantic token needs its light value checked, not
  inherited by assumption.
- `tokens.css` carries measured contrast ratios in comments, including one deliberate
  exception (dark `field.border` at 1.76:1). See
  [0007](0007-tokens-json-and-tokens-css-are-both-hand-maintained.md).
