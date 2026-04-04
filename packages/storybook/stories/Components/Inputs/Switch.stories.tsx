import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fn } from '@storybook/test';
import { Switch } from '@scorp-ds/components';

const meta: Meta<typeof Switch> = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
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
        <Switch size="small" label="Small" checked={a} onCheckedChange={setA} />
        <Switch size="medium" label="Medium" checked={b} onCheckedChange={setB} />
        <Switch size="large" label="Large" checked={c} onCheckedChange={setC} />
      </div>
    );
  },
};
