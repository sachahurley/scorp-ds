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
| Last updated | 2026-10-29 |
| API hash | `e68f0d1f6c81ab7b` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

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

Data states use the same prop names as `TableBody`: `loading` while the nodes
are on their way, `emptyState` for when there are none.

Don't use this for: site or app navigation (use SideNav instead) or a few collapsible content sections (use Accordion instead).

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

### Data states

- **Loading** (`loading`): the `<ul role="tree">` keeps its name and gains `aria-busy="true"`. Its children are three `<li role="none">` rows, each wrapping an `aria-hidden` row the height of a real row (`min-h-touch`), with a chevron-wide spacer and a one-line `Skeleton` at 60%, 40% and 50% width so they read as labels. No treeitem, so no tab stop while loading.
- **Empty** (`emptyState`, `nodes` is `[]`, not loading): the tree element is replaced by a `<div role="group">` carrying the tree's `aria-label` or `aria-labelledby` and `className`, with the `emptyState` content inside.
- **Empty with no `emptyState`**: renders nothing (`null`).

### Why the empty state replaces the tree

A `tree` must own at least one `treeitem` or `group` (ARIA required owned elements); an empty one is invalid, and axe reports it under `aria-required-children`. Putting the empty content inside the tree would make it worse: a paragraph and a Button are not treeitems, and a screen reader in tree mode would announce "Files, tree, 0 items" and then content it cannot navigate with the tree keys. So the empty content takes the tree's place. It sits in a `role="group"` with the tree's name so the reader still hears what is empty ("Files, group, No files yet") rather than an orphan sentence, and the empty state's own Button is an ordinary tab stop.

Loading keeps the tree, because `aria-busy="true"` is the ARIA-sanctioned way to say "this tree's items are on their way": a busy tree may be empty, and the Skeleton rows are hidden from assistive tech.

### Why the default is nothing

TreeView cannot tell "there are no nodes" from "the nodes have not arrived yet", so with no `emptyState` it does not render a message that may be untrue (a generic "Empty" would flash on every load). It renders nothing rather than the invalid empty tree. A caller who knows the tree is empty says so with `emptyState`; a caller who is still loading says so with `loading`.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `nodes` | `TreeNode[]` | - | Yes | `{ id, label, textValue?, icon?, children?, disabled? }`. |
| `aria-label` / `aria-labelledby` | `string` | - | One of the two (enforced by the type) | Tree name. `aria-labelledby` points at a visible heading. |
| `expanded` / `defaultExpanded` / `onExpandedChange` | `string[]` / `string[]` / `fn` | `[]` | No | Open branches. |
| `selected` / `defaultSelected` / `onSelectedChange` | `string \| null` / same / `fn` | `null` | No | Selection. |
| `onActivate` | `(id) => void` | - | No | Enter or leaf click. |
| `typeahead` | `boolean` | `true` | No | Printable-key search. |
| `loading` | `boolean` | `false` | No | Three Skeleton rows replace the nodes and the tree gets `aria-busy`. Wins over `emptyState` and over `nodes`. |
| `emptyState` | `ReactNode` | none | No | Rendered in place of the tree, in a `role="group"` with the tree's name, when `nodes` is empty. A sentence, or `EmptyState size="sm"` with `titleAs="p"`. Without it an empty tree renders nothing. Ignored while `loading`. |
| `className` | `string` | - | No | Root classes. |

`TreeViewProps` is `TreeViewOwnProps & ({ "aria-label" } | { "aria-labelledby" })`: a tree with neither does not type-check. The generated manifest lists both as optional, because it reads the props shared by every member of the union.

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
| `surface.muted` (via `Skeleton`) | color | theme | Loading placeholder fill |

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
| Loading | `loading` | Skeleton rows (`--surface-muted`), `aria-busy` on the tree |
| Empty | `emptyState` with `nodes={[]}` | Replaces the tree with a named `role="group"`; the content brings its own tokens |
| Error | Not built in | Render an `Alert` above the tree, or pass an `EmptyState` describing the failure as `emptyState` |

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
| Loading | Yes | Yes | `Loading` (3 Skeleton rows, `aria-busy`) |
| Empty | Yes | Yes | `Empty` (composes `EmptyState size="sm"`) |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (6/6)

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
- Skeleton (loading rows)
- `EmptyState` is not imported: callers pass it as `emptyState` content.

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `tree` / `treeitem` / `group`
- Required labels: `aria-label` or `aria-labelledby`, enforced by the type
- Focus order: single tab stop (focused, else selected, else first node)
- Touch target minimum: 44px rows
- Color independence: selection is a filled plate plus `aria-selected`
- Loading: the tree gets `aria-busy="true"` and the Skeleton rows are `role="none"` with `aria-hidden` content, so a reader is not read placeholder rows and the busy tree is valid with no treeitems. Flip `loading` off when the nodes render so `aria-busy` clears. If the wait needs announcing, say so in a live region.
- Empty: no `role="tree"` is rendered, because a tree with no treeitems is invalid. The empty content sits in a `role="group"` carrying the tree's name, read in document order; give `EmptyState` `titleAs="p"` (or a heading level that fits the page outline).

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do keep ids unique across the whole tree.
- Do pass `textValue` when labels are not plain strings.
- Don't use a tree for flat lists.
- Do pass `loading` while the nodes load and `emptyState` once you know there are none, instead of swapping the tree for a spinner or a hand-built message.
- Don't pass `emptyState` text that claims emptiness while the data is still loading: set `loading` until it arrives.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- `EmptyState size="sm"` with `titleAs="p"` is the empty-state content for a tree: icon, one-line title, a reason, and at most one next step (`primaryAction` "Add a file" for a first-run tree, `secondaryAction` "Clear filters" for a filtered one).
- `className` applies to the empty group as well as the tree, so a tree sized with `w-72` (as in the stories) keeps its width when it empties.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-29 | The tree name was documented as required but typed as optional, so an unnamed tree type-checked | The type requires `aria-label` or `aria-labelledby` | Resolved |
| 2026-10-29 | An empty `nodes` array renders an empty `role="tree"` list: nothing visible, no focusable node, and no empty state | `emptyState` renders in place of the tree, in a `role="group"` with the tree's name; with no `emptyState` an empty tree renders nothing. `loading` added alongside (Skeleton rows, `aria-busy`). Tested in `TreeViewStates.test.tsx`, with `Loading` and `Empty` stories | Resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-09-21 | added | Initial component (terminal batch, ds-nav-terminal) |
| Unreleased | 2026-10-29 | feat (breaking type) | Accessible name required by the type (`aria-label` or `aria-labelledby`). `TreeViewProps` is now a type alias |
| Unreleased | 2026-10-29 | feat | `loading` and `emptyState` (additive, same names as `TableBody`). An empty tree no longer renders an empty `role="tree"`: it renders `emptyState` in a named group, or nothing |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/TreeView.tsx`
