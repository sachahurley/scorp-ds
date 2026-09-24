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

4. **A story whose subject depends on viewport width declares it**, with
   `parameters.viewport.defaultViewport`. The harness reads the story's *own* parameters,
   not the merged ones: `preview.tsx` sets a project-wide default that every story
   inherits, so merged values cannot tell a request apart from an inheritance. If the
   subject is the *change* across breakpoints, split the story per breakpoint, because one
   frame shows one width.

5. **A responsive class that changes *structure* needs a frame on each side of its
   breakpoint. One that changes *scale* does not.** Structure means the track count, the
   direction, or whether something is there at all: `grid-cols-*`, `flex-col`/`flex-row`,
   `hidden`/`block`. Scale means padding, margin, gap and type size. The test is whether a
   reader looking at one frame would be surprised by the other.

   The whole responsive surface in `packages/components/src`, audited 2026-09-23:

   | Component | Class | Kind | Frames |
   |---|---|---|---|
   | `Grid` | `{sm,md,lg,xl}:grid-cols-*` | structural | `ResponsiveColumns` base / md / xl |
   | `AppHeader` | `md:block`, `md:hidden` | structural | `MobileMenuOpen` at 320, the rest at 900 |
   | `CaseStudy` | `sm:grid-cols-2` (`imagePair`) | structural | `Figures` / `RealArtwork` at 900, `Figures: stacked` at 375 |
   | `Card` | `lg:p-6` ×3 | scalar | none, deliberately |
   | `Container` | `lg:px-10` | scalar | none, deliberately |
   | `CaseStudy` | `sm:mt-24`, `sm:first:mt-0` | scalar | none, deliberately |

   **`Card` and `Container` are the named exception.** Their `lg:` padding renders in no
   frame at all: the harness captures at 900, and the only two stories above 1024
   (`Modal/Docked`, `Grid: xl`) contain neither component. You could delete `lg:p-6` and
   `lg:px-10` today and nothing would go red. That is accepted, because a story exists to
   document its subject and neither component's subject is its padding at 1024. It is
   written down here so the next person finds a decision rather than a gap.

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
- **The structural/scalar split is a judgement, not a check.** Nothing enforces it, and a
  derived audit was considered and not built: it would list roughly forty responsive
  classes, nearly all scalar, and a report nobody reads decays the same way the
  interaction map did. Build it the second time someone has to ask whether something is
  covered, not the first.
- **A responsive frame is verified by reading the computed style, not by trusting the
  viewport applied.** `Figures: stacked` was checked with `grid-template-columns`:
  `329px 329px` at 900, `311px` at 375. The same method caught that
  `Grid/ResponsiveColumns` was showing one breakpoint of three.
