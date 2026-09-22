# token-parser

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Token Class | `packages/tokens/src/lib/token-parser.ts` (functions exported from `@scorp-ds/tokens`) |
| Layer | `foundation` |
| Category | `Foundation` |
| File | `packages/tokens/src/lib/token-parser.ts` |
| Story | `Foundation/Colors` (also consumed by `Foundation/ZIndex`, `Semantic/Focus`, `Semantic/Opacity`, `Semantic/Elevation`) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

The token parser is the runtime bridge from `tokens.json` (W3C Design Token format) to flat, resolved values. It resolves `{color.amber.500}`-style references, flattens nested groups into hyphenated keys, merges `global` with the `light` or `dark` set, and can emit CSS custom property declarations or a Tailwind color object. Use it when code needs a token's resolved value at runtime, such as Storybook documentation tables and swatches. It does not write `tokens.css`: the shipped stylesheet and the Tailwind preset are maintained separately, so components should keep using CSS variables through Tailwind classes, not the parser.

<!-- /HUMAN-SECTION:intent -->

---

## Token Definitions

<!-- AUTO-START:token-definitions -->

The parser defines no tokens; it reads `packages/tokens/src/tokens.json`. Exported API:

| Token | Type | Raw Value | Base Reference | Doc Comment |
|-------|------|-----------|----------------|-------------|
| `resolveTokenValue(value, context = tokens.global)` | function | `string` in, `string` out | `{path.to.token}` references | Follows references recursively until a literal; returns non-reference strings as-is and unresolvable references unchanged. |
| `flattenTokens(obj, prefix = "", context = tokens.global)` | function | `TokenObject` in, `Record<string, string>` out | `$value` leaves | Joins path segments with `-` (for example `color-amber-500`), skips `$`-prefixed keys, resolves each value. |
| `getTokensForTheme(theme)` | function | `"light" \| "dark"` | `global` + theme set | Flattened `global` merged with the flattened theme set (theme keys win). 298 keys per theme. |
| `generateCSSVariables(theme)` | function | `"light" \| "dark"` | `getTokensForTheme` | Returns `  --key: value;` lines joined with newlines. Not written to disk by any script. |
| `generateTailwindColors()` | function | none | `color-*` keys of `global` | Nested color object split on `-` (for example `{ amber: { 500: "#F59E0B" } }`). |
| `getToken(name, theme = "light")` | function | flattened key | `getTokensForTheme` | Single resolved value or `undefined`. Recomputes the full theme map on every call. |
| `getAllTokens()` | function | none | `tokens.json` | Returns the raw token object. |
| `tokens` | const | `tokens.json` | | Raw token data typed as `{ global, light, dark, $themes? }`. |

Source sets: `global` 218 tokens (color 146, font 22, plate 3, spacing 13, control 3, touch 1, focus 2, duration 5, easing 4, zIndex 7, opacity 12); `light` and `dark` 80 each (accent 1, fire 3, surface 9, elevation 8, text 7, border 6, field 7, focus 6, button 33). `$themes` lists the Light and Dark set selections.

**Total tokens:** 378 read (218 global + 80 light + 80 dark)

<!-- AUTO-END:token-definitions -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| Token | In Story | Notes |
|-------|----------|-------|
| `getTokensForTheme` | Yes | `Foundation/Colors` swatch values |
| `getToken` | Yes | `Foundation/ZIndex` (uses `zIndex-*` parser keys), `Semantic/Focus`, `Semantic/Opacity`, `Semantic/Elevation` (border values) |
| `resolveTokenValue`, `flattenTokens` | Indirect | Used by the two functions above |
| `generateCSSVariables` | No | No consumer in the repo |
| `generateTailwindColors` | No | No consumer; `tailwind.preset.js` is hand-written with CSS variables |
| `getAllTokens` / `tokens` | No | |

**Coverage:** 50% (4/8)

<!-- AUTO-END:storybook -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Foundation Files Referenced

- `packages/tokens/src/tokens.json` (only input, imported as JSON)
- Re-exported by `packages/tokens/src/index.ts`
- Parallel, not generated: `packages/tokens/src/styles/tokens.css` and `packages/tokens/tailwind.preset.js`

<!-- AUTO-END:dependencies -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do import from the barrel (`import { getToken } from '@scorp-ds/tokens'`), not from `lib/token-parser`.
- Do use it for documentation and tooling that must display resolved values.
- Do use the parser's key format: hyphen-joined JSON paths, camelCase segments preserved (`zIndex-modal`, `font-lineHeight-tight`, `easing-easeIn`).
- Don't use it inside components to style anything; use CSS variables through Tailwind classes so themes switch without re-rendering.
- Don't assume `generateCSSVariables` output matches `tokens.css`; see Known Gaps.
- Don't write references inside larger strings (`rgba({...})`) or reference theme tokens from other theme tokens: only whole-value references to `global` paths resolve.
- Don't call `getToken` in a hot loop; each call rebuilds the whole theme map. Call `getTokensForTheme` once and index it.

<!-- /HUMAN-SECTION:do-dont -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Parser output drifts from `tokens.css`: camelCase JSON segments are not kebab-cased (`zIndex-modal` vs `--z-index-modal`, `font-lineHeight-*` vs `--line-height-*`, `easing-easeIn` vs `--easing-ease-in`); `button-size-*` tokens have no CSS variables; `font-family-mono` resolves to `Fragment Mono` while the CSS stack adds `'Scorp Symbols', ui-monospace, monospace`; `elevation-{1,2,3}-shadow` resolve to box shadows while the CSS ships `none` (documented as intentional in design-tokens.md) | None yet; `tokens.css` is maintained separately | open |
| 2026-09-22 | CLAUDE.md says to regenerate CSS vars with `pnpm --filter @scorp-ds/tokens build`, but the tokens package has no `build` script and nothing writes `tokens.css` from the parser | None yet | open |
| 2026-09-22 | No unit tests for the parser | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/tokens/src/lib/token-parser.ts`
