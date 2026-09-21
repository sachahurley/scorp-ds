import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '@scorp-ds/components';

const meta: Meta<typeof Link> = {
  title: 'Components/Navigation/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Inline text link. Always a real anchor (or a router link via `as`/`asProps`), never a button: links navigate, `Button` acts. Don't use this for plate-shaped CTAs, that's `Button` with `href`. The `inline` variant keeps a persistent underline so a link in body text never relies on color alone; `quiet` reserves the underline for hover/focus in nav lists and footers. `external` opens a new tab with the ↗ glyph and a screen-reader notice. There is no disabled state: a link without a destination is just text.",
      },
    },
  },
  argTypes: {
    variant: { control: 'radio', options: ['inline', 'quiet'] },
    external: { control: 'boolean' },
    children: { control: 'text' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Link>;

/** Default treatment: persistent underline inside body text. */
export const InProse: Story = {
  name: 'Inline (in prose)',
  render: () => (
    <p className="max-w-md font-mono text-sm leading-relaxed text-secondary-900 dark:text-secondary-100">
      The token layer is the single source of truth; see the{' '}
      <Link href="#design-tokens">design tokens reference</Link> for every scale, or start from the{' '}
      <Link href="#start-here">Start Here</Link> page.
    </p>
  ),
};

/** Quiet variant: position signals the link, underline appears on hover/focus. */
export const QuietNavList: Story = {
  name: 'Quiet (nav list)',
  render: () => (
    <nav aria-label="Footer" className="flex flex-col gap-2 font-mono text-sm">
      <Link variant="quiet" href="#components">
        Components
      </Link>
      <Link variant="quiet" href="#patterns">
        Patterns
      </Link>
      <Link variant="quiet" href="#tokens">
        Tokens
      </Link>
    </nav>
  ),
};

/** External destinations get the glyph, a new tab, and a screen-reader notice. */
export const External: Story = {
  render: () => (
    <p className="max-w-md font-mono text-sm leading-relaxed text-secondary-900 dark:text-secondary-100">
      The component catalog lives in{' '}
      <Link href="https://storybook.js.org" external>
        Storybook
      </Link>
      .
    </p>
  ),
};

// Playground — single interactive instance with all controls
export const Playground: Story = {
  args: {
    variant: 'inline',
    external: false,
    href: '#playground',
    children: 'Design tokens reference',
  },
};
