# EmptyState

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `EmptyState` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Feedback` |
| File | `packages/components/src/components/EmptyState.tsx` |
| Story | `Components/Feedback/EmptyState` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

What a view shows when it has nothing to show: a 1-bit icon on a subtle plate, a plain title, a short description, and at most one primary and one secondary Button. `sm` for inline use in cards and tables, `md` for a page or panel. Blocking errors belong in Alert.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|-----------|-------------|
| `with actions` | primaryAction / secondaryAction |
| `title only` | no description or actions |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `sm` | Inline: icon 24px, text-sm title, py-6 |
| `md` | Page: icon 32px, text-lg title, py-12 (default) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `icon` | `TuiIconName | null` | `"Archive"` | No | Icon above the title |
| `title` | `ReactNode` |  | Yes | Situation |
| `description` | `ReactNode` |  | No | Why / what to do |
| `primaryAction` | `EmptyStateAction` |  | No | { label, onClick?, href?, icon? } as a primary Button |
| `secondaryAction` | `EmptyStateAction` |  | No | Secondary Button |
| `size` | `sm | md` | `"md"` | No | Inline vs page |
| `titleAs` | `h2 | h3 | h4 | p` | `"h2"` | No | Heading level |
| `children` | `ReactNode` |  | No | Extra content under actions |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-subtle` | Color | semantic | Icon plate |
| `--text-primary` | Color | semantic | Title |
| `--text-secondary` | Color | semantic | Description, icon |
| `--plate-round` | Shape | clip-path | Icon plate |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| with / without actions | `primaryAction, secondaryAction` | Button tokens |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| No results | Yes | Yes |  |
| Title only | Yes | Yes |  |
| Inline (sm) | Yes | Yes |  |

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

Button, TuiIcon

### Foundation Files Referenced

`packages/tokens/src/tokens.json` (via the Tailwind preset and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: heading (titleAs) + buttons
- Required labels: Buttons carry their label text
- Focus order: Actions in reading order
- Touch target minimum: Buttons meet 44px via their hit area
- Color independence: Title text carries meaning; icon is decorative

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
| v1 | 2026-09-21 | added | Initial EmptyState component, story, and unit tests |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/EmptyState.tsx`
