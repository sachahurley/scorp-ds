import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Alert } from '@scorp-ds/components';

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    title: 'Heads up',
    description: 'Something changed — review before continuing.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Saved',
    description: 'Your changes were stored.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Could not connect',
    description: 'Check your network and try again.',
    onClose: fn(),
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert variant="default" title="Default" description="Neutral message." />
      <Alert variant="success" title="Success" description="Operation completed." />
      <Alert variant="warning" title="Warning" description="Proceed with care." />
      <Alert variant="error" title="Error" description="Something went wrong." />
      <Alert variant="info" title="Info" description="For your information." />
    </div>
  ),
};
