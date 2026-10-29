# ProgressBar

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `ProgressBar` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/ProgressBar.tsx` |
| Story | `Components/Feedback/ProgressBar` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |
| API hash | `e2b32a77113b77e5` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Shows task progress. Determinate with `value` / `max`, indeterminate when `value` is omitted. TUI rendering: a hairline-ringed sharp track filled with discrete blocks on the 2px grid (20 blocks = 5% steps, filled with floor so the bar is only full at completion). Indeterminate is a 4-block run that hops one block per duration.fast tick; under prefers-reduced-motion it holds still as a dimmed full track.

Don't use this for: a measured value in a known range that is not heading toward completion, such as disk used or a quota (use Meter instead), or a short wait inline or inside a button (use Spinner, or `<Button loading>`, instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Tones

`tone` takes the five shared colour roles of decision 0024 plus ProgressBar's own `primary`, the default accent.

| Enum Value | Description |
|-----------|-------------|
| `primary` | Default accent |
| `neutral` | Secondary (sepia) blocks, for progress that carries no judgement |
| `info` | Info (blue) blocks |
| `success` | Completed / healthy |
| `warning` | Approaching a limit |
| `error` | Failed |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 8px track |
| `md` | 12px track (default) |
| `lg` | 16px track |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `value` | `number | null` | `undefined` | No | Omit for indeterminate |
| `max` | `number` | `100` | No | Complete value |
| `label` | `string` |  | Yes | Accessible name |
| `showLabel` | `boolean` | `true` | No | Visible label |
| `showValue` | `boolean` | `true` | No | Percentage text |
| `size` | `sm | md | lg` | `"md"` | No | Track thickness |
| `tone` | `ProgressBarTone`: `primary | neutral | info | success | warning | error` | `"primary"` | No | Fill meaning. Also written to `data-tone` on the progressbar |
| `segments` | `number` | `20` | No | Blocks across the track |

Exported types: `ProgressBarProps`, `ProgressBarTone`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--border-default` | Color | semantic | Track ring |
| `--surface-subtle` | Color | semantic | Track fill |
| `--surface-muted` | Color | semantic | Empty blocks |
| `primary/secondary/info/success/warning/error 400-600` | Color | semantic scales | Filled blocks (`secondary` is the `neutral` tone) |
| `--duration-fast` | Motion | 120ms | Indeterminate hop interval |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| loading / complete / indeterminate | `data-state` | fill count, animation |
| Tone | `tone`, mirrored on `data-tone` | filled block colour |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Indeterminate | Yes | Yes |  |
| Tones | Yes | Yes | `Variants` export (shown as "Tones"): primary, success, warning, error; `neutral` and `info` via the `tone` control |
| Sizes | Yes | Yes |  |
| Hidden label | Yes | Yes |  |
| Live | Yes | Yes |  |

Interactive controls: Yes (autodocs argTypes)

**Coverage:** 100% (6/6)

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

None

### Foundation Files Referenced

`packages/tokens/src/tokens.json` (via the Tailwind preset and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: progressbar
- Required labels: label (visible via aria-labelledby, or aria-label when hidden)
- Focus order: Not focusable
- Touch target minimum: N/A
- Color independence: Percentage text and label carry meaning; tone color is supplementary

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

[TODO: add usage guidelines]

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
| v1 | 2026-09-21 | added | Initial ProgressBar component, story, and unit tests |
| Unreleased | 2026-10-28 | feat | Decision 0024 vocabulary: `tone` replaces `variant` and adds the `neutral` and `info` roles (`primary` stays the default). `variant` still works, warns once in development, and loses when both are set. New exported type `ProgressBarTone`; `data-tone` on the progressbar. Existing values render identically |
| Unreleased | 2026-10-29 | change | Decision 0031 removed the deprecated `variant` prop and its dev warning; use `tone`. Rendering unchanged |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/ProgressBar.tsx`
