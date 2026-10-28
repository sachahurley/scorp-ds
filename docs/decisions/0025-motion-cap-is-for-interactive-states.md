# 25. The 200ms motion cap is for interactive states; overlays may take longer

- **Status:** accepted
- **Date:** 2026-10-28
- **Affects:** every component transition; `global.duration`; `eslint-rules/`

## Context

`CLAUDE.md` says interactive states animate in "150-200ms max". `tokens.json` also
defines `duration.slow` (300ms) and `duration.slower` (500ms), so the rule and the
token set disagreed, and nothing checked either. The only component using a longer
duration is `BottomSheet`, which animates its enter and exit with `--duration-slow`
(`BottomSheet.tsx`, the overlay and the sheet). A sheet travelling most of the viewport
height in 200ms reads as a jump rather than a movement.

## Decision

- **Interactive state changes** (hover, press, focus, selection, toggle, expand of an
  inline control) use `--duration-instant`, `--duration-fast` or `--duration-normal`:
  200ms at most.
- **An overlay entering or leaving the viewport** (sheet, modal, toast, drawer) may use
  `--duration-slow`. Nothing in the system uses `--duration-slower` today; it is
  reserved for a full-screen transition, and its first use needs a reason in the
  component's spec.
- Durations are tokens. A raw duration (`300ms`, `duration-300`, `duration-[250ms]`)
  is a lint error in components.

## Options rejected

- **Delete `slow` and `slower`.** Removes a token a component uses, and the sheet would
  then animate too fast to follow.
- **Cap everything at 200ms.** The same problem; the cap was written for state changes,
  not for travel distance.

## Consequences

- `scorp/no-slow-motion` flags `--duration-slow` and `--duration-slower` in components
  outside an allowlist of overlay files, and flags raw durations everywhere.
- A new overlay that wants `slow` is added to the allowlist in the same PR, which makes
  the choice visible in review.
