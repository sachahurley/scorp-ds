import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
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
    alt: 'Sacha Hurley',
    initials: 'SH',
    size: 'md',
    status: 'online',
  },
};

export const Icon: Story = {
  args: {
    alt: 'Build bot',
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

/**
 * An image that fails to load falls back to the initials, still named by `alt`.
 *
 * The `src` is a data URL that is not a valid PNG, so the browser fires `error`
 * without touching the network and the frame is stable. The play function waits
 * for the fallback, so a capture never lands on the broken image.
 */
export const ImageFallback: Story = {
  name: 'Image fallback',
  args: {
    src: 'data:image/png;base64,bm90LWFuLWltYWdl',
    alt: 'Sacha Hurley',
    initials: 'SH',
    size: 'lg',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('SH');
    await expect(canvas.getByRole('img', { name: 'Sacha Hurley' })).toBeInTheDocument();
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar alt="Sacha" initials="S" size="sm" />
      <Avatar alt="Sacha" initials="S" size="md" />
      <Avatar alt="Sacha" initials="S" size="lg" />
      <Avatar alt="Sacha" initials="S" size="xl" />
    </div>
  ),
};
