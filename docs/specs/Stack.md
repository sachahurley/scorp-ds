# Stack

> Primitive spec — layout helper. Last synced 2026-04-05.

## Status

| Field | Value |
|-------|-------|
| Widget | `ScorpStack` |
| Layer | `primitive` |
| Category | `Layout` |
| File | `packages/components/src/primitives/Stack.tsx` |
| Story | `Primitives/Layout/Stack` |
| Version | `v1` |
| Status | `draft` |
| Last synced | 2026-04-05 |
| Notion Page | `` |

---

## Intent

<!-- HUMAN-SECTION:intent -->

Vertical or horizontal flex layout with **token-backed gap** (`gap-*` utilities). Use inside screens and compound components instead of one-off `flex` + arbitrary gap values.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|-----------|-------------|
| *(axis)* | `vertical` (default) — column; `horizontal` — row with wrap |

### Sizes (gap)

| Enum Value | Maps to |
|-----------|---------|
| `none` | `gap-0` |
| `1`–`8` | Tailwind `gap-{n}` on the 4px scale |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | — | Yes | Child elements |
| `gap` | `StackGap` | `4` | No | Spacing between children |
| `axis` | `"vertical" \| "horizontal"` | `vertical` | No | Layout direction |
| `className` | `string` | `""` | No | Extra Tailwind / utility classes |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| Spacing scale | spacing | 4px base unit | `gap-*` utilities |

<!-- AUTO-END:tokens -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Vertical | Yes | Yes | Default story |
| Horizontal | Yes | Yes | `Horizontal` story |

**Coverage:** High for primitive scope.

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None — uses Tailwind gap utilities tied to the design scale.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

None.

### Foundation Files Referenced

`packages/tokens` (implicit via Tailwind preset)

<!-- AUTO-END:dependencies -->

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
| v1 | 2026-04-04 | spec-created | Initial primitive spec |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/primitives/Stack.tsx`
