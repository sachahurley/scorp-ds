# 29. An interactive component's accessible name is required by its type

- **Status:** accepted
- **Date:** 2026-10-29
- **Affects:** `Switch`, `Slider`, `TreeView`, `TabsList`, `Avatar`, `Popover` (as a dialog), `BottomSheet`; every new interactive component

## Context

`CLAUDE.md` says every interactive component has an accessible label. Nothing checked it.
The 2026-10-28 agent-readiness audit found the name optional on Switch (which then fell
back to the words "On" or "Off"), Slider, TreeView, TabsList and Avatar (which fell back to
"Avatar"). Axe catches a missing name only when a story happens to render the component
without one, and a dev-mode `console.warn` is invisible to an agent that never runs the
code. An agent writing `<Switch checked />` got no signal at all.

## Decision

A component that must have an accessible name says so in its type, as a union of the ways
to provide one:

```ts
type SwitchProps = SwitchOwnProps &
  ({ label: ReactNode } | { "aria-label": string } | { "aria-labelledby": string });
```

Adapted per component: TreeView and TabsList take `aria-label` or `aria-labelledby`;
Avatar requires `alt`, where `alt=""` makes it explicitly decorative; Popover requires a name
only when it renders as a dialog. A missing name is a compile error with the component's
name in it.

This is a type-level breaking change with no deprecation alias, on purpose: there is no
old name to keep, and a component without a name is a bug, not a style. Consumers were fixed
before the change merged (`npm run consumers:check`): portfolio #119, scorp-protodash #27.

## Options rejected

- **Keep the dev warning.** It never reached an agent, and production builds strip it.
- **A lint rule (jsx-a11y `control-has-associated-label`).** It cannot see through a
  component boundary: it checks DOM elements, not `<Switch>`.
- **Default to a generic name ("Switch", "Avatar").** A wrong name is worse than none: it
  passes axe and tells a screen reader user nothing.

## Consequences

- A new interactive component follows the same pattern; review checks for it.
- `api-surface.json` lists the name props as optional, because the generator records only
  props every union member shares. The spec says which one is required.
- Each component declares its own union. A shared `AccessibleName` type in `lib/` would remove
  the repetition; it is not worth a breaking rename on its own.
