# VisuallyHidden

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `VisuallyHidden` (import from `@scorp-ds/components`) |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/VisuallyHidden.tsx` |
| Story | `Primitives/Layout/VisuallyHidden` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

VisuallyHidden renders content that screen readers announce and nobody sees: the word "Close" in an icon button, a caption for a table, the "Skip to content" link at the top of a page. It applies the clip-rect recipe, never `display: none` or `visibility: hidden`, which would take the text out of the accessibility tree along with the pixels. Making it a component rather than a bare class means the rule is documented in one place, the `focusable` skip-link variant exists, and the intent is legible in the markup. If content should be hidden from everyone, use `aria-hidden` or do not render it.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A single element (`as`, default `span`) carrying the `sr-only` utility, which is Tailwind's implementation of the clip-rect recipe: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0`. The element stays rendered and in the accessibility tree.

### Variants (`focusable`)

| Enum Value | Description |
|-----------|-------------|
| `false` (default) | Always hidden. No focus escape hatch. |
| `true` | Adds `focus:not-sr-only focus-within:not-sr-only`, so the content appears once it or anything inside it takes focus. The revealed element is statically positioned, so give it placement classes through `className` (the story uses `focus-within:absolute focus-within:left-4 focus-within:top-4`). |

### Variants (`as`, type `VisuallyHiddenElement`)

| Enum Value | Description |
|-----------|-------------|
| `span` (default) | Inline text inside a button, link or heading. |
| `div`, `p` | Block-level hidden text. |
| `label` | A real label for a control, wired with `htmlFor`. |
| `legend` | A name for a `fieldset` whose grouping is visually obvious. |
| `li` | Hidden list item inside a list, so the list structure stays valid. |

### Sizes

Not applicable: the element is always the 1px clipped box.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | Yes | Text or markup to announce. Keep it short and literal. |
| `focusable` | `boolean` | `false` | No | Whether the content reveals itself when something inside it takes focus (skip links). |
| `as` | `VisuallyHiddenElement` (`"span" \| "div" \| "p" \| "label" \| "legend" \| "li"`) | `"span"` | No | Element to render. |
| `className` | `string` | none | No | Extra classes, merged with `cn()` (tailwind-merge); mainly placement for the focusable variant. |
| `ref` | `Ref<HTMLElement>` | none | No | Forwarded to the underlying element. |
| `...rest` | native attributes of the chosen element | | No | Spread onto the element (`id` for `aria-labelledby` / `aria-describedby`, `htmlFor` on a `label`, `data-*`). |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| none | | | The component sets no color, spacing, typography or motion. It inherits everything from its parent, which is why the text still announces correctly. |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Hidden (default) | `sr-only` | none |
| Revealed on focus | `focusable` plus focus inside the element | none; the revealed content styles itself |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Hidden text | Yes | Yes | `Default` (a hidden line between two rules) |
| Accessible name for an icon control | Yes | Yes | `IconButtonLabel` |
| `focusable` skip link | Yes | Yes | `FocusableSkipLink` (tab into the frame to reveal it) |
| `as="label"` | Yes | Yes | `AsLabel` (hidden label wired to a search field) |
| Realistic composition | Yes | Yes | `TableActions` (repeated "Rerun" buttons disambiguated by hidden text) |

Interactive controls: `focusable`, `as`.

**Coverage:** 100% (5/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found. The recipe is the Tailwind `sr-only` / `not-sr-only` utility pair, not hand-written offsets.

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

- Semantic role: none of its own. The content participates in the accessible name of an ancestor button or link, which is the main use.
- Required labels: this component is the label. Write what a sighted user gets from the icon or from position, in the same words ("Close panel", not "Click here").
- Focus order: unchanged when `focusable` is off (the element itself is not focusable). With `focusable`, the content inside is a normal tab stop and reveals itself on focus, which is what makes a skip link usable.
- Touch target minimum: n/a while hidden. A revealed skip link is a normal control and must meet 44px.
- Color independence: n/a. Pair hidden text with an `aria-hidden="true"` glyph so assistive tech hears the words once, not twice.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use it for the accessible name of an icon-only control, and mark the glyph `aria-hidden="true"`.
- Do use it to disambiguate repeated controls in a list ("Rerun build 4821") without adding visual noise.
- Do use `focusable` for skip links, and give them placement classes so the revealed link does not shift the layout.
- Don't use it to hide content from everyone; that is `aria-hidden` or not rendering it.
- Don't put interactive content inside it without `focusable`: a focusable element in a clipped box is a keyboard trap that nobody can see.
- Don't use it for long paragraphs. If the information matters that much, show it.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Inside Button, Link, ListRow and table cells, as the accessible name next to an `aria-hidden` glyph.
- `aria-label` remains correct for a control whose whole name is one string; VisuallyHidden is for text that must live in the DOM, for example when it is referenced by `aria-labelledby` or when it mixes with visible text.
- Migration, not done in this PR: `Link`, `Select`, `SideNav`, `Spinner`, `Skeleton`, `Radio` and `Checkbox` currently apply a raw `sr-only` class. They can move to `VisuallyHidden` when each is next touched; the rendered output is identical, so the change is safe but not urgent.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Seven components still use a raw `sr-only` class | Migration noted in Composition Rules; deliberately out of scope for the PR that created the primitive | Open |
| 2026-09-22 | The `focusable` variant reveals content as a statically positioned element, so callers must supply placement | Documented on the prop and in the story; positioning depends on the host layout | Won't fix |

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

`packages/components/src/primitives/VisuallyHidden.tsx`
