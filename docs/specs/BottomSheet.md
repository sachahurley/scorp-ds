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
| API hash | `4e0539bd08b05e7f` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

BottomSheet is a panel that slides up from the bottom edge over a scrim, for menus and quick actions that dismiss easily: a site menu on mobile, a short list of options, a share sheet. Its stepped top corners and square bottom edge read as a plate docked against the viewport, with a grabber at the top seam. It has no title bar or footer, so it suits lists more than forms. Use Modal for blocking confirmations or tasks with explicit actions, and keep persistent navigation in the page rather than a sheet.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Scrim (`--surface-overlay`, full screen) plus the sheet: fixed to the bottom, centered, `min(540px, 100%)` wide. Outer ring layer (`plate-round-lg-top`, `--surface-container-stroke`, 1px top and side padding, none at the bottom) around the inner `--surface-card` fill (`px-5 pb-6 pt-1`, max `70vh`), which stacks a 44px header band and a scrollable content region. The header band centers the 36x4px grabber and pins a 44x44 close button (1-bit `X`) to its right edge; the band reserves the button's full touch target so it never overlaps the content.

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
| `onClose` | `() => void` | | Yes | Called by the close button, a scrim click and Escape. The parent sets `isOpen` to `false`. |
| `ariaLabel` | `string` | | Yes | Accessible name for the dialog (there is no visible title). |
| `closeLabel` | `string` | `"Close"` | No | Accessible name for the close button. Override it when several sheets are announced in the same view. |
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
| `--duration-fast` | Motion | 150ms | Close button hover color |
| `--focus-ring-primary` / `--focus-ring-width` | Color / Size | `#FBBF24`, 2px | Close button inset focus ring |
| `--text-secondary` / `--text-primary` | Color | per theme | Close icon, close icon on hover |
| `--touch-target` (`h-touch w-touch`) | Spacing | 44px | Close button box and header band height |
| `px-5 pb-6 pt-1`, `gap-3`, `w-9 h-1` | Spacing | 20px / 24px / 4px, 12px, 36x4px | Fill padding, band to content gap, grabber size |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Closed | `isOpen={false}` after exit | Not rendered |
| Opening | `isOpen` to `true` | Sheet `slide-in-from-bottom`, scrim `fade-in`, both over `--duration-slow`; focus moves to the sheet |
| Open | `isOpen` | Body scroll locked; Tab and Shift+Tab trapped inside the sheet |
| Close button hover | Pointer | Icon from `--text-secondary` to `--text-primary` over `--duration-fast` |
| Close button focus | `:focus-visible` | Inset `--focus-ring-width` ring in `--focus-ring-primary` |
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
| Close button dismiss | Yes | Yes | `Default` |
| Escape dismiss | Yes | Yes | `Default` |
| Overflowing, scrolling content | Yes | No | Menu has four items only |

Interactive controls: N/A (render function story).

**Coverage:** 83% (5/6)

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

- `TuiIcon` (`X` at size `4`) for the close button

### Foundation Files Referenced

- `packages/components/src/lib/use-focus-trap.ts` (`useFocusTrap`)
- `packages/tokens/src/styles/tokens.css` (surface, text, focus, z-index, motion variables)
- `packages/tokens/tailwind.preset.js` (`plate-round-lg-top` utility, `tailwindcss-animate` plugin for slide and fade)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="dialog"`, `aria-modal="true"`, named by `aria-label={ariaLabel}`; scrim and grabber are `aria-hidden`
- Required labels: `ariaLabel` is required
- Focus order: once mounted, focus moves to the sheet (`tabIndex={-1}`); on close it returns to the invoker. The close button is the first Tab stop, then the content region (`tabIndex={0}`, for keyboard scrolling), then whatever you render
- Focus trap: Tab and Shift+Tab cycle within the sheet (`useFocusTrap`), matching the `aria-modal="true"` promise that nothing behind the scrim is reachable
- Keyboard: Escape calls `onClose`; the close button is reachable by Tab and activated by Enter or Space
- Touch target minimum: met for the close button (44x44 via `h-touch w-touch` on the button box, inside a 44px header band so it never overlaps content). 44x44 still applies to the items you render
- The grabber is a static seam marker, NOT a drag handle: no drag or swipe gesture exists, so it is `aria-hidden` and every dismissal path is the close button, the scrim, or Escape
- Color independence: no color-coded meaning

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do use it for short menus and quick actions, and close the sheet when an item is chosen.
- Do give each item at least a 44px hit area (the story uses `px-3 py-2.5` plate rows).
- Do write an `ariaLabel` that names the sheet ("Site menu", "Share").
- Don't use it for confirmations, destructive actions, or multi-step forms (use Modal).
- Don't imply swipe to dismiss; the grabber is a visual seam marker and there is no drag gesture.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Content is centered in a column; wrap lists in a full-width `nav` or `div`.
- Rows inside should use `plate-round` hover plates, matching ListRow and the story's menu.
- Shares `--z-index-modal` with Modal; do not open both at once. Toasts render above it.
- The sheet ships its own close button; do not add a second one in the content.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Focus stayed behind the sheet on open and was not restored on close | Focus moves onto the sheet once mounted and returns to the invoker on close (same pattern as Modal) | Resolved |
| 2026-09-22 | No focus trap and no visible close control; grabber looks draggable but is not | Focus trap added (`useFocusTrap`); a labelled 44x44 `X` close button now sits in a 44px header band; the grabber is documented as a static seam marker with no drag gesture (Anatomy, Accessibility, Do / Don't) | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | fix | Focus management on open and close |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | feat | Visible close button (44px target, `closeLabel` prop) in a new header band |
| Unreleased | 2026-09-22 | fix | Tab and Shift+Tab are trapped inside the sheet |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/BottomSheet.tsx`
