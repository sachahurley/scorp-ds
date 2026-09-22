# Modal

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Modal` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Overlays` |
| File | `packages/components/src/components/Modal.tsx` |
| Story | `Components/Overlays/Modal` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Modal is a centered dialog over a scrim that interrupts the page for a task or decision the user must finish or dismiss before going back: confirmations, short forms, reward claims. It has a fixed title bar with a close control, a scrollable body, and an optional footer band for CTAs. The `docked` option turns it into a non-modal panel pinned bottom-center on wide viewports, for acting on content that must stay visible (compare, equip). Use BottomSheet for light menus and quick actions, Alert for inline messages, and Toast for passive confirmations.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Scrim (`--surface-overlay`, full screen, centers the panel with 20px padding) around the panel: outer ring plate (`plate-round-lg`, `--surface-container-stroke`, 1px padding) and inner `--surface-card` fill in a column of header (title `h2` plus close Button in a hit-area wrapper span), scrollable body, optional footer. Header and footer are separated from the body by 0.5px `--surface-container-stroke` hairlines. The panel is capped at `80vh` and `max-w-full`.

### Variants

| Enum Value | Description |
|-----------|-------------|
| Centered (default) | Scrim, `aria-modal="true"`, body scroll locked, backdrop click closes. |
| `docked` | On viewports at least `--breakpoint-docked` (960px) wide: no scrim, pinned 48px above the bottom, drop shadow, non-modal (no `aria-modal`, no scroll lock, page stays interactive). Below 960px, or without `matchMedia`, it renders as the centered variant. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `width` (number) | Pixels; default `740`. Small celebratory dialogs use about `320`. |
| `width` (string) | Any CSS length, passed through (e.g. `"min(320px, 90vw)"`). |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `isOpen` | `boolean` | | Yes | Controls visibility. Setting it to `false` plays the fade out before unmounting. |
| `onClose` | `() => void` | | Yes | Called on Escape, the close button, and (centered only) a scrim click. The parent sets `isOpen` to `false`. |
| `title` | `string` | | Yes | Header text (truncated on one line) and the dialog's `aria-label`. |
| `children` | `ReactNode` | | Yes | Body content; scrolls when it exceeds the panel height. The body already has `px-6 py-5` padding. |
| `footerContent` | `ReactNode` | `undefined` | No | Fixed footer band, actions right-aligned with `gap-3`. Render DS Buttons (secondary cancel, primary confirm). |
| `width` | `number \| string` | `740` | No | Panel width; numbers are px, strings pass through. Always capped at the viewport by `max-w-full`. |
| `docked` | `boolean` | `false` | No | Non-modal bottom-center panel on viewports of 960px and up; falls back to the centered modal below. |

Exported type: `ModalProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round-lg` (`plate-round-lg`) | Shape | 12px stepped corner polygon | Panel ring and fill |
| `--surface-container-stroke` | Color | `#BFB4A3` light, `#474030` dark | Panel ring, header and footer hairlines |
| `--surface-card` | Color | `#FFFFFF` light, `#120D09` dark | Panel fill |
| `--surface-overlay` | Color | `rgba(10, 7, 4, 0.65)` light, `rgba(0, 0, 0, 0.72)` dark | Scrim (centered only) |
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | Title |
| `--z-index-modal` | Layer | 1040 | Scrim or docked wrapper |
| `--breakpoint-docked` | Layout | 960px | Width at which `docked` takes effect; read off the document element at mount |
| `--duration-normal` | Motion | 200ms | Fade in and fade out |
| `text-base` | Typography | 16px | Title |
| `px-6 py-5`, `gap-3`, `p-5`, `ml-4` | Spacing | 24px / 20px, 12px, 20px, 16px | Header, body, footer padding; footer gap; scrim padding; title to close gap |
| `--touch-target` (`before:w-touch before:h-touch`) | Spacing | 44px | Close-button hit area on the wrapper span |
| Button `secondary` `sm` (icon only) | Component | `size-control-sm` 32px square | Close control |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Closed | `isOpen={false}` after exit | Not rendered |
| Opening | `isOpen` to `true` | `animate-in fade-in` over `--duration-normal`; focus moves to the panel |
| Open | `isOpen` | Body scroll locked (centered only); Tab and Shift+Tab trapped inside the panel (centered only) |
| Closing | `isOpen` to `false` | `animate-out fade-out fill-mode-forwards`; unmounts on `animationend`; focus returns to the invoker |
| Docked | `docked` and viewport at least 960px | No scrim, `bottom: 48px`, drop shadow, no `aria-modal`, no scroll lock, no click-away, no focus trap |
| Docked fallback | `docked` below 960px | Same as centered; updates live on viewport change |
| With footer | `footerContent` | Footer band with top hairline |
| Long content | Body taller than the panel | Body scrolls (`overflow-y-auto`) and is keyboard focusable |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Centered | Yes | Yes | `Default` |
| Enter and exit fade | Yes | Yes | Every story |
| Long content scroll | Yes | Yes | `LongContent` (opens by default) |
| Footer CTAs | Yes | Yes | `WithFooter`, `Docked` |
| Custom `width` | Yes | Yes | `Docked` (`640`) |
| Docked | Yes | Yes | `Docked` |
| Docked fallback below 960px | Yes | Yes | `Docked`, by resizing the viewport |

