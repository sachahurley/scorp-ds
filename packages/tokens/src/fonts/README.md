# Scorp Symbols

The glyphs browsers never receive from Fragment Mono, rescaled onto its
0.618em cell. Inlined into `src/styles/tokens.css` as a base64 `@font-face`
(so vendored copies carry it with no asset paths) and listed second in
`--font-family-mono`, so it only ever paints characters Fragment lacks.

Why it exists: Fragment Mono has no box-drawing, block, or most symbol
glyphs, and Google Fonts' subsets drop a few it does have (→ ↗ ▼ ▲ ▶ ✓).
Each missing glyph otherwise falls back to a per-OS system font whose
advance width differs, so icons vary by platform and tui-art frames break.

- `ScorpSymbols.woff2`: the built face (reference copy of the inlined data).
- `licenses/`: SIL OFL 1.1 (Fragment Mono, Noto Sans Symbols 2, Noto Sans
  Math) and the Bitstream Vera license (DejaVu Sans Mono). The face is
  renamed per those licenses' terms.

Rebuild (after `npm run audit:glyphs` flags a new glyph):

    python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip install fonttools brotli
    /tmp/fontenv/bin/python packages/tokens/scripts/build-scorp-symbols.py
