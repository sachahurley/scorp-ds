# Badge

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Badge` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/Badge.tsx` |
| Story | `Components/Feedback/Badge` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Badge is a compact inline chip for labelling, categorising, or flagging state: a status next to a row, a count, a filter tag, a tier marker. It is static text on a small plate, not a button; the optional remove control makes it a dismissible filter or tag. Use `bone` for state markers that must look identical in both themes and never follow the accent, `caps` for uppercase eyebrow chips, and `dashed` for placeholders and empty slots. For a message that needs a sentence of explanation use Alert, and for an action use Button.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `span` plate (`plate-round`, or a dashed square border when `dashed`) containing: optional left icon, label, optional remove button (1-bit `X`).

### Variants

| Enum Value | Description |
|-----------|-------------|
| `default` | Neutral: `--surface-muted` fill, secondary text. |
| `primary` | Brand accent: primary (amber) tint. |
| `success` | Positive state: success (green) tint. |
| `warning` | Caution: warning (purple) tint. |
| `error` | Problem: error (red) tint. |
| `info` | Informational: info (blue) tint. |
| `bone` | Theme-stable filled sepia chip (`secondary-500` fill, `secondary-950` text) that looks the same in light and dark. |

Modifiers that compose with any variant: `caps` (uppercase, `.08em` tracking) and `dashed` (transparent fill, 1px dashed border in the text color, sharp corners; `bone` keeps a `secondary-500` dash).

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 20px tall (`h-5`), `px-2 py-1`, `text-xs`, 12px icon box |
| `md` | 24px tall (`h-6`), `px-2.5 py-1`, `text-xs`, 14px icon box (default) |
| `lg` | 28px tall (`h-7`), `px-3 py-1.5`, `text-sm`, 16px icon box |
| `small`, `medium`, `large` | Deprecated aliases for `sm`, `md`, `lg`; log a one-time dev warning |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | | Yes | Label text or count. Keep to one or two words. |
| `variant` | `"default" \| "primary" \| "success" \| "warning" \| "error" \| "info" \| "bone"` | `"default"` | No | Color treatment. |
| `size` | `ControlSizeProp` (`"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"`) | `"md"` | No | Chip height. Legacy names are deprecated aliases. |
| `caps` | `boolean` | `false` | No | Uppercase eyebrow voice for state chips ("EQUIPPED", "LEVEL UP"). |
| `dashed` | `boolean` | `false` | No | Not-yet-real voice for placeholders, empty slots, free tiers. Drops the plate clip for sharp corners. |
| `iconLeft` | `ReactNode` | `undefined` | No | Leading icon, boxed to the size's icon slot. |
| `onClose` | `() => void` | `undefined` | No | Renders a remove button. Click is stopped from propagating to parents. |
| `onCloseLabel` | `string` | `Remove {children}` when `children` is a string, else `"Remove badge"` | No | Accessible name for the remove button. Pass it whenever the label alone does not identify what is removed. |
| `className` | `string` | `""` | No | Extra classes on the root `span`. |

Exported type: `BadgeProps`. `ControlSizeProp` is exported from the package barrel.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | 6px stepped corner polygon | Silhouette of filled chips |
| `--surface-muted` | Color | `#F7F5F2` light, `#221E13` dark | `default` fill |
| `secondary-800` / `dark:secondary-200` | Color | sepia-800 `#474030` / sepia-200 `#F7F5F2` | `default` text; remove button; dashed `default` and `bone` text |
| `{variant}-50` / `dark:{variant}-950` | Color | amber, green, purple, red, blue scales | Fill for primary, success, warning, error, info |
| `{variant}-800` / `dark:{variant}-300` | Color | same scales | Text for primary, success, warning, error, info (filled and dashed) |
| `secondary-500` | Color | sepia-500 `#BFB4A3` | `bone` fill; dashed `bone` border |
| `secondary-950` | Color | sepia-950 `#1A150F` | `bone` text |
| `border-current` | Color | inherits text color | Dashed border for non-bone variants |
| `hover:error-700` / `dark:hover:error-400` | Color | red-700 `#B91C1C` / red-400 `#F87171` | Remove button hover |
| `--focus-ring-primary` | Color | `#FBBF24` | Remove button focus ring |
| `--focus-offset-color` | Color | `#FDFCFB` light, `#0A0704` dark | Remove button focus ring offset |
| `--duration-fast` | Motion | 120ms | Remove button color transition |
| `text-xs`, `text-sm` | Typography | 12px, 14px | Label size per size step |
| `h-5`, `h-6`, `h-7` | Spacing | 20px, 24px, 28px | Chip height per size step |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Color variant | `variant` | Fill and text |
| Size | `size` | Height, padding, font size, icon box |
| Caps | `caps` | `uppercase`, `letter-spacing: .08em` |
| Dashed | `dashed` | Fill removed, dashed 1px border, `rounded-none` instead of plate clip |
| Removable | `onClose` | Remove button rendered, named from `onCloseLabel` or the string label |
| Remove hover | Pointer | Button text to `error-700` / `error-400` |
| Remove focus | Keyboard | 2px `--focus-ring-primary` ring with 1px offset |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| `default` | Yes | Yes | `Default`, `AllVariants` |
| `primary` | Yes | Yes | `Primary`, `Caps` |
| `success` | Yes | Yes | `WithIcon` |
| `warning` | Yes | Yes | `AllVariants` |
| `error` | Yes | Yes | `AllVariants` |
| `info` | Yes | Yes | `Dismissible` |
| `bone` | Yes | Yes | `Bone`, `DashedVariants` |
| `sm` | Yes | Yes | `Bone`, `Caps`, `Dashed` |
| `md` | Yes | Yes | Default size |
| `lg` | Yes | No | Only reachable via the `size` control |
| `caps` | Yes | Yes | `Caps` |
| `dashed` | Yes | Yes | `Dashed`, `DashedVariants` |
| `iconLeft` | Yes | Yes | `WithIcon`, `Caps` |
| `onClose` | Yes | Yes | `Dismissible` |

