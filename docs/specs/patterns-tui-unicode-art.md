# Pattern: TUI Unicode & ASCII art

> Pattern spec — string utilities and conventions, not a single React component.  
> Package: `@scorp-ds/tui-art` · Story: `Lab/Tui art playground` · Icons: `Foundation/Unicode icons` + `TuiIcon`.

## Status

| Field | Value |
|-------|-------|
| Widget | `PatternTuiUnicodeArt` |
| Layer | `pattern` |
| Category | `Lab` / `Foundation` |
| File | `packages/tui-art/src/*.ts` |
| Story | `Lab/Tui art playground` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-05 |
| Notion Page | `` |

---

## Intent

Scorp DS is **TUI-inspired**: monospace, borders, and dense status readouts. This pattern defines **which characters are acceptable** for decorative frames and rows, and how **generated strings** should behave so they align in the browser and in terminal-style logs.

**Use `@scorp-ds/tui-art` when** you need programmatic frames (`frameBox`, `frameBoxLines`) or aligned table lines (`formatTableRow`). **Use `TuiIcon`** for single-glyph affordances inside interactive UI.

---

## Approved Unicode blocks (summary)

Prefer characters from these ranges for chrome and ornaments. **Do not** rely on color alone for meaning — pair symbols with text labels (see Accessibility).

| Block | Range | Role |
|-------|--------|------|
| Box Drawing | U+2500–U+257F | Borders, dividers, light/heavy rules |
| Block Elements | U+2580–U+259F | Optional progress / fill (sparingly on web) |
| Geometric Shapes | U+25A0–U+25FF | Bullets / status markers with labels |
| Miscellaneous Symbols | U+2600–U+26FF | Overlaps with icon glyphs; prefer `TuiIcon` names in product UI |
| Arrows | U+2190–U+21FF | Directional cues in monospace layouts |

**ASCII fallback:** When logs must survive 7-bit channels, use `style: 'ascii'` in `@scorp-ds/tui-art` (`+`, `-`, `|`).

Machine-readable copies of block metadata: `TUI_ART_UNICODE_BLOCKS` in `packages/tui-art/src/ranges.ts`.

---

## API (package)

| Export | Role |
|--------|------|
| `frameBox` / `frameBoxLines` | Bordered block with optional title row and body lines |
| `formatTableRow` | Single monospace row with column widths |
| `BOX_CHARS` | Corner/edge characters per `light` / `heavy` / `ascii` |
| `fitToWidth` / `padLine` | Truncate and pad inside a fixed column count |

**Width model:** Options use **JavaScript string length** (UTF-16 code units), not full-width East Asian terminal width. For mostly Latin + box drawing, this matches browser monospace well enough; document exceptions if you add CJK-heavy content.

---

## CLI

From repo root:

```bash
npm run tui-art -- frame --title "Logs" "line one" "line two"
printf '%s\n' "a" "b" | npm run tui-art -- frame --style ascii
```

Optional: `npm run tui-art -- frame @path/to/file.txt` reads lines from a file (leading `@`).

---

## Storybook

- **Foundation / Unicode icons** — full `TuiIcon` registry + static frame sample.
- **Lab / Tui art playground** — live `frameBox` + `formatTableRow` preview.

---

## Accessibility

- Treat multi-line frames as **decorative** unless they convey unique information. In React, wrap decorative `<pre>` output in a container with `aria-hidden="true"` **or** provide a visible text summary for screen readers.
- **Icons and symbols** must not be the only indicator of state; keep adjacent text (`success`, `failed`, etc.).
- Minimum touch targets apply to **controls**, not to raw `<pre>` specimens in docs.

---

## Reference

- `packages/tui-art/src/index.ts`
- `packages/components/src/components/TuiIcon.tsx`
- `packages/storybook/stories/Foundation/UnicodeIcons.stories.tsx`
- `packages/storybook/stories/Lab/TuiArtPlayground.stories.tsx`
