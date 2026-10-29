import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Alert } from '@scorp-ds/components';

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'error'],
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
    tone: 'success',
    title: 'Saved',
    description: 'Your changes were stored.',
  },
};

export const Error: Story = {
  args: {
    tone: 'error',
    title: 'Could not connect',
    description: 'Check your network and try again.',
    onDismiss: fn(),
  },
};

// The export keeps its old name: it is the story id the visual baselines are keyed by.
export const AllVariants: Story = {
  name: 'All tones',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert tone="neutral" title="Default" description="Neutral message." />
      <Alert tone="success" title="Success" description="Operation completed." />
      <Alert tone="warning" title="Warning" description="Proceed with care." />
      <Alert tone="error" title="Error" description="Something went wrong." />
      <Alert tone="info" title="Info" description="For your information." />
    </div>
  ),
};
