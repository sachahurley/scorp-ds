import type { Meta, StoryObj } from '@storybook/react';
import { LogInspectorSplit } from '../../presets/workbenchSplit';

/**
 * Pattern: two-pane workbench, a narrow index / nav column beside the main inspector.
 * Evokes terminal multiplexer layouts (sidebar + buffer) with Window panes, SideNav, and LogView.
 * The panes live in `presets/workbenchSplit.tsx`; this story is the page shell.
 */
const meta: Meta = {
  title: 'Patterns/WorkbenchSplit',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** — responsive split: stack on small screens, side-by-side from `md`. Uses plain flex and tokens; refine breakpoints in product as needed.\n\n**Theme:** Storybook **Theme** toolbar for light/dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const InspectorLayout: Story = {
  name: 'Log inspector',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] p-4 md:p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
        Pattern · Workbench split
      </p>
      <LogInspectorSplit />
    </div>
  ),
};
