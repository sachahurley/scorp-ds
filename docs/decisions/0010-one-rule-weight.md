# 10. The system has exactly one rule weight

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; completed 2026-09-22)
- **Affects:** every divider, table rule and card separator

## Context

Dividers were drawn at two weights. Some used `0.5px` for a finer hairline; others used
1px. A `0.5px` rule is a sub-pixel value: browsers snap it inconsistently, so it renders
lighter than intended and at some zoom levels and device ratios disappears entirely.

## Decision

`--border-width-hairline` (1px) is the system's **only** rule weight: table and card
dividers, plate rings, tab list rules, modal header and footer separators.

Use it as `border-b-[length:var(--border-width-hairline)]`.

## Options rejected

- **Keep `0.5px` for a finer line.** It does not reliably render as a finer line; it
  renders as an unpredictable one.
- **Add a second, lighter token.** Two weights invite a third, and the visual difference
  is not reliable enough to be worth encoding.

## Consequences

- Card and Table were migrated first. Modal (x2) and Tabs were the last stragglers,
  migrated 2026-09-22 along with regression tests asserting the token is used and the
  string `0.5px` does not appear in rendered output.
- On a high-DPI display the change is very subtle; on a 1x display it is the difference
  between a visible rule and an intermittent one.
- `Table.test.tsx`, `Modal.test.tsx` and `Tabs.test.tsx` assert this and stop it drifting
  back.
