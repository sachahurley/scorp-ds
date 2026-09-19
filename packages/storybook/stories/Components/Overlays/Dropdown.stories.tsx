import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Dropdown } from '@scorp-ds/components';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['left', 'right'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const item = (label: string, variant?: 'default' | 'destructive') => ({
  label,
  onClick: fn(),
  variant,
});

export const Default: Story = {
  args: {
    label: 'Actions',
    items: [
      item('Edit'),
      item('Duplicate'),
      item('Delete', 'destructive'),
    ],
  },
};

export const AlignRight: Story = {
  args: {
    label: 'Menu',
    align: 'right',
    items: [item('Profile'), item('Sign out', 'destructive')],
  },
};

export const Small: Story = {
  args: {
    label: 'More',
    size: 'small',
    items: [item('One'), item('Two')],
  },
};
