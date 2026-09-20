import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider, TuiIcon, type TuiIconName } from '@scorp-ds/components';

/**
 * Pattern: the sidebar navigation rail — plate rows on a container surface.
 * Upstreamed from the showcase's Side Navigation pattern page (2026-09-20),
 * which shipped this recipe before the DS documented it. Both live sites
 * (showcase sidebar, portfolio compass) already use it.
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

// One recipe for every row; active holds the hover state.
const ROW =
  'flex w-full items-center gap-3 px-3 py-2 plate-round font-mono text-sm ' +
  'transition-colors [transition-duration:var(--duration-fast)] ' +
  'focus:outline-none focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]';
const ROW_IDLE =
  'text-secondary-800 dark:text-secondary-500 hover:bg-[var(--surface-muted)] hover:text-[var(--accent)]';
const ROW_ACTIVE = 'bg-[var(--surface-muted)] text-[var(--accent)]';

interface NavItem {
  label: string;
  icon: TuiIconName;
}

const TOP_ITEMS: NavItem[] = [
  { label: 'Home', icon: 'Star' },
  { label: 'Search', icon: 'Search' },
];

const SECTION_ITEMS: NavItem[] = [
  { label: 'Documents', icon: 'FileText' },
  { label: 'Shared', icon: 'Share2' },
  { label: 'Archive', icon: 'Archive' },
];

function NavRailDemo() {
  const [active, setActive] = useState('Home');
  const [sectionOpen, setSectionOpen] = useState(true);

  const row = (item: NavItem, indent = false) => (
    <li key={item.label}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActive(item.label);
        }}
        aria-current={active === item.label ? 'page' : undefined}
        className={`${ROW} ${active === item.label ? ROW_ACTIVE : ROW_IDLE} ${indent ? 'ml-6' : ''}`}
      >
        <TuiIcon name={item.icon} />
        <span>{item.label}</span>
      </a>
    </li>
  );

  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Side navigation
        </p>

        <nav
          aria-label="Primary"
          className="w-64 border border-[var(--border-hairline)] bg-[var(--surface-container)] p-4"
        >
          <ul className="space-y-2">
            {TOP_ITEMS.map((item) => row(item))}

            {/* Collapsible section: the header is a row too, with a chevron */}
            <li>
              <button
                type="button"
                onClick={() => setSectionOpen((v) => !v)}
                aria-expanded={sectionOpen}
                className={`${ROW} ${ROW_IDLE}`}
              >
                <TuiIcon name="Settings" />
                <span>Workspace</span>
                <span className="ml-auto">
                  <TuiIcon name={sectionOpen ? 'ChevronUp' : 'ChevronDown'} />
                </span>
              </button>
              {sectionOpen && (
                <ul className="mt-2 space-y-2">
                  {SECTION_ITEMS.map((item) => row(item, true))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <Divider />
        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Composes: plate-round rows, TuiIcon, surface.container / surface.muted / accent tokens.
          The active route carries aria-current="page" and holds the hover state; section headers
          are buttons with aria-expanded; focus is the inset ring recipe.
        </p>
      </div>
    </div>
  );
}

export const NavigationRail: Story = {
  name: 'Navigation rail',
  render: () => <NavRailDemo />,
};
