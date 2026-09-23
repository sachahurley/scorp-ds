# TreeView

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `TreeView` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Terminal` |
| File | `packages/components/src/components/TreeView.tsx` |
| Story | `Components/Terminal/TreeView` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `56b8f36b2aba3ab1` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

TREE VIEW COMPONENT

Hierarchical list with expandable branches (file trees, outlines). Implements
the WAI-ARIA tree pattern: `role="tree"` / `treeitem` / `group`,
`aria-expanded` on branches, `aria-level` / `aria-setsize` / `aria-posinset` on
every node, and `aria-selected` for a single selection. One tab stop with
roving focus.

Keyboard: Up/Down move, Right expands or enters a branch, Left collapses or goes
to the parent, Home/End, Enter selects and fires `onActivate`, Space selects,
printable keys type-ahead. Clicking a row selects it (and toggles branches).
Disclosure icons are the 1-bit ChevronRight / ChevronDown. `expanded` and
`selected` are each controlled or uncontrolled.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| (single) | Rows with optional icons; selected row holds the muted fill + accent text |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (single) | Rows are `min-h-touch` (44px); indent step `spacing.4` per level |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `nodes` | `TreeNode[]` | - | Yes | `{ id, label, textValue?, icon?, children?, disabled? }`. |
| `aria-label` / `aria-labelledby` | `string` | - | One of | Tree name. |
| `expanded` / `defaultExpanded` / `onExpandedChange` | `string[]` / `string[]` / `fn` | `[]` | No | Open branches. |
| `selected` / `defaultSelected` / `onSelectedChange` | `string \| null` / same / `fn` | `null` | No | Selection. |
| `onActivate` | `(id) => void` | - | No | Enter or leaf click. |
| `typeahead` | `boolean` | `true` | No | Printable-key search. |
| `className` | `string` | - | No | Root classes. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `surface.muted` | color | theme | Hover and selected fill |
| `accent` | color | theme | Selected text |
| `text.primary` / `text.secondary` | color | theme | Labels / disclosure icons |
| `plate.round`, focus inset ring, `duration.fast` | shape / focus / motion | - | Rows |
| `touch.target`, `spacing.4` | size | 44px / 16px | Row height, indent |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Expanded / collapsed | `expanded` | `aria-expanded`, chevron |
| Selected | `selected` | Muted fill + accent, `aria-selected` |
| Focused | roving focus | Inset ring on the row |
| Disabled | `node.disabled` | `aria-disabled`, 50% opacity, not selectable |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Collapsed | Yes | Yes |  |
| Without icons | Yes | Yes |  |
| Controlled | Yes | Yes |  |

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

- TuiIcon

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `tree` / `treeitem` / `group`
- Required labels: `aria-label` or `aria-labelledby`
- Focus order: single tab stop (focused, else selected, else first node)
- Touch target minimum: 44px rows
- Color independence: selection is a filled plate plus `aria-selected`

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep ids unique across the whole tree.
- Do pass `textValue` when labels are not plain strings.
- Don't use a tree for flat lists.

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

`packages/components/src/components/TreeView.tsx`
