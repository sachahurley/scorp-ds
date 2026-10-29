import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@scorp-ds/components';

const meta: Meta<typeof Divider> = {
  title: 'Components/Display/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
    spacing: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    // Deprecated aliases for orientation and label (decision 0024): they still work, so keep them out of the controls.
    variant: { table: { disable: true } },
    text: { table: { disable: true } },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-80',
  },
};

/** A `label` gives the labelled form. `spacing` is margin above and below it, as on the plain rule. */
export const WithText: Story = {
  name: 'With label',
  args: {
    label: 'Section',
    className: 'w-96',
  },
};

export const Vertical: Story = {
  name: 'Vertical',
  render: () => (
    <div className="flex h-24 items-stretch gap-4">
      <span className="font-mono text-sm">Left</span>
      <Divider orientation="vertical" spacing="none" className="self-stretch" />
      <span className="font-mono text-sm">Right</span>
    </div>
  ),
};
