import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { Button, Dropdown, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Overlays/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['left', 'right'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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
  // Opens on render so the baseline captures the menu, not just the trigger.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
  },
};

export const AlignRight: Story = {
  // Right-alignment is only observable against an open menu; the resting frame is
  // a picture of the trigger.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Menu' }));
  },
  args: {
    label: 'Menu',
    align: 'right',
    items: [item('Profile'), item('Sign out', 'destructive')],
  },
};

export const Small: Story = {
  // Open: the sm size applies to the menu rows as well as the trigger.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'More' }));
  },
  args: {
    label: 'More',
    size: 'sm',
    items: [item('One'), item('Two')],
  },
};

/**
 * Disabled items are dimmed and skipped by the arrow keys, so the highlighted
 * row is always the row Enter activates.
 */
export const WithDisabledItem: Story = {
  name: 'Disabled item',
  // Open: the dimmed disabled row this story documents exists only in the menu.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
  },
  args: {
    label: 'Actions',
    items: [
      item('Edit'),
      { label: 'Duplicate', onClick: fn(), disabled: true },
      { ...item('Open in new tab'), iconRight: <TuiIcon name="ExternalLink" /> },
      item('Delete', 'destructive'),
    ],
  },
};

/**
 * A custom `trigger` is cloned, not wrapped: the toggle handler,
 * `aria-haspopup` and `aria-expanded` land on the element itself, so there is
 * one control and one tab stop. Pass something focusable, such as `Button`.
 */
export const CustomTrigger: Story = {
  name: 'Custom trigger',
  // Open: this story is about aria-expanded landing on the cloned trigger itself,
  // which is only true once the menu is open.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Row actions' }));
  },
  args: {
    trigger: <Button variant="outline">Row actions</Button>,
    items: [item('Rename'), item('Archive'), item('Delete', 'destructive')],
  },
};
