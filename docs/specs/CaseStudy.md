# CaseStudy

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `CaseStudyPage` (also `CaseStudyHeader`, `CaseStudySections`, `CaseStudyContent`; import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Patterns` |
| File | `packages/components/src/components/CaseStudy.tsx` |
| Story | `Patterns/CaseStudy` (full pages: `Screens/CaseStudyTemplate`) |
| Version | `v2` |
| Status | `draft` |
| Last updated | 2026-10-27 |
| API hash | `80c21507c5f9caf1` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

CaseStudy renders long-form narrative pages (case studies, write-ups, project pages) from data. A page is a structured `CaseStudy`: a header every page must fill (a title and a one-line summary, plus outcomes, meta and a cover when there are any), then an ordered list of sections. Sections can be moved by moving them in the array and dropped with `hidden: true`; section and figure numbers are counted, never authored, so they close up on their own. Each content block has one shape per meaning, so a reader can tell steps from findings from pillars at a glance. Every figure renders the hatch placeholder until it has real content, so a page can be laid out before its art exists. Use it for editorial pages. Don't use it for app UI or dashboards; compose those from components.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`CaseStudyPage` renders an `<article>`: `CaseStudyHeader`, then `CaseStudySections` (`mt-16`, `sm:mt-20`). Each visible section is a `<section id>` holding a header and a `CaseStudyContent`.

### Header (`CaseStudyHeader`)

| Part | Description |
|------|-------------|
| Title | `<h1>`, `text-2xl`, `sm:text-page-title` (36px), `text-primary`. Always the largest type on the page. |
| Summary | `<p>`, `text-base`, `sm:text-lg`, body pair. Required. |
| Outcomes | `<dl>` grid, 2 columns, then 2, 3 or 4 from `sm` by item count. Figure `text-2xl` accent, label `text-xs` label pair. The figure is visually first but the `dt` stays first in the DOM; figures hang from a shared top line. |
| Meta | `<dl>` label / value rows (`text-xs` uppercase / `text-sm`), one pair per row, two pairs per row from `sm`, under a hairline rule. |
| Cover | Optional figure, `wide` by default, no figure number. |

### Section header

A hairline rule (`surface-container-stroke`) above; beneath it the two-digit number (accent) and the kicker (uppercase, `text-xs`, label pair); then the `<h2>` title (`text-xl`, `sm:text-2xl`) and an optional intro (`text-base`). Sections are spaced `mt-16` (`sm:mt-20`).

### Content blocks (`type`)

| Enum Value | Description |
|-----------|-------------|
| `prose` | `<p>` `text-base leading-relaxed`, `my-6`. |
| `image` | `<figure>` on the plate ring, `aspect` (default `"16 / 9"`), numbered caption, optional `width` breakout. `src` renders an `<img>` (`object-fit: cover`); without it, the hatch placeholder. |
| `imagePair` | Two 4:3 figures, 1 column then 2 from `sm`, each numbered; `srcs` / `alts` / `captions` tuples; optional `width`. |
| `ascii` | `<pre>` box-drawing diagram inside the figure ring, `role="img"` with `label` (falling back to `caption`). Type is `text-xs`, stepping down until the longest line fits the figure (shrink to fit, so phones see the whole diagram); `overflow-x-auto` remains the fallback. |
| `slot` | A live region filled from the `slots` prop by `name`; the hatch placeholder (at `aspect`) when empty. Numbered like a figure. |
| `list` | Steps, flows or principles. A tree drawn with hairline rules: a trunk from the first branch to the last, each branch on the midline of its title's first line. Title over text at every width. |
| `insights` | Findings. `<ol>` with ruled rows, a `text-2xl` accent numeral column, `text-lg` title, `text-sm` text. |
| `callouts` | Pillars or options. Cards on `surface-muted` (`plate-round`, `p-5`). Three items break out `wide` and sit three up from `sm`; any other count sits two up in the column. |
| `quote` | A testimonial. `<blockquote>` `text-lg` on a hairline accent rule (`pl-6`); optional `Avatar` (`md`), `name`, `role`. |
| `statement` | A thesis or challenge. `text-2xl` between hairline rules, `py-10`, broken out `wide`; optional accent kicker. |
| `outcomes` | Result figures inside a section, the same layout as the header's outcomes. |

### Sizes (figure `width`)

| Enum Value | Description |
|-----------|-------------|
| (unset) | Column width. |
| `wide` | `max(100%, min(100% + 240px, 100cqw - 48px))`, centred: about 120px past the column each side, never narrower than the column. |
| `full` | `max(100%, 100cqw - 48px)`, centred: runs to the container margins. |

Breakouts size against the nearest `container-type: inline-size` ancestor (`100cqw`), falling back to the viewport.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### `CaseStudyPage`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `study` | `CaseStudy` | none | Yes | The page. |
| `slots` | `CaseStudySlots` | none | No | Live content for `slot` blocks, keyed by name. |
| `className` | `string` | `""` | No | Classes on the `<article>` (for example a column width). |

`CaseStudyHeader` takes `study` (the header fields only) and `className`. `CaseStudySections` takes `sections`, `slots` and `className`. `CaseStudyContent` takes `blocks`, `slots`, `figureStart` (default `1`) and `className`.

### `CaseStudy`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | The page's `h1`. |
| `summary` | `string` | Yes | One line: what this was and what it achieved. |
| `outcomes` | `CaseStudyOutcome[]` | No | `{ value, label }` result figures. |
| `meta` | `{ label: string; value: string }[]` | No | Role, timeline, stack and similar. |
| `cover` | `CaseStudyFigure` | No | A figure under the header. |
| `sections` | `CaseStudySection[]` | Yes | In reading order. |

### `CaseStudySection`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kicker` | `string` | Yes | Short name shown under the rule. |
| `title` | `string` | Yes | The section's `h2`. |
| `intro` | `string` | No | Lead paragraph under the title. |
| `blocks` | `CaseStudyContentBlock[]` | No | Content, in order. |
| `hidden` | `boolean` | No | Leaves the section out, and out of the numbering. |
| `id` | `string` | No | Anchor id; defaults to the kicker, slugified. |

### `CaseStudyContentBlock` union

| `type` | Fields |
|--------|--------|
| `prose` | `text: string` |
| `image` | `src?; alt?; aspect?; caption?; width?: "wide" \| "full"` |
| `imagePair` | `captions?: [string, string]; width?; srcs?: [string \| undefined, string \| undefined]; alts?: [...]` |
| `ascii` | `text: string; caption?; width?; label?` |
| `slot` | `name: string; caption?; width?; aspect?` |
| `list` / `insights` / `callouts` | `items: { title: string; text: string }[]` |
| `quote` | `text: string; name?; role?; image?` |
| `statement` | `text: string; kicker?` |
| `outcomes` | `items: { value: string; label: string }[]` |

All text fields are plain strings (no inline markup). Item `title` / `label` values are React keys, so they must be unique within a block; section kickers (or `id`s) must be unique within a page.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--font-size-page-title` (`text-page-title`) | Typography | `36px` | Page title from `sm` |
| `text-xs` to `text-2xl` | Typography | `12px` to `24px` | Block type scale |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Titles, quote and statement text |
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Section numbers, figure numbers, numerals, outcome figures, quote rule, statement kicker |
| `secondary-700` / `secondary-600` | Color | `#695F4D` light / `#968A75` dark | Labels, kickers, captions, roles |
| `secondary-800` / `secondary-500` | Color | `#474030` light / `#BFB4A3` dark | Body text |
| `--surface-container-stroke` | Color | light `#BFB4A3`, dark `#474030` | Section, meta, insight and statement rules; list tree |
| `--surface-muted` | Color | light `#F7F5F2`, dark `#221E13` | Callout cards, hatch stripes |
| `--surface-subtle` | Color | light `#FCFBFA`, dark `#1A150F` | Hatch stripes |
| `--border-hairline` | Color | light `#F0EBE4`, dark `#2B2718` | Figure ring |
| `--border-width-hairline` (`border-*-hairline`) | Border | `1px` | Every rule |
| `--plate-round` (`plate-round`) | Shape | stepped corner polygon | Figures, cards |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Block type | `type` | See Anatomy |
| Breakout | `width` on `image` / `imagePair` / `ascii` / `slot`; automatic on three `callouts` and on `statement` | Layout only |
| Figure content | `src`, `srcs`, or a filled `slots` entry | Real content replaces the hatch |
| Hidden section | `hidden: true` | Section and its figures removed; numbering closes up |
| Quote attribution | `name` present | Adds `Avatar` + name / role |
| Viewport below `sm` | Media query | Title `2xl`, section titles `xl`, summary `base`, outcomes two up, meta one pair per row, image pairs stacked |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Header | Yes | Yes | `Header`, `HeaderMobile` |
| Section headers | Yes | Yes | `Sections` |
| Reorder and hide | Yes | Yes | `ReorderAndHide` |
| prose | Yes | Yes | `Prose` |
| image + imagePair (placeholder) | Yes | Yes | `Figures`, `FiguresStacked` |
| image + imagePair (real `src`) | Yes | Yes | `RealArtwork`, inline data URI art |
| ascii | Yes | Yes | `AsciiDiagram` |
| slot (filled and empty) | Yes | Yes | `Slots` |
| list | Yes | Yes | `List` |
| insights | Yes | Yes | `Insights` |
| callouts (three wide, two in column) | Yes | Yes | `Callouts` |
| quote (bare and attributed) | Yes | Yes | `Quote` |
| statement | Yes | Yes | `Statement` |
| outcomes | Yes | Yes | `Outcomes` |
| Full pages | n/a | Yes | `Screens/CaseStudyTemplate`: `Case study template`, `Scorp DS`, from `packages/storybook/presets/caseStudy.ts` |

Interactive controls: none (stories pass fixed data).

**Coverage:** 100% (14/14)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Hatch stripe stops `8px` / `16px` (inline `repeating-linear-gradient`).
- Breakout math `240px` and `48px`.
- `MONO_ADVANCE` `0.62`: Fragment Mono's measured advance width (0.618em), used to shrink `ascii` diagrams to fit.
- Label and body colors use secondary scale steps chosen as AA theme pairs rather than semantic text tokens.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Avatar` (quote attribution, `size="md"`, `alt=""`)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (plate, border, surface, accent, text, font-size tokens)
- `packages/tokens/tailwind.preset.js` (`plate-round`, `border-*-hairline`, `text-page-title`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic structure: `<article>`; the title is the page's `<h1>`; each section is a `<section id>` with an `<h2>`; `<dl>` (outcomes, meta), `<ol>` (insights), `<ul>` (list), `<figure>` / `<figcaption>` / `<blockquote>`.
- Outcomes keep `dt` before `dd` in the DOM and reorder visually, so screen readers hear the label with its figure.
- Focus order: no interactive elements.
- Color independence: numbers and accent rules are paired with text; rules are decorative (`aria-hidden` where they are separate elements).
- Images: `alt` defaults to `""` (decorative), because a captioned figure already names itself. Pass `alt` only when the picture carries meaning the caption does not.
- Diagrams: `ascii` blocks are `role="img"` with an `aria-label`, because box-drawing characters read as noise.
- The page renders its own `<h1>`; do not add another above it.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do author pages as data (`CaseStudy`) and keep layout decisions in the renderer.
- Do write the summary as the one sentence a reader keeps if they stop there.
- Do pick blocks by meaning: `list` for steps and principles, `insights` for findings, `callouts` for pillars or options, `quote` for something a person said, `statement` for the thesis, `outcomes` for results.
- Do put `container-type: inline-size` on a page-width ancestor, outside the reading column, when you use breakouts.
- Do constrain the page to a reading column (the stories use `max-w-2xl`).
- Don't type section or figure numbers into titles or captions; they are counted.
- Don't delete a section you may want back; set `hidden: true`.
- Don't add a second `<h1>` above `CaseStudyPage`.
- Don't use these blocks for app screens, settings or dashboards.
- Don't repeat item titles inside one block, or kickers inside one page; they are keys and anchors.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Typical order: overview (intro and a hero figure), the problem, the approach or system, research or exploration, insights, decisions, outcomes, reflection. `Screens/CaseStudyTemplate` is the canonical page.
- One or two supporting blocks per section; a section can be title and intro alone.
- Keep callout and list blurbs to about 25 words, and item titles to about four words.
- Blocks own their vertical margins; do not wrap them in a `Stack` with a gap.
- Place the page inside the app shell; it has no background and inherits `surface-page`.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `image` / `imagePair` have no `src` field | `src` / `srcs` added | resolved |
| 2026-09-22 | No unit tests | `CaseStudy.test.tsx` | resolved |
| 2026-09-22 | Off-scale spacing values (`my-11`, `my-7`, `gap-3.5`) | v2 uses scale steps only | resolved |
| 2026-10-27 | Wide `ascii` diagrams scroll sideways on phones | Shrink to fit from `text-xs` | resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v2 | 2026-10-27 | breaking | `CaseStudyBlocks` replaced by `CaseStudyPage`: structured header and ordered, hideable sections; counted section and figure numbers; new `statement` and `outcomes` blocks; redesigned list, insights, callouts and quote; `font.size.pageTitle`. See decision 0014. |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/CaseStudy.tsx`
