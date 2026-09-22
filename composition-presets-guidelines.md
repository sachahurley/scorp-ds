# Composition Presets Guidelines

## What is a composition preset?

A preset is a shared function or constant in `packages/storybook/presets/` that returns
a canonical, locked-in configuration of design-system components.

Presets are the single source of truth for how components are assembled in Storybook
examples and screen compositions. Stories import from the preset rather than restating
the composition, so editing it once updates every place that uses it.

Presets return `JSX.Element` (or typed content data, such as an array of blocks).

## Two levels of editing

### Level 1: the component itself

**Where:** `packages/components/src/components/` or `packages/components/src/primitives/`
**Controls:** what the component CAN do: its props, variants, layout, tokens.
**When to edit:** changing how ALL instances of a component behave.

### Level 2: the preset

**Where:** `packages/storybook/presets/{name}.tsx` (or `.ts` for content-only presets)
**Controls:** how components are USED together in a specific context.
**When to edit:** changing how one screen's version of a composition looks.

## When to create a preset

Create a preset when:

- A composition appears in more than one file
- A screen story needs a composition that also has a playground example
- The assembly is non-trivial (nested components, meaningful state, ordered content)
- A consumer project renders the same composition and must not fork it

Do NOT create a preset for:

- Trivially simple configurations (a single element)
- Configurations unique to one documentation section that will never be reused

## Preset design rules

1. **Compose only DS components and primitives.** A preset must not introduce bespoke
   layout CSS, raw colour values, or hardcoded spacing. If a preset needs something the
   system cannot express, that is a gap in the system: fix the component or add a token.
2. **No hardcoded values.** The same "No Hardcoding" rules in `CLAUDE.md` apply here.
3. **Add a JSDoc comment** naming what the preset is for and who consumes it.
4. **Keep content and structure separable** when a consumer shares the content. See
   `caseStudy.ts`, which exports typed block data consumed by both the Screens story
   and the portfolio, so the demo page never forks.

## Current presets

| File | Export | Purpose |
|---|---|---|
| `presets/caseStudy.ts` | `caseStudyTemplateBlocks` | Canonical case-study template content, shared with the portfolio |
| `presets/marketingHero.tsx` | `MarketingHeroScreen` | Canonical marketing hero composition |

## How stories consume presets

```tsx
import { caseStudyTemplateBlocks } from '../../presets/caseStudy';
import { MarketingHeroScreen } from '../../presets/marketingHero';
```

Screen-level composition lives in `presets/` and is documented under `stories/Screens/`.
Flows (multi-step journeys) stay in specs or product apps: Storybook shows one screen at
a time.

## Adding a new preset

1. Add the file to `packages/storybook/presets/`
2. Add a JSDoc comment with a usage example
3. Update any stories that should use it
4. Verify with `npm run lint` and `npm run type-check`
5. If a consumer project will render it, note that in the JSDoc so the vendoring step
   is not missed
