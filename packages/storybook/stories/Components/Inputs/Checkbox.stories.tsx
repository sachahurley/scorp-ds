import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Checkbox } from '@scorp-ds/components';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    helperText: { control: 'text', description: 'Hint under the field (linked via aria-describedby)' },
    errorMessage: { control: 'text', description: 'Validation message; implies error and replaces helperText' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean', description: 'Mixed state (native indeterminate), drawn as a bar' },
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

export const HelperText: Story = {
  name: 'Helper text',
  args: {
    label: 'Email me release notes',
    helperText: 'About once a month. Unsubscribe any time.',
    onCheckedChange: fn(),
  },
};

export const Error: Story = {
  args: {
    label: 'I accept the terms',
    errorMessage: 'Accept the terms to create an account.',
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
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
    onCheckedChange: fn(),
  },
};

/**
 * "Select all" over a list: the parent is checked when every child is,
 * indeterminate when some are, and toggles them all.
 */
export const SelectAll: Story = {
  name: 'Select all (mixed)',
  render: function SelectAllDemo() {
    const files = ['notes.md', 'budget.csv', 'logo.svg'];
    const [picked, setPicked] = useState<string[]>(['notes.md']);
    const all = picked.length === files.length;
    const some = picked.length > 0 && !all;
    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          label="Select all files"
          checked={all}
          indeterminate={some}
          onCheckedChange={() => setPicked(all ? [] : files)}
        />
        <div className="flex flex-col gap-2 pl-7">
          {files.map((f) => (
            <Checkbox
              key={f}
              size="sm"
              label={f}
              checked={picked.includes(f)}
              onCheckedChange={(on) => setPicked((p) => (on ? [...p, f] : p.filter((x) => x !== f)))}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const IndeterminateSizes: Story = {
  name: 'Indeterminate sizes',
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox size="sm" label="Small" indeterminate />
      <Checkbox size="md" label="Medium" indeterminate />
      <Checkbox size="lg" label="Large" indeterminate />
    </div>
  ),
};
