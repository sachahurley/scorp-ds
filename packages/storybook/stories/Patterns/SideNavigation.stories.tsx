import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@scorp-ds/components';
import { SideNavigationRail } from '../../presets/sideNavigation';

/**
 * Pattern: the sidebar navigation rail, plate rows on a container surface.
 * Upstreamed from the showcase's Side Navigation pattern page (2026-09-20),
 * which shipped this recipe before the DS documented it. Both live sites
 * (showcase sidebar, portfolio compass) already use it. The recipe now
 * ships as the SideNav component (Components/Navigation/SideNav); the rail
 * lives in `presets/sideNavigation.tsx` and this story is the page shell.
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

function NavRailDemo() {
  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Side navigation
        </p>

        <SideNavigationRail />

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
