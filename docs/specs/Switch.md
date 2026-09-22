# Switch

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Switch` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Inputs` |
| File | `packages/components/src/components/Switch.tsx` |
| Story | `Components/Inputs/Switch` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Switch toggles a setting on or off with an immediate effect, like enabling notifications or a theme. It is a `role="switch"` button with a plate-shaped track and knob; the knob glides at `duration-normal` (200ms), within the 150 to 200ms interactive-motion ceiling (this replaced the earlier steps(3) pixel hop, Sacha's call on 2026-09-21, because the hop read as jitter). It is fully controlled: the parent owns `checked` and updates it from `onCheckedChange`. Use `Checkbox` instead when the choice is part of a form that is submitted later.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

An outer `flex items-center gap-3` wrapper (receives `className`) holding the switch `<button>` and an optional visible label `<span>`. The button is unclipped and carries a `::before` hit area 44px tall spanning the track width; inside it an `aria-hidden` track span (clipped to `--plate-round`, carries the focus ring) holds the knob span (also `plate-round`), which is positioned with an inline `transform: translateX(...)`. An optional `icon` renders inside the knob.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single style. `icon` adds a glyph inside the knob (for example Sun/Moon in a theme toggle). |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | Track 24x44px (`h-6 w-11`), knob 20px, knob x 2px off / 22px on, 12px icon box |
| `md` (default) | Track 32x56px (`h-8 w-14`), knob 24px, knob x 3px off / 29px on, 12px icon box |
| `lg` | Track 40x72px (`h-10 w-[72px]`), knob 32px, knob x 3px off / 37px on, 16px icon box |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Switch does not use the control-height tokens; its track heights are one step below the Button scale. The hit area is 44px tall at every size (44x44 for `sm`).

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `checked` | `boolean` | `false` | No (effectively yes) | Current state. Switch keeps no internal state, so pass it from the parent. |
| `onCheckedChange` | `(checked: boolean) => void` | none | No (effectively yes) | Called with the next state on click, Enter, or Space. Without it the switch cannot change. |
| `label` | `string` | none | No | Visible label and the accessible name (`aria-label`). |
| `hideLabel` | `boolean` | `false` | No | Keeps `label` as the accessible name only, with no visible text. Use in rows that already show a heading, such as settings rows. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Track size. Legacy names are deprecated. |
| `disabled` | `boolean` | `false` | No | Native disabled; switch dims to 50% and the label uses `secondary-700` / `dark:secondary-400`. |
| `icon` | `ReactNode` | none | No | Glyph inside the knob. |
| `className` | `string` | `""` | No | Applied to the outer wrapper. |
| `ref` | `Ref<HTMLButtonElement>` | none | No | Forwarded to the switch button. |
| `...rest` | native `<button>` attributes (except `onChange`) | | No | Spread onto the button after the built-in attributes, so a consumer `aria-label` overrides `label`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--button-primary-background` | Color | light `#FBBF24`, dark `#E0A26A` | Track when on |
| `secondary-300` / `dark:secondary-700` | Color | `#F0EBE4` / `#695F4D` | Track when off |
| `--field-background` | Color | light `#FFFFFF`, dark `#120D09` | Knob fill |
| `--focus-ring-primary` | Color | `#FBBF24` | Inset focus ring on the track |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `--touch-target` (`h-touch`) | Size | `44px` | Hit area height |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Label text |
| `secondary-700` / `dark:secondary-400` | Color | `#695F4D` / `#E0DACE` | Disabled label text |
| `--plate-round` | Shape | stepped 6px corner polygon | Track and knob clip |
| `--duration-normal` | Motion | `200ms` | Track color and knob glide (Tailwind default ease) |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Off | `checked={false}` | Track `secondary-300` / `secondary-700`, knob at the left |
| On | `checked={true}` | Track `--button-primary-background`, knob at the right |
| Focus visible | `group-focus-visible` on the track | Inset ring `--focus-ring-primary` |
| Disabled | `disabled` | Button `opacity-50`, `cursor-not-allowed`; label `secondary-700` / `secondary-400` |
| Hidden label | `hideLabel` | No visible span; `aria-label` still set |
| Knob icon | `icon` | Icon box inside the knob |

There is no hover style.

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Off | Yes | Yes | `Off` (static; `onCheckedChange` is a spy) |
| On | Yes | Yes | `On` |
| Disabled | Yes | Yes | `Disabled` |
| sm / md / lg | Yes | Yes | `All sizes` (interactive, stateful) |
| `hideLabel` | Yes | No | |
| Knob `icon` | Yes | No | Used by `ThemeToggle` |

Interactive controls: `size`, `disabled` via args.

**Coverage:** 67% (4/6)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `w-[72px]` track width for `lg`.
- Inline `transform: translateX(2px | 22px | 3px | 29px | 3px | 37px)` knob offsets.
- `h-6 w-11`, `h-8 w-14`, `h-10`, knob `h-5/6/8` sizes use the Tailwind scale rather than control tokens.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None imported. `ThemeToggle` composes Switch with a knob `icon`.

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `button` with `role="switch"` and `aria-checked`; `type="button"`.
- Required labels: `label` (visible or with `hideLabel`) or `aria-label`. Without either, the name falls back to "On" or "Off", which describes the state, not the setting.
- Keyboard: Tab to focus; Space or Enter toggles (handled in `onKeyDown`).
- Focus: 2px inset ring on the track via `group-focus-visible`.
- Touch target minimum: 44px tall hit area at every size; width is the track width (44/56/72px). The visible label text is not clickable.
- Color independence: state is also shown by knob position.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do always pass `label` naming the setting ("Notifications"), using `hideLabel` when the row already shows it.
- Do control it: keep `checked` in state and update it in `onCheckedChange`.
- Do apply the change immediately; a Switch should not need a Save button.
- Don't use Switch inside a form that is submitted later; use `Checkbox` (Switch has no `name`/value form participation).
- Don't rely on the fallback "On"/"Off" name.
- Don't put state words in the label ("Notifications on"); the switch announces its own state.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- In settings rows, put the heading and description on the left and the Switch (with `hideLabel`) on the right edge.
- `ThemeToggle` is the canonical use of the knob `icon`.
- Switch heights (24/32/40px) do not match Button heights at the same size name; align rows by centering, not by baseline.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | Small track 24px tall, below the 44px target | Plate clip moved to an inner track span; the button carries a 44px-tall hit area | Resolved |
| 2026-09-22 | Off track in light mode (`secondary-300` `#F0EBE4` on the `#FDFCFB` page, with a white knob) is far below the 3:1 non-text contrast guideline; the visible label is not clickable; no reduced-motion handling for the knob glide | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | fix | 44px hit area at every size |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Switch.tsx`
