import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@scorp-ds/components';

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    helperText: { control: 'text', description: 'Hint under the field (linked via aria-describedby)' },
    errorMessage: { control: 'text', description: 'Validation message; implies error and replaces helperText' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} label="Choose option" defaultValue="two">
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
      </Select>
    </div>
  ),
  args: {
    size: 'md',
  },
};

export const Error: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} label="Required choice" defaultValue="">
        <option value="">Choose…</option>
        <option value="a">A</option>
      </Select>
    </div>
  ),
  args: {
    errorMessage: 'Pick an option to continue.',
    size: 'md',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-72">
      <Select {...args} label="Locked field" defaultValue="a" disabled>
        <option value="a">Only option</option>
      </Select>
    </div>
  ),
};

/** When you cannot show a visible label, pass `aria-label` on Select (applied to the trigger). */
export const WithAriaLabelOnly: Story = {
  name: 'Aria label only',
  render: (args) => (
    <div className="w-72">
      <Select {...args} defaultValue="b" aria-label="Pick a letter">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    </div>
  ),
  args: { size: 'md' },
};
