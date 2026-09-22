import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider, SideNav, SideNavItem, type TuiIconName } from '@scorp-ds/components';

/**
 * Pattern: the sidebar navigation rail — plate rows on a container surface.
 * Upstreamed from the showcase's Side Navigation pattern page (2026-09-20),
 * which shipped this recipe before the DS documented it. Both live sites
 * (showcase sidebar, portfolio compass) already use it. The recipe now
 * ships as the SideNav component (Components/Navigation/SideNav).
 */
const meta: Meta = {
  title: 'Patterns/SideNavigation',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** — every row is a plate (`plate-round`). Idle rows are quiet secondary text; hover fills the plate with `var(--surface-muted)` and flips the text to `var(--accent)`; the active route simply holds that state (fill + color, never color alone, never weight). Focus is an inset ring — the plate clip swallows outside outlines.\n\n**Theme:** use the Storybook **Theme** toolbar (sun/moon) to preview light and dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

interface NavItem {
  id: string;
  label: string;
  icon: TuiIconName;
}

const TOP_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'Star' },
  { id: 'search', label: 'Search', icon: 'Search' },
];

const SECTION_ITEMS: NavItem[] = [
  { id: 'documents', label: 'Documents', icon: 'FileText' },
  { id: 'shared', label: 'Shared', icon: 'Share2' },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
];

function NavRailDemo() {
  const [active, setActive] = useState('home');

  // SideNavItem owns the row recipe (plate, idle/hover/active, inset focus,
  // aria-current); the pattern only wires routing state.
  const row = (item: NavItem) => (
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
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Side navigation
        </p>

        <SideNav aria-label="Primary">
          {TOP_ITEMS.map(row)}
          {/* Collapsible section: a SideNavItem with children becomes a group
              button with aria-expanded (starts open when it holds the active route) */}
          <SideNavItem icon="Settings" label="Workspace" defaultExpanded>
            {SECTION_ITEMS.map(row)}
          </SideNavItem>
        </SideNav>

        <Divider />
        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Composes: SideNav / SideNavItem (plate-round rows, TuiIcon, surface.container /
          surface.muted / accent tokens). The active route carries aria-current="page" and holds
          the hover state; group rows are buttons with aria-expanded; focus is the inset ring recipe.
        </p>
      </div>
    </div>
  );
}

export const NavigationRail: Story = {
  name: 'Navigation rail',
  render: () => <NavRailDemo />,
};
