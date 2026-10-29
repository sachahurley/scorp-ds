# Pattern: Side navigation

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/SideNavigation` (preset `SideNavigationRail`, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/presets/sideNavigation.tsx` (story shell: `packages/storybook/stories/Patterns/SideNavigation.stories.tsx`) |
| Story | `Patterns/SideNavigation` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

The sidebar navigation rail of an app: a `SideNav` landmark holding top-level route links and one collapsible group of routes. Every row is a plate; the active route holds the hover state (fill and accent text, never color alone, never weight). The recipe first shipped on the showcase's Side Navigation page and in the portfolio compass, and now ships as the `SideNav` component; this pattern shows it composed with routing state.

Don't use this for: the top bar of an app (use `AppHeader` instead), switching between views of one page (use `Tabs` instead), a trail to the current page (use `Breadcrumbs` instead), or a list of files or buffers inside a tool pane (use the WorkbenchSplit pattern instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is `SideNavigationRail` in `presets/sideNavigation.tsx`; the story only adds the page shell (`--surface-page`, `p-6 md:p-10`, a `max-w-3xl` column, the eyebrow line, a `Divider` and the footnote).

| Building block | Role |
|----------------|------|
| `SideNav` | The `<nav>` landmark on the container surface, `aria-label="Primary"` so it is distinct from the header's navigation. |
| `SideNavItem` (links) | One per route from `navigationRailTopItems` (Home, Search) and `navigationRailSectionItems` (Documents, Shared, Archive): `icon`, `label`, `href="#<id>"`, `active` when it is the current route. The specimen's `onClick` prevents navigation and sets the active id; product code passes its router link through `as` instead. |
| `SideNavItem` (group) | "Workspace" with the `Settings` icon and the section items as children, so it renders a group button with `aria-expanded`; `defaultExpanded` because it holds routes that can be active. |
| `TuiIcon` | Row icons (`Star`, `Search`, `Settings`, `FileText`, `Share2`, `Archive`), drawn by SideNavItem. |

---

## Storybook

- **NavigationRail** ("Navigation rail"): fullscreen story; Home starts active.
- **Theme:** Storybook **Theme** toolbar (sun/moon) for light/dark.
- **Test-runner:** included in `npm run test-storybook:ci` (axe, both themes).

---

## Accessibility notes

- The rail is a `<nav>` named "Primary"; give every `nav` on a page its own name.
- The active route carries `aria-current="page"` and a filled plate, so it is never shown by color alone.
- The group row is a `<button>` with `aria-expanded` and `aria-controls`.
- Keyboard: Tab moves through the rows; Enter follows a link; Enter or Space opens and closes the group. Focus is the inset ring recipe, because the plate clip would cut an outside outline.
- Rows are `min-h-touch` (44px).

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-29 | The pattern does not show the rail's `collapsed` (icon-only) state, which SideNav supports, or what the rail becomes on a narrow screen; neither SideNav nor this pattern defines mobile behaviour | None yet | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-10-29 | added | Spec written from source; the rail moved to the `SideNavigationRail` preset with its route data; no rendered change (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/sideNavigation.tsx`, `packages/storybook/stories/Patterns/SideNavigation.stories.tsx`
