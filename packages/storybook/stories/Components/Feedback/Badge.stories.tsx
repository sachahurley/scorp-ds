import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Badge, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Label' },
};

export const Primary: Story = {
  args: { variant: 'primary', children: 'New' },
};

export const WithIcon: Story = {
  args: {
    variant: 'success',
    children: 'Synced',
    iconLeft: <TuiIcon name="Check" size="4" />,
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    children: 'Filter on',
    onClose: fn(),
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};
