# CaseStudy

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `CaseStudyBlocks` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Patterns` |
| File | `packages/components/src/components/CaseStudy.tsx` |
| Story | `Patterns/CaseStudyBlocks` (full page: `Screens/CaseStudyTemplate`) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `06b48a68c0922402` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

CaseStudyBlocks is the long-form section library upstreamed from the portfolio's case-study pages: you author a page as a typed `CaseStudyBlock[]` array and one renderer draws every section with consistent rhythm and tokens. It covers eleven block types (meta grid, headline, prose, image, image pair, box-drawing diagram, live slot, callouts, numbered insights, pull quote, titled list), with wide and full-bleed breakouts for figures. Every figure block renders the hatch placeholder until it is given real content, so a page can be laid out before its art exists and swapped one figure at a time. Use it for editorial, narrative pages such as case studies, write-ups and project pages. Don't use it for app UI or dashboards; compose those from components.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`div.font-mono` wrapper (plus `className`) rendering each block in order. Block keys are array indexes.

### Variants (block `type`)

| Enum Value | Description |
|-----------|-------------|
| `meta` | `<dl>` auto-fit grid (min 130px columns) of label / value pairs. Labels `text-xs uppercase` tracked; values `text-sm`. `mb-11`. |
| `headline` | `<header>` with optional `kicker` (`text-xs`, first letter uppercased), `<h2>` `title` (`text-xl`), optional `text` (`text-base`). `mt-16` (`sm:mt-24`), none when first. |
| `prose` | `<p>` `text-base leading-relaxed`, `my-7`. |
| `image` | `<figure>` on the plate ring, `aspect` (default `"16 / 9"`), optional `caption`, optional `width` breakout. Renders `src` as an `<img>` (`object-fit: cover`) when given one, the hatch placeholder otherwise. |
| `imagePair` | Two 4:3 figures, 1 column then 2 from `sm`, optional `captions` tuple, `srcs` / `alts` tuples and `width` breakout. Either side falls back to the placeholder independently. |
| `ascii` | `<pre>` box-drawing diagram inside the figure ring, `text-xs`, `overflow-x-auto`. Stays live text rather than an image, so it is selectable and retints with the theme. `role="img"` with `label` (falling back to `caption`) carries the meaning. Generate the string with `@scorp-ds/tui-art`. |
| `slot` | A live region the page fills via the `slots` prop, keyed by `name`: a component specimen, a chart, an embed. Falls back to the hatch placeholder (at `aspect`) when the name has no entry. |
| `callouts` | Auto-fit grid (min 160px) of title + blurb; `grid-template-rows: subgrid` keeps every body on one line however titles wrap. |
| `insights` | `<ol>` of title + blurb with accent two-digit numerals (`01`, `02`, ...). |
| `quote` | `<figure>` with an accent `“` glyph (`text-3xl`, `aria-hidden`), `<blockquote>` (`text-lg`), optional `<figcaption>` with `Avatar` (`md`), `name` and `role`. |
| `list` | `<ul>` of stacked title + blurb items. |

### Sizes (figure `width`)

| Enum Value | Description |
|-----------|-------------|
| (unset) | Column width. |
| `wide` | `min(100% + 240px, 100cqw - 48px)`, centered: about 120px past the column on each side. |
| `full` | `100cqw - 48px`, centered: runs to the container margins. |

Breakouts size against the nearest `container-type: inline-size` ancestor (`100cqw`), falling back to the viewport.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `blocks` | `CaseStudyBlock[]` | none | Yes | The page's sections in order. |
| `className` | `string` | `""` | No | Classes on the wrapper (for example a column width). |

### `CaseStudyBlock` union

| `type` | Fields |
|--------|--------|
| `meta` | `items: { label: string; value: string }[]` |
| `headline` | `kicker?: string; title: string; text?: string` |
| `prose` | `text: string` |
| `image` | `aspect?: string; caption?: string; width?: "wide" \| "full"; src?: string; alt?: string` |
| `imagePair` | `captions?: [string, string]; width?: "wide" \| "full"; srcs?: [string \| undefined, string \| undefined]; alts?: [string \| undefined, string \| undefined]` |
| `ascii` | `text: string; caption?: string; width?: "wide" \| "full"; label?: string` |
| `slot` | `name: string; caption?: string; width?: "wide" \| "full"; aspect?: string` |
| `callouts` | `items: { title: string; text: string }[]` |
| `insights` | `items: { title: string; text: string }[]` |
| `quote` | `text: string; name?: string; role?: string; image?: string` |
| `list` | `items: { title: string; text: string }[]` |

All text fields are plain strings (no inline markup). Item keys use `label` / `title`, so they must be unique within a block.

`CaseStudyBlocks` itself takes `blocks`, an optional `className`, and an optional `slots: CaseStudySlots` (`Record<string, ReactNode>`) supplying content for `slot` blocks. `slots` is the escape hatch for pages that need a live component inside the narrative; this library stays editorial and does not take on app-UI concerns.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | stepped 6px corner polygon | Placeholder ring and fill |
| `--border-hairline` | Color | light `#F0EBE4`, dark `#2B2718` | Placeholder ring (outer layer, `p-px`) |
| `--surface-subtle` / `--surface-muted` | Color | light `#FCFBFA` / `#F7F5F2`, dark `#1A150F` / `#221E13` | 45deg hatch stripes |
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Insight numerals, quote glyph |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Titles, quote text, attribution name |
| `secondary-700` / `secondary-600` | Color | `#695F4D` light / `#968A75` dark | Labels, kickers, captions, role |
| `secondary-800` / `secondary-500` | Color | `#474030` light / `#BFB4A3` dark | Body text |
| `text-xs` to `text-3xl` | Typography | `12px` to `48px` | Block type scale |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Block type | `type` | See Variants |
| Breakout | `width` on `image` / `imagePair` / `ascii` / `slot` | Layout only |
| Figure content | `src` on `image` / `imagePair`, a filled `slots` entry for `slot` | Real content replaces the hatch |
| First headline | `:first-child` | Top margin removed |
| Quote attribution | `name` present | Adds `Avatar` + name / role |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| meta | Yes | Yes | `MetaGrid` |
| headline + prose | Yes | Yes | `Headline` |
| image + imagePair (placeholder) | Yes | Yes | `Figures` |
| image + imagePair (real `src`) | Yes | Yes | `RealArtwork`, using an inline data URI so the test-runner needs no network |
| ascii | Yes | Yes | `AsciiDiagram` |
| slot (filled and empty) | Yes | Yes | `Slots` |
| callouts | Yes | Yes | `Callouts` |
| insights | Yes | Yes | `Insights` |
| quote (bare and attributed) | Yes | Yes | `Quote` |
| list | Yes | Yes | `DefinitionList` |
| `wide` / `full` breakouts | Yes | Yes | `Screens/CaseStudyTemplate` only (page-level `container-type: inline-size`); not in the Patterns stories |
| Full page composition | n/a | Yes | `Screens/CaseStudyTemplate`, blocks from `packages/storybook/presets/caseStudy.ts` |

