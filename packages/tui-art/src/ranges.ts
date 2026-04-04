/**
 * Documented Unicode blocks aligned with `docs/specs/patterns-tui-unicode-art.md`.
 * Use for tooling, lint allowlists, or designer reference — not exhaustive of Unicode.
 */

export const TUI_ART_UNICODE_BLOCKS = [
  {
    name: 'Box Drawing',
    rangeStart: 0x2500,
    rangeEnd: 0x257f,
    note: 'Primary borders, rules, and light/heavy T-junctions.',
  },
  {
    name: 'Block Elements',
    rangeStart: 0x2580,
    rangeEnd: 0x259f,
    note: 'Optional progress / fill blocks (use sparingly in web TUI).',
  },
  {
    name: 'Geometric Shapes',
    rangeStart: 0x25a0,
    rangeEnd: 0x25ff,
    note: 'Small bullets and status diamonds when paired with text labels.',
  },
  {
    name: 'Miscellaneous Symbols',
    rangeStart: 0x2600,
    rangeEnd: 0x26ff,
    note: 'Weather, gear, warning — overlaps with icon glyphs; prefer TuiIcon names in UI.',
  },
  {
    name: 'Arrows',
    rangeStart: 0x2190,
    rangeEnd: 0x21ff,
    note: 'Directional cues in monospace layouts.',
  },
] as const;
