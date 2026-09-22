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
| API hash | `cfba133a0c8a70f7` |

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
| `sm` | Track 24x44px, knob 20px, knob x 2px off / 22px on, 12px icon box |
| `md` (default) | Track 32x56px, knob 24px, knob x 3px off / 29px on, 12px icon box |
| `lg` | Track 40x72px, knob 32px, knob x 3px off / 37px on, 16px icon box |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Every measurement comes from `global.switch` (`--switch-track-height/width-*`, `--switch-knob-size/inset/travel-*`), so none of it is typed into the component. The `md` and `lg` track heights alias `control.height.sm` and `control.height.md`; `sm`'s 24px track is one step below the control scale and has no other token, and its 44px width aliases `touch.target`. The knob's on offset is `track width - knob size - inset`. The hit area is 44px tall at every size (44x44 for `sm`).

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `checked` | `boolean` | `false` | No (effectively yes) | Current state. Switch keeps no internal state, so pass it from the parent. |
| `onCheckedChange` | `(checked: boolean) => void` | none | No (effectively yes) | Called with the next state on click, Enter, or Space. Without it the switch cannot change. |
| `label` | `string` | none | No | Visible label and the accessible name (`aria-label`). Clicking the visible text toggles the switch. |
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
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Track when on (4.9:1 / 8.24:1 on the page; 4.9:1 / 8.78:1 against the knob) |
| `--control-track` | Color | `#968A75` both themes | Track when off (3.31:1 light / 5.34:1 dark on the page; 3.39:1 / 5.69:1 against the knob) |
| `--field-background` | Color | light `#FFFFFF`, dark `#120D09` | Knob fill |
| `--focus-ring-primary` | Color | `#FBBF24` | Inset focus ring on the track |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `--touch-target` (`h-touch`) | Size | `44px` | Hit area height |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Label text |
| `secondary-700` / `dark:secondary-400` | Color | `#695F4D` / `#E0DACE` | Disabled label text |
| `--plate-round` | Shape | stepped 6px corner polygon | Track and knob clip |
| `--duration-normal` | Motion | `200ms` | Track color and knob glide (Tailwind default ease); both drop to `transition-none` under `prefers-reduced-motion` |
| `--switch-track-height-sm\|md\|lg` | Size | `24px` / `var(--control-height-sm)` / `var(--control-height-md)` | Track height |
| `--switch-track-width-sm\|md\|lg` | Size | `var(--touch-target)` / `56px` / `72px` | Track width |
| `--switch-knob-size-sm\|md\|lg` | Size | `20px` / `24px` / `32px` | Knob box |
| `--switch-knob-inset-sm\|md\|lg` | Size | `2px` / `3px` / `3px` | Knob x when off |
| `--switch-knob-travel-sm\|md\|lg` | Size | `22px` / `29px` / `37px` | Knob x when on |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Off | `checked={false}` | Track `--control-track`, knob at `--switch-knob-inset-*` |
| On | `checked={true}` | Track `--accent`, knob at `--switch-knob-travel-*` |
| Focus visible | `group-focus-visible` on the track | Inset ring `--focus-ring-primary` |
| Disabled | `disabled` | Button `opacity-50`, `cursor-not-allowed`; label `secondary-700` / `secondary-400` |
| Hidden label | `hideLabel` | No visible span; `aria-label` still set |
| Knob icon | `icon` | Icon box inside the knob |
| Reduced motion | `prefers-reduced-motion: reduce` | Track colour and knob glide become instant (`motion-reduce:transition-none`) |

There is no hover style. The `data-state` attribute on the track reads `on` or `off` for tests and product CSS.

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

None. Track and knob geometry moved to `global.switch` tokens on 2026-09-22; the inline `transform` now interpolates `--switch-knob-inset-*` / `--switch-knob-travel-*`. The icon boxes (`w-3`, `w-4`) are Tailwind spacing steps that map to the 4px scale.

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
- Touch target minimum: 44px tall hit area at every size; width is the track width (44/56/72px). The visible label text toggles the switch too, like a native control label. It is a plain `<span>` (a `<button>` is not a labelable element), so the accessible name still comes from `aria-label` and the click is wired by hand; it does nothing while `disabled`.
- Motion: the knob glide and track colour honour `prefers-reduced-motion: reduce` and become instant.
- Non-text contrast: off track 3.31:1 (light) / 5.34:1 (dark) on the page, on track 4.9:1 / 8.24:1; knob against the track 3.39:1 / 5.69:1 off and 4.9:1 / 8.78:1 on. All clear the 3:1 rule in WCAG 1.4.11.
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
| 2026-09-22 | Off track in light mode (`secondary-300` `#F0EBE4` on the `#FDFCFB` page, with a white knob) is far below the 3:1 non-text contrast guideline; the visible label is not clickable; no reduced-motion handling for the knob glide | Off track is now `--control-track` (sepia-600): 3.31:1 light / 5.34:1 dark on the page, 3.39:1 / 5.69:1 against the knob. The visible label toggles the switch. Track colour and knob glide carry `motion-reduce:transition-none` | Resolved |
| 2026-09-22 | On track was `--button-primary-background` (amber-400), leaving the white knob at 1.67:1 in the light theme | On track is now `--accent`: 4.9:1 on the light page and 4.9:1 against the knob (dark is unchanged, the accent and the primary fill are both the gold there) | Resolved |
| 2026-09-22 | Track and knob geometry were hardcoded (`w-[72px]`, inline `translateX` literals, Tailwind height steps) | Moved to `global.switch` tokens; `md` / `lg` track heights alias the control-height tokens and `sm`'s width aliases `touch.target` | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | fix | 44px hit area at every size |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | Off track moved to `--control-track` and the on track to `--accent` so both states clear the 3:1 non-text rule; visible label now toggles; knob glide is reduced-motion safe; track and knob geometry moved to `global.switch` tokens |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Switch.tsx`
