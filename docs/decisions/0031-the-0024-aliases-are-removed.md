# 31. The 0024 aliases are removed; Modal `width` stays

- **Status:** accepted
- **Date:** 2026-10-29
- **Affects:** Alert, Badge, Toast, ProgressBar, LogView, Modal, BottomSheet, Tooltip,
  Dropdown, Divider, Button, Card, every sized component, `lib/size.ts`; completes step 4
  of [0024](0024-one-prop-vocabulary.md) and closes the migration in
  [0011](0011-unified-size-scale.md)

## Context

[0024](0024-one-prop-vocabulary.md) renamed props across the system and kept every old
name working as a deprecated alias: `@deprecated` in the JSDoc, a one-time dev warning
through `warnDeprecated` (`lib/deprecate.ts`) or `resolveSize` (`lib/size.ts`), and a
`@deprecated` alias type for a deprecated value, so the manifest struck it through. Its
step 4 says an alias is removed once `npm run consumers:check` passes without it.

By 2026-10-29 the three consumers (the portfolio, the showcase and scorp-protodash) had
moved off the 0024 names. Their remaining legacy size names are migrated in their own
PRs, which land before this change, and `npm run consumers:check` is run against this
change before it merges. A read-only grep of their `src/` (vendored copies excluded)
found no import of `ControlSizeProp`, `ToastVariant` or any other removed export.

The aliases had a cost while they stayed: every component carried two names and the code
to reconcile them, the catalog showed struck-through values an agent still had to read
past, and the audit's naming score could not reach 3 while they existed (0024,
Consequences).

## Decision

Every 0024 alias is removed, along with its warning and its tests, except Modal `width`.

| Component | Removed | Use |
|---|---|---|
| Alert | `variant` (and its `default` value), `onClose` | `tone`, `onDismiss` |
| Badge | `variant` (and `default`), `onClose`, `onCloseLabel` | `tone`, `onDismiss`, `dismissLabel` |
| Toast, `ToastItem`, `toast()` options | `variant` (and `default`); the `ToastVariant` type | `tone`, `ToastTone` |
| ProgressBar | `variant` | `tone` |
| LogView | `level: "warn"` | `"warning"` |
| Modal | `isOpen`, `onClose` | `open`, `onOpenChange` |
| BottomSheet | `isOpen`, `onClose`, `ariaLabel` | `open`, `onOpenChange`, `aria-label` |
| Tooltip | `position` | `side` |
| Dropdown | `align: "left" \| "right"` | `align: "start" \| "end"` |
| Divider | `variant`, `text` | `orientation`, `label` |
| Button | `size="icon"` (`DeprecatedButtonSize`) | `md`; icon-only buttons square themselves |
| Every sized component | `small \| medium \| large` (`LegacyControlSize`, `ControlSizeProp`, `resolveSize`, the Kbd and Meter `Extract` re-admissions) | `sm \| md \| lg` (`ControlSize`) |
| Card | inferring `layout="flex"` from a `flex` class in `className` | `layout="flex"`; `layout` defaults to `"block"` |

Two exports leave the package barrel: `ControlSizeProp` and `ToastVariant`.
`BottomSheetProps` is a single interface again, with `aria-label` required.

**Modal `width` stays**, deprecated, warning once, and losing to `size` when both are
passed. Callers still pass widths the `sm | md | lg | full` scale does not have, and
whether the scale should gain steps for them is an open design question. `width` is
removed in its own change once that is decided. `lib/deprecate.ts` stays for it.

Nothing renders differently: every story, preset and consumer already used the new
names. The one story that passed `size="icon"` (VisuallyHidden) now passes no size, which
gives the same square `md` plate.

## Options rejected

- **Keep the aliases until the next breaking release.** The system has no release
  train: consumers vendor a commit ([0005](0005-vendored-copies-not-a-published-package.md)),
  so there is no later moment that is cheaper than the one where every consumer has
  already migrated.
- **Remove one alias family per PR, as 0024 step 4 suggests.** The consumers were
  migrated as one batch and `consumers:check` covers every family at once; splitting the
  removal would have produced a dozen PRs that each re-vendor three sites for no extra
  safety.
- **Remove Modal `width` too.** Its replacement does not cover every width it is used
  for, so removing it would force a design choice in an API cleanup.
- **Keep `ControlSizeProp` as a plain alias of `ControlSize`.** No consumer imports it,
  and a second name for one type is the drift 0024 set out to remove.

## Consequences

- An agent reading the catalog sees one name per concept; the only struck-through prop
  left is Modal `width`.
- A caller on an old name now gets a type error instead of a warning. The consumers are
  re-vendored after the merge, per the vendor-after-merge rule.
- 0024's deprecation pattern still stands for future renames: `warnDeprecated` and the
  `@deprecated` alias types are how the next one is done, and the manifest still records
  deprecated values and props (`api-surface.test.ts`).

## Amendment 2026-10-29: the Modal size scale

Modal `width` stayed because the portfolio's dialogs used widths no `size` matched (320,
420, 440 and 560px). The scale is now five steps chosen from the widths actually in use:
`xs` 320, `sm` 360, `md` 440, `lg` 640, `xl` 740 (the default, unchanged), plus `full`.
`md` and `lg` were 640 and 740 for one day and no consumer used them, so renaming the steps
broke nothing. The portfolio moves onto the scale in its vendor PR (its 420px Avatar
dialog becomes `md`, its 560px WorldStats dialog becomes `lg`), then `width` is removed.

## Amendment 2026-10-29: `width` removed

The portfolio's dialogs moved onto the scale in its vendor PR, leaving no caller of
`width`, so it is removed and the 0024 aliases are now gone entirely.
`lib/deprecate.ts` (`warnDeprecated`) stays as the shared tool decision 0024 prescribes for
the next rename, although nothing calls it today.

## Amendment 2026-10-29: Window `variant` removed

Window's `variant="active"` became an `active` boolean (0024 amendment: a focused pane is
a state, not a treatment) and stayed one release as a `warnDeprecated` alias. The
portfolio, the only consumer passing it, moved to `active` in its vendor PR, so the alias
is removed and no deprecated prop is left again. `lib/deprecate.ts` stays for the next
rename, as above.
