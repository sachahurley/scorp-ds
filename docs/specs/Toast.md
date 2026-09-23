# Toast

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Toast`, `Toaster`, `toast`, `useToast` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/Toast.tsx` |
| Story | `Components/Feedback/Toast` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `fc144a865ea0994f` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Toast is a brief, non-blocking confirmation that rises from the bottom edge and goes away on its own: "Copied to clipboard", "+40 XP", "Item deleted (Undo)". `Toaster` is the fixed bottom-center region that renders a queue of toasts. The recommended way to drive it is imperative: mount one prop-less `<Toaster />` near the app root and call `toast()` (or `toast.success`, `toast.error`, and so on) from anywhere; the queue and expiry timers live in the component module. The original controlled API, where the app owns the queue and passes `toasts` and `onDismiss`, still works unchanged. Keep toasts to one short line of information the user can safely miss, with at most one inline action such as Undo. Use Alert for errors that need to stay on screen, and Modal for anything the user must read before continuing.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`Toaster`: a fixed flex column (bottom 24px, horizontally centered, `gap-2`, `aria-live="polite"`) of `Toast` plates. `Toast`: outer ring plate (`plate-round`, 1px padding, variant ring color) around an inner fill plate (variant fill, max width `min(28rem, 100vw - 2rem)`) holding, in a row with `gap-2`: the variant's 1-bit severity icon (`TuiIcon` size `4`), the message on a single nowrap line with an ellipsis, an optional underlined action button, and, for persistent toasts, an `X` dismiss button. Both inline buttons have a 44px-tall invisible hit area and the inset focus ring.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `default` | Hairline ring, `--surface-muted` fill, `Bell` icon in secondary. `role="status"`. |
| `success` | Green ring and fill, `CheckCircle` icon. `role="status"`. |
| `warning` | Purple (warning scale) ring and fill, `AlertTriangle` icon. `role="status"`. |
| `error` | Red ring and fill, `AlertCircle` icon. `role="alert"` (announced immediately). |
| `info` | Blue ring and fill, `Info` icon. `role="status"`. |

Icons and color pairs match Alert, so the two read as one family.

### Sizes

| Enum Value | Description |
|-----------|-------------|
| N/A | Single size: `px-3 py-2.5`, `text-sm`, width hugs the message up to the max width. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### `toast()` (imperative API)

| Call | Returns | Description |
|------|---------|-------------|
| `toast(message, options?)` | `ToastItem["id"]` | Queues a toast (variant from `options.variant`, default `"default"`). Seen only while a `<Toaster />` without `toasts` is mounted. |
| `toast.success(message, options?)` | id | Queues a `success` toast. Options exclude `variant`. |
| `toast.warning(message, options?)` | id | Queues a `warning` toast. |
| `toast.error(message, options?)` | id | Queues an `error` toast (`role="alert"`). |
| `toast.info(message, options?)` | id | Queues an `info` toast. |
| `toast.dismiss(id?)` | `void` | Removes one toast by id, or every toast when called without an id. |

`toast()` works outside React (event handlers, fetch callbacks, stores): it writes to a module-level queue that `Toaster` and `useToast` subscribe to with `useSyncExternalStore` (empty on the server).

### `ToastOptions`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `variant` | `ToastVariant` | `"default"` | No | Severity. The `toast.success()` style helpers set it for you. |
| `action` | `ToastAction` | none | No | Inline action such as Undo. Pressing it runs `onClick`, then dismisses the toast. |
| `duration` | `number` | `5000` | No | Milliseconds before auto-dismiss, paused while the plate is hovered or holds focus. `Infinity` persists and shows a dismiss button. |
| `id` | `string \| number` | `toast-{n}` | No | Reuse an id to replace a toast in place (for example "Saving..." then "Saved"). |

### `useToast()`

Returns `{ toasts, toast, dismiss }`: the live imperative queue (`ToastItem[]`) plus the same `toast` and `dismiss` functions exported at module level. Use it to render a custom region or show a count.

### `Toaster`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `toasts` | `ToastItem[]` | `undefined` | No | Controlled mode: the queue to render, oldest first (the newest renders closest to the bottom edge). Omit to render the imperative `toast()` queue. |
| `onDismiss` | `(id: ToastItem["id"]) => void` | `undefined` | No | Controlled mode: called when a plate is clicked, its action runs, its dismiss button is pressed, or its `duration` elapses. Ignored in imperative mode, where the queue dismisses itself. |

