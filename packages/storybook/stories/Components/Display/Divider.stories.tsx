import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@scorp-ds/components';

const meta: Meta<typeof Divider> = {
  title: 'Components/Display/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['horizontal', 'vertical', 'withText'] },
    spacing: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
    className: 'w-80',
  },
};

export const WithText: Story = {
  args: {
    variant: 'withText',
    text: 'Section',
    className: 'w-96',
  },
};

export const Vertical: Story = {
  name: 'Vertical',
  render: () => (
    <div className="flex h-24 items-stretch gap-4">
      <span className="font-mono text-sm">Left</span>
      <Divider variant="vertical" spacing="none" className="self-stretch" />
      <span className="font-mono text-sm">Right</span>
    </div>
  ),
};
