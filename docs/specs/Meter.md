# Meter

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Meter` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/Meter.tsx` |
| Story | `Components/Terminal/Meter` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `f5dd50df1de10299` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

METER COMPONENT

A gauge for a value in a known range (disk, quota, battery), not a progress
bar. `role="meter"` with `aria-valuenow` / `min` / `max` / `aria-valuetext`,
drawn as stepped blocks on the pixel grid.

Thresholds follow the native `<meter>` model: `low` / `high` split the range
into three regions and `optimum` names the good one. The optimum region is
`success`, one region away is `warning`, two away is `error`; with no thresholds
the meter is `primary`. `tone` overrides. The label and value text are always
visible and warning / error add a 1-bit icon, so color is never the only
signal. `getMeterTone()` is exported.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| `primary` | No thresholds |
| `success` | Value in the optimum region |
| `warning` | One region away (+ AlertTriangle) |
| `error` | Two regions away (+ AlertCircle) |

### Sizes

| Enum Value | Description |
|------------|-------------|
| `sm` | 8px blocks |
| `md` | 12px blocks (default) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `value` | `number` | - | Yes | Clamped to `[min, max]`. |
| `min` / `max` | `number` | `0` / `100` | No | Range. |
| `low` / `high` / `optimum` | `number` | - | No | Native meter thresholds. |
| `label` | `ReactNode` | - | Yes | Visible label and accessible name. |
| `valueText` | `string` | percentage | No | Visible value and `aria-valuetext`. |
| `tone` | `MeterTone` | derived | No | Force a tone. |
| `segments` | `number` | `20` | No | Block count. |
| `size` | `"sm" \| "md"` | `"md"` | No | Block height. |
| `className` | `string` | - | No | Wrapper classes. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `primary|success|warning|error` 600 light / 400 dark | color | semantic scales | Filled blocks |
| `surface.muted` | color | theme | Empty blocks |
| `surface.container-stroke` | color | theme | Empty block ring |
| `text.primary` / `text.secondary` | color | theme | Label / value text |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Tone by threshold | `low` / `high` / `optimum` | Block fill + icon |
| Forced tone | `tone` | Block fill |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Thresholds | Yes | Yes |  |
| High is good (battery) | Yes | Yes |  |
| Sizes | Yes | Yes |  |
| ForcedTone | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (5/5)

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

- TuiIcon
- lib/size (resolveSize)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `meter` with valuenow / min / max / valuetext
- Required labels: `label` (via `aria-labelledby`)
- Focus order: not focusable
- Touch target minimum: N/A
- Color independence: visible value text; icons on warning / error

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do pass `valueText` with units.
- Do set `optimum` to say which end is good.
- Don't use Meter for task progress.

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

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial component (terminal batch, ds-nav-terminal) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Meter.tsx`
