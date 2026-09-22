# Slider

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Slider` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Slider.tsx` |
| Story | `Components/Inputs/Slider` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Slider picks a numeric value from a continuous or stepped range, such as zoom level, size, or bias, where the relative position matters more than typing an exact number. It is a styled native `<input type="range">`, so keyboard arrows, `min`/`max`/`step`, form participation, and assistive tech support come from the browser. Use `Input type="number"` when users need to enter a precise value, and `Select` or `Radio` for a handful of named choices. If the current value matters, show it in the `label` (for example "Zoom · 4x"), because Slider does not display it.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `flex w-full flex-col gap-1.5` span (receives `className`) holding an optional `<label>` and a 44px-tall row (`h-touch`). The row stacks a rail span (`data-slot="rail"`, a 4px bar in `--control-track`) carrying the fill span (`data-slot="fill"`, `--accent`, width set from the current value) under the transparent range input. The native track pseudo-elements are transparent so the rail shows through; the thumb is a 14x20px plate (`w-3.5 h-5`) in `--accent`, clipped to `--plate-round`. The whole 44px row is the pointer target.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single style. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| (none) | No `size` prop. Fixed 44px row (`h-touch`), 4px rail, 14x20px thumb. Width comes from the container. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `label` | `ReactNode` | none | No | Visible label associated via `htmlFor`/`id`. Put the current value in it if users need to see it. Use this or `aria-label`. |
| `id` | `string` | generated (`useId`) | No | Id for the input; always set so the label can target it. |
| `disabled` | `boolean` | none | No | Native disabled; input dims to 50% with a default cursor. |
| `min` / `max` / `step` | `number \| string` | native (`0` / `100` / `1`) | No | Range bounds and increment. |
| `value` / `defaultValue` | `string \| number \| readonly string[]` | native (midpoint) | No | Controlled or uncontrolled value. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | none | No | Native change handler; fires continuously while dragging. Read `Number(e.target.value)`. |
| `className` | `string` | `""` | No | Applied to the outer span, which is already `w-full`. Pass a width or `max-w-*` here, or constrain the parent. |
| `ref` | `Ref<HTMLInputElement>` | none | No | Forwarded to the range input. |
| `...rest` | native `<input>` attributes (except `size` and `type`) | | No | `name`, `aria-label`, `aria-valuetext`, `list`, and so on. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--control-track` | Color | `#968A75` both themes | Rail (3.31:1 light / 5.34:1 dark on the page) |
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Thumb fill and the filled portion of the rail (4.9:1 / 8.24:1 on the page) |
| `--touch-target` (`h-touch`) | Size | `44px` | Row height, the pointer target |
| `--plate-round` | Shape | stepped 6px corner polygon | Thumb clip |
| `--focus-ring-primary` | Color | `#FBBF24` | Inset focus ring on the input box |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `secondary-800` / `dark:secondary-300` | Color | `#474030` / `#F0EBE4` | Label text |
| `text-sm` | Typography | `14px` | Label |

The file header also lists `duration.fast` for hover, but the component has no hover or transition styles.

The fill and the rail sit at 1.48:1 (light) / 1.54:1 (dark) against each other. Both clear 3:1 against the page and the thumb marks the boundary, so the fill is never the sole indicator of the value.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Idle | default | Rail `--control-track`, fill + thumb `--accent` |
| Filled | `value` / `defaultValue` | Fill width = `(value - min) / (max - min)`, clamped to 0-100% |
| Focus visible | `:focus-visible` | Inset `box-shadow` ring `--focus-ring-primary` around the whole 44px row |
| Disabled | `disabled` | Row `opacity-50`, `cursor-default` |
| Dragging / hover | native | No distinct styling |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Controlled with value in label | Yes | Yes | `Default` (min 2, max 8, step 1) |
| Disabled | Yes | Yes | `Disabled` (uncontrolled `defaultValue`) |
| No visible label (`aria-label`) | Yes | No | |
| Focus | Yes | Interactive only | |
| Container widths | Yes | Yes | `Container widths` (256px and 512px columns) |

Interactive controls: none beyond autodocs args (no `argTypes`, no Playground).

**Coverage:** 75% (3/4)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `[&::-webkit-slider-thumb]:-mt-2`: a magic offset that centers the 20px thumb on the 4px track in WebKit; it must change if either size changes.
- `h-1`, `h-5 w-3.5`: rail and thumb sizes from the Tailwind 4px scale; there is no rail-thickness or thumb token yet. The row height is `h-touch` (`--touch-target`).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (`--surface-muted`, `--accent`, `--plate-round`, focus-ring tokens)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: native `slider` (range input) with implicit `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- Required labels: `label` or `aria-label`; no dev warning when missing. Use `aria-valuetext` when the raw number is not meaningful ("4x zoom").
- Keyboard: native. Arrow keys step, Page Up/Down jump, Home/End go to the bounds.
- Focus: inset ring on the input box (outlines are suppressed).
- Touch target minimum: met. The input is `h-touch` (44px) and spans the full width, so the whole band is the pointer target; the visible rail stays 4px.
- Non-text contrast: rail 3.31:1 (light) / 5.34:1 (dark) and fill 4.9:1 / 8.24:1 against the page, both clearing the 3:1 rule in WCAG 1.4.11.
- Color independence: position is shown by the thumb and by the filled portion of the rail, not by colour alone; put the number in the `label` when it matters.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do show the current value in the `label` when it matters (the story uses "Zoom · 4x").
- Do set `min`, `max`, and `step` explicitly so keyboard steps are predictable.
- Do let the container set the width: the slider is `w-full`, so wrap it in a sized column (`w-64`, `max-w-sm`) or pass a width in `className`.
- Don't use Slider when users need an exact value; offer an `Input` alongside or instead.
- Don't use Slider for a few named options; use `Radio` or `Select`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- The label styling (`text-sm`, `secondary-800`) matches Input's label, so Slider sits in a form column with other fields.
- The music player pattern builds its own scrubber on a native range input with a filled track (`--scrub-fill` / `--scrub-track`). Slider now has a filled portion of its own (`--accent` over `--control-track`), so the two recipes are candidates to converge.
- For a value readout beside the track, compose it outside the component in a flex row.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | No 44px touch target (24px input, 14px thumb) despite the header comment; track `--surface-muted` has very low contrast against the page in both themes and there is no filled portion; no `size`, `helperText`/`errorMessage`, or tests | Row is now `h-touch` (44px) and full width; the rail moved to `--control-track` (3.31:1 light / 5.34:1 dark, up from 1.06:1 / 1.09:1) and a `--accent` fill marks the value. Unit tests added | Resolved |
| 2026-09-22 | The `inline-flex` wrapper sized to its content, so a parent width such as `w-64` had no effect | Root is `flex w-full`; width comes from the container or from `className` | Resolved |
| 2026-09-22 | No `size` prop and no `helperText` / `errorMessage` | None yet; Slider is the only field tier without them | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec created from source |
| Unreleased | 2026-09-22 | fix | Real 44px touch target, `--control-track` rail with an `--accent` fill, full-width layout, and the first unit tests |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Slider.tsx`
