# Pagination

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Pagination` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/Pagination.tsx` |
| Story | `Components/Navigation/Pagination` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `7ea8f60bc2d19bc7` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

PAGINATION COMPONENT

Page picker for long, paged collections. Boundary pages, sibling pages around
the current one, and an ellipsis where a gap is skipped; the list length stays
constant while paging so the control never jumps. Prev/next use the 1-bit
ArrowLeft/ArrowRight icons with accessible labels.

The visible plate follows the Button scale (`h-control-sm|md|lg`); the button
element is the hit area (at least 44px) and the plate is an inner span, because
the plate clip-path would also clip an enlarged hit area. The current page is
the primary plate and carries `aria-current="page"`.

`getPaginationRange(page, pageCount, siblingCount, boundaryCount)` is exported
for custom renderers.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| current | Primary button fill plate + `aria-current` |
| page | Ghost plate, hover fill |
| ellipsis | `...` text, `aria-hidden` |

### Sizes

| Enum Value | Description |
|------------|-------------|
| `sm` | 32px plate, 44px hit area |
| `md` | 40px plate (default), 44px hit area |
| `lg` | 48px plate and hit area |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `page` | `number` | - | No | Current page, 1-based (controlled). |
| `defaultPage` | `number` | `1` | No | Uncontrolled start page. |
| `pageCount` | `number` | - | Yes | Total pages; renders nothing at 0. |
| `onPageChange` | `(page) => void` | - | No | Requested page. |
| `siblingCount` | `number` | `1` | No | Pages each side of current. |
| `boundaryCount` | `number` | `1` | No | Pages at each end. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | No | Plate height (legacy names deprecated). |
| `showPrevNext` | `boolean` | `true` | No | Arrow buttons. |
| `getPageLabel` | `(page) => string` | "Page n" | No | Page button name. |
| `previousLabel` / `nextLabel` | `string` | "Previous page" / "Next page" | No | Arrow button names. |
| `aria-label` | `string` | `"Pagination"` | No | Landmark name. |
| `className` | `string` | - | No | Extra classes on the `<nav>`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `button.primary.background` / `text` | color | theme | Current page plate |
| `button.ghost.background` / `background-hover` / `text` | color | theme | Other pages |
| `control.height.sm/md/lg` | size | 32 / 40 / 48px | Plate height |
| `touch.target` | size | 44px | Hit area |
| `plate.round`, focus inset ring, `duration.fast` | shape / focus / motion | 150ms | Plate, focus, hover |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Current | `page` | Primary fill, `aria-current` |
| Hover | :hover | Ghost hover fill |
| Disabled | prev on page 1, next on last | `disabled`, 50% opacity |
| Focus-visible | keyboard | Inset ring on the plate |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| MiddlePage | Yes | Yes |  |
| FewPages | Yes | Yes |  |
| Siblings 2, boundaries 2 | Yes | Yes |  |
| Sizes | Yes | Yes |  |
| Ends | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (6/6)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- TuiIcon
- lib/size (resolveSize)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `navigation` landmark with a `ul` of buttons
- Required labels: page buttons "Page n", arrows "Previous page" / "Next page"
- Focus order: prev, pages, next
- Touch target minimum: 44x44 at every size
- Color independence: current page is a filled plate plus `aria-current`

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep Pagination below the collection it controls.
- Do move focus or announce results after a page change in your app.
- Don't use Pagination for infinite feeds; load more instead.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

[TODO: define how this component behaves with others]

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial component (navigation batch, ds-nav-terminal) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Pagination.tsx`
