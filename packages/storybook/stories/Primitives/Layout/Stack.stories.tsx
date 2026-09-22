import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@scorp-ds/components';

const meta: Meta<typeof Stack> = {
  title: 'Primitives/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'select', options: ['none', '1', '2', '3', '4', '5', '6', '8'] },
    axis: { control: 'select', options: ['vertical', 'horizontal'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: {
    gap: '4',
    axis: 'vertical',
    children: (
      <>
        <div className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">Block A</div>
        <div className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">Block B</div>
        <div className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">Block C</div>
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    gap: '3',
    axis: 'horizontal',
    children: (
      <>
        <span className="bg-primary-200 px-2 py-1 font-mono text-xs dark:bg-primary-900">One</span>
        <span className="bg-primary-200 px-2 py-1 font-mono text-xs dark:bg-primary-900">Two</span>
        <span className="bg-primary-200 px-2 py-1 font-mono text-xs dark:bg-primary-900">Three</span>
      </>
    ),
  },
};
