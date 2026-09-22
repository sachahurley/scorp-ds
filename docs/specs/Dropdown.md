# Dropdown

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Dropdown` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Overlays` |
| File | `packages/components/src/components/Dropdown.tsx` |
| Story | `Components/Overlays/Dropdown` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Dropdown is an action menu: a trigger that opens a short list of commands such as Edit, Duplicate, or Delete. It is data-driven (an `items` array with labels, handlers, optional icons, and a destructive style), closes on selection, Escape, or an outside click, and supports arrow-key navigation. Use it to tuck secondary actions for an object or toolbar behind one control. To choose a form value use `Select`; for navigation between views use `Tabs` or `Link`.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `relative inline-block` wrapper containing the trigger and, when open, the menu: a ring layer (`plate-round p-px` in `--border-default`) around a `role="menu"` panel on `--surface-card`. The default trigger is a secondary-button-styled `<button>` with `label` and a `ChevronDown` icon that rotates when open. Each item is a `<button role="menuitem">` with an optional left `icon` grouped with the label and an optional `iconRight` pushed to the right edge.

### Variants

| Enum Value | Description |
|-----------|-------------|
| Item `default` | Primary text, `--surface-subtle` hover. |
| Item `destructive` | `error-600` text, `--field-background-error` hover. |
| `align="left"` (default) | Menu aligned to the trigger's left edge. |
| `align="right"` | Menu aligned to the trigger's right edge. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | Default trigger 32px (`h-control-sm`), `px-4 py-1.5`, 16px icon boxes |
| `md` (default) | Default trigger 40px (`h-control-md`), `px-5 py-2.5`, 20px icon boxes |
| `lg` | Default trigger 48px (`h-control-lg`), `px-6 py-3.5`, 24px icon boxes |
| `small` / `medium` / `large` | Deprecated aliases for `sm` / `md` / `lg` (one-time dev warning) |

Size affects the default trigger and item icon boxes only; items are always `px-4 py-3` `text-sm` (44px rows) and the menu is at least 200px wide.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

### `DropdownProps`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `items` | `DropdownItem[]` | none | Yes | Menu entries, in order. |
| `trigger` | `ReactNode` | default button | No | Custom trigger content. It is wrapped in a `div` with `role="button"` and `tabIndex=0` that toggles on click, Enter, or Space. |
| `label` | `string` | `"Actions"` | No | Text of the default trigger button (and its accessible name). Ignored with a custom `trigger`. |
| `align` | `"left" \| "right"` | `"left"` | No | Which trigger edge the menu aligns to. Use `right` near the right edge of the viewport. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | `"md"` | No | Default trigger height and item icon size. Legacy names are deprecated. |

Dropdown does not forward refs, `className`, or native attributes.

### `DropdownItem`

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `label` | `string` | none | Yes | Item text and accessible name. Truncated with an ellipsis when too long. |
| `onClick` | `() => void` | none | Yes | Called on activation; the menu then closes. |
| `icon` | `ReactNode` | none | No | Left icon grouped with the label (typically `TuiIcon`). |
| `iconRight` | `ReactNode` | none | No | Right-aligned icon (for example a shortcut hint or `ExternalLink`). |
| `variant` | `"default" \| "destructive"` | `"default"` | No | `destructive` colors the item red for irreversible actions. |
| `disabled` | `boolean` | `false` | No | Item is dimmed, not clickable, and skipped by arrow keys. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--button-secondary-background` / `-hover` | Color | light `#695F4D` / `#968A75`, dark `#221E13` / `#E0A26A` | Default trigger fill |
| `--button-secondary-text` / `-text-hover` | Color | light `#FDFCFB` / `#FDFCFB`, dark `#E0A26A` / `#1A150F` | Default trigger text |
| `--focus-ring-secondary` | Color | `#695F4D` | Default trigger inset focus ring |
| `--focus-ring-width` | Size | `2px` | Focus ring thickness |
| `--border-default` | Color | light `#F0EBE4`, dark `#695F4D` | Menu ring |
| `--surface-card` | Color | light `#FFFFFF`, dark `#120D09` | Menu fill |
| `--surface-subtle` | Color | light `#FCFBFA`, dark `#1A150F` | Item hover and keyboard highlight |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Item text |
| `error-600` | Color | `#DC2626` | Destructive item text (both themes) |
| `--field-background-error` | Color | light `#FEF2F2`, dark `#450A0A` | Destructive item hover |
| `--control-height-sm/md/lg` | Size | `32px` / `40px` / `48px` | Default trigger height |
| `--plate-round` | Shape | stepped 6px corner polygon | Trigger, menu ring, menu |
| `--duration-normal` | Motion | `200ms` | Trigger color transition, chevron rotation, menu enter |
| `--duration-fast` | Motion | `120ms` | Item hover transition |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Trigger hover | `:hover` | `--button-secondary-*-hover`; `active:brightness-95` when pressed |
| Trigger focus | `:focus-visible` | Inset ring `--focus-ring-secondary` (default trigger only) |
| Open | internal `isOpen` | Menu rendered with `fade-in slide-in-from-top-2`, chevron `rotate-180`, `aria-expanded="true"` |
| Item hover / highlight | hover or arrow keys | `--surface-subtle` (destructive hover: `--field-background-error`) |
| Item destructive | `variant: "destructive"` | `error-600` text |
| Item disabled | `disabled: true` | `opacity-50`, `cursor-not-allowed` |
| Align | `align` | `left-0` or `right-0` on the menu |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default trigger, md | Yes | Yes | `Default` |
| Destructive item | Yes | Yes | `Default`, `AlignRight` |
| align right | Yes | Yes | `AlignRight` |
| sm size | Yes | Yes | `Small` |
| lg size | Yes | Controls only | |
| Item icons (`icon`, `iconRight`) | Yes | No | |
| Disabled item | Yes | No | |
| Custom `trigger` | Yes | No | |

