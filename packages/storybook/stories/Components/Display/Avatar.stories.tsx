import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', 'xl'] },
    status: { control: 'select', options: ['online', 'offline', 'away'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: {
    initials: 'SH',
    size: 'medium',
    status: 'online',
  },
};

export const Icon: Story = {
  args: {
    icon: <TuiIcon name="User" size="6" className="text-secondary-600" />,
    size: 'large',
  },
};

export const Image: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/shapes/svg?seed=scorp',
    alt: 'Avatar illustration',
    size: 'large',
    status: 'away',
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar initials="S" size="small" />
      <Avatar initials="S" size="medium" />
      <Avatar initials="S" size="large" />
      <Avatar initials="S" size="xl" />
    </div>
  ),
};
