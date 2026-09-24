# Design System Documentation Requirements

> One rule, one template per page type. Every fact lives in exactly one place: props live in TypeScript JSDoc (autodocs renders them), tokens live in `tokens.json` + `design-tokens.md`, usage lives in the story. Anything that must be hand-maintained in two places is a bug in this document.

## The Golden Rule

Every page answers, in order: **see it → name it → use it.**
Visual example first, token/prop name second, one code snippet third.

## Page templates

### Start Here (one page)

1. **Identity** — one paragraph + one hero specimen. The merged portfolio identity: warm sepia, gold accent, Fragment Mono 400, plates, dark by default.
2. **Setup** — one code block: install, import `tokens.css`, add the Tailwind preset, wrap in `ThemeProvider`.
3. **The five laws** — tokens only (no raw values) · plates are the shape language · mono 400 everywhere · dark is the default theme · 44px minimum touch targets.
4. **Map** — one line each for where tokens, components, and patterns live.

### Foundation pages (Colors, Typography, Spacing, Motion, Z-index)

1. **Header** — title + 1-2 sentences + last-updated date. No status badges: if it is not stable it does not ship.
2. **Specimens** — the visual grid, large enough to judge at a glance.
3. **Token table** — Swatch · Token · Value · Usage. Add Light/Dark value columns only when values differ per theme.
4. **Code** — one usage snippet for the whole page.

### Semantic pages (Colors, Elevation, Focus, Opacity, Shape)

Same four sections as Foundation, with Light/Dark columns (these tokens differ per theme).

- **Semantic Colors** includes the Accent + Fire group; state the egg contract in one sentence (themes override the variable, the variable is the API).
- **Shape** documents both plate silhouettes, the ring recipe (element = ring color clipped, `::before` = fill clipped 1px inset), and the inset-focus caveat. Components link here instead of re-explaining the recipe.

### Component pages (one per component)

1. **Header** — name + one-sentence purpose + one "don't use this when …" line.
2. **Live example** — the playground story with controls, first thing on the page.
3. **Variants and states** — one story per meaningful axis (variant, size, disabled/error). Not every permutation.
4. **Props** — auto-generated from TypeScript via autodocs. JSDoc comments on the interface ARE the prop documentation; never hand-write a props table.
5. **Accessibility** — 2-4 concrete bullets: keyboard behavior, what carries the label, where focus goes.
6. **Code** — one realistic snippet.

### Pattern pages

1. Example. 2. The preset/recipe code. 3. One line listing the components it composes.

### Screens and Lab

A rendered story and a one-line description. No other requirements.

## Playground patterns (pick one per story)

- **A · Preset playground** — screen compositions assembled from shared preset functions; the sample is a thin shell.
- **B · Inline playground** — single component + controls; the code snippet stays in sync with the knobs.
- **C · Stateful playground** — interaction-heavy components (modal, sheet) own their interaction lifecycle.

Placeholder filler may be plain HTML; the component under test always uses tokens.

## Interaction states (visual regression depends on this)

Visual regression screenshots a story as it renders, so anything behind a hover, a click
or a keypress is invisible to it unless the story puts itself there.

- **A story whose subject only exists after an interaction carries a `play` function.**
  There is no interaction map in the harness, and one must not be added back: the previous
  one had two wrong story ids that captured nothing, silently.
- **The play function puts the story into the state the story is about**, which is not
  always "open". Do not open everything. `Combobox/Sizes` compares three fields and one
  open list would cover two of them; the `Error` stories are about the message under the
  field; `Disabled` stories cannot open at all.
- **Focus states use `await userEvent.tab()`, never `element.focus()`.** `:focus-visible`
  does not match programmatic focus, so a JS-focused story captures a frame with no ring
  and still looks like passing coverage. Enforced by `scorp/no-element-focus-in-story`.
  Focusing the window first (`canvasElement.ownerDocument.defaultView?.focus()`) is fine
  and is how you make the Tab land.
- **A story that cannot produce a stable frame gets `tags: ['skip-visual']` and a comment
  saying why.** Anything driven by a timer or randomness renders differently every run:
  `ProgressBar/Live` ticks every 400ms, `LogView/Streaming` every 700ms. `skip-visual`
  leaves the visual comparison only; the story stays in the a11y pass. It is not lint
  enforced, so a new one is a claim to justify in review, not a quick fix for a red run.

- **A story whose subject depends on viewport width declares it**, with
  `parameters: { viewport: { defaultViewport: '…' } }`. The harness honours a story's own
  declaration (the project-wide default in `preview.tsx` is not one). Two stories were
  documenting the opposite of their names before this: `AppHeader/MobileMenuOpen` captured
  the desktop nav, and `Modal/Docked` captured a centred modal, because the harness shot
  everything at 900px.
- **If the subject is the *change* across breakpoints, split the story per breakpoint.**
  One frame shows one width. `Grid/ResponsiveColumns` is `base` / `md` / `xl` as three
  stories for that reason, the same way `Tooltip/Positions` split when one frame could not
  hold two placements.
- **A responsive class that changes *structure* needs a frame on each side of its
  breakpoint; one that changes *scale* does not.** Structure is the track count, the
  direction, or whether something is there at all (`grid-cols-*`, `flex-col`/`flex-row`,
  `hidden`/`block`). Scale is padding, margin, gap, type size. The test: would a reader
  looking at one frame be surprised by the other? `CaseStudy`'s `imagePair` is two-up in
  `Figures` at 900 and one column in `Figures: stacked` at 375 for this reason.
- **`Card`'s `lg:p-6` and `Container`'s `lg:px-10` are the named exception.** They render
  in no frame at all, since the harness captures at 900 and the only stories above 1024
  contain neither component. That is accepted: neither component's subject is its padding
  at 1024. Decision 0012 carries the full audit, so a gap here is a decision rather than
  an oversight.
- Verify a responsive frame by reading the computed style, not by trusting that the
  viewport applied. `grid-template-columns` was `329px 329px` at 900 and `311px` at 375.

Why this matters beyond screenshots: the a11y runner executes play functions too. The
first one ever added found a contrast failure that had been shipping, and the focus work
found two fields with no focus indicator at all, which axe cannot detect on its own.

Full reasoning: `docs/decisions/0012-stories-drive-their-own-interactions.md`.

## Writing rules

- First paragraph of every page: zero jargon; readable with no coding background.
- Code snippets show token/prop names, never raw values.
- Deprecated anything: strikethrough + link to the replacement, or delete it.

## Checklist before publishing a page

- [ ] Leads with a visual
- [ ] Every name shown is the real token/prop string from code
- [ ] Exactly one code snippet per page (component pages: one per section max)
- [ ] Component pages: props are autodocs-generated, a11y bullets present
- [ ] Nothing on the page duplicates a fact that lives in another file
- [ ] Interaction-gated stories carry a `play` function; focus states use `userEvent.tab()`
- [ ] Any `skip-visual` tag says, in a comment, why the frame cannot be stable
- [ ] Stories whose subject depends on width declare a viewport, or are split per breakpoint
- [ ] A new responsive class that changes structure has a frame on each side of its breakpoint
