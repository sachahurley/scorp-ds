# Avatar

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Avatar` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/Avatar.tsx` |
| Story | `Components/Display/Avatar` |
| Version | `v1` |
| Status | `stable` |
| Last updated | 2026-10-29 |
| API hash | `b0d20ad04fc99fd1` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Avatar is a square plate that represents a person or entity in profiles, comments, identity headers, and team lists. It shows an image when one loads, otherwise initials, otherwise a custom icon, and finally an `@` glyph, so it always renders something. An optional status dot marks presence (online, offline, away). It is display only; wrap it in a link or button when it should navigate.

Don't use this for: a generic icon (use TuiIcon instead) or a status shown on its own (use Badge instead, which pairs the colour with text).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

Relative wrapper sized to the avatar, a `plate-round` content box (`overflow-hidden`, centered content), and an optional square status dot pinned to the bottom-right corner with a 2px border in `--field-background`.

### Variants

| Enum Value | Description |
|-----------|-------------|
| Image | Renders when `src` is set and has not failed; `object-cover`. |
| Initials | Renders when there is no usable image and `initials` is set. |
| Icon | Renders when there is no image or initials and `icon` is set; boxed to the size's icon slot. |
| Default glyph | Fallback `@` character when nothing else is provided. |

Content priority: image, initials, icon, default glyph. A failed image falls back automatically.

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 24px (`w-6 h-6`), `text-xs`, 12px icon, 6px status dot |
| `md` | 40px (`w-10 h-10`), `text-sm`, 20px icon, 8px status dot (default) |
| `lg` | 64px (`w-16 h-16`), `text-lg`, 32px icon, 12px dot inset 4px |
| `xl` | 96px (`w-24 h-24`), `text-2xl`, 48px icon, 16px dot inset 8px |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `src` | `string` | `undefined` | No | Image URL. Falls back to initials, icon, then `@` if it fails to load. |
| `alt` | `string` | none | Yes | Who the avatar shows. Names the image, or the box (`role="img"`) when it renders initials, an icon or the `@` glyph, including after a broken image. `""` marks it decorative: the image gets `alt=""` and the fallback box `aria-hidden`. |
| `initials` | `string` | `undefined` | No | One or two letters shown when there is no usable image. |
| `icon` | `IconSlot \| ReactNode` | `undefined` | No | Icon (a TuiIcon name or an element) shown when there is no image or initials. |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | No | Square size: `sm` 24px, `md` 40px, `lg` 64px, `xl` 96px. |
| `status` | `"online" \| "offline" \| "away"` | `undefined` | No | Presence dot, announced as `Status: {status}`. |
| `className` | `string` | `""` | No | Extra classes on the wrapper. |
| `onError` | `() => void` | `undefined` | No | Called when the image fails to load (after the internal fallback is set). |

Exported type: `AvatarProps`.

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--plate-round` (`plate-round`) | Shape | 6px stepped corner polygon | Content box clip |
| `secondary-200` / `dark:secondary-800` | Color | sepia-200 `#F7F5F2` / sepia-800 `#474030` | Content box fill |
| `secondary-900` / `dark:secondary-50` | Color | sepia-900 `#2B2718` / sepia-50 `#FDFCFB` | Initials text |
| `secondary-700` / `dark:secondary-300` | Color | sepia-700 `#695F4D` / sepia-300 `#F0EBE4` | Custom icon color (inherited) |
| `secondary-900` / `dark:secondary-100` | Color | sepia-900 / sepia-100 `#FCFBFA` | Default `@` glyph |
| `success-600` / `dark:success-500` | Color | green-600 `#16A34A` / green-500 `#22C55E` | `online` dot |
| `secondary-500` / `dark:secondary-600` | Color | sepia-500 `#BFB4A3` / sepia-600 `#968A75` | `offline` dot |
| `warning-600` / `dark:warning-500` | Color | purple-600 `#9333EA` / purple-500 `#A855F7` | `away` dot |
| `--field-background` | Color | `#FFFFFF` light, `#120D09` dark | Status dot border (cutout against the page) |
| `text-xs`, `text-sm`, `text-lg`, `text-2xl` | Typography | 12px, 14px, 18px, 24px | Initials per size |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Content mode | `src`, `initials`, `icon` | Which child renders |
| Image failed | `img` `onError` | Switches to the next fallback, which keeps the `alt` name; calls `onError` |
| Decorative | `alt=""` | Image `alt=""`, fallback box `aria-hidden`; the status dot is still announced |
| Size | `size` | Box, font, icon, dot size and dot inset |
| Presence | `status` | Dot color |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Image | Yes | Yes | `Image` |
| Initials | Yes | Yes | `Initials`, `AllSizes` |
| Icon | Yes | Yes | `Icon` |
| Default `@` glyph | Yes | No | |
| Image error fallback | Yes | Yes | `Image fallback` (an undecodable data URL, so no network; the play function waits for the initials) |
| `sm` / `md` / `lg` / `xl` | Yes | Yes | `AllSizes` (4 items) |
| `online` | Yes | Yes | `Initials` |
| `away` | Yes | Yes | `Image` |
| `offline` | Yes | No | Only via the `status` control |

