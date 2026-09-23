# 3. Draw icons as 1-bit pixel art instead of shipping a font or an icon library

- **Status:** accepted
- **Date:** 2026-09-22 (backfilled; `#34`, `0fc1925`, `#41`)
- **Affects:** `TuiIcon`, every component taking an icon, the glyph audit in CI

## Context

The first icon approach used Unicode box-drawing characters and text glyphs. It failed
in the most basic way: **the same glyph rendered differently on every OS**, because each
fell back to a different system font. A close mark could be a heavy X on one machine and
a multiplication sign on another (`3a5f3a0`).

Icon libraries solve consistency but bring a curved, anti-aliased vocabulary that fights
the pixel grid.

## Decision

Every icon is 1-bit pixel art on a **7x7 grid**, stored as a bitmap in
`TUI_ICON_BITMAPS` and rendered as crisp SVG squares by `TuiIcon`.

One art pixel is 2px at the default size, the same 2px step the plates use, and larger
sizes step in whole pixels so edges never blur. The grid is **odd** so every icon has a
true centre column and 1-pixel lines stay symmetric.

Where a plain-text form is needed (tui-art frames, terminal-style strings),
`TUI_ICON_GLYPHS` carries a Unicode form rendered through the Scorp Symbols face.

## Options rejected

- **Unicode glyphs in the system font.** What was there. Rejected: not reproducible
  across operating systems.
- **Lucide or similar.** Consistent, but curved and anti-aliased; wrong vocabulary, and
  a dependency for something that is part of the identity.
- **An icon font.** Reintroduces font loading and fallback, the exact failure being fixed.

## Consequences

- Adding an icon means drawing a bitmap, not importing one. Deliberate friction: the
  set stays small and on-language.
- `npm run audit:glyphs` runs in CI and fails if any character would fall back to a
  system font.
- Icons carry no colour of their own and inherit `currentColor`.
- An icon used as the whole meaning of a control is decorative to assistive tech, so the
  control needs its own `aria-label`.
