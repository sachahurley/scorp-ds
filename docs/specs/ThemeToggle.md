# ThemeToggle

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `ThemeToggle` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Theme` |
| File | `packages/components/src/components/ThemeToggle.tsx` |
| Story | `Components/Theme/ThemeToggle` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

ThemeToggle is a ready-made light/dark control: a small `Switch` with a 1-bit Moon or Sun icon in the knob and a "Dark" / "Light" label beside it. It reads and writes the theme through `next-themes`, so it only works inside `ThemeProvider` (which defaults to dark, the system's canonical theme, with light as the secondary theme). Drop it into app chrome (header, settings, footer) when users should be able to override the theme. It takes no props; if you need a different label, layout or a three-way light/dark/system choice, build it from `Switch` or `Select` with `useTheme` directly.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`div.flex.items-center.gap-3` containing:

1. `Switch` at `size="sm"` (24x44px track), `checked` when the theme is dark, with a `TuiIcon` (size `"3"`) in the knob: `Moon` when dark, `Sun` when light.
2. A `text-sm font-mono` label: "Dark" or "Light".

Before mount (server render and first client render) it renders a placeholder instead: a 44x24px (`w-11 h-6`) block in `--field-border` plus the word "Theme" in `--text-secondary`, to avoid a hydration mismatch.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single fixed presentation. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| (none) | Always the `sm` Switch. |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| (none) | | | | ThemeToggle takes no props. Theme state comes from `next-themes` `useTheme()`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--border-focus` | Color | `#FBBF24` | Moon icon color (dark theme) |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Sun icon color (light theme); placeholder label |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | "Dark" / "Light" label |
| `--field-border` | Color | light `#968A75`, dark `#474030` | Pre-mount placeholder track |
| `text-sm` | Typography | `14px` | Label |
| Switch tokens | | see `Switch.md` | Track, knob, focus ring, 44px hit area |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Unmounted | first render | Placeholder: `--field-border` block, "Theme" in `--text-secondary` |
| Light | `theme !== "dark"` | Switch off, `Sun` in `--text-secondary`, label "Light" |
| Dark | `theme === "dark"` | Switch on, `Moon` in `--border-focus`, label "Dark" |
| Toggle | Switch `onCheckedChange` | Calls `setTheme("light")` or `setTheme("dark")` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Light / Dark | Yes | Yes | `Default`, driven by the preview's `ThemeProvider`; toggling changes the whole Storybook theme |
| Unmounted placeholder | Yes | No | Only visible before hydration |

Interactive controls: none (no props).

**Coverage:** 50% (1/2)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Placeholder `w-11 h-6` mirrors the `sm` Switch track size by hand; it is square (`rounded-none`) while the real track is plate-clipped.
- Label strings "Dark", "Light", "Theme" and the `aria-label` "Switch to light/dark theme" are hardcoded English.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Switch` (`size="sm"`, `icon`)
- `TuiIcon` (`Moon`, `Sun`)

### Foundation Files Referenced

- `next-themes` (`useTheme`); requires `ThemeProvider` from `packages/components/src/theme/ThemeProvider.tsx`
- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: the `Switch` control (a native button with switch semantics, see `Switch.md`), with `checked` reflecting dark mode.
- Required labels: built in. `aria-label` is "Switch to light theme" or "Switch to dark theme"; the visible "Dark" / "Light" text is not programmatically associated.
- Focus order: a single tab stop (the switch).
- Keyboard: Space / Enter toggle, as provided by `Switch`.
- Touch target minimum: met through Switch's 44px pseudo-element hit area around the 24px track.
- Color independence: the icon (Moon / Sun) and the text label both state the current theme.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do render it inside `ThemeProvider`; without the provider `setTheme` does nothing.
- Do place it once per app, in persistent chrome.
- Don't place a second visible label next to it; it already shows "Dark" / "Light".
- Don't use it to toggle anything other than the color theme; use `Switch`.
- Don't rely on it to expose the system preference: it only offers light and dark (see Known Gaps).

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Its height is the `sm` Switch (24px visual, 44px hit area), so it sits in a header row next to `sm` Buttons and icon buttons.
- In a settings list, place it at the end of a row whose leading text names the setting ("Appearance").
- Wrap consumers in `ThemeProvider` at the app root; the provider sets the `dark` class on `<html>` that `tokens.css` keys off.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Reads `theme` instead of `resolvedTheme`: with `ThemeProvider`'s `enableSystem` and `theme="system"` on a dark OS, the toggle shows "Light" and an unchecked switch while the page is dark | None yet | open |
| 2026-09-22 | No props (no `className`, no label override) and no unit tests | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Knob glyphs use the 1-bit Moon and Sun icons |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/ThemeToggle.tsx`
