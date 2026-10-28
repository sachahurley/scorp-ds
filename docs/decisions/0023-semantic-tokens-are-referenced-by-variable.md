# 23. Semantic tokens are referenced by variable, and every variable is checked

- **Status:** accepted
- **Date:** 2026-10-28
- **Affects:** every component, story and preset; `tailwind.preset.js`; `eslint-rules/`

## Context

The agent-readiness audit of 2026-10-28 found two spellings for every semantic token,
and nothing checking either of them.

- `CLAUDE.md` told agents to reference tokens "via Tailwind classes". The preset does
  define classes for the semantic layer: `text-foreground-*` for `--text-*`,
  `border-line-*` for `--border-*`, `bg-field-bg` for `--field-background`. Components
  use those classes **0 times**.
- Components write the variable directly, `text-[var(--text-secondary)]`, about 306
  times. [0009](0009-claude-md-rules-are-enforced-by-lint.md) already sanctioned that
  form as the one bracket class `no-arbitrary-values` allows.
- Neither form is validated. `no-arbitrary-values` lets any `-[var(--x)]` through. The
  stories referenced `--surface-default`, which has never existed, 11 times
  (`Lab/TuiArtPlayground`, `Foundation/OneBitIcons`); those backgrounds rendered
  transparent and passed every check.
- The preset keys rename the token (`foreground` for `text`, `line` for `border`,
  `bg` for `background`), so an agent cannot derive one name from the other.
- `scorp-protodash` uses the preset keys about 39 times. Portfolio and the showcase use
  none.

## Decision

1. **Inside this repo, semantic tokens are referenced by their CSS variable:**
   `<utility>-[var(--token-name)]`, where the name is exactly the one in `tokens.css`.
   This covers everything in the `light` and `dark` layers: surface, text, border,
   field, focus, button, elevation, accent, fire, control and the terminal accents.
2. **Foundation aliases and geometry keep their preset classes:** colour scales through
   the semantic alias (`bg-error-50`, `text-secondary-800`, never `amber-*`, per
   [0006](0006-components-use-semantic-aliases-only.md)), and `h-control-*`,
   `size-touch`, `plate-round*`, `font-mono`.
3. **Every `var(--x)` must name a token that exists.** `scorp/no-undefined-css-var`
   reads the custom properties declared in `tokens.css` (plus the component-local
   variables a file declares itself) and fails on anything else, in components,
   stories, presets and the site.
4. **The preset's semantic keys (`foreground`, `line`, `field`, `surface`) stay** as a
   consumer convenience, because a consumer uses them. They are not used inside this
   repo, and a test asserts each one points at a variable that exists.

## Options rejected

- **Make the preset classes canonical and migrate 306 call sites.** More churn for the
  same result, and the class names would still need renaming to match the variables
  before an agent could derive them. Unknown class names also fail silently: Tailwind
  just generates nothing.
- **Delete the preset's semantic keys.** Breaks `scorp-protodash` on its next vendor
  run.
- **Keep both forms and rely on review.** That is what produced 11 references to a
  token that does not exist.

## Consequences

- An agent has one rule to follow: copy the variable name from `tokens.css`. A typo or
  an invented name fails lint, with the name in the message.
- Component-local custom properties (for example `--btn-ring`) are allowed when the
  same file declares them. A variable used in a file but declared in another one is a
  smell and needs an allowlist entry with a reason.
- Removing the preset's semantic keys is a later decision, once `scorp-protodash` has
  moved off them.
