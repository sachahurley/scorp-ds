# Link

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Link` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/Link.tsx` |
| Story | `Components/Navigation/Link` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Link is the inline text link for navigation inside prose, captions, nav lists and footers. It always renders a real anchor (or a router link via `as`/`asProps`, the same polymorphism as `ListRow`), never a button: links navigate, `Button` acts. When a navigation needs to look like a plate-shaped call to action, use `Button` with `href` instead; when the action happens in place ("Show more", "Open dialog"), use `Button`. The `inline` variant keeps a persistent underline so a link in body text never relies on color alone, and `quiet` reserves the underline for hover and focus where position already signals the link. There is deliberately no disabled state: a link without a destination is just text, so render text.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

An `<a>` (or the `as` component) containing the children and, when `external` is set, a 12px `ExternalLink` `TuiIcon` (`ml-1`) plus an sr-only " (opens in new tab)" span.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `inline` (default) | Persistent underline (`underline underline-offset-2`). The safe treatment inside body text. |
| `quiet` | No underline at rest; underline on hover and focus-visible. For nav lists and footers. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| (none) | No size axis: Link inherits the surrounding font size and line height. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `variant` | `"inline" \| "quiet"` | `"inline"` | No | Underline treatment (see Variants). |
| `external` | `boolean` | `false` | No | Sets `target="_blank"` and `rel="noopener noreferrer"` in both forms, appends the `ExternalLink` glyph and the sr-only "(opens in new tab)" notice. In the anchor form your own `target` / `rel` win; in the `as` form anything in `asProps` wins. |
| `href` | `string` | none | One of `href` / `as` | Destination; renders an `<a>`. |
| `as` | `ElementType` | none | One of `href` / `as` | Custom link component (for example a router `Link`), rendered with identical styling. |
| `asProps` | `Record<string, unknown>` | none | No | Props spread onto the `as` component (`to`, `state`, ...). Only with `as`. |
| `children` | `ReactNode` | none | Yes | Link text. Describe the destination; avoid bare "here". |
| `className` | `string` | `""` | No | Extra classes, merged with `cn()` (tailwind-merge), so color or size overrides win. |
| `ref` | `Ref<HTMLAnchorElement>` | none | No | Forwarded to the `<a>` or the `as` component. |
| `...rest` | native `<a>` attributes | | No | Anchor form only (`target`, `rel`, `onClick`, `aria-*`, ...). Not forwarded in the `as` form: pass them through `asProps`. The `external` new-tab attributes are the exception and reach the `as` component. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--accent` | Color | light `#B45309` (amber-700), dark `#E0A26A` (amber-gold) | Resting text color, the documented "links, active nav" role. Theme eggs may override it at runtime. |
| `--text-link-hover` | Color | light `#92400E`, dark `#FCD34D` | Hover text color (darkens in light, brightens in dark) |
| `--focus-ring-primary` | Color | `#FBBF24` | Focus-visible outline color |
| `--focus-ring-width` | Size | `2px` | Outline thickness |
| `--focus-ring-offset` | Size | `2px` | Outline offset (outside outline is safe: links are not plate-clipped) |
| `--duration-fast` | Motion | `120ms` | Color transition |
| `--font-family-mono` (`font-mono`) | Typography | Fragment Mono stack | Link text |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Rest | `variant` | `--accent`; underline on `inline` only |
| Hover | `:hover` | `--text-link-hover`; `quiet` gains the underline |
| Focus visible | `:focus-visible` | Outline `--focus-ring-width` solid `--focus-ring-primary`, offset `--focus-ring-offset`; `quiet` gains the underline |
| External | `external` prop | Adds `ExternalLink` glyph, sr-only notice, and the `target="_blank"` / `rel="noopener noreferrer"` defaults in both the anchor and `as` forms |
| Router link | `as` / `asProps` | Same classes on the custom component |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| inline | Yes | Yes | `Inline (in prose)` |
| quiet | Yes | Yes | `Quiet (nav list)` inside a labeled `<nav>` |
| external | Yes | Yes | `External` |
| `as` / `asProps` router form | Yes | No | Not demoed (ListRow's `AsRouterLink` shows the same polymorphism) |
| Hover / focus | Yes | Interactive only | No static story |

Interactive controls: `Playground` with `variant`, `external`, `children` (plus `href` arg).

**Coverage:** 75% (3/4)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. `underline-offset-2` and `ml-1` are Tailwind scale utilities.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`ExternalLink`, size `"3"`, external links only)

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/tokens/src/styles/tokens.css` (accent, text-link-hover, focus-ring, duration tokens)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `<a>` (or the `as` component's element); never a button.
- Required labels: descriptive children. External links add an sr-only "(opens in new tab)"; the glyph itself is `aria-hidden`. The notice is now always true: `external` sets the new-tab attributes in the `as` form as well, so the announcement matches the behaviour.
- Focus order: document order; a visible 2px outside outline on focus-visible.
- Keyboard: native Enter on the anchor.
- Touch target minimum: not enforced. Inline text links fall under the WCAG 2.5.8 inline exception; stacked `quiet` nav lists should get vertical spacing from the parent (`gap-2` in the story).
- Color independence: `inline` keeps a persistent underline. `quiet` relies on position at rest, so reserve it for nav lists and footers.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- DO use Link for navigation inside prose and for nav/footer lists.
- DO use `as`/`asProps` for router links instead of wrapping.
- DO write link text that names the destination ("design tokens reference", not "click here").
- DON'T use Link for actions (open modal, submit); that's Button.
- DON'T use `Button variant="link"` for inline text links; it is the legacy
  path and Link supersedes it for text-in-prose. Plate-shaped link CTAs stay
  `Button href`.
- DON'T use `quiet` inside running body text: without the underline the link is signalled by color alone.
- DON'T disable a link; drop the wrapper and render text.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

Inherits font size from context (no size axis), so it sits correctly in any
text tier. Inside `ListRow`/`Table` cells prefer the row's own interactive
modes before nesting links.

- Never nest a Link inside an interactive `ListRow` (it is already an `<a>` or `<button>`); use a display-only row or the row's `href`.
- For a list of `quiet` links, wrap them in a `<nav aria-label="...">` so the landmark carries the context the missing underline does not.
- With `as`, set `target` / `rel` in `asProps` yourself when the destination is external; `external` only adds the glyph and notice in that form.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-20 | `Button variant="link"` overlaps this component for text links | Documented as legacy for inline use; revisit full deprecation once usages migrate | open |
| 2026-09-20 | `text.link` rest token duplicates the accent role (predates the merged identity; identical in light, bright amber-400 in dark vs accent gold) | Link renders `accent` at rest per the token docs; `text.link` rest is unconsumed again and a candidate for retirement or re-pointing at accent | open |
| 2026-09-22 | `external` with `as` adds the glyph and notice but not `target` / `rel`, and native anchor attributes are not forwarded in the `as` form | `external` now passes `target="_blank"` and `rel="noopener noreferrer"` to the `as` component (router links forward them to the anchor they render), with `asProps` spread last so a consumer can opt out. Other native attributes still go through `asProps` | Resolved |
| 2026-09-22 | No unit tests for Link | Added: `external` in both forms, the `asProps` override, and the non-external default | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-20 | added | Initial component: inline/quiet variants, external affordance, router polymorphism |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | `external` sets `target` / `rel` in the `as` form too, so the glyph and the "(opens in new tab)" notice always match the behaviour |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Link.tsx`
