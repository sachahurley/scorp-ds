# Container

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Container` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Container.tsx` |
| Story | `Primitives/Layout/Container` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Container is the page-width wrapper: one max width, one set of gutters, one place to change either. Use it as the outermost element of a page or of a full-width band, in place of the hand-written `mx-auto max-w-* px-*` runs that the site and the showcase repeat today. It decides width and horizontal inset only: vertical rhythm belongs to Stack, and a background band belongs to a Box around the Container, so the color reaches the viewport edges while the text stays within the measure.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A single element (`as`, default `div`) with `mx-auto w-full`, a max width, and the gutter classes.

### Variants (`as`, type `ContainerElement`)

| Enum Value | Description |
|-----------|-------------|
| `div` (default) | Generic wrapper. |
| `main`, `header`, `footer`, `nav`, `aside`, `section`, `article` | Renders the real landmark, so a page shell needs no extra element. |

### Variants (`gutter`)

| Enum Value | Description |
|-----------|-------------|
| `true` (default) | `px-5 lg:px-10`: 20px inset, 40px from the `lg` breakpoint up. |
| `false` | No horizontal inset, for a band whose child owns the edge or for a nested Container. |

### Sizes (`size`, type `ContainerSize`)

Each value is a breakpoint width, so a container never stops mid-breakpoint.

| Enum Value | Description |
|-----------|-------------|
| `sm` | `max-w-screen-sm` (640px) |
| `md` | `max-w-screen-md` (768px) |
| `lg` (default) | `max-w-screen-lg` (1024px) |
| `xl` | `max-w-screen-xl` (1280px) |
| `full` | `max-w-full` (no limit) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | Yes | Page content, centered inside the max width and inset by the gutters. |
| `size` | `ContainerSize` | `"lg"` | No | Where the content stops growing, from the breakpoint scale. |
| `gutter` | `boolean` | `true` | No | Whether to inset the content from the viewport edges. |
| `as` | `ContainerElement` | `"div"` | No | Element to render, so the wrapper can be the real landmark. |
| `className` | `string` | none | No | Extra classes (vertical padding, background), merged with `cn()` (tailwind-merge), so `px-0` beats the gutters. |
| `ref` | `Ref<HTMLElement>` | none | No | Forwarded to the underlying element. |
| `...rest` | native attributes of the chosen element | | No | Spread onto the element (`id`, `role`, `aria-*`, `data-*`, handlers). |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| Breakpoints `sm` / `md` / `lg` / `xl` (Tailwind `screens`, fed by the breakpoint tokens) | Layout | 640px, 768px, 1024px, 1280px | `size` max widths, and the `lg:` gutter step |
| `--spacing-5` (via `px-5`) | Spacing | 20px | Gutter below `lg` |
| `--spacing-10` (via `lg:px-10`) | Spacing | 40px | Gutter from `lg` up |

Container references no color, typography or motion tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Measured page column | `size` | breakpoint scale |
| Gutters on | `gutter` (default) | `--spacing-5`, `--spacing-10` |
| Flush | `gutter={false}` | none |
| Landmark wrapper | `as` | none |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default (`lg`, gutters on) | Yes | Yes | `Default` |
| All sizes | Yes | Yes | `Sizes` (sm, md, lg, xl, full) |
| `gutter={false}` | Yes | Yes | `WithoutGutter` |
| Landmark element | Yes | Yes | `PageShell` (`as="section"` with `aria-label`) |
| Realistic composition | Yes | Yes | `PageShell` (full-bleed Box band with a Container inside) |

Interactive controls: `size`, `gutter`, `as`.

**Coverage:** 100% (5/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. Max widths are the Tailwind `max-w-screen-*` utilities, which read the `screens` scale, and the gutters are spacing-scale utilities.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/tokens/tailwind.preset.js` (`screens`, spacing scale)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none by default. `as="main"` / `"header"` / `"footer"` / `"nav"` / `"aside"` renders the real landmark, which is the supported way to build a page shell without a wrapper element.
- Required labels: a page may have only one `main`; give repeated `nav` or `aside` landmarks an `aria-label` so screen reader users can tell them apart.
- Focus order: Container adds no focusable element; DOM order is unchanged.
- Touch target minimum: n/a.
- Color independence: n/a; Container paints nothing. Pair it with a Box when a band needs a surface.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use one Container per band, not one per page: a full-bleed band gets its own Box plus Container pair so every band's content stays aligned.
- Do keep `size="lg"` unless a page has a reason to be narrower or wider; consistency across pages is the point of the primitive.
- Do put vertical padding in `className` (`py-8`) or, better, in a Stack inside the Container.
- Don't nest a guttered Container inside another guttered Container; the insets double. Use `gutter={false}` for the inner one.
- Don't set a max width through `className`; add or change a `size` value so every page moves together.
- Don't use Container to center a small block such as a sign-in card. That is Center.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- The page shape is Box (background, full bleed) wraps Container (measure, gutters) wraps Stack (vertical rhythm).
- Migration, not done in this PR to keep the diff reviewable: `packages/site/src/App.tsx` hand-writes the same shape (`mx-auto flex max-w-3xl ...` for the header row, `mx-auto max-w-3xl px-6 py-12` for the page body), and the showcase pages repeat their own `container mx-auto px-5 lg:px-10` run. Both should become `<Container size="md">` plus a `className` for the vertical padding when each file is next touched. Storybook pattern and screen stories that center their own frame can stay as they are: they are specimens, not pages.
- Container is width only: never give it a surface. A band that needs a background gets a Box around it, so the color reaches the viewport edges.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | The gutter is a boolean, so a page cannot choose a narrower or wider inset | Intentional: one gutter value is what makes pages line up. Revisit only if a real screen needs a second value | Open |
| 2026-09-22 | The site and showcase pages still hand-write the container shape | Migration noted in Composition Rules; out of scope for the PR that created the primitive | Open |

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

`packages/components/src/primitives/Container.tsx`
