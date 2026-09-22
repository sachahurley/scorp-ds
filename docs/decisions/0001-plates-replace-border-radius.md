# 1. Replace border radius with stepped plate silhouettes

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; decided during the portfolio identity merge, `a648d92`)
- **Affects:** every component with a softened corner; `global.plate` tokens; the Tailwind preset

## Context

Scorp DS is terminal-inspired, and a curve is the one shape a character grid cannot
draw. Rounded corners read as "web app" and fought the identity everywhere they
appeared.

The portfolio identity merge introduced plates: `clip-path` polygons that step the
corner in 2px increments instead of curving it, so a corner is built from the same
pixel grid as the icons.

## Decision

Radius tokens are **retired**. There is no `--radius-*` in the system. Components use
`rounded-none`, and where a softened corner is wanted they wear a plate silhouette:
`--plate-round` (6px step, for controls, rows and tooltips), `--plate-round-lg` (12px
step, for cards, tables, modals and sheets), or `--plate-round-lg-top` (stepped top,
square bottom, for bottom sheets).

## Options rejected

- **Keep a small radius scale.** Cheapest, but it keeps the shape language curved and
  leaves two competing ways to soften a corner.
- **Use `border-radius` and accept the mismatch.** Rejected: the corner is the single
  most visible carrier of the TUI stance.
- **Draw corners as background images.** Does not scale with the element and cannot
  inherit the fill colour.

## Consequences

- `clip-path` **slices real borders off**. A plate cannot simply have a `border`. The
  ring recipe is: the element is the ring colour clipped to the plate, and a `::before`
  layer is the fill clipped 1px inset. `Button`'s `outline` variant is the reference
  implementation.
- `clip-path` also **swallows outside outlines**, which is why focus rings are inset.
  See [0002](0002-focus-rings-are-inset.md).
- Plate geometry is a token, not a value: the tooltip caret was the last hardcoded
  exception and now lives in `global.plate.caret`.
- Enforced by `scorp/no-rounded`, which fails on any `rounded-{sm,md,lg,xl,2xl,3xl,full}`.
