# 12. Stories drive their own interactions, with a play function

- **Status:** accepted
- **Date:** 2026-09-23
- **Affects:** every story whose subject is not visible at rest; `scripts/visual-regression.mjs`

## Context

Visual regression screenshots a story as it renders. That is blind to anything behind a
hover, a click or a keypress, which is most of what a design system's harder components
do. The first version of the harness carried a hardcoded map of story id to interaction
inside the script.

The map failed in the way hand-maintained tables always fail. Two of its story ids were
simply wrong, and a wrong id did not error: it silently captured nothing, so the map
reported coverage it was not providing.

Separately, two measurements changed how this had to work:

- **A ring is small.** A focus ring is 2px inset around one control. Radio's is 25px of
  change on a 900x600 frame. The original diff gate was a ratio (0.1% of the frame, 540px),
  which by construction cannot see it. So could a story have had a focus interaction under
  the old gate and still shown nothing.
- **`:focus-visible` does not match programmatic focus.** `element.focus()` produces
  **0px** of change on a Button; `keyboard.press('Tab')` produces 544px.

## Decision

**A story whose subject only exists after an interaction carries a Storybook `play`
function.** There is no interaction map, and one must not be reintroduced.

Three rules follow:

1. **Interaction-gated stories get a `play` function.** Storybook runs it in the preview
   before anything screenshots the story, so the visual harness and the a11y runner both
   see the real state without either needing to know the story exists.

2. **Focus states use `await userEvent.tab()`, never `element.focus()`.** Enforced by
   `scorp/no-element-focus-in-story`. Focusing the window
   (`canvasElement.ownerDocument.defaultView?.focus()`) is fine and is not what the rule
   flags; it is how you get the frame ready for a Tab.

3. **A story that cannot produce a stable frame gets `tags: ['skip-visual']`, with a
   comment saying why.** Distinct from `skip-test`: a `skip-visual` story stays in the
   a11y pass, which does not care what value a progress bar is showing.

**The play function puts the story into the state the story is about, which is not always
"open".** Opening everything loses information: `Combobox/Sizes` renders three fields to
compare and one open list would cover two of them; the `Error` stories are about the
message under the field; `Disabled` stories cannot open at all.

## Options rejected

- **Keep and extend the interaction map.** It works, but a wrong id fails silently, and
  every entry added makes it harder to remove. This is the same failure shape as the stale
  lookup tables in `generate-draft-specs.mjs` and the Flutter branches in the skills.
- **A lint rule requiring `outline-none` to pair with an inset ring, instead of visual
  coverage.** Checked and rejected: Combobox, Select and Input build focus from a
  `focus-within` border rather than an inset shadow, so the rule would have false-positived
  on precisely the components that turned out to be broken.
- **Cover every component's focus state.** The set is representative instead: both
  mechanisms, all three ring colours, and the two smallest controls. The rest share the
  primary inset recipe already covered.

## Consequences

- **It finds real bugs, twice over.** The first play function ever added, on
  `Dropdown/Default`, immediately failed the a11y pass on a destructive item at 3.99:1
  that had been shipping. The focus work then found that focusing an errored Combobox or
  Select changed nothing at all: a WCAG 2.4.7 failure that **axe cannot detect**, because a
  missing focus indicator is not machine-detectable.
- **The diff gate had to follow.** It is now an absolute pixel count (10), not a ratio,
  because the signals worth catching are a fixed size rather than a share of the viewport.
  See the comment in `scripts/visual-regression.mjs` for the measurements.
- **Timer-driven stories are the recurring hazard.** `ProgressBar/Live` ticks every 400ms
  and `LogView/Streaming` every 700ms against a 600ms settle wait. Both are tagged; expect
  new ones whenever a story animates itself.
- **`skip-visual` is not lint-enforced**, and it is the obvious place for a flaky story to
  go and be forgotten. Treat a new one as a claim to be justified in review, not a fix.
