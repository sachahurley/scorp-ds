import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: ['online', 'offline', 'away'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: {
    initials: 'SH',
    size: 'md',
    status: 'online',
  },
};

export const Icon: Story = {
  args: {
    icon: <TuiIcon name="User" size="6" className="text-secondary-600" />,
    size: 'lg',
  },
};

export const Image: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/shapes/svg?seed=scorp',
    alt: 'Avatar illustration',
    size: 'lg',
    status: 'away',
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar initials="S" size="sm" />
      <Avatar initials="S" size="md" />
      <Avatar initials="S" size="lg" />
      <Avatar initials="S" size="xl" />
    </div>
  ),
};
