import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Button, Card } from '@scorp-ds/components';

const meta: Meta<typeof Card> = {
  title: 'Components/Display/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'inline-radio', options: ['block', 'flex'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Account',
    subtitle: 'Manage billing and seats',
    children: (
      <p className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
        Card body copy uses semantic text tokens.
      </p>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Deploy',
    subtitle: 'Production',
    layout: 'flex',
    className: 'w-96',
    children: (
      <p className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
        Ready to ship this release?
      </p>
    ),
    footerContent: (
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Deploy
        </Button>
      </div>
    ),
  },
};

/**
 * `headerContent` replaces the title/subtitle block with arbitrary content.
 * The canonical use is an identity header: Avatar beside a name and a quiet
 * detail line. Upstreamed from the showcase's profile card (2026-09-20).
 */
export const WithHeaderContent: Story = {
  args: {
    className: 'w-96',
    headerContent: (
      <div className="flex items-center gap-4">
        <Avatar initials="AJ" size="md" />
        <div>
          <h3 className="font-mono text-base font-bold text-[var(--text-primary)]">
            Alex Johnson
          </h3>
          <p className="font-mono text-sm text-secondary-800 dark:text-secondary-300">
            alex.johnson@example.com
          </p>
        </div>
      </div>
    ),
    children: (
      <p className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
        Body copy sits under the identity header; fields or activity go here.
      </p>
    ),
    footerContent: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Reset
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Save changes
        </Button>
      </div>
    ),
  },
};

/**
 * A bare Card (no header, no footer) as a flex column: `layout="flex"` makes
 * the quote fill the available height so the attribution locks to the bottom
 * behind a hairline. Upstreamed from the showcase's testimonial cards
 * (2026-09-20); the layout used to be inferred from the `className` string,
 * which also fired on `inline-flex`, `flex-1` and `flex-wrap`.
 */
export const Testimonial: Story = {
  render: () => (
    <Card layout="flex" className="h-72 w-96">
      <figure className="flex min-h-0 flex-1 flex-col">
        <blockquote className="flex-1 font-mono text-base leading-relaxed text-[var(--text-primary)]">
          The token-based approach means we can iterate quickly while keeping
          every surface consistent. Exactly what we needed.
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-4 border-t-[0.5px] border-solid border-[var(--surface-container-stroke)] pt-4">
          <Avatar initials="MC" size="md" />
          <div className="min-w-0">
            <p className="font-mono text-sm font-bold text-[var(--text-primary)]">Michael Chen</p>
            <p className="font-mono text-xs text-secondary-700 dark:text-secondary-400">
              Frontend Lead · Tech Startup Inc.
            </p>
          </div>
        </figcaption>
      </figure>
    </Card>
  ),
};
