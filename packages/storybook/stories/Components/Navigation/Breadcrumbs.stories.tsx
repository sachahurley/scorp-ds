import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@scorp-ds/components';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Where the current page sits in a hierarchy. A `<nav aria-label="Breadcrumb">` around an ordered list; the last item is the current page (`aria-current="page"`, plain text). Separators are the 1-bit ChevronRight icon, hidden from assistive tech. Set `maxItems` to fold the middle of long trails into an overflow button that expands in place and moves focus to the first revealed link. Items render through `Link`, so router links work via `as` / `asProps`.',
      },
    },
  },
  argTypes: {
    maxItems: { control: { type: 'number', min: 2, max: 8 } },
    itemsBeforeCollapse: { control: { type: 'number', min: 0, max: 4 } },
    itemsAfterCollapse: { control: { type: 'number', min: 1, max: 4 } },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

const trail = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Scorp DS', href: '#scorp' },
  { label: 'Components', href: '#components' },
  { label: 'Navigation', href: '#navigation' },
  { label: 'Breadcrumbs' },
];

/** Full trail; the last item is the current page. */
export const Default: Story = {
  args: { items: trail.slice(0, 4).concat({ label: 'Breadcrumbs' }) },
};

/** Six items folded to three: first item, overflow button, last item. Activate the overflow to expand. */
export const Collapsed: Story = {
  args: { items: trail, maxItems: 3 },
};

/** Keep two items on each side of the overflow. */
export const CollapsedWiderEnds: Story = {
  name: 'Collapsed (2 before, 2 after)',
  args: { items: trail, maxItems: 4, itemsBeforeCollapse: 2, itemsAfterCollapse: 2 },
};

/** Two levels deep: a parent and the current page. */
export const Short: Story = {
  args: { items: [{ label: 'Settings', href: '#settings' }, { label: 'Profile' }] },
};

// Stand-in for a router <Link to="...">: renders an anchor from `to`.
function FakeRouterLink({ to, children, ...rest }: { to: string; children?: ReactNode }) {
  return (
    <a href={to} data-router-link="" {...rest}>
      {children}
    </a>
  );
}

/** Items rendered through a router link component via `as` / `asProps`. */
export const RouterLinks: Story = {
  args: {
    items: [
      { label: 'Home', as: FakeRouterLink, asProps: { to: '#home' } },
      { label: 'Docs', as: FakeRouterLink, asProps: { to: '#docs' } },
      { label: 'Getting started' },
    ],
  },
};
