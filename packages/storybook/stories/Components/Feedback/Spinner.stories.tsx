import type { Meta, StoryObj } from '@storybook/react';
import { Button, Spinner } from '@scorp-ds/components';

/**
 * Components / Feedback / Spinner
 *
 * TUI loading indicator: eight 1-bit dots with a gap stepping around the ring. It
 * inherits the text color, so it matches whatever surface it sits on.
 *
 * Accessibility: `role="status"` with a visually hidden `label` (default
 * "Loading"). With prefers-reduced-motion it holds a static frame.
 * For a submitting button, use `<Button loading>` instead of placing one.
 */
const meta: Meta<typeof Spinner> = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text', description: 'Visually hidden status text' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: 'md', label: 'Loading' },
  render: (args) => (
    <span className="text-[var(--text-primary)]">
      <Spinner {...args} />
    </span>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-center gap-6 font-mono text-sm text-[var(--text-primary)]">
      <span className="inline-flex items-center gap-2">
        <Spinner size="sm" /> sm
      </span>
      <span className="inline-flex items-center gap-2">
        <Spinner size="md" /> md
      </span>
      <span className="inline-flex items-center gap-2">
        <Spinner size="lg" /> lg
      </span>
    </div>
  ),
};

export const InlineWithText: Story = {
  name: 'Inline with text',
  render: () => (
    <p className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)]">
      <Spinner size="sm" label="Loading invoices" /> fetching invoices
    </p>
  ),
};

export const InButton: Story = {
  name: 'In a button (use Button loading)',
  render: () => (
    <div className="flex items-center gap-3">
      <Button loading>Save changes</Button>
      <Button variant="secondary" loading>
        Sync
      </Button>
    </div>
  ),
};
