# Pattern: TUI Unicode & ASCII art

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

String utilities and conventions, not a single React component. Package: `@scorp-ds/tui-art` · Story: `Lab/Tui art playground` · Icons: `Foundation/1-bit icons` + `TuiIcon`.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Lab/Tui art playground` (package `@scorp-ds/tui-art`, no React) |
| Layer | `pattern` |
| Category | `Lab` |
| File | `packages/tui-art/src/index.ts` (plus `box.ts`, `frame.ts`, `row.ts`, `text.ts`, `ranges.ts`, `cli.ts`) |
| Story | `Lab/Tui art playground` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Scorp DS is TUI-inspired: monospace, borders, and dense status readouts. This pattern defines which characters are acceptable for decorative frames and rows, and how generated strings should behave so they align in the browser and in terminal-style logs. Use `@scorp-ds/tui-art` when you need programmatic frames (`frameBox`, `frameBoxLines`) or aligned table lines (`formatTableRow`) as plain strings, in the browser, a CLI or server logs. Use `TuiIcon` for single-glyph affordances inside interactive UI, and the `Table` component for real tabular data in React.

<!-- /HUMAN-SECTION:intent -->

---

## Approved Unicode blocks (summary)

Prefer characters from these ranges for chrome and ornaments. **Do not** rely on color alone for meaning: pair symbols with text labels (see Accessibility).

| Block | Range | Role |
|-------|--------|------|
| Box Drawing | U+2500 to U+257F | Borders, dividers, light/heavy rules |
| Block Elements | U+2580 to U+259F | Optional progress / fill (sparingly on web) |
| Geometric Shapes | U+25A0 to U+25FF | Bullets / status markers with labels |
| Miscellaneous Symbols | U+2600 to U+26FF | Overlaps with icon glyphs; prefer `TuiIcon` names in product UI |
| Arrows | U+2190 to U+21FF | Directional cues in monospace layouts |

**ASCII fallback:** When logs must survive 7-bit channels, use `style: 'ascii'` in `@scorp-ds/tui-art` (`+`, `-`, `|`).

**Rendering in the browser:** Fragment Mono lacks box drawing, block elements and most symbols, so the Scorp Symbols face (second in `--font-family-mono`, inlined in `tokens.css`) supplies them, rescaled onto Fragment Mono's cell so frames join and columns align. It covers the full Box Drawing and Block Elements blocks plus the `TUI_ICON_GLYPHS` text forms, not every character in the other approved blocks. `npm run audit:glyphs` fails CI if any character the DS renders falls back to a system font; if you add a new symbol, add it to `packages/tokens/scripts/build-scorp-symbols.py` and rebuild.

Machine-readable copies of block metadata: `TUI_ART_UNICODE_BLOCKS` in `packages/tui-art/src/ranges.ts`.

---

## API (package)

| Export | Role |
|--------|------|
| `frameBox` / `frameBoxLines` | Bordered block with optional title row (plus a tee separator) and body lines. Options: `lines`, `title?`, `width?` (outer columns, minimum 4, default longest line + 2), `style?` (default `light`), `truncateMarker?` (default U+2026). Embedded newlines in `lines` are split. `frameBox` joins with `\n`. |
| `formatTableRow` | One row `│ a │ b │` with per-column content widths; missing widths default to 1; `dense` drops the inner spaces. Overflow is truncated with U+2026. |
| `BOX_CHARS` | Corner, edge and tee characters per `BoxStyle` (`light` / `heavy` / `ascii`) |
| `fitToWidth` / `padLine` | Truncate with an ellipsis / right-pad with spaces to a fixed column count |
| `TUI_ART_UNICODE_BLOCKS` | The approved-block table above as data |
| Types | `BoxStyle`, `BoxChars`, `FrameBoxOptions`, `FormatTableRowOptions` |

**Width model:** Options use **JavaScript string length** (UTF-16 code units), not full-width East Asian terminal width. For mostly Latin + box drawing, this matches browser monospace well enough; document exceptions if you add CJK-heavy content.

---

## CLI

From repo root:

```bash
npm run tui-art -- frame --title "Logs" "line one" "line two"
printf '%s\n' "a" "b" | npm run tui-art -- frame --style ascii
```

Optional: `npm run tui-art -- frame @path/to/file.txt` reads lines from a file (leading `@`). Flags: `--title`, `--width <n>` (4 or more), `--style light|heavy|ascii`; `frame` is the only command. Runs through `tsx packages/tui-art/src/cli.ts`.

---

## Storybook

- **Foundation / 1-bit icons**: full `TuiIcon` registry plus a static line-art sample.
- **Lab / Tui art playground**: live `frameBox` and `formatTableRow` preview with title, body, width, style and dense controls.
- **Tests:** `packages/tui-art/src/frame.test.ts` and `row.test.ts`.

---

## Accessibility

- Treat multi-line frames as **decorative** unless they convey unique information. In React, wrap decorative `<pre>` output in a container with `aria-hidden="true"` **or** provide a visible text summary for screen readers.
- **Icons and symbols** must not be the only indicator of state; keep adjacent text (`success`, `failed`, etc.).
- Minimum touch targets apply to **controls**, not to raw `<pre>` specimens in docs.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Width is measured in UTF-16 code units, so astral-plane symbols and East Asian wide characters misalign frames | Documented in the width model; no display-width support yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference

- `packages/tui-art/src/index.ts`
- `packages/components/src/components/TuiIcon.tsx`
- `packages/storybook/stories/Foundation/OneBitIcons.stories.tsx`
- `packages/storybook/stories/Lab/TuiArtPlayground.stories.tsx`
