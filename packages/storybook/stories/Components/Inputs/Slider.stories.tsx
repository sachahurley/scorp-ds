import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from '@storybook/test';
import { useState } from 'react';
import { Slider } from '@scorp-ds/components';

/**
 * Components / Inputs / Slider
 *
 * Styled native range input: a `--control-track` rail with an `--accent`
 * fill before the thumb, a solid accent thumb, sharp corners, and a 44px-tall
 * pointer target. Keyboard arrows, min/max/step and form participation come
 * from the native control underneath.
 *
 * The slider is full width and takes its size from its container, so wrap it
 * (or pass a width in `className`) to constrain it.
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

/**
 * Width comes from the container: the slider fills whatever box it is given,
 * so the same control works in a 256px settings column and a 512px panel.
 */
export const Widths: Story = {
  name: 'Container widths',
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-64">
        <Slider label="Narrow (w-64)" min={0} max={100} defaultValue={25} />
      </div>
      <div className="w-[32rem]">
        <Slider label="Wide (w-128)" min={0} max={100} defaultValue={75} />
      </div>
    </div>
  ),
};

/**
 * Keyboard focus. Covers the ring on the slider row, which carries it instead of the thumb.
 *
 * Tab rather than `.focus()`: the recipe is `focus-visible`, which does not match
 * programmatic focus, so a story focusing the control in JS would render no ring
 * at all and still look like passing coverage.
 */
export const Focus: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.focus();
    await userEvent.tab();
  },
};
