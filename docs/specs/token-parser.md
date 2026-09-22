# token-parser

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Token Class | `packages/tokens/src/lib/token-parser.ts` (functions exported from `@scorp-ds/tokens`) |
| Layer | `foundation` |
| Category | `Foundation` |
| File | `packages/tokens/src/lib/token-parser.ts` |
| Story | `Foundation/Colors` (also consumed by `Foundation/Breakpoints`, `Foundation/ZIndex`, `Semantic/Focus`, `Semantic/Opacity`, `Semantic/Elevation`) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

The token parser is the runtime bridge from `tokens.json` (W3C Design Token format) to flat, resolved values. It resolves `{color.amber.500}`-style references, flattens nested groups into CSS custom property names, merges `global` with the `light` or `dark` set, and can emit CSS custom property declarations or a Tailwind color object. Use it when code needs a token's resolved value at runtime, such as Storybook documentation tables and swatches. It does not write `tokens.css`: the shipped stylesheet is hand-maintained (it carries measured contrast ratios and deliberate exceptions such as the dark `field.border` at 1.76:1), so components should keep using CSS variables through Tailwind classes, not the parser.

Every key the parser emits is the CSS custom property name minus the leading `--`. `token-parser.test.ts` asserts that in both directions for both themes: any token in `tokens.json` without a custom property, any custom property without a token, and any value that resolves differently fails the build and is named in the failure message. That test is what keeps the two hand-written files honest.

<!-- /HUMAN-SECTION:intent -->

---

## Token Definitions

<!-- AUTO-START:token-definitions -->

The parser defines no tokens; it reads `packages/tokens/src/tokens.json`. Exported API:

| Token | Type | Raw Value | Base Reference | Doc Comment |
|-------|------|-----------|----------------|-------------|
| `resolveTokenValue(value, context = tokens.global)` | function | `string` in, `string` out | `{path.to.token}` references | Follows references recursively until a literal; returns non-reference strings as-is and unresolvable references unchanged. |
| `flattenTokens(obj, prefix = "", context = tokens.global)` | function | `TokenObject` in, `Record<string, string>` out | `$value` leaves | Joins path segments with `-` and kebab-cases camelCase segments (`zIndex.modal` becomes `z-index-modal`), applies the documented group aliases (`font.lineHeight.*` becomes `line-height-*`), skips `$`-prefixed keys, resolves each value. |
| `getTokensForTheme(theme)` | function | `"light" \| "dark"` | `global` + theme set | Flattened `global` merged with the flattened theme set (theme keys win). 328 keys per theme, one per custom property in `tokens.css`. |
| `generateCSSVariables(theme)` | function | `"light" \| "dark"` | `getTokensForTheme` | Returns `  --key: value;` lines joined with newlines. Not written to disk by any script; `tokens.css` stays hand-written. |
| `generateTailwindColors()` | function | none | `color-*` keys of `global` | Nested color object split on `-` (for example `{ amber: { 500: "#F59E0B" } }`). |
| `getToken(name, theme = "light")` | function | flattened key | `getTokensForTheme` | Single resolved value or `undefined`. Recomputes the full theme map on every call. |
| `getAllTokens()` | function | none | `tokens.json` | Returns the raw token object. |
| `tokens` | const | `tokens.json` | | Raw token data typed as `{ global, light, dark, $themes? }`. |

Source sets: `global` 248 tokens (color 146, font 22, plate 3, spacing 13, breakpoint 5, control 3, button 9, touch 1, focus 2, border 1, switch 15, duration 5, easing 4, zIndex 7, opacity 12); `light` and `dark` 80 each (color 8, accent 1, fire 3, surface 9, elevation 8, text 7, border 6, control 1, field 7, focus 6, button 24). `$themes` lists the Light and Dark set selections.

**Total tokens:** 408 read (248 global + 80 light + 80 dark)

