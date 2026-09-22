# Card

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Card` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Card.tsx` |
| Story | `Components/Display/Card` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Card is the standard container for a self-contained group of content on a page: a settings group, a profile, a testimonial, a deploy summary. It is a large plate with a hairline ring, an optional header (title and subtitle, or custom `headerContent`), a content area, and an optional footer for actions, each separated by hairlines. Use it to group related content and actions, not as generic page padding. For a dialog that interrupts the page use Modal; for dense repeated rows use ListRow or Table.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Outer ring plate (`plate-round-lg`, `--surface-container-stroke`, 1px padding) around an inner `--surface-card` fill containing: header (rendered when `title`, `subtitle`, or `headerContent` is set; title `h3` plus subtitle `p`, or the custom node), content, and footer (when `footerContent` is set). Header and footer have 0.5px `--surface-container-stroke` hairlines. Each section pads `p-4`, `p-6` from the `lg` breakpoint.

### Variants

| Enum Value | Description |
|-----------|-------------|
| Block (default) | Sections stack in normal flow. |
| Flex column | Triggered when `className` contains the substring `flex`: the ring and fill become flex columns and the content area grows (`flex-1 min-h-0`), so a fixed-height card pins its footer to the bottom. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| N/A | Width and height follow the container or `className`. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | | Yes | Main content. |
| `title` | `string` | `undefined` | No | Header title, rendered as an `h3` in `text-base` bold. |
| `subtitle` | `string` | `undefined` | No | Secondary line under the title, `text-sm`. |
| `headerContent` | `ReactNode` | `undefined` | No | Custom header; replaces `title` and `subtitle` entirely when set. |
| `footerContent` | `ReactNode` | `undefined` | No | Footer band for actions or metadata. |
| `className` | `string` | `""` | No | Extra classes on the outer ring (width, height). Including `flex` switches on the flex column layout. |

Exported type: `CardProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round-lg` (`plate-round-lg`) | Shape | 12px stepped corner polygon | Ring and fill clip |
| `--surface-container-stroke` | Color | `#BFB4A3` light, `#474030` dark | Ring layer; header and footer hairlines |
| `--surface-card` | Color | `#FFFFFF` light, `#120D09` dark | Fill (footer included) |
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | Title |
| `secondary-800` / `dark:secondary-300` | Color | sepia-800 `#474030` / sepia-300 `#F0EBE4` | Subtitle |
| `text-base`, `text-sm` | Typography | 16px, 14px | Title, subtitle |
| `p-4`, `lg:p-6`, `mb-1` | Spacing | 16px, 24px, 4px | Section padding, title to subtitle gap |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Header (title and subtitle) | `title`, `subtitle` | Header section with bottom hairline |
| Custom header | `headerContent` | Header section; title and subtitle ignored |
| Footer | `footerContent` | Footer section with top hairline |
| Bare | No header or footer props | Content only |
| Flex column | `className` containing `flex` | Layout classes only |
| Responsive padding | Viewport at the `lg` breakpoint | `p-4` to `p-6` |

Cards are static: no hover, focus, or pressed states.

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Title and subtitle header | Yes | Yes | `Default`, `WithFooter` |
| Custom `headerContent` | Yes | Yes | `WithHeaderContent` (Avatar identity header) |
| Footer | Yes | Yes | `WithFooter`, `WithHeaderContent` |
| Bare card | Yes | Yes | `Testimonial` |
| Flex column layout | Yes | Yes | `WithFooter`, `Testimonial` |

Interactive controls: args editable via autodocs (no custom controls).

**Coverage:** 100% (5/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `border-b-[0.5px]` / `border-t-[0.5px]` hairlines on header and footer.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (surface and text variables)
- `packages/tokens/tailwind.preset.js` (`plate-round-lg` utility, semantic color scales)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none; a plain `div`. The title is always an `h3`
- Required labels: none; add a heading via `title` or `headerContent` when the card is a landmark-like group
- Focus order: not focusable; interactive children follow DOM order
- Touch target minimum: applies to controls placed in the footer or content
- Color independence: no color-coded meaning

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use `title` and `subtitle` for simple headers and `headerContent` for identity headers (Avatar plus name).
- Do put actions in `footerContent` with DS Buttons, primary last.
- Do add `flex flex-col` with a fixed height when the footer or an attribution must sit at the bottom.
- Don't nest Cards inside Cards; use a Divider or spacing to separate subgroups.
- Don't render dropdown menus or tooltips that need to escape the card; the plate clip cuts them off.
- Don't pass padding overrides to fake a different density; the section padding is part of the component.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- The clip path bounds all children: popovers, menus, and tooltips inside a Card must open toward space inside it or render outside (portal).
- Grid of cards: give each card the same height and `flex flex-col` so footers align.
- If the page heading structure needs a level other than `h3`, render the heading yourself in `headerContent`.
- Content sections that need their own separators can use the same 0.5px `--surface-container-stroke` hairline (see the `Testimonial` story).

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Flex layout is detected with `className.includes('flex')`, so `inline-flex`, `flex-1`, or `flex-wrap` also switch the card into a flex column; title heading level is fixed at `h3`; no unit tests | None yet | Open |

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

`packages/components/src/components/Card.tsx`
