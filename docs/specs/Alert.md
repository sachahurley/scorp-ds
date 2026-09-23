# Alert

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Alert` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/Alert.tsx` |
| Story | `Components/Feedback/Alert` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `7678be0f759120d9` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Alert is an inline, persistent message that sits in the page flow next to the content it describes: a failed save above a form, a warning at the top of a settings panel, a neutral notice about a changed default. It stays until the underlying condition changes or the user dismisses it, so it suits messages the user may need to reread or act on. Use Toast instead for brief, non-critical confirmations that should disappear on their own, and Modal when the user must respond before continuing. Each severity pairs a tinted plate with its own 1-bit icon so meaning never rests on color alone.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Outer ring plate (`plate-round`, 1px padding) wraps an inner fill plate holding, left to right: severity icon (boxed to the title's 20px first line), content column (optional title `h4`, optional description), optional close button. The close button is `type="button"`, draws a 12px `X`, and carries an invisible 44x44px hit area from a centered `::before` pseudo-element, so layout is unchanged.

### Variants

| Enum Value | Description |
|-----------|-------------|
| `default` | Neutral notice. `Bell` icon, `--border-default` ring on `--surface-subtle` fill. |
| `info` | Informational. `Info` icon, info (blue) ring and tint. |
| `success` | Positive outcome. `CheckCircle` icon, success (green) ring and tint. |
| `warning` | Proceed with care. `AlertTriangle` icon, warning (purple) ring and tint. |
| `error` | Failure or blocking problem. `AlertCircle` icon, error (red) ring and tint. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| N/A | Single size. Width follows the container; padding is fixed at `p-4`. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info"` | `"default"` | No | Severity. Sets ring, fill, text colors, and the default icon. |
| `title` | `string` | `undefined` | No | Short bold heading rendered as an `h4`. Omit for a single-line message. |
| `description` | `ReactNode` | `undefined` | No | Body copy. Accepts rich content such as a link or inline code. |
| `iconLeft` | `ReactNode` | variant icon | No | Replaces the severity icon. Keep a 16px 1-bit icon so the icon still signals meaning. |
| `onClose` | `() => void` | `undefined` | No | When set, renders a close button (`type="button"`, 1-bit `X`, `aria-label="Close alert"`, 44px hit area) that calls this. The Alert does not hide itself; the parent removes it. |
| `className` | `string` | `""` | No | Extra classes on the outer ring element (width, margin). |

Exported type: `AlertProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | 6px stepped corner polygon | Clip path on both ring and fill layers |
| `--border-default` | Color | `#F0EBE4` light, `#695F4D` dark | `default` ring |
| `--surface-subtle` | Color | `#FCFBFA` light, `#1A150F` dark | `default` fill |
| `--text-primary` | Color | `#2B2718` light, `#FDFCFB` dark | `default` title |
| `secondary-800` / `dark:secondary-300` | Color | sepia-800 `#474030` / sepia-300 `#F0EBE4` | `default` icon, description, close button |
| `{status}-300` / `dark:{status}-700` | Color | green, purple, red, blue scales | Ring for success, warning, error, info |
| `{status}-50` / `dark:{status}-950` | Color | green, purple, red, blue scales | Fill for success, warning, error, info |
| `{status}-800` / `dark:{status}-400` | Color | status scales | Icon for success, warning, info |
| `error-700` / `dark:error-400` | Color | red-700 `#B91C1C` / red-400 `#F87171` | Icon for error |
| `{status}-900` / `dark:{status}-50` | Color | status scales | Title for status variants |
| `{status}-900` / `dark:{status}-300` | Color | status scales | Description and close button for status variants |
| `hover:error-800` / `dark:hover:error-300` | Color | red-800 `#991B1B` / red-300 `#FCA5A5` | Close button hover, all variants |
| `--focus-ring-primary` / `--focus-ring-error` | Color | `#FBBF24` / `#DC2626` light, `#EF4444` dark | Close button inset focus ring (error variant uses the error ring) |
| `--focus-ring-width` | Size | 2px | Close button focus ring thickness |
| `--touch-target` (`before:w-touch before:h-touch`) | Size | 44px | Close button hit area |
| `--duration-fast` | Motion | 120ms | Close button color transition |
| `text-sm` | Typography | 14px | Title and description |
| `p-4`, `gap-3`, `h-5`, `mb-1` | Spacing | 16px, 12px, 20px, 4px | Padding, icon gap, icon box height, title gap |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Severity | `variant` | Ring, fill, icon, title, description colors; default icon |
| Title only / description only / both | `title`, `description` | Layout only |
| Custom icon | `iconLeft` | Icon slot content (color still from the variant) |
| Dismissible | `onClose` | Close button rendered |
| Close hover | Pointer | Close button text to `error-800` / `error-300` over `--duration-fast` |
| Close focus | `:focus-visible` | Inset ring `--focus-ring-primary` (`--focus-ring-error` on the error variant), `--focus-ring-width` thick |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| `default` | Yes | Yes | `Default`, `AllVariants` |
| `info` | Yes | Yes | `AllVariants` |
| `success` | Yes | Yes | `Success`, `AllVariants` |
| `warning` | Yes | Yes | `AllVariants` |
| `error` | Yes | Yes | `Error`, `AllVariants` |
| Dismissible | Yes | Yes | `Error` (with `onClose` action) |
| Custom `iconLeft` | Yes | No | Not demonstrated |

Interactive controls: `variant` (select); other args editable via autodocs.

**Coverage:** 86% (6/7)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `aria-label="Close alert"`: fixed English label, not overridable.

No raw color, size, or spacing values. (The close button's focus ring and hit area are token-driven since 2026-09-22.)

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (severity icons `Bell`, `Info`, `CheckCircle`, `AlertTriangle`, `AlertCircle` at size `4`; close `X` at size `3`)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (semantic surface, border, text, motion variables)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility, semantic color scales)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="alert"` on the outer element for every variant (assertive live region)
- Required labels: none from the consumer; the close button is labelled `Close alert`
- Focus order: the Alert itself is not focusable; the close button is a native `type="button"` control in DOM order, so an Alert inside a form never submits it
- Focus visible: inset box-shadow ring from `--focus-ring-primary` (error variant: `--focus-ring-error`); an outside ring would be sliced by the plate clip
- Touch target minimum: met. The close button keeps its 12px glyph but has a centered 44x44px `::before` hit area (the Checkbox recipe). The area reaches into the 12px gap beside the content column, so keep the description clear of the close control
- Color independence: each variant has a distinct icon (default and info differ), plus title text

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do place the Alert directly above or beside the content it refers to.
- Do write a short title that names the problem and a description that says what to do next.
- Do use `error` for failures the user must fix, `warning` for risky but allowed states, `info` or `default` for neutral notices.
- Don't use an Alert for transient confirmations like "Copied" (use Toast).
- Don't stack several Alerts of the same severity; merge them into one message.
- Don't swap in an `iconLeft` that drops the severity meaning or uses a non 1-bit icon.
- Don't render an Alert on page load for non-urgent info: `role="alert"` interrupts screen readers.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Full width of its container; constrain width with the parent or `className`.
- Inside a Card or Modal body, place it at the top of the content region, above the fields it describes.
- Put actions (retry, learn more) in `description` as a `Link` or small `Button`; do not add a second close control.
- For field-level errors, use the input's `errorMessage` instead of an Alert.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Close button has no `type="button"` (submits an enclosing form), no token focus ring color, and a 12px hit area below the 44px minimum | Added `type="button"`, the inset `--focus-ring-*` ring, and a 44px `::before` hit area; JSDoc added to every prop | Resolved |
| 2026-09-22 | `role="alert"` is applied to every variant, so neutral and success messages are announced assertively | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Severity prefixes `[i]` `[ok]` `[!!]` `[er]` and close `[x]` replaced by 1-bit icons: default Bell, info Info (default and info now differ), success CheckCircle, warning AlertTriangle, error AlertCircle; close is a 12px X |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | Close button is `type="button"` (no stray form submits), uses the inset token focus ring instead of `focus:ring-1 focus:ring-offset-1`, and gets a 44px pseudo-element hit area; `AlertProps` gained per-prop JSDoc |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Alert.tsx`
