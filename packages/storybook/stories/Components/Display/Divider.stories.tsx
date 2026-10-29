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

/**
 * A `label` gives the labelled form. It fills its parent (here a `w-96` container): each
 * side is a hairline that takes the width left beside the label. `spacing` is margin above
 * and below it, as on the plain rule.
 */
export const WithText: Story = {
  name: 'With label',
  args: {
    label: 'Section',
  },
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
};

/** In a narrow container (`w-48`) the sides shrink to the space beside the label; the rule never runs past the parent. */
export const LabelNarrow: Story = {
  name: 'Label in a narrow container',
  args: {
    label: 'Section',
  },
  render: (args) => (
    <div className="w-48">
      <Divider {...args} />
    </div>
  ),
};

/** A label wider than the row truncates with an ellipsis; each side keeps a short run so the rule stays visible. The full string is still the separator's accessible name. */
export const LabelLong: Story = {
  name: 'Long label',
  args: {
    label: 'This sitting has run its course, the cards are back in the deck',
  },
  render: (args) => (
    <div className="w-64">
      <Divider {...args} />
    </div>
  ),
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
