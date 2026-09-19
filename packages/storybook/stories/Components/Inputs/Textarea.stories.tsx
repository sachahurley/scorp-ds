import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@scorp-ds/components';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
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
    error: true,
    defaultValue: '',
    placeholder: 'Fix validation errors',
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