Interactive controls: N/A (render function stories).

**Coverage:** 100% (7/7)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Default `width` of `740` px.
- `max-h-[80vh]` panel height cap.
- `border-b-[0.5px]` / `border-t-[0.5px]` hairlines.
- Docked: `bottom: "48px"` and `filter: drop-shadow(0 10px 40px rgba(0, 0, 0, 0.35))` (drop shadow follows the clipped silhouette; values track `elevation.high`'s dark blur).
- Docked breakpoint fallback `960` (`DOCKED_BREAKPOINT_FALLBACK_PX`), used only when there is no document or `--breakpoint-docked` is unreadable (SSR, jsdom). In the browser the query is built from the token.
- `aria-label="Close modal"`: fixed English label.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Button` (`variant="secondary"`, `size="sm"`, icon only) for the close control
- `TuiIcon` (`X`, default size `4`)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (surface, text, z-index, motion variables)
- `packages/tokens/tailwind.preset.js` (`plate-round-lg` utility, `tailwindcss-animate` plugin for `animate-in` / `fade-in`)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: panel is `role="dialog"` with `aria-modal="true"` (omitted when docked), named by `aria-label={title}`
- Required labels: `title` is required and becomes the accessible name; the close button is labelled `Close modal`
- Focus order: on open, focus moves to the panel (`tabIndex={-1}`) so the dialog name is announced; on close, focus returns to the element that had it. The body region is `tabIndex={0}` for keyboard scrolling
- Focus trap: while modal, Tab and Shift+Tab cycle within the panel (`useFocusTrap`, a capture-phase Tab handler). Shift+Tab from the panel itself, or from the first control, wraps to the last; Tab from the last control wraps to the first. The `docked` variant is non-modal by design and never traps, so Tab reaches the live page behind it
- Keyboard: Escape calls `onClose` (listener on `document` while open, docked included)
- Touch target minimum: met. The close button is a 32px plate (`size-control-sm`), and because a `clip-path` slices an element's own pseudo-elements the 44x44 hit area hangs off an unclipped wrapper span (the Checkbox pattern). The wrapper forwards only clicks whose target is the wrapper itself, so `onClose` fires once per click
- Color independence: no color-coded meaning; the close control is an icon with an accessible name

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do write a short, specific `title`; it is the dialog's accessible name.
- Do put the primary action last (rightmost) in `footerContent`, with a secondary cancel before it.
- Do use `docked` only when the page behind must stay visible and interactive.
- Don't add extra padding around `children`; the body already pads `px-6 py-5`.
- Don't open a Modal from another Modal; replace the content or close first.
- Don't use a Modal for non-blocking feedback (use Toast or Alert) or for quick menus (use BottomSheet).

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Footer holds DS Buttons, typically `size="sm"`; it right-aligns them.
- Form content goes in the body; field errors use each input's `errorMessage`, form-level errors an Alert at the top of the body.
- Toasts (`--z-index-popover`, 1050) and tooltips (1060) render above the Modal (1040); a BottomSheet shares the 1040 layer.
- Menus and tooltips inside the body are clipped by the plate; render them toward open space.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Focus never moved into the dialog on open (focus effect ran before the panel mounted); crashed without window.matchMedia | Focus effect keyed on the panel being mounted; matchMedia guarded (falls back to centered modal) | Resolved |
| 2026-09-22 | No focus trap in the centered modal (Tab reaches the page behind); close button is 32px, below the 44px target | Focus trap added (`useFocusTrap`, modal only, never docked); close button wrapped in an unclipped span carrying a 44x44 pseudo-element hit area | Resolved |
| 2026-09-22 | Source header still says the content area is capped at 66vh; the only cap is `max-h-[80vh]` on the panel | Header comment now states the 80vh panel cap | Resolved |
| 2026-09-22 | `Default`, `Long content` and `Docked` stories added their own padding inside a body that already pads `px-6 py-5` | Padding removed from the story bodies | Resolved |
| 2026-09-22 | The docked breakpoint was the literal `960` typed into `window.matchMedia("(min-width: 960px)")`, so the switch point was not a token | Reads `--breakpoint-docked` from the document element (`global.breakpoint.docked`), with a documented 960 fallback for SSR and jsdom; the `typeof window.matchMedia !== "function"` guards are unchanged | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | fix | Focus moves into the dialog on open; no crash without matchMedia |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | Focus trap while modal (docked stays non-modal); 44px close-button hit area; 66vh comment corrected; story double padding removed |
| Unreleased | 2026-09-22 | change | Docked breakpoint comes from the `--breakpoint-docked` token instead of a hardcoded 960 (same 960px switch point) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Modal.tsx`