Interactive controls: `align`, `size` on each story.

**Coverage:** 57% (4/7)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- `min-w-[200px]` on the menu.
- `z-[1051]` on the menu instead of a z-index token (`--z-index-dropdown` is 1000, `--z-index-popover` 1050).
- `active:brightness-95` on the default trigger.
- `mt-2` menu offset (Tailwind scale).

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`ChevronDown` on the default trigger)

### Foundation Files Referenced

- `packages/components/src/lib/size.ts`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: default trigger is a `button` with `aria-haspopup="true"` and `aria-expanded`; the menu is `role="menu"` with `aria-orientation="vertical"`; items are `role="menuitem"` buttons.
- Required labels: the default trigger is named by `label`. A custom `trigger` must carry its own text or `aria-label`; its wrapper has no `aria-haspopup` or `aria-expanded`.
- Keyboard: Enter or Space opens the trigger. While open, ArrowDown/ArrowUp move the highlight (wrapping, skipping disabled items), Enter/Space activate, Escape closes. Click outside closes.
- Focus management: focus stays on the trigger; the highlight is visual only (no roving focus or `aria-activedescendant`), so screen readers do not announce the highlighted item. Tab moves focus away but does not close the menu (only an outside mouse press, Escape, or selection does).
- Touch target minimum: items are 44px tall. The default trigger is 32/40/48px; only `lg` meets 44px.
- Color independence: destructive items rely on red text; the label must say what happens ("Delete project").

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep menus short (about seven items or fewer) and put destructive items last.
- Do write item labels as verbs ("Duplicate", "Delete project").
- Do use `align="right"` for triggers at the right edge of a row or header.
- Don't use Dropdown to pick a form value; use `Select`.
- Don't hide the only way to do a primary action inside a Dropdown.
- Don't pass a `Button` as a custom `trigger`: it gets wrapped in another `role="button"` element, creating nested interactive controls and two tab stops. Prefer the default trigger with `label`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- The default trigger reuses the secondary Button tokens and control heights, so it lines up with `Button` and `Input` at the same size.
- Menu styling (ring, card fill, 44px rows, highlight) matches the `Select` listbox.
- The menu is absolutely positioned with no portal or collision handling; avoid `overflow: hidden` ancestors and use `align` to keep it on screen.
- Item icons should be `TuiIcon`; the item sizes the icon box from `size`.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | With disabled items, the keyboard highlight index (counted over enabled items) is compared against the raw item index, so the highlighted row and the item Enter activates can differ | None yet | Open |
| 2026-09-22 | Default trigger and item buttons have no `type="button"`, so a Dropdown inside a `<form>` submits it when clicked | None yet | Open |
| 2026-09-22 | Highlight is visual only and `--surface-subtle` is nearly invisible on `--surface-card` in light mode; no tests cover Dropdown | None yet | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` backed by control-size tokens; small/medium/large are deprecated aliases |
| Unreleased | 2026-09-21 | feat | Trigger arrow uses the 1-bit ChevronDown icon |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Dropdown.tsx`
