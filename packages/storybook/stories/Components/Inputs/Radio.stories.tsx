import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Radio } from '@scorp-ds/components';

const meta: Meta<typeof Radio> = {
  title: 'Components/Inputs/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Group: Story = {
  name: 'Radio group',
  render: () => (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 font-mono text-sm text-secondary-700 dark:text-secondary-300">
        Pick one
      </legend>
      <Radio name="plan" value="free" label="Free" defaultChecked onChange={fn()} />
      <Radio name="plan" value="pro" label="Pro" onChange={fn()} />
      <Radio name="plan" value="team" label="Team" onChange={fn()} />
    </fieldset>
  ),
};

export const Error: Story = {
  args: {
    name: 'solo',
    value: 'x',
    label: 'Invalid choice',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'solo',
    value: 'y',
    label: 'Disabled',
    disabled: true,
  },
};
