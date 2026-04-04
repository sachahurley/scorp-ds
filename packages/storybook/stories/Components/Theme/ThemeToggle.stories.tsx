import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from '@scorp-ds/components';

/**
 * Requires `ThemeProvider` in preview (already configured in `.storybook/preview.tsx`).
 */
const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/Theme/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toggles light/dark via `next-themes`. Use the switch to confirm `class` on `<html>` updates and dark-mode tokens apply.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => (
    <div className="rounded-none border border-secondary-300 p-6 dark:border-secondary-700">
      <ThemeToggle />
    </div>
  ),
};
