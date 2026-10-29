# Tooltip

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Tooltip` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Overlays` |
| File | `packages/components/src/components/Tooltip.tsx` |
| Story | `Components/Overlays/Tooltip` |
| Version | `v1` |
| Status | `stable` |
| Last updated | 2026-10-29 |
| API hash | `6e02c20625d0c90e` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Tooltip shows a short supplementary hint next to a trigger when it is hovered or focused, most often to name an icon-only button or add a detail to a label. It is supplementary only: the interface must make sense without it, because touch users rarely see it and its content is plain text. Never put the only copy of essential information, or anything interactive, in a tooltip. Use helper text on the field, an inline note, or an Alert when the information matters.

Don't use this for: content with a link, a button or more than a sentence (use Popover instead) or a hint that must always be visible (use helper text on the field instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Wrapper (`relative inline-block w-fit`) holding the trigger and, while open, an absolutely positioned balloon: transparent hover bridge, ring plate (`plate-round`, `--surface-container-stroke`, 1px padding) around a `--surface-card` fill, and a 1-bit stepped caret (two stacked clip-path polygons) pointing at the trigger. The balloon carries `data-placement` with the side it actually rendered on (after any flip).

Viewport fit: after the balloon mounts (still at `opacity-0`), a layout effect measures the trigger and balloon rects. If the preferred side lacks room (balloon size plus the 8px gap plus an 8px edge margin), it flips to the opposite side when that side has room; if neither fits it keeps the preferred side. Top and bottom balloons are also clamped horizontally with a `margin-left` nudge so they stay 8px inside the viewport, and the caret gets the opposite nudge (limited to the balloon body, inside the stepped corners) so it keeps pointing at the trigger. Left and right balloons are not clamped vertically. It re-measures when `side`, `align`, `content`, or `maxWidth` changes while open. With `align="start"` or `"end"` the balloon lines up with the trigger edge instead of centering, and the caret gets the nudge that keeps it on the trigger center.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `top` | Above the trigger, centered, 8px gap (default). Flips to `bottom` when it would overflow the top edge |
| `bottom` | Below the trigger, caret rotated 180deg. Flips to `top` near the bottom edge |
| `left` | Left of the trigger, vertically centered, caret rotated -90deg. Flips to `right` near the left edge |
| `right` | Right of the trigger, vertically centered, caret rotated 90deg. Flips to `left` near the right edge |

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
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | No | Preferred side of the trigger. Flips to the opposite side when this one would overflow the viewport and the opposite side has room; top/bottom also clamp horizontally. The rendered side is exposed as `data-placement` on the balloon. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | No | Cross-axis alignment along the trigger edge. `start` / `end` line the balloon's leading / trailing edge up with the trigger's; the caret still points at the trigger's center. Exposed as `data-align`. |
| `delay` | `number` | `200` | No | Delay in milliseconds before showing on hover or focus. Hiding is immediate. |
| `maxWidth` | `string` | `"200px"` | No | Balloon max width, any CSS length (inline style). Stays a free CSS length: no token describes a reading width (the spacing scale stops at 96px and the breakpoints are page widths). |
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
| Mounting | After `delay` | Mounted at `opacity-0` for 50ms; a layout effect measures and picks the side and horizontal nudge before paint |
| Visible | 50ms later | `opacity-100` over `--duration-fast`; trigger gains `aria-describedby` |
| Hovering the balloon | Pointer crosses the 8px bridge | Stays open |
| Dismissed | Mouse leave, focus leaving the wrapper, or Escape | Unmounted immediately |
| Side | `side`, resolved by the viewport fit | Placement classes, caret rotation, and `data-placement` follow the resolved side |
| Aligned | `align="start"` or `"end"` | Balloon edge lines up with the trigger edge (`left-0` / `right-0`, or `top-0` / `bottom-0` for left/right); caret nudged by `margin-left` (or `margin-top`) to the trigger center, kept inside the stepped corners |
| Flipped | Preferred side overflows, opposite side fits | Renders on the opposite side; `data-placement` shows it |
| Clamped | Top/bottom balloon would cross a horizontal viewport edge | Balloon `margin-left` nudge; caret counter-nudge keeps it on the trigger |

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
| Viewport flip and clamp | Yes | Yes | `Viewport flip` (a trigger against each edge, fullscreen) |
| `align` start / end | Yes | Yes | `OnButton` `align` control only; no captured frame |
| Custom `maxWidth` | Yes | No | Not demonstrated; no control |

Interactive controls: `side` (select), `align` (select), `delay` (number).

Story ids keep the export names `Positions` and `PositionLeft` (shown as "Sides" and "Side: left"), so the visual baselines did not change when `position` became `side`.

**Coverage:** 90% (9/10)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Caret clip paths `CARET_OUTER` (16x8px) and `CARET_INNER` (12x6px) polygons on a 2px step grid (structural shape, not themable).
- Caret layer sizes and offsets: `h-[8px] w-[16px]`, `h-[6px] w-[12px]`, `left-[2px] top-[-1px]`, `-translate-x-[5px]` / `translate-x-[5px]`.
- 50ms mount-to-visible delay in the show timer.
- Viewport fit constants: `GAP = 8` (trigger gap, mirrors the `*-2` offsets), `EDGE = 8` (viewport margin), and the 12px caret inset limit.
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
- Positioning: flipping and clamping keep the hint on screen, so it is not cut off at the viewport edge (WCAG 1.4.10 reflow friendly); the resolved side does not change the accessible tree
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

- The balloon renders inside the wrapper (no portal), so an ancestor with `overflow: hidden` or a plate clip path (Card, Modal body) will still clip it: the viewport flip only knows about the viewport. Choose a `side` that points into open space.
- In grid or flex layouts the wrapper stays `w-fit`; pass a width class via `className` when the trigger is full width.
- One tooltip per trigger; do not nest tooltips.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Hover-only: no keyboard focus trigger, no Escape, not hoverable (WCAG 2.1.1, 1.4.13) | Opens on focus, closes on blur and Escape, hover bridge keeps it open over the balloon, trigger gets aria-describedby | Resolved |
| 2026-09-22 | Source header claims auto-positioning near viewport edges, but there is no collision handling or portal: the balloon can overflow the viewport or be clipped by ancestors. `tooltipRef` is unused | #43: viewport flip to the opposite side plus horizontal clamp for top/bottom, measured through `tooltipRef`, `data-placement` exposes the result | Resolved |
| 2026-09-22 | Still no portal: an ancestor with `overflow: hidden` or a clip path clips the balloon; left/right balloons are not clamped vertically | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-29 | docs | Promoted to `stable`: meets the decision 0026 bar and was reviewed by Sacha |
| Unreleased | 2026-09-21 | feat | Viewport flip: measured after open, flips to the opposite side when the preferred one overflows; top/bottom clamp horizontally with the caret kept on the trigger |
| Unreleased | 2026-09-21 | fix | Added keyboard focus, Escape dismiss, hoverable content, aria-describedby on the trigger |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-10-28 | change | Decision 0024 vocabulary: `side` replaces `position` (deprecated alias, still works, warns once) and a new `align` (`start \| center \| end`, default `center`) lines the balloon up with a trigger edge. Story moved from `Components/Display` to `Components/Overlays`; baselines renamed, not recaptured. Default render unchanged |
| Unreleased | 2026-10-29 | change | Decision 0031 removed the deprecated `position` prop and its dev warning; use `side`. Rendering unchanged |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Tooltip.tsx`
