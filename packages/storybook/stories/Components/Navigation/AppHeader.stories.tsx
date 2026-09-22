import type { Meta, StoryObj } from '@storybook/react';
import { AppHeader, Avatar, Button, Link, ThemeToggle, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof AppHeader> = {
  title: 'Components/Navigation/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Top bar with three slots: `brand` (left), `navigation` (middle, wrapped in a named `<nav>`), and `actions` (right, always visible). Below `md` the navigation folds behind a menu toggle (1-bit Menu icon, `aria-expanded` + `aria-controls`) that opens a panel under the bar. `sticky` pins the bar on the `z-index.sticky` layer. Use the viewport toolbar (mobile) to see the menu toggle.',
      },
    },
  },
  argTypes: {
    sticky: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

const brand = (
  <Link href="#home" variant="quiet" className="inline-flex min-h-touch items-center gap-2 font-bold text-[var(--text-primary)]">
    <TuiIcon name="Star" />
    scorp
  </Link>
);

const nav = (
  <>
    <Link href="#docs" variant="quiet" className="inline-flex min-h-touch items-center">
      Docs
    </Link>
    <Link href="#components" variant="quiet" className="inline-flex min-h-touch items-center" aria-current="page">
      Components
    </Link>
    <Link href="#patterns" variant="quiet" className="inline-flex min-h-touch items-center">
      Patterns
    </Link>
  </>
);

/** Brand, navigation, and actions. Narrow the viewport to see the menu toggle. */
export const Default: Story = {
  args: {
    brand,
    navigation: nav,
    actions: <ThemeToggle />,
  },
};

/** Sticky over scrolling content (scroll the canvas). */
export const Sticky: Story = {
  args: { brand, navigation: nav, actions: <ThemeToggle />, sticky: true },
  render: (args) => (
    <div className="h-96 overflow-auto bg-[var(--surface-page)]" tabIndex={0} aria-label="Scrolling page">
      <AppHeader {...args} />
      <div className="space-y-3 p-6 font-mono text-sm text-[var(--text-primary)]">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>line {i + 1}: the header stays pinned while this content scrolls.</p>
        ))}
      </div>
    </div>
  ),
};

/** Mobile menu opened (the panel shows below `md`; widen the viewport and it hides). */
export const MobileMenuOpen: Story = {
  name: 'Mobile menu open',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: { brand, navigation: nav, actions: <ThemeToggle />, defaultMenuOpen: true },
};

/** Richer actions slot: search button and an avatar. */
export const WithActions: Story = {
  args: {
    brand,
    navigation: nav,
    actions: (
      <>
        <Button variant="ghost" size="lg" aria-label="Search">
          <TuiIcon name="Search" size="5" />
        </Button>
        <Avatar initials="SH" size="sm" />
      </>
    ),
  },
};

/** Brand and actions only (no navigation, so no menu toggle). */
export const BrandOnly: Story = {
  args: { brand, actions: <ThemeToggle /> },
};
