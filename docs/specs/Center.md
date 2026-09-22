# Center

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Center` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Center.tsx` |
| Story | `Primitives/Layout/Center` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `4bb4a67710881c79` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Center puts one column of content in the middle of its parent: a measured width, optionally centered text, and optionally the full viewport height. Use it for sign-in cards, empty states, 404 screens and any single column that should sit in the middle of the page. Center is about a block of content, not about the page: the page-level wrapper with gutters is Container, and the rhythm inside the column is Stack.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A single element (`as`, default `div`) with `mx-auto w-full`, a max width, and the optional text and full-height classes.

### Variants (`andText`)

| Enum Value | Description |
|-----------|-------------|
| `false` (default) | Box centered, text ragged right, which reads better for forms and prose. |
| `true` | Adds `text-center`, for short copy in empty states and splash screens. |

### Variants (`fullHeight`)

| Enum Value | Description |
|-----------|-------------|
| `false` (default) | The block sits at the top of the flow. |
| `true` | Adds `flex min-h-screen flex-col justify-center`: the column is also centered in the viewport height. |

### Variants (`as`, type `CenterElement`)

| Enum Value | Description |
|-----------|-------------|
| `div` (default) | Generic wrapper. |
| `section`, `article`, `main`, `figure` | Renders a real element, so a centered screen can be a labelled region. |

### Sizes (`maxWidth`, type `CenterMaxWidth`)

Content-column widths, not page widths. Container is the page.

| Enum Value | Description |
|-----------|-------------|
| `xs` | `max-w-xs` (320px) |
| `sm` | `max-w-sm` (384px) |
| `md` (default) | `max-w-md` (448px), about the width of a sign-in card |
| `lg` | `max-w-lg` (512px) |
| `xl` | `max-w-xl` (576px) |
| `2xl` | `max-w-2xl` (672px) |
| `none` | `max-w-none`, to center a block that sizes itself |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | Yes | Content to center; it keeps its own layout inside the column. |
| `maxWidth` | `CenterMaxWidth` | `"md"` | No | Width of the centered column. |
| `andText` | `boolean` | `false` | No | Whether to center the text as well as the box. |
| `fullHeight` | `boolean` | `false` | No | Whether to also center vertically in the viewport. |
| `as` | `CenterElement` | `"div"` | No | Element to render. |
| `className` | `string` | none | No | Extra classes (padding, background), merged with `cn()` (tailwind-merge), so `max-w-xs` beats `maxWidth="md"`. |
| `ref` | `Ref<HTMLElement>` | none | No | Forwarded to the underlying element. |
| `...rest` | native attributes of the chosen element | | No | Spread onto the element (`id`, `role`, `aria-*`, `data-*`, handlers). |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| Tailwind content widths `max-w-xs` to `max-w-2xl` | Layout | 320px, 384px, 448px, 512px, 576px, 672px | `maxWidth` |
| Viewport height (`min-h-screen`) | Layout | `100vh` | `fullHeight` |

Center references no color, typography, spacing or motion tokens: it sets width and alignment only.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Horizontal centering (always) | `mx-auto w-full` | none |
| Column width | `maxWidth` | content width scale |
| Centered text | `andText` | none |
| Viewport centering | `fullHeight` | none |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default column | Yes | Yes | `Default` (`maxWidth="md"`) |
| All widths | Yes | Yes | `MaxWidth` (xs to 2xl; `none` via the control) |
| `andText` | Yes | Yes | `AndText` (side by side with the default) |
| `fullHeight` | Yes | Yes | `FullHeight` (empty state) |
| Realistic composition | Yes | Yes | `SignInCard` (Center + Box + Stack + Input + Button) |

Interactive controls: `maxWidth`, `andText`, `fullHeight`, `as`.

**Coverage:** 100% (5/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. Widths are Tailwind `max-w-*` utilities and the full-height option is `min-h-screen`; no colors, spacing or radii are set.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none by default; `as="section"` plus `aria-label` turns a centered screen into a named region, and `role` / `aria-*` are forwarded.
- Required labels: none, unless a forwarded `role` or landmark needs a name.
- Focus order: Center adds no focusable element and does not reorder children; DOM order is unchanged.
- Touch target minimum: n/a for the wrapper; the controls inside keep their own 44px targets.
- Color independence: n/a. Note that `andText` changes text alignment only: it must never be the only signal that content is, for example, an error state.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `fullHeight` only when the Center owns the whole page (sign-in, splash, 404); inside a page section it would push everything down by a viewport.
- Do keep `andText` off for forms and multi-line prose; centered body text is harder to scan.
- Do pair Center with Box for the surface and Stack for the rhythm inside the column.
- Don't use Center as the page wrapper. It has no gutters, so on a narrow viewport the content would touch the edges; that is Container.
- Don't set a width through `className`; pick a `maxWidth` value so centered blocks stay consistent.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- The centered-screen shape is Center (`fullHeight`, `as="section"`, labelled) wraps Box (ring and padding) wraps Stack (fields and actions).
- Inside a page, Container sets the measure and Center narrows one block within it, for example a centered call to action inside a wide article.
- `EmptyState` is the component-level answer for the "nothing here yet" case; Center is what places it when the screen is otherwise blank.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | `fullHeight` uses `min-h-screen`, so a Center inside a fixed-height panel centers against the viewport rather than the panel | Documented; use `className="min-h-full"` for that case, which `cn()` lets override | Open |
| 2026-09-22 | The width scale differs from Container's breakpoint scale, which can read as inconsistent | Intentional: Center measures a content column, Container measures the page. Stated in both specs | Won't fix |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-22 | feat | Primitive created |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/primitives/Center.tsx`
