# Strong components, but the step from component to screen still needs a human

- **Source:** agent-readiness audit of `main` at `a681b18`. Nine criteria, each scored 0 to 3 from the repo alone
- **Date:** 2026-10-28

## Finding

| Criterion | Score | Why |
|---|---|---|
| Machine-readable source of truth | 2 | `tokens.json` is DTCG and `api-surface.json` is generated, but the manifest listed values for 33 of 428 props; `Link`, `ListRow` and `Table` were `{}` |
| Explicit, typed APIs | 2 | `TuiIcon.name: string`; legacy sizes inside `ControlSizeProp` with no `@deprecated`; raw `Modal.width`, `Popover.offset`, `Tooltip.delay` |
| Docs colocated with code | 2 | 61 specs, all `draft`; 14 component specs with no "use instead"; five components documenting props in `@param` |
| Composition rules | 1 | Two presets (case study, marketing hero); Forms, AuthCard, SideNavigation only as story code with no spec |
| Deterministic naming | 1 | `variant` / `tone` / `level`, `isOpen` / `open`, `onClose` / `onDismiss`, `ariaLabel`; two spellings for every semantic token |
| Enforceable constraints | 2 | Good lint, drift test, spec-hash gate, axe, visual regression; nothing checks inline styles, Tailwind defaults, undefined variables, durations or story types |
| Discoverability | 2 | Manifest, specs and Storybook, but no catalog; most data components have no empty or loading story |
| Extension path | 2 | Documented in `CLAUDE.md` and held by the coverage ratchet; no scaffold; `lab/` documented but absent |
| Single source, generated derivatives | 1 | `tokens.css`, preset, `design-tokens.md`, spec token maps and consumer references all hand-kept; only `tokens.css` was drift-tested |

The pass condition was a new engineer building a correct screen from the repo alone. It
was not met. The clearest evidence: 11 references to `--surface-default`, a token that
has never existed, passed every check; and `docs/component-references/Scorp-button.md`,
which consumer agents read, taught the deprecated `size="medium"` as the default.

## Lesson

Component-level rigour does not add up to screen-level correctness. The checks proved
each part was right in isolation. What an agent needs next is one name per concept, a
manifest that lists the allowed values, and recipes it can import rather than copy.

Decisions that followed: `../decisions/0023-semantic-tokens-are-referenced-by-variable.md`,
`../decisions/0024-one-prop-vocabulary.md`, `../decisions/0025-motion-cap-is-for-interactive-states.md`,
`../decisions/0026-a-spec-is-stable-when-it-meets-the-bar.md`,
`../decisions/0027-half-step-spacing-is-tokenised.md`.
