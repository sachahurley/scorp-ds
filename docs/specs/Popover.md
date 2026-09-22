# Popover

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Popover` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Overlays` |
| File | `packages/components/src/components/Popover.tsx` |
| Story | `Components/Overlays/Popover` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `3250ac09b7d9401f` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Anchored, non-modal floating panel for rich interactive content next to a trigger (filters, a small form, a details card). Behaves like a disclosure: the page stays interactive, focus is never trapped, Tab flows from the trigger into the panel.

Positioning is written in-house (no floating-ui): `computePosition` in `lib/position.ts` places the panel on `side` + `align`, flips to the opposite side when it would overflow, and shifts along the anchor to stay on screen. `useAnchoredPosition` (lib/use-anchored-position.ts) re-measures on scroll, resize and ResizeObserver. Both are internal and reused by Combobox.

Don't use this for: short hints (Tooltip), action lists (Dropdown), blocking tasks (Modal).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|-----------|-------------|
| `side` | top, bottom (default), left, right; flips when out of room |
| `align` | start (default), center, end |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `(none)` | No `size` prop. The panel hugs its content, optionally matching the anchor width via `matchAnchorWidth`, and is capped by the measured space the popover has (`--popover-available-height`). |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `open` | `boolean` | `undefined` | No | Controlled open state |
| `defaultOpen` | `boolean` | `false` | No | Uncontrolled initial state |
| `onOpenChange` | `(open) => void` |  | No | Fires on trigger, Escape, outside press, blur |
| `trigger` | `ReactElement` |  | No | Toggle element; receives aria-expanded / aria-controls / aria-haspopup |
| `anchorRef` | `RefObject<HTMLElement>` |  | No | Position against your own element instead of trigger |
| `side` | `PopoverSide` | `"bottom"` | No | Preferred side |
| `align` | `PopoverAlign` | `"start"` | No | Cross-axis alignment |
| `offset` | `number` | `8` | No | Gap in px |
| `closeOnOutsideClick` | `boolean` | `true` | No | Close on outside press |
| `closeOnEscape` | `boolean` | `true` | No | Close on Escape |
| `autoFocus` | `boolean` | `true` | No | Focus first focusable (or the panel) on open |
| `returnFocus` | `boolean` | `true` | No | Return focus to trigger on Escape / trigger close |
| `matchAnchorWidth` | `boolean` | `false` | No | Min width equals anchor width |
| `role` | `AriaRole | null` | `"dialog"` | No | Panel role; null when content has its own |
| `aria-label / aria-labelledby` | `string` |  | For dialog | Panel name |
| `portal` | `boolean` | `false` | No | Render into document.body (needed inside plate-clipped containers) |
| `className / contentClassName` | `string` |  | No | Ring / fill classes; fill defaults to p-4 |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-container-stroke` | Color | semantic | Ring layer |
| `--surface-card` | Color | semantic | Fill |
| `--text-primary` | Color | semantic | Text |
| `--plate-round` | Shape | clip-path | Silhouette |
| `--z-index-popover` | Z-index | 1050 | Stacking |
| `--duration-fast` | Motion | 120ms | Fade in |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| closed / open | `open` | panel mounted |
| flipped | `data-side` | position only |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Open | Yes | Yes |  |
| Sides | Yes | Yes |  |
| Controlled | Yes | Yes |  |

Interactive controls: Yes (autodocs argTypes)

**Coverage:** 100% (4/4)

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

lib/position.ts, lib/use-anchored-position.ts, lib/use-controllable-state.ts

### Foundation Files Referenced

`packages/tokens/src/tokens.json` (via the Tailwind preset and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: role="dialog" (non-modal) by default
- Required labels: aria-label or aria-labelledby on the panel
- Focus order: Trigger, then panel content in DOM order; Escape returns focus to trigger
- Touch target minimum: Trigger owns the target size (Button meets 44px via its hit area)
- Color independence: N/A

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

[TODO: add usage guidelines]

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
| 2026-09-21 | Inline rendering is clipped by plate-clipped ancestors (clip-path clips fixed descendants) | `portal` prop; recommended inside Card / Modal | open |
| 2026-09-21 | No arrow/caret | Deferred; the Tooltip caret could be generalized | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial Popover component, story, and unit tests |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Popover.tsx`
