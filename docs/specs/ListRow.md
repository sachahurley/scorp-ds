# ListRow

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `ListRow` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/ListRow.tsx` |
| Story | `Components/Display/ListRow` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `4dc7a05b1b2b3978` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

ListRow is the list and navigation tier of the container system, promoted from the portfolio's plate row: a meta line, a title and an optional description, clipped to the small plate. The clip is invisible until hover (or `selected`) fills it with `surface.muted`, so resting lists stay quiet, and interactive rows carry the accent on their title. Use it for scannable lists of links, projects, notes, queue items and side navigation. Use `Card` for framed content panels and `Table` for data with comparable columns; a ListRow has one text column (plus an optional thumbnail) and no column alignment across rows.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Row element (`<a>`, `<button>`, the `as` component, or `<div>`) with `block w-full p-3 plate-round`, containing:

1. `meta` (optional): `text-sm` line above the title.
2. `title`: `text-base leading-6 truncate` (single line, ellipsized), with an optional `titleSuffix` span (`ml-2`).
3. `description` (optional): `text-sm leading-6`, `mt-1`.
4. `thumb` (optional): when present the body becomes a flex pair (`gap-4`, `items-start`): a `flex-shrink-0` slot plus a `min-w-0 flex-1` text column. `thumbPosition="end"` reverses it.

### Variants

| Enum Value | Description |
|-----------|-------------|
| Link row | `href` set: renders `<a>`, accent title, hover fill. |
| Button row | `onClick` set: renders `<button type="button">`, accent title, hover fill. |
| Router row | `as` set: renders the custom component with `asProps`, accent title, hover fill. |
| Display row | None of the above: renders `<div>`, `text-primary` title, no hover. |
| `selected` | Holds the hover fill (`surface.muted`) at rest. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| (none) | Single density: 12px padding, 24px title line, so a title-only row is 48px tall. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `title` | `ReactNode` | none | Yes | Row title. Accent color when the row is interactive, `text-primary` otherwise. Single line: longer titles ellipsize. |
| `meta` | `ReactNode` | none | No | Small line above the title (date, category), in the AA-passing secondary pair (700 light / 600 dark), not `text.tertiary`. |
| `description` | `ReactNode` | none | No | Supporting line below the title. |
| `titleSuffix` | `ReactNode` | none | No | Trailing affordance beside the title, for example `<TuiIcon name="ExternalLink" size="3" />`. |
| `thumb` | `ReactNode` | none | No | Thumbnail node (sized `<img>` or framed element). Reserved with `flex-shrink: 0`, never scaled. |
| `thumbPosition` | `"start" \| "end"` | `"start"` | No | Which side the thumbnail sits on. |
| `selected` | `boolean` | `false` | No | Marks the current selection: holds the `surface.muted` fill. Pair with `aria-current="page"` in nav. |
| `href` | `string` | none | No | Renders an `<a>`. Mutually exclusive with `onClick` and `as`. |
| `onClick` | `() => void` | none | No | Renders a `<button type="button">`. Mutually exclusive with `href` and `as`. |
| `as` | `ElementType` | none | No | Custom link component (router `Link`). |
| `asProps` | `Record<string, unknown>` | none | No | Props spread onto the `as` component (`to`, `state`, `aria-current`, ...). |
| `className` | `string` | `""` | No | Appended to the row classes (plain concatenation, no tailwind-merge). |
| `ref` | `Ref<HTMLElement>` | none | No | Forwarded to the rendered element. |
| `...rest` | native element attributes | | No | Forwarded in every form, including display (`<div>`) and `as` rows (`aria-current`, `id`, `data-*`, `target`, `disabled`, ...). On `as` rows `asProps` is spread last, so it wins. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | stepped 6px corner polygon | Row silhouette (visible only when filled) |
| `--surface-muted` | Color | light `#F7F5F2`, dark `#221E13` | Hover fill (interactive rows) and `selected` fill |
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Interactive title |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Display-row title |
| `secondary-700` / `secondary-600` | Color | `#695F4D` light / `#968A75` dark | `meta` |
| `secondary-800` / `secondary-500` | Color | `#474030` light / `#BFB4A3` dark | `description` |
| `--focus-ring-primary`, `--focus-ring-width` | Focus | `#FBBF24`, `2px` | Inset focus ring (`box-shadow: inset`), since the clip swallows outside outlines |
| `--duration-fast` | Motion | `120ms` | Hover color transition |
| `truncate` | Typography | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` | Title overflow |
| `text-sm` / `text-base` | Typography | `14px` / `16px` | Meta and description / title |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Rest (interactive) | `href` / `onClick` / `as` | Title `--accent`, `cursor-pointer` |
| Rest (display) | no interaction props | Title `--text-primary`, no hover or focus styles |
| Hover | `:hover` (interactive only) | Background `--surface-muted` |
| Focus visible | `:focus-visible` (interactive only) | Inset 2px `--focus-ring-primary` |
| Selected | `selected` | Background `--surface-muted` at rest (title color unchanged; accent only if interactive) |
| With thumbnail | `thumb`, `thumbPosition` | Layout only; the text column is `min-w-0 flex-1` so a long title ellipsizes instead of pushing the image |
| Long title | title longer than the row | `truncate`: single line with an ellipsis |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Link row | Yes | Yes | `Default` (with `titleSuffix`) |
| Button row | Yes | Yes | `Default` |
| Display row | Yes | Yes | `Default` |
| Selected | Yes | Yes | `Selected`, with `aria-current="page"` in a `<nav>` |
| Thumbnail start / end | Yes | Yes | `WithThumbnail` |
| Router (`as`) | Yes | Yes | `AsRouterLink` (anchor stand-in) |
| Hover / focus | Yes | Interactive only | No static story |

Interactive controls: none (no `Playground` story; all stories use `render`).

**Coverage:** 100% (6/6)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. Meta and description use secondary-scale steps (`secondary-700/600`, `secondary-800/500`) chosen as AA-passing theme pairs rather than a semantic text token.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None imported. `titleSuffix` and `thumb` are consumer-provided (typically `TuiIcon` and an `<img>`).

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (plate, surface, accent, text, focus-ring, duration tokens)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `<a>` or `<button type="button">` when interactive; `<div>` for display rows. The accessible name is the whole row text (meta, title, description).
- Required labels: none beyond the text. Nav consumers pass `aria-current="page"` on the selected row.
- Focus order: document order; 2px inset focus ring.
- Keyboard: native Enter (links) and Enter/Space (buttons).
- Touch target minimum: met. 12px padding plus the 24px title line gives a 48px minimum height at full width.
- Color independence: `selected` pairs the fill with the accent title (fill plus color, never color alone), and `aria-current` carries it for screen readers.
- Text contrast: `meta` is 6.13:1 (light) / 5.34:1 (dark) and `description` 8.9:1 / 8.87:1, both clearing AA at 14px. `text.tertiary` (3.31:1 in light) is deliberately not used here.
- Truncated titles: the full text stays in the accessible name, so screen readers still read it in full. Keep titles short enough to scan visually.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `href` for navigation and `onClick` only for in-place selection (queue items, pickers).
- Do pass `aria-current="page"` together with `selected` in navigation.
- Do use `as={Link} asProps={{ to }}` for router navigation so the page does not reload.
- Do size `thumb` yourself (fixed width and aspect); the row reserves the slot but never scales it.
- Don't nest links or buttons inside an interactive row; the row is already the control.
- Don't put a `Card` or bordered frame inside a row; rows are the quiet tier.
- Don't style the current row with `className` fills; use `selected` so the state stays consistent.
- Don't use rows for tabular data with columns to compare; use `Table`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Stack rows with `Stack gap="1"` (nav, queues) or `gap-4` (content lists); rows carry their own padding, so no extra wrapper is needed.
- `selected` follows the `Patterns/SideNavigation` convention (fill plus color, never color alone, never weight); `Patterns/MusicPlayer` uses ListRow for its queue.
- Use `TuiIcon` at size `"3"` for `titleSuffix` so it matches the title line.
- Inside a `Card`, rows sit directly on the card surface; the hover plate reads against `surface.card`.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | JSDoc says `meta` renders in `text.tertiary`, and the story says long titles ellipsize; the code uses `secondary-700/600` for meta and has no `truncate`, so long titles wrap | Reconciled in favour of contrast: the JSDoc now documents the AA-passing secondary pair the code uses, and titles really do ellipsize (`truncate`). The `WithThumbnail` story shows a title long enough to prove it | Resolved |
| 2026-09-22 | Display rows (`<div>`) and `as` rows drop extra native attributes (`aria-*`, `id`); `className` is concatenated without tailwind-merge | Both forms now forward native attributes; on `as` rows `asProps` is spread last so it still wins. `className` is still plain concatenation | Partly resolved |
| 2026-09-22 | No unit tests for ListRow | Added: attribute forwarding on display and `as` rows, title truncation, and the `meta` colour pair | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | Titles truncate as documented, `meta` docs match the AA-passing colours the code uses, and native attributes are forwarded on display and `as` rows |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/ListRow.tsx`
