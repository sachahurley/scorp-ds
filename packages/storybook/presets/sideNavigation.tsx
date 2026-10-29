import { useState } from 'react';
import { SideNav, SideNavItem, type TuiIconName } from '@scorp-ds/components';

/** One route in the navigation rail: a stable id, the visible label and its 1-bit icon. */
export interface NavigationRailItem {
  /** Route id; also the `href` fragment and the active-state key. */
  id: string;
  /** Visible row label, which is also the link's accessible name. */
  label: string;
  /** Icon shown before the label. */
  icon: TuiIconName;
}

/** Top-level routes of the specimen rail. */
export const navigationRailTopItems: NavigationRailItem[] = [
  { id: 'home', label: 'Home', icon: 'Star' },
  { id: 'search', label: 'Search', icon: 'Search' },
];

/** Routes inside the collapsible "Workspace" group of the specimen rail. */
export const navigationRailSectionItems: NavigationRailItem[] = [
  { id: 'documents', label: 'Documents', icon: 'FileText' },
  { id: 'shared', label: 'Shared', icon: 'Share2' },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
];

/**
 * Side navigation preset: the sidebar rail, a `SideNav` landmark holding top-level
 * `SideNavItem` links and one collapsible group. SideNavItem owns the row recipe
 * (plate, idle / hover / active, inset focus, `aria-current="page"`); the preset only
 * wires the routing state, which is what product code replaces with its router.
 *
 * A `SideNavItem` with children becomes a group button with `aria-expanded`; give it
 * `defaultExpanded` when it holds the active route. Name the landmark with
 * `aria-label` ("Primary") so it is distinct from the header's navigation.
 *
 * Consumed by `Patterns/SideNavigation`. The showcase sidebar and the portfolio
 * compass use the same row recipe, not this preset; if a consumer renders the
 * preset itself, vendor this file with it.
 *
 * @example
 * <SideNavigationRail />
 */
export function SideNavigationRail() {
  const [active, setActive] = useState('home');

  const row = (item: NavigationRailItem) => (
    <SideNavItem
      key={item.id}
      icon={item.icon}
      label={item.label}
      href={`#${item.id}`}
      active={active === item.id}
      onClick={(e) => {
        e.preventDefault();
        setActive(item.id);
      }}
    />
  );

  return (
    <SideNav aria-label="Primary">
      {navigationRailTopItems.map(row)}
      {/* Collapsible section: a SideNavItem with children becomes a group
          button with aria-expanded (starts open when it holds the active route) */}
      <SideNavItem icon="Settings" label="Workspace" defaultExpanded>
        {navigationRailSectionItems.map(row)}
      </SideNavItem>
    </SideNav>
  );
}