Interactive controls: `size` (select), `status` (select).

**Coverage:** 83% (10/12, counting each size and status)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Fallback alt text `"Avatar"`, reached only by an untyped caller that omits the required `alt`.
- Default glyph `@`.
- Status label template `Status: {status}` (English).

No raw color, size, or spacing values.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None (consumers may pass `TuiIcon` via `icon`).

### Foundation Files Referenced

- `packages/components/src/lib/size.ts` (`ControlSize`)
- `packages/tokens/src/styles/tokens.css` (`--field-background`)
- `packages/tokens/tailwind.preset.js` (`plate-round` utility, semantic color scales)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: image mode is an `img` with `alt`; initials, icon and default glyph modes make the content box `role="img"` with `aria-label={alt}`, so the letters are not read on their own; the status dot is `role="img"` with `aria-label="Status: {status}"`; the outer wrapper has no role
- Required labels: `alt`, enforced by the type. Pass the person's name, or `""` when the name is printed beside the avatar, which hides the avatar from assistive tech so the name is not read twice
- Focus order: not focusable
- Touch target minimum: not interactive; if wrapped in a link or button, that control must provide 44x44 (the `sm` 24px avatar needs extra hit area)
- Color independence: presence is conveyed to screen readers by the label, but visually only by dot color (all dots share one shape); pair with text where presence matters

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do pass `alt` with the person's name, or `alt=""` when the name is printed beside the avatar.
- Do always pass `initials` alongside `src` so a broken image still identifies the person.
- Do show the person's name next to the avatar; the avatar alone is not a visible label.
- Don't rely on the status dot alone to communicate availability in critical flows.
- Don't round the avatar with `className`; the plate clip is the Scorp shape.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Canonical pairing: Card `headerContent` with `Avatar size="md"` beside a name (`text-base` bold) and a detail line (`text-sm`), as in the Card `WithHeaderContent` story.
- In ListRow leading slots use `sm` or `md`; reserve `lg` and `xl` for profile headers.
- The status dot border uses `--field-background`, so place avatars on card or page surfaces that match it.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Sizes use `w-6` / `w-10` / `w-16` / `w-24` (24/40/64/96px), not the control-height tokens the 2026-09-21 changelog row mentions | None yet | Open |
| 2026-09-22 | Non-image modes have no accessible name; image alt defaults to generic "Avatar" | 2026-10-29: `alt` is required by the type and names the image or the fallback box (`role="img"`); `alt=""` marks a decorative avatar | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-29 | docs | Promoted to `stable`: meets the decision 0026 bar and was reviewed by Sacha |
| Unreleased | 2026-09-21 | feat | Size scale is now `sm | md | lg` | xl (fixed 24/40/64/96px boxes, not control-height tokens); small/medium/large are deprecated aliases |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-10-29 | feat (breaking type) | `alt` is required and names every mode (the fallback box becomes `role="img"`); `alt=""` is decorative and no longer becomes "Avatar". `Image fallback` story added |
| Unreleased | 2026-10-29 | change | Decision 0031 removed the deprecated `small \| medium \| large` size names and their dev warning; `size` takes `sm \| md \| lg \| xl` only. Rendering unchanged |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Avatar.tsx`
