import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn, userEvent } from '@storybook/test';
import { Switch } from '@scorp-ds/components';

const meta: Meta<typeof Switch> = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {
  args: {
    label: 'Notifications',
    checked: false,
    onCheckedChange: fn(),
  },
};

export const On: Story = {
  args: {
    label: 'Notifications',
    checked: true,
    onCheckedChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked',
    disabled: true,
    checked: false,
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: function AllSizesRender() {
    const [a, setA] = useState(true);
    const [b, setB] = useState(true);
    const [c, setC] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <Switch size="sm" label="Small" checked={a} onCheckedChange={setA} />
        <Switch size="md" label="Medium" checked={b} onCheckedChange={setB} />
        <Switch size="lg" label="Large" checked={c} onCheckedChange={setC} />
      </div>
    );
  },
};

/**
 * Keyboard focus. Covers the ring on a track rather than a box.
 *
 * Tab rather than `.focus()`: the recipe is `focus-visible`, which does not match
 * programmatic focus, so a story focusing the control in JS would render no ring
 * at all and still look like passing coverage.
 */
export const Focus: Story = {
  ...Off,
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.focus();
    await userEvent.tab();
  },
};
