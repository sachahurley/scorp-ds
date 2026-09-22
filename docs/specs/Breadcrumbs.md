# Breadcrumbs

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Breadcrumbs` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/Breadcrumbs.tsx` |
| Story | `Components/Navigation/Breadcrumbs` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `0b88e94071062cca` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

BREADCRUMBS COMPONENT

Shows where the current page sits in a hierarchy: a `<nav aria-label="Breadcrumb">`
landmark around an ordered list of links, ending on the current page (plain text
with `aria-current="page"`). Separators are the 1-bit ChevronRight icon, hidden
from assistive tech because the list already conveys order.

`maxItems` folds the middle of long trails into one overflow button; activating
it expands the trail in place and moves focus to the first revealed link. Items
render through `Link` (quiet variant), so router links work via `as` / `asProps`.

Don't use this for: step progress (use a stepper) or tabs between sibling views
(use Tabs).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| (none) | Single visual treatment; collapse is behavior, not a variant. |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (inherits) | Text size `text-sm`; links and the overflow button keep a 44px hit area (`min-h-touch`). |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `items` | `BreadcrumbItem[]` | - | Yes | Trail root to current page; the last item is current. |
| `items[].label` | `ReactNode` | - | Yes | Visible text. |
| `items[].href` / `as` / `asProps` | `string` / `ElementType` / `object` | - | No | Destination or router link (ignored on the current item). |
| `maxItems` | `number` | unset | No | Collapse the middle once the trail is longer. |
| `itemsBeforeCollapse` | `number` | `1` | No | Items kept before the overflow button. |
| `itemsAfterCollapse` | `number` | `1` | No | Items kept after the overflow button. |
| `expandLabel` | `(n) => string` | "Show n more breadcrumbs" | No | Overflow button accessible name. |
| `aria-label` | `string` | `"Breadcrumb"` | No | Landmark name. |
| `className` | `string` | - | No | Extra classes on the `<nav>`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `accent` / `text.link-hover` | color | via Link | Ancestor links (quiet Link) |
| `text.primary` | color | theme | Current page |
| `text.secondary` | color | sepia 700 light / 500 dark | Separator icons |
| `surface.muted` | color | theme | Overflow button hover fill |
| `plate.round`, focus inset ring | shape / focus | - | Overflow button |
| `touch.target` | size | 44px | Hit areas |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Collapsed | `maxItems` exceeded | Overflow button shown |
| Expanded | overflow activated | All items; focus moves to first revealed |
| Current | last item | `aria-current="page"`, text.primary |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Collapsed | Yes | Yes |  |
| Collapsed (2 before, 2 after) | Yes | Yes |  |
| Short | Yes | Yes |  |
| RouterLinks | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (5/5)

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

- Link
- TuiIcon

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `navigation` landmark with an `ol`
- Required labels: landmark name (default "Breadcrumb"); overflow button `aria-label`
- Focus order: document order; expanding moves focus to the first revealed link
- Touch target minimum: 44x44 (`min-h-touch`, `min-w-touch`)
- Color independence: current page is plain text (not a link) with `aria-current`

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do end the trail on the current page.
- Do use `maxItems` on deep hierarchies so the trail stays on one line.
- Don't use breadcrumbs as the only navigation on a page.

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

`packages/components/src/components/Breadcrumbs.tsx`
