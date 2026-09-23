# The hardcoding rules cost almost nothing to enforce, because the code already complied

- **Source:** scan of `packages/components/src` while adding the `scorp/*` ESLint rules
- **Date:** 2026-09-22

## Finding

Before any custom lint rule existed, the components package contained:

| Rule | Violations |
|---|---|
| Raw hex colours | 0 |
| `rounded-{sm,md,lg,xl,2xl,full}` | 0 |
| Raw colour scales instead of semantic aliases | 0 |
| Sans-serif font classes | 0 |
| Imports of the forbidden legacy package | 0 |
| `rgb()` / `rgba()` / `hsl()` | 1 |
| Bare-number arbitrary Tailwind values | 21 |
| Exported components without declaration-level JSDoc | 3 |

Of 364 Tailwind bracket classes, **331 were the sanctioned `-[var(--token)]` form** and
12 were `content-['']` markers. The genuinely hardcoded set was small and clustered:
8 in the Tooltip caret, 3 hairline rules, and a handful of legitimate one-off geometry.

## Lesson

Enforcement was cheap **because** the discipline predated it. The rules did not clean
anything up; they froze a state that already existed. That is the right time to add a
ratchet, and it is why each rule went in at `error` rather than `warn`.

The corollary is the more useful finding: **class-based linting cannot see everything.**
The Tooltip's eight flagged classes were the visible part; the two clip-path polygons
next to them were JS string constants holding roughly 28 more hardcoded pixel values
that no Tailwind-aware rule would ever match. Raw values also hide in inline `style`
objects. A green lint run is a floor, not a guarantee.
