# Spinner

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Spinner` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/Spinner.tsx` |
| Story | `Components/Feedback/Spinner` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

TUI loading indicator in the 1-bit icon language: eight square dots on an
8x8 pixel grid with a two-dot gap that steps clockwise around the ring
(100ms per frame). Frames step, never ease, so motion hops on the pixel
grid like the plates. Paints with `currentColor`, so it takes on the text
color of whatever surface holds it.

Use for waits of unknown length. For a submitting button, use
`<Button loading>` instead of placing a Spinner by hand.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | One look; color inherits from the parent |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 12px box (1.5px art pixel), inline text and 32px controls |
| `md` | 16px box (2px art pixel), default, 40px controls |
| `lg` | 24px box (3px art pixel), 48px controls and empty states |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | No | Box size (legacy small/medium/large accepted, deprecated) |
| `label` | `string` | `"Loading"` | No | Visually hidden status text read by screen readers |
| `className` | `string` | `undefined` | No | Extra wrapper classes, e.g. a text color |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| (currentColor) | color | inherited | Dot fill |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Animating | default | none |
| Static (full ring) | `prefers-reduced-motion: reduce` | none |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default | Yes | Yes | `Default` (controls) |
| Sizes | Yes | Yes | `All sizes` |
| Inline with text | Yes | Yes | `Inline with text` |
| In a button | Yes | Yes | `In a button` (via `Button loading`) |

Interactive controls: size, label

**Coverage:** 100% (4/4)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

Frame interval (100ms) and the 8x8 dot geometry are structural constants (shape language), matching how TuiIcon bitmaps are authored.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts` (`resolveSize`, `ControlSizeProp`)
- `packages/components/src/lib/utils.ts` (`cn`)

### Used by

`Button` renders it in the `loading` overlay (inside an `aria-hidden` span, so its status role is not announced twice).

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `status` (polite live region)
- Required labels: `label` (defaults to "Loading"); rendered `sr-only`
- Focus order: not focusable
- Touch target minimum: N/A (not interactive)
- Color independence: shape and motion carry the meaning; the label names it
- Motion: honors `prefers-reduced-motion` with a static frame

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do give a specific `label` when several regions load at once ("Loading invoices").
- Do use `<Button loading>` for submit buttons; it keeps width and focus stable.
- Don't place a Spinner inside a button by hand (it would add a second live region inside the button's name).
- Don't use it for determinate progress; show a count or a bar instead.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

Inherits color, so wrap it in an element with a text color token
(`text-[var(--text-secondary)]`) rather than coloring it directly. Pair
with short text for long waits.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec aligned to the current template (Component and Last updated rows, repo-only header) |
| Unreleased | 2026-09-21 | feat | New component: 1-bit dot ring spinner, sm/md/lg, visually hidden label, reduced-motion static frame |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Spinner.tsx`
