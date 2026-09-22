# DescriptionList

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `DescriptionList` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/DescriptionList.tsx` |
| Story | `Components/Terminal/DescriptionList` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

DESCRIPTION LIST COMPONENT (key / value)

Term and value pairs on a real `<dl>`: metadata panels, config readouts,
neofetch-style summaries. Each pair is a `<div>` holding one `<dt>` and one
`<dd>`.

`layout="inline"` (default) puts term and value on one row with the value
right-aligned; `leader` draws a dotted rule between them as a pseudo-element on
the term (no extra nodes in the list). `layout="stacked"` puts a small uppercase
term above each value.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| `inline` | One row per pair, value right-aligned |
| `inline` + `leader` | Dotted leader between term and value |
| `stacked` | Term above value |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (single) | `text-sm` values; stacked terms `text-xs` |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `items` | `DescriptionListItem[]` | - | Yes | `{ term, description, key? }`. |
| `layout` | `"inline" \| "stacked"` | `"inline"` | No | Row or stacked pairs. |
| `leader` | `boolean` | `false` | No | Dotted leader (inline only). |
| `className` | `string` | - | No | Extra classes on `<dl>`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `text.secondary` | color | theme | Terms |
| `text.primary` | color | theme | Values |
| `surface.container-stroke` | color | theme | Dotted leader |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| (static) | - | - |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Leader | Yes | Yes |  |
| Stacked | Yes | Yes |  |
| RichValues | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (4/4)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

No hardcoded values found.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `dl` with `div` > `dt` + `dd` groups
- Required labels: N/A
- Focus order: only interactive values
- Touch target minimum: N/A
- Color independence: terms and values differ by position, not only color

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep terms short.
- Do switch to `stacked` for long values or narrow panes.
- Don't use it for tabular data with more than two columns (use Table).

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

[TODO: define how this component behaves with others]

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial component (terminal batch, ds-nav-terminal) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/DescriptionList.tsx`
