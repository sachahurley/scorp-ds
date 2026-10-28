# 14. Case studies are structured pages, not block lists

- **Status:** accepted
- **Date:** 2026-10-27
- **Affects:** `CaseStudy` (`CaseStudyPage`, `CaseStudyHeader`, `CaseStudySections`, `CaseStudyContent`), the portfolio's case-study pages, `font.size.pageTitle`

## Context

`CaseStudyBlocks` took a flat `CaseStudyBlock[]`: a `meta` grid, then `headline`
blocks interleaved with content. Reviewing the portfolio's live case studies
(2026-10-27) showed what that shape produced:

- Every section looked the same: a 12px grey kicker, a 20px title, grey body, about 96px
  of empty space. The kicker, the page's only landmark, was its smallest, dimmest text.
- The page title was the portfolio's own 16px `h1.page`, smaller than every 20px
  section title below it.
- `callouts`, `list` and `insights` were all "title + blurb" and read alike, though they
  mean pillars, steps and findings. Three callouts in the column wrapped to about two
  words per line in a monospace face.
- One `quote` style served both a challenge statement and a testimonial.
- Nothing asked for results. Two of the portfolio's three listed projects were
  placeholders and nothing in the format made that look wrong.
- Reordering meant moving a `headline` and remembering to move every block after it;
  there was no way to hide a section.

The redesign was reviewed side by side against v1 in a Lab story before landing.

## Decision

A case study is a `CaseStudy` object, rendered by `CaseStudyPage`:

- **Header fields.** `title` and `summary` are required, so a page without a one-line
  summary fails the type check. `outcomes`, `meta` and `cover` are optional. The title
  is the page's `h1` and its largest type: `font.size.pageTitle` (36px, new) from `sm`
  up, `2xl` below. Outcome figures stay at `2xl` so they never outrank it.
- **Sections are an ordered array.** Move a section by moving it; drop one with
  `hidden: true`. Sections own their headings, so `headline` is no longer a block.
- **Numbers are counted, never authored.** Each section opens on its number and
  name (`02 THE PROBLEM`). Figures are numbered across the page
  (`fig. 03`). Both count visible sections only.
- **One shape per meaning.** `list` is a tree drawn with rules (not box glyphs, which
  never met the trunk exactly), `insights` has large numerals and ruled rows,
  `callouts` are cards (three break out wide), `quote` hangs off an accent rule, and two
  blocks are new: `statement` (a thesis set large between rules) and `outcomes`.

`CaseStudyBlocks` and `CaseStudyBlock` are removed rather than deprecated: the
portfolio is the only consumer and migrates in the same change.

## Options rejected

- **Keep the flat block list and restyle it.** The look could change, but reordering
  and hiding would still mean editing runs of blocks, and nothing could require a
  summary.
- **Keep `CaseStudyBlocks` beside the new API.** Two ways to author the same page is
  how the sizes drifted before `0011`; with one consumer there is nothing to protect.
- **Six section-label styles were tried** (rule after the name, lead-in rule, count,
  bracket, large numeral, file path). The rule above with the number and name beneath
  was chosen; a `01 / 07` position count on the right was tried and dropped. Later
  (2026-10-28) the rule itself was dropped too: sections are now set apart by space
  alone (96px, 128px from `sm`), which read calmer than a rule every screen.
- **Six meta layouts were tried** (2026-10-28: ruled label/value pairs, centred
  columns, a byline, plates, a column beside the summary, dotted leaders). Dotted
  leaders were chosen: one fact a line, label joined to value like a contents page,
  replacing the ruled two-up grid.
- **Add 36px as a t-shirt step.** It falls between `2xl` (24px) and `3xl` (48px) and
  renaming the scale would break every consumer, so the token is role-named.

## Consequences

- A case study cannot ship without a summary, and the outcome slot sits in the header
  where an empty one is noticed.
- Re-vendoring the portfolio requires migrating its project data from blocks to
  sections in the same PR. Its sealed (encrypted) case study stores blocks inside the
  ciphertext, so the portfolio needs a small blocks-to-sections adapter for it, or a
  re-encryption.
- `CaseStudy.test.tsx` asserts the numbering, hiding, figure counting, heading levels
  and the hairline rule, which `CaseStudyBlocks` never had.
