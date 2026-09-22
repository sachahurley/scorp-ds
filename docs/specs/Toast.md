# Toast

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Toast`, `Toaster` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/Toast.tsx` |
| Story | `Components/Feedback/Toast` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Toast is a brief, non-blocking confirmation that rises from the bottom edge and goes away on its own: "Copied to clipboard", "+40 XP". `Toaster` is the fixed bottom-center region that renders a queue of toasts; the app owns the queue and the expiry timers, so the component stays stateless. Keep toasts to one short line of information the user can safely miss. Use Alert for errors or anything that needs action, and Modal for anything the user must read before continuing.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`Toaster`: a fixed flex column (bottom 24px, horizontally centered, `gap-2`) of `Toast` plates. `Toast`: outer ring plate (`plate-round`, `--border-hairline`, 1px padding) around an inner `--surface-muted` fill plate with a single nowrap line of text.

### Variants

| Enum Value | Description |
|-----------|-------------|
| N/A | One visual style. No severity variants. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| N/A | Single size: `px-3 py-2.5`, `text-sm`, width hugs the message. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### `Toaster`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `toasts` | `ToastItem[]` | | Yes | Queue to render, oldest first. The newest renders last, closest to the bottom edge. |
| `onDismiss` | `(id: ToastItem["id"]) => void` | `undefined` | No | Called when a plate is clicked. Wire it to remove the item from your queue. |

### `Toast`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | | Yes | Toast content, one short line. |
| `onClick` | `() => void` | `undefined` | No | Click handler; adds `cursor-pointer`. `Toaster` passes its dismiss callback here. |

### `ToastItem`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `id` | `string \| number` | | Yes | Stable React key, passed back to `onDismiss`. |
| `message` | `ReactNode` | | Yes | Content for the plate. |

Exported types: `ToastItem`, `ToasterProps`. `Toast` props are an inline type (not exported).

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | 6px stepped corner polygon | Ring and fill silhouettes |
| `--border-hairline` | Color | `#F0EBE4` light, `#2B2718` dark | Ring layer |
| `--surface-muted` | Color | `#F7F5F2` light, `#221E13` dark | Fill layer |
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | Message text |
| `--duration-normal` | Motion | 200ms | Rise-in transform duration |
| `--z-index-popover` | Layer | 1050 | Toaster region, above modals (1040) |
| `text-sm` | Typography | 14px | Message |
| `bottom-6`, `gap-2`, `px-3 py-2.5`, `translate-y-16` | Spacing | 24px, 8px, 12px / 10px, 64px | Region offset, stack gap, padding, rise distance |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Entering | Mount (one animation frame) | `translate-y-16` to `translate-y-0` over `--duration-normal` with `steps(5)` (hops, no fade) |
| Resting | After enter | None |
| Clickable | `onClick` / `onDismiss` set | `cursor-pointer` |
| Removed | App drops the item from `toasts` | Unmounts immediately (no exit animation) |
| Overflowing text | Long message | Truncated with an ellipsis on one line |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Enter animation | Yes | Yes | `Default` (buttons push toasts) |
| Stacked queue | Yes | Yes | `Default` (press repeatedly) |
| Click to dismiss | Yes | Yes | `Default` wires `onDismiss` |
| Auto expiry (app owned) | N/A | Yes | Story expires toasts after 3200ms |
| Standalone `Toast` | Yes | No | Only rendered through `Toaster` |
| Long message truncation | Yes | No | Not demonstrated |

Interactive controls: N/A (render function story).

**Coverage:** 60% (3/5, excluding the app-owned expiry row)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `[transition-timing-function:steps(5)]`: stepped motion curve, no easing token.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (border, surface, text, motion, z-index variables)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `Toaster` is `aria-live="polite"`; each `Toast` is `role="status"` (also polite). The live region nests status regions, which some screen readers may announce twice
- Required labels: none; the message text is the announcement
- Focus order: toasts never take focus and are not focusable
- Touch target minimum: click-to-dismiss is a plain `div` click handler, not a button, so it is pointer only (no keyboard activation) and not a reliable touch target; expiry must not depend on it
- Color independence: text only, no color-coded meaning

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep the message to one short line; longer text is truncated.
- Do expire toasts automatically in your queue logic (the story uses 3200ms) and treat click dismissal as a bonus.
- Do mount a single `Toaster` near the app root and push items into its queue.
- Don't put errors, links, or buttons in a toast; users may never see it and keyboard users cannot reach it.
- Don't use a toast for anything the user must acknowledge (use Modal) or keep seeing (use Alert).

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- `Toaster` is fixed bottom-center at `--z-index-popover` (1050), so toasts appear above an open Modal or BottomSheet by decision.
- Only one `Toaster` per page; multiple regions would overlap at the same position.
- Render `Toast` directly only for custom placements, and provide your own live region if you do.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Click to dismiss is not keyboard operable; nested live regions (`aria-live` plus `role="status"`) may double announce; no exit animation; truncated text has no way to be read in full | None yet | Open |

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

`packages/components/src/components/Toast.tsx`
