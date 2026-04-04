import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card } from '@scorp-ds/components';

const meta: Meta<typeof Card> = {
  title: 'Components/Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Account',
    subtitle: 'Manage billing and seats',
    children: (
      <p className="font-mono text-sm text-secondary-600 dark:text-secondary-400">
        Card body copy uses semantic text tokens.
      </p>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Deploy',
    subtitle: 'Production',
    className: 'w-96 flex flex-col',
    children: (
      <p className="font-mono text-sm text-secondary-600 dark:text-secondary-400">
        Ready to ship this release?
      </p>
    ),
    footerContent: (
      <div className="flex gap-2">
        <Button variant="secondary" size="small">
          Cancel
        </Button>
        <Button variant="primary" size="small">
          Deploy
        </Button>
      </div>
    ),
  },
};
