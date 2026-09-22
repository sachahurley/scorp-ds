# TuiIcon

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `TuiIcon` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Display` |
| File | `packages/components/src/components/TuiIcon.tsx` |
| Story | `Components/Display/TuiIcon` |
| Version | `v3` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

TuiIcon is the system's only icon component: 51 names drawn as 1-bit pixel art on a 7x7 grid. Use it for every glyph inside interactive UI (button icons, close marks, chevrons, status markers); use the `TUI_ICON_GLYPHS` text forms only in plain-text contexts such as tui-art frames and terminal strings. Icons are always decorative (`aria-hidden`), so the surrounding control or text must carry the meaning.

Every icon renders identically on every OS. Three layers, decided by Sacha on 2026-09-21:

1. **1-bit icons.** `TuiIcon` renders each name from `TUI_ICON_BITMAPS`: 7x7 pixel art (`#`/`.` rows) drawn as crisp SVG squares. One art pixel is 2px at the default 16px size, matching the plates' 2px step and the portfolio's Urizen 1-bit tiles at scale 2; the art pixel is 1.5/2/2/3/4px for sizes 3/4/5/6/8 (whole pixels everywhere except size 3). The odd grid gives a true center column. Typed `Record<TuiIconName, …>`, so a name without a bitmap is a compile error. (Supersedes a same-day 16px line-drawn set Sacha rejected.)
2. **Scorp Symbols.** `TUI_ICON_GLYPHS` keeps each icon's Unicode text form for plain-text contexts (tui-art frames, terminal strings). Those glyphs render through the Scorp Symbols face, second in `--font-family-mono`: a 5.6 KB subset inlined in `tokens.css`, rescaled onto Fragment Mono's 0.618em cell so box drawing joins and columns align. Built by `packages/tokens/scripts/build-scorp-symbols.py`.
3. **Glyph audit.** `npm run audit:glyphs` (CI, Storybook a11y workflow) asks Chrome which font paints every character the DS renders and fails on any system fallback.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

`<span aria-hidden="true">` (`inline-flex`, centered, `font-mono leading-none select-none`, box size from `size`) containing one `<svg viewBox="0 0 7 7" fill="currentColor" shape-rendering="crispEdges">` with a single `<path>`. The path is precomputed once per icon at module load (`ICON_PATHS`): each horizontal run of `#` in a bitmap row becomes one rect subpath. The art is drawn at `7 x pixel` px and centered in the box, never stretched. An unknown `name` renders a text `?` instead of the SVG.

### Icon set (51 names, keys of `TUI_ICON_GLYPHS`)

Keys are Lucide-compatible component names.

| Group | Names |
|-------|-------|
| Status | `AlertCircle`, `AlertTriangle`, `Check`, `CheckCircle`, `HelpCircle`, `Info`, `X` |
| Navigation | `ArrowLeft`, `ArrowRight`, `ChevronDown`, `ChevronRight`, `ChevronUp`, `ExternalLink`, `LogOut`, `Menu`, `MoreVertical` |
| Actions | `Copy`, `Download`, `Edit`, `Minus`, `Plus`, `Save`, `Search`, `Send`, `Share2`, `Trash2`, `Upload` |
| Objects | `Archive`, `Bell`, `FileText`, `Globe`, `Lock`, `Mail`, `Settings`, `Shield`, `Star`, `Tag`, `User` |
| Visibility / theme | `Eye`, `EyeOff`, `Moon`, `Sun` |
| Media | `Music2`, `Pause`, `Play`, `Repeat`, `Shuffle`, `SkipBack`, `SkipForward`, `Volume2`, `VolumeX` |

`Minus` (U+2212, a full-width 7px horizontal bar on the center row) is the most recent addition, used by Checkbox's indeterminate mark; `Menu` (U+2630) came just before it. Several names share a text form (for example `AlertCircle` / `AlertTriangle` both map to U+26A0, `Download` / `Save` to U+2913), but each has its own bitmap except `ChevronRight` and `Play`, which are identical.

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | Single rendering mode; color comes from `currentColor`. |

### Sizes (`TuiIconSize`)

