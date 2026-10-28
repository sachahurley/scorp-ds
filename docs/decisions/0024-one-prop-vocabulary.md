# 24. One prop vocabulary, and one way to deprecate a name

- **Status:** accepted
- **Date:** 2026-10-28
- **Affects:** every component's public props; new components first; extends
  [0011](0011-unified-size-scale.md)

## Context

[0011](0011-unified-size-scale.md) fixed one axis, size. The agent-readiness audit of
2026-10-28 found the same drift on every other axis. A name learned on one component
did not carry to the next:

| Concept | What the components said |
|---|---|
| Semantic colour | `variant` on Alert, Toast, Badge, ProgressBar; `tone` on Meter, StatusLine; `level` on LogView, with `warn` where everything else says `warning`; `default` on some, `neutral` on others |
| Overlay state | `isOpen` + `onClose` on Modal and BottomSheet; `open` + `onOpenChange` on Popover |
| Dismiss | `onClose` on Alert and Badge; `onDismiss` on Toast |
| Placement | `position` on Tooltip; `side` + `align: start \| center \| end` on Popover; `align: left \| right` on Dropdown |
| Icons | `ReactNode` on Button, Badge, Alert, Dropdown, Avatar, Switch; a `TuiIconName` string on EmptyState, SideNav, StatusLine, TreeView |
| Accessible name | `ariaLabel` on BottomSheet; `aria-label` everywhere else |
| Orientation | `variant: horizontal \| vertical \| withText` on Divider |

Deprecation was also inconsistent. `small | medium | large` were deprecated by a dev
warning, but the `@deprecated` tag sat on an inner type, so editors never struck the
value through, the generated manifest did not record it, and the hand-written consumer
reference still documented `medium` as the default.

## Decision

### The vocabulary

| Concept | Name | Values |
|---|---|---|
| Visual treatment | `variant` | Per component (`primary`, `ghost`, `quiet`, …). Never a colour role, never an orientation |
| Semantic colour | `tone` | `neutral \| info \| success \| warning \| error`. A component may add roles of its own (Badge `primary`) but never renames these five |
| Size | `size` | `sm \| md \| lg`, per [0011](0011-unified-size-scale.md) |
| Overlay state | `open`, `defaultOpen`, `onOpenChange(open)` | |
| Dismissible content | `onDismiss`, `dismissLabel` | |
| Placement | `side` + `align` | `side: top \| right \| bottom \| left`, `align: start \| center \| end` |
| Icon slots | `icon`, `iconLeft`, `iconRight`, typed `IconSlot` | `IconSlot = TuiIconName \| ReactElement`; a name renders a `TuiIcon` |
| Accessible name | `label`, `aria-label`, `aria-labelledby` | Never `ariaLabel` |
| Orientation | `orientation` | `horizontal \| vertical`; layout primitives keep `axis` |
| Value change | `onValueChange` for composite widgets; `onCheckedChange` for checkables; native `onChange` for native inputs | |
| Field error | `errorMessage` implies the error state; `error` is for an error shown elsewhere | |

Domain terms stay where the domain owns them: LogView keeps `level` (and accepts
`warning`), Table keeps `density`, layout primitives keep `axis` and `gap`.

### New components

A new component uses this vocabulary from its first commit. The chat composer
components (#99) are the first to be held to it.

### Migrating existing components

Each component moves in an API PR that needs approval, per the Agent Autonomy table.
The old name keeps working as a deprecated alias.

### How a name is deprecated

1. The old prop or value stays accepted, and carries `@deprecated Use X.` **on the prop
   or union member itself**, so editors strike it through.
2. Using it logs a one-time dev warning naming the replacement (the `resolveSize`
   pattern).
3. `docs/contracts/api-surface.json` records it as deprecated, so the generated catalog
   and consumer references show it struck through.
4. It is removed in its own PR, one alias family at a time, only when
   `npm run consumers:check` passes with the alias gone, and the consumers are
   re-vendored after the merge.

## Options rejected

- **Rename everything in one breaking PR.** Three consumers vendor this system
  ([0005](0005-vendored-copies-not-a-published-package.md)) and would all break on their
  next vendor run.
- **Keep `variant` for colour roles because most components already use it.** `variant`
  also means shape (Skeleton), treatment (Button, Input) and orientation (Divider). A
  name that means four things cannot be learned once.
- **Follow one external library's names wholesale.** The names above already match the
  common ones (`open` / `onOpenChange`, `side` / `align`), but the call is made per
  concept, against what this system ships.

## Consequences

- An agent that learns a prop on one component can use it on another, and the manifest
  can say which names are on their way out.
- For a while, some components accept two names. The dev warning and the strike-through
  are what move callers off the old one.
- The audit's "naming" score cannot reach 3 until the aliases are removed. That is the
  last step, and it depends on the consumers.
