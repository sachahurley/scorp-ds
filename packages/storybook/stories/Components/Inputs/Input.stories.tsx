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
    label: { control: 'text', description: 'Visible label (recommended for a11y)' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
    helperText: { control: 'text', description: 'Hint under the field (linked via aria-describedby)' },
    errorMessage: { control: 'text', description: 'Validation message; implies error and replaces helperText' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    size: 'medium',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Work email',
    defaultValue: 'hello@example.com',
    size: 'medium',
  },
};

export const HelperText: Story = {
  name: 'Helper text',
  args: {
    label: 'Handle',
    placeholder: 'scorp',
    helperText: 'Lowercase letters and numbers only.',
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    defaultValue: 'hello@',
    errorMessage: 'Enter a full email address, like you@example.com.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-only',
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input label="Small" size="small" placeholder="Small" />
      <Input label="Medium" size="medium" placeholder="Medium" />
      <Input label="Large" size="large" placeholder="Large" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Field label',
    size: 'medium',
    placeholder: 'Type here',
    error: false,
    disabled: false,
  },
};

/** Quiet variant: the underline recipe for inline fields (passwords, rename-in-place). */
export const Quiet: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <Input variant="quiet" aria-label="Vault passphrase" placeholder="passphrase" />
      <Input variant="quiet" label="Character name" defaultValue="Sacha" />
      <Input variant="quiet" error aria-label="Wrong passphrase" defaultValue="hunter2" />
    </div>
  ),
};