| Enum Value | Description |
|-----------|-------------|
| `"3"` | 12px box (`w-3 h-3`), 1.5px art pixel, 10.5px art. |
| `"4"` (default) | 16px box (`w-4 h-4`), 2px art pixel, 14px art. |
| `"5"` | 20px box (`w-5 h-5`), 2px art pixel, 14px art. |
| `"6"` | 24px box (`w-6 h-6`), 3px art pixel, 21px art. |
| `"8"` | 32px box (`w-8 h-8`), 4px art pixel, 28px art. |

Each size also sets a text size (`text-xs` to `text-2xl`) that only applies to the `?` fallback.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `name` | `string` | none | Yes | Icon name, a key of `TUI_ICON_GLYPHS`. Typed as `string`, so unknown names compile and render `?`; use `TuiIconName` in your own types. |
| `size` | `TuiIconSize` (`"3" \| "4" \| "5" \| "6" \| "8"`) | `"4"` | No | Box size as a Tailwind size number. An invalid value at runtime falls back to `"4"`. |
| `className` | `string` | none | No | Merged with `cn()`. Use it for color (`text-*`) and margin. |

### Related exports

| Export | Kind | Description |
|--------|------|-------------|
| `TUI_ICON_GLYPHS` | `const` object | Name to Unicode text form, for plain-text contexts and catalogs. |
| `TuiIconName` | type | `keyof typeof TUI_ICON_GLYPHS`. |
| `TuiIconSize` | type | `"3" \| "4" \| "5" \| "6" \| "8"`. |
| `TuiIconProps` | type | Props interface. |
| `TUI_ICON_BITMAPS` | `const` (module export, not re-exported from the package barrel) | `Record<TuiIconName, readonly string[]>`, seven 7-character rows per icon. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `currentColor` | Color | inherited | Icon fill; set color on the parent or via `className` with a semantic class |
| `--font-family-mono` (`font-mono`) | Typography | `'Fragment Mono', 'Scorp Symbols', ui-monospace, monospace` | `?` fallback; Scorp Symbols renders `TUI_ICON_GLYPHS` text forms elsewhere |
| `text-xs` to `text-2xl` | Typography | `12px` to `24px` | `?` fallback size per icon size |
| `w-3` to `w-8` / `h-3` to `h-8` | Spacing | `12px` to `32px` | Icon box |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Known name | `name` in `TUI_ICON_BITMAPS` | SVG bitmap in `currentColor` |
| Unknown name | any other string | Text `?` in the mono font |
| Size | `size` | Box size and art pixel (see Sizes) |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Single icon | Yes | Yes | `Check` (size 4), `ChevronDown` (size 5) |
| Sizes 3 / 4 / 5 / 6 / 8 | Yes | Yes | `Size scale` |
| Common set | Yes | Yes | `Common glyphs` (7 names) |
| Full catalog (all 51 names, glyphs, code points) | Yes | Yes | `Foundation/1-bit icons` > `Catalog` |
| Unknown-name fallback `?` | Yes | No | |

Interactive controls: `name` (text), `size` (select) on the arg-driven stories.

**Coverage:** 80% (4/5)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

