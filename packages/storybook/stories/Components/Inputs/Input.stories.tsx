import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@scorp-ds/components';

/**
 * Components / Inputs / Input
 *
 * Text field aligned with button heights (small / medium / large).
 */
const meta: Meta<typeof Input> = {
  title: 'Components/Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Email address',
    size: 'medium',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'hello@example.com',
    size: 'medium',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Required field',
    error: true,
    defaultValue: '',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input size="small" placeholder="Small" />
      <Input size="medium" placeholder="Medium" />
      <Input size="large" placeholder="Large" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    size: 'medium',
    placeholder: 'Type here',
    error: false,
    disabled: false,
  },
};
