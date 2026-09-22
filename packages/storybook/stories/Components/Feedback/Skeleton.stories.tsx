import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@scorp-ds/components';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'rect', 'avatar'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    lines: { control: { type: 'number', min: 1, max: 8 } },
    animated: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Placeholders are `aria-hidden`. Mark the loading region instead: `aria-busy="true"` plus a visually hidden "Loading ..." line, then flip `aria-busy` off when the content renders.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Skeleton {...args} />
    </div>
  ),
  args: { variant: 'text', lines: 3 },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-end gap-3">
        <Skeleton variant="avatar" size="sm" />
        <Skeleton variant="avatar" size="md" />
        <Skeleton variant="avatar" size="lg" />
      </div>
      <Skeleton variant="rect" className="h-32" />
      <Skeleton lines={2} />
    </div>
  ),
};

/** The documented loading-region pattern: the container is busy and named; the blocks are hidden. */
export const LoadingCard: Story = {
  name: 'Loading region (aria-busy)',
  render: () => (
    <section aria-busy="true" aria-label="Profile" className="flex w-80 gap-3">
      <span className="sr-only">Loading profile</span>
      <Skeleton variant="avatar" size="lg" />
      <div className="flex-1 pt-1">
        <Skeleton lines={3} />
      </div>
    </section>
  ),
};

/** `animated={false}` for screens with many placeholders. */
export const Static: Story = {
  render: Default.render,
  args: { variant: 'text', lines: 4, animated: false },
};