### `Toast`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | | Yes | Toast content, one short line. |
| `variant` | `ToastVariant` | `"default"` | No | Icon, colors, and `role` (`error` is `alert`). |
| `action` | `ToastAction` | `undefined` | No | Inline action button. Pressing it calls `action.onClick`, then `onDismiss`; the click does not bubble to `onClick`. |
| `duration` | `number` | `undefined` | No | Auto-dismiss after this many ms, paused on hover and focus (remaining time is kept across pauses). `Infinity` persists and shows a dismiss button. Needs `onDismiss`. |
| `onDismiss` | `() => void` | `undefined` | No | Removes the toast; called by the timer, the action, and the dismiss button. |
| `onClick` | `() => void` | `undefined` | No | Pointer shortcut on the plate; adds `cursor-pointer`. `Toaster` wires it to dismiss. |

### `ToastItem`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `id` | `string \| number` | | Yes | Stable React key, passed back to dismissal callbacks. |
| `message` | `ReactNode` | | Yes | Content for the plate. |
| `variant` | `ToastVariant` | `"default"` | No | Severity. |
| `action` | `ToastAction` | `undefined` | No | Inline action. |
| `duration` | `number` | `undefined` | No | Auto-dismiss time. Imperative items always have one (default 5000). Controlled items only auto-dismiss when they set it, so existing callers keep their own timing. |

### `ToastAction`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `label` | `string` | | Yes | Short verb shown as the button text ("Undo", "Retry", "View"). |
| `onClick` | `() => void` | | Yes | Runs when pressed; the toast dismisses itself afterwards. |

Exported types: `ToastItem`, `ToasterProps`, `ToastProps`, `ToastVariant`, `ToastAction`, `ToastOptions`, `ToastApi`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | 6px stepped corner polygon | Ring and fill silhouettes |
| `--border-hairline` | Color | `#F0EBE4` light, `#2B2718` dark | Default ring layer |
| `--surface-muted` | Color | `#F7F5F2` light, `#221E13` dark | Default fill layer |
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | Default message text |
| `secondary-800` / `dark:secondary-300` | Color | sepia scale | Default icon |
| `{success,warning,error,info}-300` / `dark:-700` | Color | semantic scales | Variant ring layer (as Alert) |
| `{success,warning,error,info}-50` / `dark:-950` | Color | semantic scales | Variant fill layer |
| `{success,warning,info}-800`, `error-700` / `dark:-400` | Color | semantic scales | Variant icon |
| `{success,warning,error,info}-900` / `dark:-50` | Color | semantic scales | Variant message and button text |
| `--focus-ring-primary`, `--focus-ring-width` | Color / Size | `#FBBF24`, `2px` | Inset focus ring on the action and dismiss buttons |
| `--touch-target` (`h-touch`) | Size | `44px` | Invisible hit area height of the inline buttons |
| `--duration-normal` | Motion | 200ms | Rise-in transform duration |
| `--z-index-popover` | Layer | 1050 | Toaster region, above modals (1040) |
| `text-sm` | Typography | 14px | Message and buttons |
| `bottom-6`, `gap-2`, `px-3 py-2.5`, `translate-y-16` | Spacing | 24px, 8px, 12px / 10px, 64px | Region offset, stack and row gap, padding, rise distance |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Entering | Mount (one animation frame) | `translate-y-16` to `translate-y-0` over `--duration-normal` with `steps(5)` (hops, no fade) |
| Counting down | `duration` set (imperative default 5000ms) | None; `onDismiss` fires when the remaining time elapses |
| Paused | Pointer over the plate, or focus inside it (action or dismiss button) | Timer stops; remaining time is kept and resumes on leave or blur |
| Persistent | `duration: Infinity` with `onDismiss` | Shows the `X` dismiss button (`aria-label="Dismiss notification"`) |
| With action | `action` | Underlined text button; pressing runs the action, then dismisses |
| Replaced in place | `toast(..., { id })` with an existing id | Old item removed, new one appended with the same key |
| Variant | `variant` | Ring, fill, icon, text colors; `role="alert"` for `error`, `role="status"` otherwise |
| Clickable | `onClick` / `onDismiss` set | `cursor-pointer` |
| Removed | Timer, action, dismiss button, click, `toast.dismiss`, or the app drops the item from `toasts` | Unmounts immediately (no exit animation) |
| Overflowing text | Long message | Truncated with an ellipsis on one line |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Enter animation | Yes | Yes | `Default`, `Imperative` |
| Stacked queue | Yes | Yes | `Default`, `Imperative` (press repeatedly) |
| Click to dismiss | Yes | Yes | `Default` wires `onDismiss`; imperative plates dismiss on click |
| Controlled API | Yes | Yes | `Default` (story owns the queue, expires after 3200ms) |
| Imperative `toast()` and helpers | Yes | Yes | `Imperative` (every helper, Undo, persistent) |
| All variants | Yes | Yes | `Variants` (static, no timers) |
| Action button | Yes | Yes | `With action`, `Imperative` ("With Undo") |
| Persistent dismiss button | Yes | Yes | `With action`, `Imperative` ("Persistent") |
| Auto-dismiss with hover / focus pause | Yes | Yes | `Imperative` (interactive) |
| `useToast()` custom rendering | Yes | No | Covered by tests only |
| Replace in place (`id`) | Yes | No | Covered by tests only |
| Long message truncation | Yes | No | Not demonstrated |