Interactive controls: none (stories pass fixed `blocks` arrays).

**Coverage:** 100% (8/8)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Hatch stripe stops `8px` / `16px` (inline `repeating-linear-gradient`).
- Breakout math `240px` and `48px`; grid minimums `130px` (meta) and `160px` (callouts).
- `tracking-[0.08em]` on meta labels.
- Off-scale spacing steps `my-11` (44px), `mb-7` / `my-7` / `gap-y-7` (28px), `gap-3.5` (14px), `gap-y-1.5` (6px): Tailwind values not in the spacing token scale.
- Label and body colors use secondary scale steps chosen as AA theme pairs rather than semantic text tokens.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Avatar` (quote attribution, `size="md"`, `alt=""`)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (plate, border, surface, accent, text tokens)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: real document structure: `<dl>` (meta), `<header>` + `<h2>` (headline), `<ol>` (insights), `<ul>` (list), `<figure>` / `<figcaption>` / `<blockquote>` (figures, quotes).
- Required labels: none. Headline titles are `<h2>`, so the page needs its own `<h1>` above the blocks.
- Focus order: no interactive elements.
- Touch target minimum: n/a.
- Color independence: accent numerals are paired with their titles; placeholders are decorative (no alt text, since there is no image).
- Images: `alt` defaults to `""`, marking the image decorative, because a captioned figure already names itself. Pass `alt` only when the picture carries meaning the caption does not.
- Diagrams: `ascii` blocks are `role="img"` with an `aria-label`, because box-drawing characters read as noise when announced one by one.
- Decorative content: the quote glyph is `aria-hidden`; the attribution `Avatar` has `alt=""` because the name is adjacent text.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do author content as data (`CaseStudyBlock[]`) and keep layout decisions in the renderer.
- Do put `container-type: inline-size` on the page-width ancestor, outside the text column, when you use `wide` or `full` breakouts (as `Screens/CaseStudyTemplate` does).
- Do start the page with your own `<h1>`; blocks begin at `<h2>`.
- Do constrain the wrapper to a reading column (the stories use `max-w-2xl`).
- Don't use these blocks for app screens, settings or dashboards.
- Don't repeat titles inside one `callouts`, `insights` or `list` block; they are used as React keys.
- Don't expect real images yet: `image` and `imagePair` render hatched placeholders only.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Typical order: `meta` first, then repeating `headline` sections, each followed by one supporting block (`callouts`, an `image`, a `list`, an `imagePair`, `insights` or a `quote`). `Screens/CaseStudyTemplate` (blocks in `packages/storybook/presets/caseStudy.ts`) is the canonical page.
- Blocks own their vertical margins; do not wrap them in a `Stack` with a gap.
- Place the renderer inside the page shell; it has no background and inherits `surface-page`.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `image` / `imagePair` have no `src` field: they only render placeholders | None yet | open |
| 2026-09-22 | The `list` block is described as a definition list but renders a `<ul>`; several off-scale spacing values and raw px in breakout math | None yet | open |
| 2026-09-22 | No unit tests for CaseStudyBlocks | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/CaseStudy.tsx`
