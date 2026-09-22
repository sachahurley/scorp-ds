# SideNav

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Component | `SideNav` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Navigation` |
| File | `packages/components/src/components/SideNav.tsx` |
| Story | `Components/Navigation/SideNav` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-09-22 |
| API hash | `f1a6e02641d4c4e3` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

SIDE NAV COMPONENT (navigation rail)

The Patterns/SideNavigation recipe as a compound component: `SideNav` >
`SideNavSection` (optional heading naming a group) > `SideNavItem`. Rows are
plates: idle rows are secondary text, hover fills with surface.muted and flips
to the accent, and the active route holds that state (fill + color, never color
alone, never weight) with `aria-current="page"`.

A `SideNavItem` with nested items is a collapsible group (button with
`aria-expanded` / `aria-controls`) that starts open when it holds the active
item. `collapsed` shrinks the rail to icon-only rows named by `aria-label`, with
the label in a Tooltip; section headings become screen-reader only.

The Patterns/SideNavigation and Patterns/WorkbenchSplit stories now compose it.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

### Variants

| Enum Value | Description |
|------------|-------------|
| expanded rail | Icon + label rows, 16rem wide |
| collapsed rail | Icon-only rows with tooltips |

### Sizes

| Enum Value | Description |
|------------|-------------|
| (single) | Rows are `min-h-touch` (44px) |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `SideNav.aria-label` | `string` | - | Recommended | Landmark name, e.g. "Primary". |
| `SideNav.collapsed` | `boolean` | `false` | No | Icon-only rail. |
| `SideNavSection.heading` | `ReactNode` | - | No | Group heading (names the group). |
| `SideNavItem.label` | `string` | - | Yes | Row text; accessible name when collapsed. |
| `SideNavItem.icon` | `TuiIconName` | - | No | 1-bit icon. |
| `SideNavItem.active` | `boolean` | `false` | No | Current route: fill + `aria-current`. |
| `SideNavItem.href` / `onClick` / `as` + `asProps` | - | - | No | Anchor, button, or router link. |
| `SideNavItem.trailing` | `ReactNode` | - | No | Row-end slot (Badge, Kbd). |
| `SideNavItem.children` | `SideNavItem[]` | - | No | Makes the row a collapsible group. |
| `SideNavItem.expanded` / `defaultExpanded` / `onExpandedChange` | `boolean` / `boolean` / `fn` | open if holds active | No | Group state. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|----------------|-------|
| `surface.container` | color | theme | Rail fill |
| `border.hairline` | color | theme | Rail edge |
| `surface.muted` | color | theme | Hover and active row fill |
| `accent` | color | amber 700 light / gold dark | Hover and active row text |
| `text.secondary` | color | theme | Idle rows, section headings |
| `plate.round`, focus inset ring, `duration.fast`, `touch.target` | shape / focus / motion / size | - | Rows |

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|-----------------|---------------|-----------------|
| Idle | default | text.secondary |
| Hover | :hover | surface.muted fill, accent text |
| Active | `active` | Holds hover state + `aria-current` |
| Group open / closed | `expanded` | `aria-expanded`, ChevronDown / ChevronRight |
| Collapsed | `collapsed` | Icon-only, tooltip, `aria-label` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|-----------------|---------|--------------|-------|
| Default | Yes | Yes |  |
| Active item inside a group | Yes | Yes |  |
| Collapsed | Yes | Yes |  |
| Toggle collapsed | Yes | Yes |  |
| Button rows (onClick) | Yes | Yes |  |

Interactive controls: Yes (autodocs)

**Coverage:** 100% (5/5)

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

- Tooltip
- TuiIcon

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css` (via Tailwind preset classes and CSS variables)

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `navigation` landmark; sections are named `group`s; rows are links or buttons
- Required labels: landmark name; collapsed rows get `aria-label`
- Focus order: document order; group toggles reveal children after the toggle
- Touch target minimum: 44px row height
- Color independence: active row is a filled plate plus `aria-current`

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do give every item an icon if you offer the collapsed rail.
- Do mark exactly one item `active`.
- Don't nest groups more than one level deep.

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
| v1 | 2026-09-21 | added | Initial component (navigation batch, ds-nav-terminal) |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/SideNav.tsx`
