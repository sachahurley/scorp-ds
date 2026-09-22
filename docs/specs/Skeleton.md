# Skeleton

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `Skeleton` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/Skeleton.tsx` |
| Story | `Components/Feedback/Skeleton` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Placeholder blocks that hold the layout while content loads. Shapes: text lines (the last of several is 60% wide), rect blocks (plate), avatar squares (plate, control heights). Motion is the Tailwind pulse re-timed to steps(4) so it hops instead of easing; off under prefers-reduced-motion or with `animated={false}`.

Every Skeleton is aria-hidden. Mark the loading region instead: `aria-busy="true"` plus a visually hidden "Loading ..." line, then flip aria-busy off when content renders.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|-----------|-------------|
| `text` | Lines (default) |
| `rect` | Block, size via className |
| `avatar` | Square plate |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | 32px avatar |
| `md` | 40px avatar (default) |
| `lg` | 48px avatar |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `variant` | `text | rect | avatar` | `"text"` | No | Shape |
| `lines` | `number` | `1` | No | Text line count |
| `size` | `sm | md | lg` | `"md"` | No | Avatar size |
| `animated` | `boolean` | `true` | No | Stepped pulse |
| `className` | `string` |  | No | Sizing |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-muted` | Color | semantic | Block fill |
| `--plate-round` | Shape | clip-path | rect / avatar |
| `--control-height-sm/md/lg` | Size | 32/40/48px | Avatar |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| animated / static | `animated + reduced motion` | animate-pulse |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Shapes | Yes | Yes |  |
| Loading region (aria-busy) | Yes | Yes |  |
| Static | Yes | Yes |  |

Interactive controls: Yes (autodocs argTypes)

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

None

### Foundation Files Referenced

`packages/tokens/src/tokens.json` (via the Tailwind preset and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: none (aria-hidden)
- Required labels: Container carries aria-busy and a hidden loading label
- Focus order: Not focusable
- Touch target minimum: N/A
- Color independence: N/A

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

[TODO: add usage guidelines]

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
| v1 | 2026-09-21 | added | Initial Skeleton component, story, and unit tests |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Skeleton.tsx`
