# 28. Composition rules are written down, and every pattern is a preset

- **Status:** accepted
- **Date:** 2026-10-29
- **Affects:** `composition-presets-guidelines.md`, `packages/storybook/presets/`, `stories/Patterns/`, `docs/specs/patterns-*.md`

## Context

The agent-readiness audit scored composition 1 out of 3. Components were documented one
at a time, but nothing said how they go together:

- Only two presets existed (`caseStudy`, `marketingHero`). Forms, AuthCard, SettingsPanel,
  SideNavigation, DenseListRow and WorkbenchSplit lived only as story code, so an agent
  asked for a settings screen had to read a story and copy it, page shell included.
- Forms, AuthCard and SideNavigation had no spec at all.
- The spacing hierarchy (`Stack gap="3"` inside a group, `gap="6"` between groups),
  the nesting limits (no Card in a Card) and the action order (primary last) were each
  true in the code and in one spec's Do / Don't list, and written down together nowhere.
- The patterns did not agree with their own advice. The SettingsPanel spec told product
  code to use a `fieldset` and `legend`, and its story used a styled `<p>` and a
  hand-rolled border instead of `Divider`. AuthCard's primary action sat outside its
  `<form>` as `type="button"`, so Enter in a field submitted nothing.

## Decision

1. **`composition-presets-guidelines.md` has a "Composition rules" section** covering the
   spacing hierarchy (as token steps), nesting, slot content and action order, forms, and
   which layout primitive to use. Every rule is written from what an existing pattern or
   a component spec already does, and names where it is seen. A rule with no pattern
   behind it is not added: it waits until a pattern does it.
2. **Every pattern except MusicPlayer is a preset** in `packages/storybook/presets/`, one
   file per pattern, with a JSDoc saying what it is for and who consumes it. The story is
   the page shell (background, column width, eyebrow, footnote) around the preset.
   MusicPlayer stays story-local: it is a large stateful demo whose value is the
   behaviour spec, not a composition to copy.
3. **Presets use the layout primitives** where a primitive renders the same thing:
   action rows, toolbars and meta rows are `Inline`, not hand-written flex divs. Where no
   primitive fits (a split whose axis changes at a breakpoint, dense row chrome) the
   preset keeps plain flex and the pattern spec lists it as a Known Gap.
4. **The patterns follow their own rules.** SettingsPanel's notifications group is a
   `fieldset` with a `legend` and its section rule is a `Divider`. AuthCard's "Sign in" is
   `type="submit"` and names its form with `form={useId()}`.
5. **Every pattern spec has a "Don't use this for: ... (use X instead)" line,** the same
   bar decision 0026 sets for component specs.

## Options rejected

- **Rules without presets.** Prose alone is what the audit found missing in practice: an
  agent copies code before it reads guidance, so the code it copies has to be the
  canonical version.
- **Presets without rules.** A preset shows one screen; it does not say which parts are
  the rule and which are that screen's content. The rules section names the parts.
- **Export the patterns from `@scorp-ds/components`.** They are compositions with
  specimen content, not components with an API. Consumers copy or vendor a preset;
  promoting one to a component is a separate decision when two products need it.
- **Normalise the spacing first (one gap for every field group).** The patterns use
  `spacing.3` in a multi-group card and `spacing.4` in a single-group card. Changing either
  changes rendered output to satisfy a rule nobody had asked for; the rule records both.
- **Move MusicPlayer too.** Its playback hook, drag handle and two layouts would make a
  preset larger than the story, for a composition no screen reuses.

## Consequences

- An agent building a screen reads one section and copies a preset, instead of reverse
  engineering a story.
- Changing how a pattern is composed is now a preset edit, and a rule edit when the change
  contradicts a rule. The guidelines say so: when a rule and a preset disagree, one of
  them is wrong.
- The SettingsPanel frames changed (the Divider is the terminal-dim rule at 1px rather
  than the container-stroke hairline, and the notifications label is now a legend). No
  other pattern frame changed: the preset moves and the `Inline` swaps render identically.
- Nothing enforces the rules yet. The parts that lint could check (a Card inside a Card,
  a Button with no `type`, a `fieldset` with no `legend`) are candidates for `scorp/*`
  rules under decision 0009.
