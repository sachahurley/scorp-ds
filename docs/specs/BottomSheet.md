# BottomSheet

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `BottomSheet` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Overlays` |
| File | `packages/components/src/components/BottomSheet.tsx` |
| Story | `Components/Overlays/BottomSheet` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

BottomSheet is a panel that slides up from the bottom edge over a scrim, for menus and quick actions that dismiss easily: a site menu on mobile, a short list of options, a share sheet. Its stepped top corners and square bottom edge read as a plate docked against the viewport, with a grabber at the top seam. It has no title bar or footer, so it suits lists more than forms. Use Modal for blocking confirmations or tasks with explicit actions, and keep persistent navigation in the page rather than a sheet.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Scrim (`--surface-overlay`, full screen) plus the sheet: fixed to the bottom, centered, `min(540px, 100%)` wide. Outer ring layer (`plate-round-lg-top`, `--surface-container-stroke`, 1px top and side padding, none at the bottom) around the inner `--surface-card` fill (`px-5 pb-6 pt-2.5`, max `70vh`), which stacks a 36x4px grabber and a scrollable content region.

### Variants

| Enum Value | Description |
|-----------|-------------|
| N/A | One style. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| N/A | Fixed width `min(540px, 100%)`; height hugs content up to `70vh`. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `isOpen` | `boolean` | | Yes | Controls visibility. Setting it to `false` plays the slide out before unmounting. |
| `onClose` | `() => void` | | Yes | Called on scrim click and Escape. The parent sets `isOpen` to `false`. |
| `ariaLabel` | `string` | | Yes | Accessible name for the dialog (there is no visible title). |
| `children` | `ReactNode` | | Yes | Sheet content, usually a list of buttons or links. Scrolls when taller than the sheet. |

Exported type: `BottomSheetProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round-lg-top` (`plate-round-lg-top`) | Shape | 12px stepped top corners, square bottom | Sheet ring and fill |
| `--surface-container-stroke` | Color | `#BFB4A3` light, `#474030` dark | Ring layer, grabber |
| `--surface-card` | Color | `#FFFFFF` light, `#120D09` dark | Sheet fill |
| `--surface-overlay` | Color | `rgba(10, 7, 4, 0.65)` light, `rgba(0, 0, 0, 0.72)` dark | Scrim |
| `--z-index-overlay` | Layer | 1030 | Scrim |
| `--z-index-modal` | Layer | 1040 | Sheet |
| `--duration-slow` | Motion | 300ms | Slide and scrim fade, in and out |
| `px-5 pb-6 pt-2.5`, `gap-3`, `w-9 h-1` | Spacing | 20px / 24px / 10px, 12px, 36x4px | Fill padding, grabber to content gap, grabber size |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Closed | `isOpen={false}` after exit | Not rendered |
| Opening | `isOpen` to `true` | Sheet `slide-in-from-bottom`, scrim `fade-in`, both over `--duration-slow`; focus moves to the sheet |
| Open | `isOpen` | Body scroll locked |
| Closing | `isOpen` to `false` | `slide-out-to-bottom` / `fade-out` with `fill-mode-forwards`; unmounts on the sheet's `animationend`; focus returns to the invoker |
| Overflowing content | Content taller than `70vh` | Content region scrolls and is keyboard focusable |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Open and slide in | Yes | Yes | `Default` ("Open menu") |
| Close and slide out | Yes | Yes | `Default` (item click) |
| Scrim click dismiss | Yes | Yes | `Default` |
| Escape dismiss | Yes | Yes | `Default` |
| Overflowing, scrolling content | Yes | No | Menu has four items only |

Interactive controls: N/A (render function story).

**Coverage:** 80% (4/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `w-[min(540px,100%)]` sheet width.
- `max-h-[70vh]` fill height cap.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (surface, z-index, motion variables)
- `packages/tokens/tailwind.preset.js` (`plate-round-lg-top` utility, `tailwindcss-animate` plugin for slide and fade)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="dialog"`, `aria-modal="true"`, named by `aria-label={ariaLabel}`; scrim and grabber are `aria-hidden`
- Required labels: `ariaLabel` is required
- Focus order: once mounted, focus moves to the sheet (`tabIndex={-1}`); on close it returns to the invoker. The content region is `tabIndex={0}` for keyboard scrolling. There is no focus trap
- Keyboard: Escape calls `onClose`; there is no visible close button, so pointer users dismiss via the scrim or an action inside the sheet
- Touch target minimum: 44x44 applies to the items you render; the grabber is decorative (not draggable)
- Color independence: no color-coded meaning

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use it for short menus and quick actions, and close the sheet when an item is chosen.
- Do give each item at least a 44px hit area (the story uses `px-3 py-2.5` plate rows).
- Do write an `ariaLabel` that names the sheet ("Site menu", "Share").
- Don't use it for confirmations, destructive actions, or multi-step forms (use Modal).
- Don't imply swipe to dismiss; the grabber is visual only.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Content is centered in a column; wrap lists in a full-width `nav` or `div`.
- Rows inside should use `plate-round` hover plates, matching ListRow and the story's menu.
- Shares `--z-index-modal` with Modal; do not open both at once. Toasts render above it.
- Include an explicit close or cancel item when the sheet has no obvious dismissing action.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Focus stayed behind the sheet on open and was not restored on close | Focus moves onto the sheet once mounted and returns to the invoker on close (same pattern as Modal) | Resolved |
| 2026-09-22 | No focus trap and no visible close control; grabber looks draggable but is not | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | fix | Focus management on open and close |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/BottomSheet.tsx`
