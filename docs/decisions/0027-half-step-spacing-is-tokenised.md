# 27. Half-step spacing gets tokens, and off-scale steps are errors

- **Status:** accepted
- **Date:** 2026-10-28
- **Affects:** `global.spacing`, `tailwind.preset.js`, every component's padding, margin and gap

## Context

`tokens.json` defines a 4px spacing scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24.
`design-tokens.md` said Tailwind's spacing classes map to it. They did not: the preset
maps only `control-*` and `touch`, so `p-4` is Tailwind's own `1rem`. The values happen
to match, which is why nobody noticed, but changing `spacing.4` changed nothing.

Components also use half steps that the scale does not contain: about 34 uses of
`gap-0.5`, `p-0.5`, `px-1.5`, `py-1.5`, `gap-1.5`, `space-y-1.5`, `px-2.5`, `py-2.5`,
`gap-2.5` and `py-3.5`, mostly in dense rows, badges and field chrome. Those values are
spacing nothing governs.

## Decision

- Add `spacing.0-5` (2px), `spacing.1-5` (6px), `spacing.2-5` (10px) and `spacing.3-5`
  (14px) to `tokens.json` and `tokens.css` (`--spacing-0-5` and so on). DTCG names
  cannot contain a dot, hence the hyphen.
- The preset maps every spacing step, whole and half, to its variable
  (`'0.5': 'var(--spacing-0-5)'`, `4: 'var(--spacing-4)'`), so the class names stay
  the familiar ones and a token edit reaches every class. No rendered value changes.
- Padding, margin, gap and space utilities in components may only use a step that is in
  the scale. `p-7`, `gap-9`, `px-11` and the like are lint errors.

## Options rejected

- **Allowlist the half steps without tokens.** Keeps 34 uses outside the system, and
  the allowlist would have to be maintained by hand.
- **Rewrite the half steps to whole steps.** Changes the rendered output of the densest
  components, where 2px matters, to satisfy a rule.
- **Replace Tailwind's spacing scale entirely (`theme.spacing` instead of `extend`).**
  Width, height and inset utilities read the same scale, and consumers use them with
  off-scale values; replacing it would break them.

## Consequences

- Adding the tokens is a token change, so it ships in a PR that needs approval, with
  screenshots showing nothing moved.
- The rule covers spacing utilities only. Width, height and position utilities stay on
  Tailwind's scale.
