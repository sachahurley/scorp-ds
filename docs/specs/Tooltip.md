# Tooltip

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Tooltip` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Tooltip.tsx` |
| Story | `Components/Display/Tooltip` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Tooltip shows a short supplementary hint next to a trigger when it is hovered or focused, most often to name an icon-only button or add a detail to a label. It is supplementary only: the interface must make sense without it, because touch users rarely see it and its content is plain text. Never put the only copy of essential information, or anything interactive, in a tooltip. Use helper text on the field, an inline note, or an Alert when the information matters.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Wrapper (`relative inline-block w-fit`) holding the trigger and, while open, an absolutely positioned balloon: transparent hover bridge, ring plate (`plate-round`, `--surface-container-stroke`, 1px padding) around a `--surface-card` fill, and a 1-bit stepped caret (two stacked clip-path polygons) pointing at the trigger.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `top` | Above the trigger, centered, 8px gap (default) |
| `bottom` | Below the trigger, caret rotated 180deg |
| `left` | Left of the trigger, vertically centered, caret rotated -90deg |
| `right` | Right of the trigger, vertically centered, caret rotated 90deg |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| N/A | Width hugs the content between a 64px minimum (`min-w-16`) and `maxWidth` (default `200px`); text wraps. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `content` | `ReactNode` | | Yes | The hint. Plain text only; no links or buttons. |
| `children` | `ReactNode` | | Yes | The trigger. Pass a single focusable element (Button, link) so it receives `aria-describedby` and keyboard users can open the tooltip. |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | No | Side of the trigger. No automatic flipping. |
| `delay` | `number` | `200` | No | Milliseconds before showing on hover or focus. Hiding is immediate. |
| `maxWidth` | `string` | `"200px"` | No | Balloon max width, any CSS length (inline style). |
| `className` | `string` | `""` | No | Extra classes on the wrapper, e.g. `w-full` for a full-width trigger. |

Exported type: `TooltipProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | 6px stepped corner polygon | Balloon ring and fill |
| `--surface-container-stroke` | Color | `#BFB4A3` light, `#474030` dark | Balloon ring, caret outer layer |
| `--surface-card` | Color | `#FFFFFF` light, `#120D09` dark | Balloon fill, caret inner layer |
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | Content text |
| `--z-index-tooltip` | Layer | 1060 | Balloon stacking (top of the z scale) |
| `--duration-fast` | Motion | 120ms | Opacity fade in |
| `text-xs` | Typography | 12px | Content |
| `px-3 py-2`, `min-w-16`, `mb-2` / `mt-2` / `mr-2` / `ml-2` | Spacing | 12px / 8px, 64px, 8px | Padding, minimum width, gap to trigger |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Hidden | Default | Balloon not mounted |
| Pending | Hover or focus, before `delay` | None |
| Mounting | After `delay` | Mounted at `opacity-0` for 50ms to allow layout |
| Visible | 50ms later | `opacity-100` over `--duration-fast`; trigger gains `aria-describedby` |
| Hovering the balloon | Pointer crosses the 8px bridge | Stays open |
| Dismissed | Mouse leave, focus leaving the wrapper, or Escape | Unmounted immediately |
| Side | `position` | Placement classes and caret rotation |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| `top` | Yes | Yes | `OnButton`, `Positions` |
| `bottom` | Yes | Yes | `Positions` |
| `left` | Yes | Yes | `Positions` |
| `right` | Yes | Yes | `Positions` |
| Hover open | Yes | Yes | `OnButton` |
| Focus open | Yes | Yes | `OnButton` (Tab to the Button) |
| Escape dismiss | Yes | Yes | `OnButton` |
| Custom `maxWidth` | Yes | No | Not demonstrated; no control |

Interactive controls: `position` (select), `delay` (number).

**Coverage:** 88% (7/8)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Caret clip paths `CARET_OUTER` (16x8px) and `CARET_INNER` (12x6px) polygons on a 2px step grid (structural shape, not themable).
- Caret layer sizes and offsets: `h-[8px] w-[16px]`, `h-[6px] w-[12px]`, `left-[2px] top-[-1px]`, `-translate-x-[5px]` / `translate-x-[5px]`.
- 50ms mount-to-visible delay in the show timer.
- Default `maxWidth` of `"200px"`.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None (the trigger is supplied by the consumer).

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (surface, text, z-index, motion variables)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: balloon is `role="tooltip"` with a `useId` id; the trigger (single element child) gets `aria-describedby` pointing at it while open, merged with any existing value
- Required labels: the trigger needs its own accessible name; the tooltip only describes it
- Focus order: the tooltip is never focusable; it opens on focus of anything inside the wrapper and closes when focus leaves the wrapper (WCAG 2.1.1)
- Dismissal: Escape closes it from anywhere without moving focus; the balloon is hoverable via a transparent bridge (WCAG 1.4.13)
- Touch target minimum: 44x44 applies to the trigger, not the tooltip
- Color independence: text content only

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use it to name icon-only buttons (still set `aria-label` on the button) or add a short clarifying detail.
- Do wrap a single focusable element so keyboard and screen reader users get the hint.
- Do keep content to a phrase or one short sentence.
- Don't put links, buttons, or form controls inside a tooltip.
- Don't put essential instructions or error text in a tooltip; touch users will miss it.
- Don't wrap non-focusable text or several children: the tooltip opens on hover but cannot describe them.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- The balloon renders inside the wrapper (no portal), so an ancestor with `overflow: hidden` or a plate clip path (Card, Modal body) will clip it. Choose a `position` that points into open space.
- In grid or flex layouts the wrapper stays `w-fit`; pass a width class via `className` when the trigger is full width.
- One tooltip per trigger; do not nest tooltips.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Hover-only: no keyboard focus trigger, no Escape, not hoverable (WCAG 2.1.1, 1.4.13) | Opens on focus, closes on blur and Escape, hover bridge keeps it open over the balloon, trigger gets aria-describedby | Resolved |
| 2026-09-22 | Source header claims auto-positioning near viewport edges, but there is no collision handling or portal: the balloon can overflow the viewport or be clipped by ancestors. `tooltipRef` is unused | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | fix | Added keyboard focus, Escape dismiss, hoverable content, aria-describedby on the trigger |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Tooltip.tsx`