Interactive controls: `variant` (select, options omit `bone`), `size` (select).

**Coverage:** 93% (13/14)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `[letter-spacing:.08em]` for `caps`.
- `"Remove "` prefix and the `"Remove badge"` fallback for the remove button: English, but now overridable via `onCloseLabel`.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (remove `X` at size `3`)

### Foundation Files Referenced

- `packages/components/src/lib/size.ts` (`resolveSize`, `ControlSizeProp`)
- `packages/tokens/src/styles/tokens.css` (surface, focus, motion variables)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility, semantic color scales)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none; the chip is a plain `span` read inline as text
- Required labels: the label text is the accessible content; the remove button is labelled `Remove badge` (generic, does not name the badge)
- Focus order: only the remove button is focusable, in DOM order
- Required labels (remove): the remove button is named after the chip (`Remove Draft`) when `children` is a string, falls back to `Remove badge` for rich children, and takes any `onCloseLabel` the caller passes
- Touch target minimum: the remove button carries the system's 44x44 pseudo-element hit area. On a plate badge the chip's own `clip-path` trims whatever reaches past the chip, so the effective target is 44px wide by the chip height (20 / 24 / 28px); give removable chips room in their row rather than packing them edge to edge, and prefer `lg` for touch-first surfaces
- Color independence: meaning is carried by the label text; status colors are reinforcement. Text scales (800 on 50, 300 on 950, 950 on bone) are chosen to meet WCAG AA

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep labels to one or two words or a number.
- Do use the variant that matches the meaning (error for failed, success for done), and say it in the text too.
- Do use `bone` only where the chip must not re-theme or follow the accent (loot tiers, equipped markers).
- Do use `dashed` for placeholders and empty slots, not as a second color variant.
- Don't make a Badge clickable by wrapping it in an `onClick`; use Button or a link for actions.
- Don't pass `className` overrides for uppercase text; use `caps`.
- Don't use the deprecated `small | medium | large` names in new code.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Inline element: sits on the text baseline next to titles, in ListRow trailing slots, and in Table cells.
- Group several Badges with a `flex flex-wrap gap-2` container.
- Pair `size` with the surrounding text: `sm` beside `text-xs` meta, `md` in rows, `lg` beside headings.
- When `onClose` is used for filter chips, keep the label a plain string so the remove button is named after the chip, or pass `onCloseLabel` when the chip list needs more context than its own text.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Heights use `h-5` / `h-6` / `h-7` (20/24/28px), not the control-height tokens the 2026-09-21 changelog row mentions; remove button is below the 44px target and its label does not name the badge | Remove button: 44x44 pseudo-element hit area (clipped to the chip height by the plate, see Accessibility) and a new `onCloseLabel` prop defaulting to `Remove {children}`. The height scale is unchanged and stays intentional: badges are inline text markers, not controls | Partially resolved |
| 2026-09-22 | Story `variant` control omits `bone`; test "renders bracket-wrapped label" name is stale (brackets were retired) | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` (fixed 20/24/28px heights, not control-height tokens); small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | feat | Remove button text `x` replaced by the 1-bit X icon (12px) |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | feat | `onCloseLabel` prop; the remove button is named after the badge by default and gains a 44px hit area |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Badge.tsx`
