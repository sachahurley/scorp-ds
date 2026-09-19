import type { Meta, StoryObj } from '@storybook/react';
import { TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof TuiIcon> = {
  title: 'Components/Display/TuiIcon',
  component: TuiIcon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: ['3', '4', '5', '6', '8'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TuiIcon>;

export const Check: Story = {
  args: { name: 'Check', size: '4' },
};

export const ChevronDown: Story = {
  args: { name: 'ChevronDown', size: '5' },
};

export const SizeScale: Story = {
  name: 'Size scale',
  render: () => (
    <div className="flex items-end gap-3 text-primary-600">
      <TuiIcon name="Bell" size="3" />
      <TuiIcon name="Bell" size="4" />
      <TuiIcon name="Bell" size="5" />
      <TuiIcon name="Bell" size="6" />
      <TuiIcon name="Bell" size="8" />
    </div>
  ),
};

export const CommonSet: Story = {
  name: 'Common glyphs',
  render: () => (
    <div className="flex flex-wrap gap-4 font-mono text-sm text-secondary-800 dark:text-secondary-200">
      {['Check', 'X', 'ArrowRight', 'Settings', 'Search', 'Trash2', 'AlertTriangle'].map((name) => (
        <span key={name} className="flex items-center gap-2 border border-secondary-300 px-2 py-1 dark:border-secondary-700">
          <TuiIcon name={name} size="4" />
          {name}
        </span>
      ))}
    </div>
  ),
};
