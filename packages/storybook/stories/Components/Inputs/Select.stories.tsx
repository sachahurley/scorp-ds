import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@scorp-ds/components';

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="two" aria-label="Example select">
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
      </Select>
    </div>
  ),
  args: {
    size: 'medium',
  },
};

export const Error: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="" aria-label="Select with error">
        <option value="">Choose…</option>
        <option value="a">A</option>
      </Select>
    </div>
  ),
  args: {
    error: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="a" disabled aria-label="Disabled select">
        <option value="a">Only option</option>
      </Select>
    </div>
  ),
};
