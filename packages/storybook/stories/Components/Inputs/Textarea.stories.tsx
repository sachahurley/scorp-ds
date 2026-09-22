import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@scorp-ds/components';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
    helperText: { control: 'text', description: 'Hint under the field (linked via aria-describedby)' },
    errorMessage: { control: 'text', description: 'Validation message; implies error and replaces helperText' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Notes…',
    rows: 4,
    className: 'w-96',
  },
};

export const Error: Story = {
  args: {
    label: 'Feedback',
    defaultValue: '',
    placeholder: 'What should we change?',
    helperText: 'Up to 500 characters.',
    errorMessage: 'Add a sentence or two before sending.',
    className: 'w-96',
    rows: 3,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Comments',
    disabled: true,
    defaultValue: 'Read only copy.',
    className: 'w-96',
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Textarea label="Small" size="small" placeholder="Small" rows={2} />
      <Textarea label="Medium" size="medium" placeholder="Medium" rows={3} />
      <Textarea label="Large" size="large" placeholder="Large" rows={3} />
    </div>
  ),
};
