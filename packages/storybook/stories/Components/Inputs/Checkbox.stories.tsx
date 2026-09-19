import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Checkbox } from '@scorp-ds/components';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    label: 'Accept terms',
    onCheckedChange: fn(),
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribed',
    defaultChecked: true,
    onCheckedChange: fn(),
  },
};

export const Error: Story = {
  args: {
    label: 'Must confirm',
    error: true,
    onCheckedChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable',
    disabled: true,
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox size="small" label="Small" defaultChecked />
      <Checkbox size="medium" label="Medium" defaultChecked />
      <Checkbox size="large" label="Large" defaultChecked />
    </div>
  ),
};