Interactive controls: N/A (render function stories).

**Coverage:** 75% (9/12)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `[transition-timing-function:steps(5)]`: stepped motion curve, no easing token.
- `max-w-[min(28rem,calc(100vw-2rem))]`: plate max width, no size token.
- `DEFAULT_DURATION = 5000`: default auto-dismiss time, a behavior constant with no timing token.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`Bell`, `CheckCircle`, `AlertTriangle`, `AlertCircle`, `Info`, `X`)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (border, surface, text, semantic scales, focus, touch, motion, z-index variables)
- `packages/tokens/tailwind.preset.js` (`plate-round`, `h-touch` utilities)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `Toaster` is `aria-live="polite"`. Error toasts are `role="alert"` (assertive, announced immediately); every other variant is `role="status"` (polite). The live region nests status regions, which some screen readers may announce twice
- Required labels: none for the plate; the message text is the announcement. The action button is named by its `label`; the persistent dismiss button has `aria-label="Dismiss notification"`
- Focus order: toasts never take focus on their own. The action and dismiss buttons are native `<button type="button">` elements in tab order with the inset focus ring; focus inside a toast pauses its timer so keyboard users are not cut off
- Timing: auto-dismiss pauses on hover and focus; `duration: Infinity` persists with a keyboard-operable dismiss button
- Touch target minimum: the action and dismiss buttons have a 44px-tall pseudo-element hit area. Click to dismiss on the plate is still a plain `div` handler (pointer only, no keyboard activation); do not rely on it
- Color independence: each variant pairs its color with a distinct 1-bit icon, and the message text carries the meaning

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep the message to one short line; longer text is truncated.
- Do mount a single prop-less `<Toaster />` near the app root and call `toast()` / `toast.success()` from handlers.
- Do use an `action` for reversible operations ("Item deleted" with Undo) and pass a longer `duration` so there is time to press it.
- Do reuse an `id` to update a toast in place ("Saving..." then "Saved") instead of stacking two.
- Do, in controlled mode, set `duration` on items or expire them in your queue logic (the story uses 3200ms), and treat click dismissal as a bonus.
- Don't put links or more than one action in a toast; users may never see it before it expires.
- Don't use a toast for anything the user must acknowledge (use Modal) or keep seeing (use Alert). An error toast is for transient failures with an easy retry.
- Don't use `duration: Infinity` for routine confirmations; persistent toasts pile up.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- `Toaster` is fixed bottom-center at `--z-index-popover` (1050), so toasts appear above an open Modal or BottomSheet by decision.
- Only one `Toaster` per page; multiple regions would overlap at the same position.
- `toast()` calls made while no prop-less `Toaster` is mounted stay queued and appear once one mounts.
- Render `Toast` directly only for custom placements, and provide your own live region if you do. `useToast()` gives a custom region the live queue.
- Variants share icons and color pairs with Alert; escalate to Alert when the message must stay on screen.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Click to dismiss is not keyboard operable; nested live regions (`aria-live` plus `role="status"`) may double announce; no exit animation; truncated text has no way to be read in full | Keyboard part addressed by #43: persistent toasts get a real dismiss button, actions are real buttons, and timers pause on focus and hover. Nested live regions, exit animation, and truncation remain | Open |
| 2026-09-22 | No severity variants, no action, and the app had to own the queue and timers | #43: `variant`, `action`, `duration` with hover/focus pause, imperative `toast()` / `useToast()` with a prop-less `<Toaster />` | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-21 | feat | Variants (default/success/warning/error/info, Alert icons and colors), `action`, `duration` with hover/focus pause, error `role="alert"`, imperative `toast()` / `useToast()` with `<Toaster />`; controlled API unchanged |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Toast.tsx`