- Art pixel sizes (1.5, 2, 2, 3, 4) in `SIZE_MAP`: rendering constants tied to the 7x7 grid, not tokens.
- The bitmaps themselves are data, not styling.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/components/src/lib/utils.ts` (`cn`)
- `packages/tokens/src/styles/tokens.css` (Scorp Symbols `@font-face` block, generated between `SCORP-SYMBOLS:START` / `END`)
- `packages/tokens/scripts/build-scorp-symbols.py` (builds the Scorp Symbols subset)
- `scripts/audit-glyphs.mjs` (`npm run audit:glyphs`: Playwright + Chrome check that no rendered character falls back to a system font)

### Used by

Imported by `Alert`, `Badge`, `Checkbox` (`Check`, `Minus`), `Dropdown`, `Link`, `Modal`, `Select`, `ThemeToggle`, `Toast` (variant icons, `X`). `Button` does not import it but sizes `TuiIcon` children passed as icons.

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none. The wrapper is always `aria-hidden="true"`, and the SVG has no title.
- Required labels: provide them on the parent. Icon-only buttons need `aria-label`; standalone status icons need adjacent text or an sr-only span.
- Focus order: not focusable.
- Touch target minimum: n/a; the containing control must meet 44x44.
- Color independence: icons inherit color and never carry meaning alone; pair with text (Alert, Badge and the stories follow this).

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do type icon names in your own code as `TuiIconName` so typos fail at compile time.
- Do set color with a semantic class on the icon or its parent (`text-[var(--accent)]`, `text-secondary-700`); the art uses `currentColor`.
- Do use the default size `"4"` inside `sm` / `md` controls; step up to `"5"` or `"6"` only when the glyph should fill a larger box.
- Do rebuild Scorp Symbols and run `npm run audit:glyphs` when you add a text glyph anywhere in the DS.
- Don't paste Unicode symbols or emoji into components as icons; add a bitmap to `TUI_ICON_BITMAPS` (and a text form to `TUI_ICON_GLYPHS`).
- Don't scale icons with `w-*` / `h-*` overrides; the art stays at its pixel size and only the box grows. Pick a `size`.
- Don't use an icon as the only indicator of state or as the only content of a control without an `aria-label`.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- `Button` centers React-element icons in a 16/20/24px box (sm/md/lg) but does not resize them; TuiIcon keeps its own `size` (16px by default), so the glyph stays 16px unless you pass a larger size.
- Use size `"3"` for inline suffixes next to `text-sm` / `text-base` text (`Link` external glyph, `ListRow` `titleSuffix`).
- To add an icon: add the Lucide-style key and Unicode text form to `TUI_ICON_GLYPHS`, a 7x7 bitmap to `TUI_ICON_BITMAPS` (the `Record` type forces it), add the code point to the Scorp Symbols build if the glyph is new, then run `npm run audit:glyphs`. New names appear in the `Foundation/1-bit icons` catalog automatically.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-21 | `size` typed as `string`, typos compiled | Typed as `TuiIconSize` ("3" | "4" | "5" | "6" | "8"), exported | Resolved |
| 2026-09-21 | `X` glyph (U+2717 ✗) is not in Fragment Mono; it fell back to a per-OS system font and rendered as a slanted hand-drawn tick in close buttons. | `X` is now drawn as inline SVG (square-cap strokes, currentColor) via `DRAWN_ICONS`; `TUI_ICON_GLYPHS.X` keeps the in-font `×` as a text-only fallback. | Resolved |
| 2026-09-21 | 45 of 49 glyphs are not in Fragment Mono and render in fallback system fonts (Menlo, Apple Symbols, STIX Two Math on macOS; different fonts elsewhere), so icon appearance varies by OS. | All three: icons drawn as SVG; Scorp Symbols face for text glyphs; `audit:glyphs` in CI. Root cause also included Google Fonts' subsets dropping glyphs Fragment Mono has (→ ↗ ▼ ▲ ▶ ✓). | Resolved |
| 2026-09-22 | `name` is still typed `string`, so unknown names compile and render `?`; size `"3"` uses a 1.5px art pixel, which can blur edges on 1x displays | None yet | open |
| 2026-09-22 | `ChevronRight` and `Play` have identical bitmaps; no unit tests for TuiIcon | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-21 | feat | Added `Minus` (7x7 horizontal bar, text form U+2212); Scorp Symbols rebuilt. 51 icons |
| Unreleased | 2026-09-21 | feat | Added Menu (three bars, U+2630); Scorp Symbols face rebuilt so the glyph audit passes. 50 icons |
| Unreleased | 2026-09-21 | fix | `size` typed as `TuiIconSize` |
| v3 | 2026-09-21 | feat | Icons redrawn as 1-bit 7x7 pixel art (`TUI_ICON_BITMAPS`), replacing the line-drawn set. |
| v2 | 2026-09-21 | feat | All 49 icons drawn as SVG (`TUI_ICON_DRAWINGS`); text forms render via the Scorp Symbols face; glyph audit in CI. |
| v1.1 | 2026-09-21 | fix | `X` renders as a drawn SVG close mark instead of the fallback-font ✗ glyph. |
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/TuiIcon.tsx`
