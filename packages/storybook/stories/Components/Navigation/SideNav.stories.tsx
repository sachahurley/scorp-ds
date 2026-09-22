import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button, SideNav, SideNavItem, SideNavSection, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof SideNav> = {
  title: 'Components/Navigation/SideNav',
  component: SideNav,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Navigation rail (the Patterns/SideNavigation recipe as a component). Compound API: `SideNav` > `SideNavSection` (optional heading that names the group) > `SideNavItem` (icon, label, `active`, `href` / `onClick` / `as`). Items with nested `SideNavItem` children become collapsible groups with `aria-expanded`; a group starts open when it holds the active item. The active row holds the hover state (fill + accent) and carries `aria-current="page"`. `collapsed` shrinks the rail to icon-only rows named by `aria-label`, with the label in a Tooltip.',
      },
    },
  },
  argTypes: {
    collapsed: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SideNav>;

function Rail({ collapsed = false }: { collapsed?: boolean }) {
  const [active, setActive] = useState('home');
  const item = (id: string) => ({
    active: active === id,
    href: `#${id}`,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setActive(id);
    },
  });
  return (
    <SideNav aria-label="Primary" collapsed={collapsed}>
      <SideNavSection>
        <SideNavItem icon="Star" label="Home" {...item('home')} />
        <SideNavItem icon="Search" label="Search" {...item('search')} />
        <SideNavItem
          icon="Mail"
          label="Inbox"
          trailing={<Badge size="sm">12</Badge>}
          {...item('inbox')}
        />
      </SideNavSection>
      <SideNavSection heading="Workspace">
        <SideNavItem icon="FileText" label="Documents" {...item('documents')} />
        <SideNavItem icon="Settings" label="Settings">
          <SideNavItem icon="User" label="Profile" {...item('profile')} />
          <SideNavItem icon="Lock" label="Security" {...item('security')} />
        </SideNavItem>
        <SideNavItem icon="Archive" label="Archive" {...item('archive')} />
      </SideNavSection>
    </SideNav>
  );
}

/** Sections, a nested group, and a count badge. Click rows to move the active route. */
export const Default: Story = {
  render: (args) => <Rail collapsed={args.collapsed} />,
};

/** The active route inside a group: the group opens automatically. */
export const ActiveInGroup: Story = {
  name: 'Active item inside a group',
  render: () => (
    <SideNav aria-label="Settings navigation">
      <SideNavItem icon="Star" label="Overview" href="#overview" />
      <SideNavItem icon="Settings" label="Settings">
        <SideNavItem label="Profile" href="#profile" />
        <SideNavItem label="Security" href="#security" active />
        <SideNavItem label="Billing" href="#billing" />
      </SideNavItem>
    </SideNav>
  ),
};

/** Icon-only rail. Hover or focus a row for its tooltip; names come from `aria-label`. */
export const Collapsed: Story = {
  render: () => <Rail collapsed />,
};

/** A toggle between the full and icon-only rail. */
export const ToggleCollapsed: Story = {
  name: 'Toggle collapsed',
  render: () => {
    const Demo = () => {
      const [collapsed, setCollapsed] = useState(false);
      return (
        <div className="flex flex-col items-start gap-3">
          <Button
            variant="secondary"
            size="sm"
            aria-pressed={collapsed}
            iconLeft={<TuiIcon name="Menu" />}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? 'Expand rail' : 'Collapse rail'}
          </Button>
          <Rail collapsed={collapsed} />
        </div>
      );
    };
    return <Demo />;
  },
};

/** Rows with `onClick` only render as buttons (in-app views without URLs). */
export const ButtonRows: Story = {
  name: 'Button rows (onClick)',
  render: () => {
    const Demo = () => {
      const [view, setView] = useState('list');
      return (
        <SideNav aria-label="Views">
          {['list', 'board', 'calendar'].map((v) => (
            <SideNavItem
              key={v}
              icon={v === 'list' ? 'FileText' : v === 'board' ? 'Copy' : 'Bell'}
              label={v[0].toUpperCase() + v.slice(1)}
              active={view === v}
              onClick={() => setView(v)}
            />
          ))}
        </SideNav>
      );
    };
    return <Demo />;
  },
};