<!-- AUTO-END:token-definitions -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| Token | In Story | Notes |
|-------|----------|-------|
| `getTokensForTheme` | Yes | `Foundation/Colors` swatch values |
| `getToken` | Yes | `Foundation/Breakpoints` (`breakpoint-*`), `Foundation/ZIndex` (`z-index-*`), `Semantic/Focus`, `Semantic/Opacity`, `Semantic/Elevation` (border values) |
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
- Parallel, not generated: `packages/tokens/src/styles/tokens.css`, asserted identical by `packages/tokens/src/lib/token-parser.test.ts`
- `packages/tokens/tailwind.preset.js` reads `global.breakpoint` out of `tokens.json` directly for its `screens`; everything else in the preset is hand-written CSS variable references

<!-- AUTO-END:dependencies -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do import from the barrel (`import { getToken } from '@scorp-ds/tokens'`), not from `lib/token-parser`.
- Do use it for documentation and tooling that must display resolved values.
- Do use the parser's key format: the CSS custom property name without the leading `--` (`z-index-modal`, `line-height-tight`, `easing-ease-in`). It is never the raw JSON path when that path contains camelCase.
- Don't use it inside components to style anything; use CSS variables through Tailwind classes so themes switch without re-rendering.
- Don't hand-write `tokens.css` from `generateCSSVariables` output: the stylesheet's comments (contrast measurements, the deliberate dark `field.border` exception, the inlined Scorp Symbols font face) do not survive a regeneration. Add the declaration by hand and let the drift test check it.
- Don't write references inside larger strings (`rgba({...})`) or reference theme tokens from other theme tokens: only whole-value references to `global` paths resolve.
- Don't call `getToken` in a hot loop; each call rebuilds the whole theme map. Call `getTokensForTheme` once and index it.

<!-- /HUMAN-SECTION:do-dont -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-09-22 | Parser output drifts from `tokens.css`: camelCase JSON segments are not kebab-cased (`zIndex-modal` vs `--z-index-modal`, `font-lineHeight-*` vs `--line-height-*`, `easing-easeIn` vs `--easing-ease-in`); `button-size-*` tokens have no CSS variables; `font-family-mono` resolves to `Fragment Mono` while the CSS stack adds `'Scorp Symbols', ui-monospace, monospace`; `elevation-{1,2,3}-shadow` resolve to box shadows while the CSS ships `none` (documented as intentional in design-tokens.md) | `flattenTokens` now kebab-cases segments and applies one documented alias (`font-line-height-*` to `line-height-*`); `button.size` moved to `global` with `sm`, `md`, `lg` keys and matching `--button-size-*` declarations; `font.family.mono` holds the whole stack; the JSON elevation shadows are `none`, matching the flat TUI treatment the CSS already shipped | Resolved |
| 2026-09-22 | The parser was missing `color-term-*` entirely: the eight ANSI terminal accents existed only in `tokens.css`, with different values per theme (found while writing the drift test) | Added as `color.term.*` in the `light` and `dark` sets of `tokens.json` | Resolved |
| 2026-09-22 | CLAUDE.md says to regenerate CSS vars with `pnpm --filter @scorp-ds/tokens build`, but the tokens package has no `build` script and nothing writes `tokens.css` from the parser | CLAUDE.md's "New Token" steps now say what is true: edit `tokens.json` and `tokens.css` in the same commit, then run `npm test` and let the drift test check the pair. Stale radius and token-group claims in the same section were corrected too | Resolved |
| 2026-09-22 | No unit tests for the parser | `packages/tokens/src/lib/token-parser.test.ts` added to the root vitest run: name and value agreement with `tokens.css` in both directions for both themes (differences are listed by name in the failure), plus naming-contract and reference-resolution cases | Resolved |
| 2026-09-22 | `generateCSSVariables` emits declarations in JSON order, not the grouped, commented order `tokens.css` uses, so its output still cannot be pasted over the stylesheet | None, by design: the stylesheet is hand-written and the drift test, not a generator, is what keeps it correct | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-09-22 | docs | Spec rewritten from source; Notion fields removed |
| Unreleased | 2026-09-22 | fix | Parser emits real CSS custom property names and values: camelCase segments kebab-cased, `font.lineHeight` aliased to `line-height-*`, terminal accents added to `tokens.json`, `button.size` moved to `global` and published as CSS variables, mono stack and flat elevation shadows corrected. New drift test asserts the parser and `tokens.css` agree both ways; `Foundation/ZIndex` moved to the new `z-index-*` keys |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/tokens/src/lib/token-parser.ts`
