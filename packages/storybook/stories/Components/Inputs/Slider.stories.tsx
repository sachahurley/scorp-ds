import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from '@scorp-ds/components';

/**
 * Components / Inputs / Slider
 *
 * Styled native range input: muted track, solid accent thumb, sharp
 * corners. Keyboard arrows, min/max/step and form participation come from
 * the native control underneath.
 */
const meta: Meta<typeof Slider> = {
  title: 'Components/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: function SliderDemo() {
    const [value, setValue] = useState(4);
    return (
      <div className="w-64">
        <Slider
          label={`Zoom · ${value}x`}
          min={2}
          max={8}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Ink bias', min: 0, max: 100, defaultValue: 40, disabled: true },
  render: (args) => (
    <div className="w-64">
      <Slider {...args} />
    </div>
  ),
};
