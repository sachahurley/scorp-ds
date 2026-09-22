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

/**
 * `<optgroup>` children render as labelled groups, and a disabled option (or a
 * disabled group) is skipped by the arrow keys. Mixed static and mapped
 * children are flattened, so nothing is dropped.
 */
export const Grouped: Story = {
  name: 'Option groups',
  render: (args) => (
    <div className="w-72">
      <Select {...args} label="Deploy target" defaultValue="use1">
        <option value="local">Local</option>
        <optgroup label="North America">
          <option value="use1">us-east-1</option>
          <option value="usw2">us-west-2</option>
        </optgroup>
        <optgroup label="Europe">
          <option value="euw1">eu-west-1</option>
          <option value="euc1" disabled>
            eu-central-1 (full)
          </option>
        </optgroup>
      </Select>
    </div>
  ),
  args: { size: 'md' },
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
