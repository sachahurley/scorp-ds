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
          '**Pattern**: a responsive split that stacks on small screens and sits side by side from `md`. The split is a `Stack` whose `axis` changes at the breakpoint (`{ base: \'vertical\', md: \'horizontal\' }`), so there is no hand-written flex to copy.\n\n**Theme:** Storybook **Theme** toolbar for light/dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** The page shell around the preset, shared by both frames. */
const shell = () => (
  <div className="min-h-screen bg-[var(--surface-page)] p-4 md:p-6">
    <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
      Pattern · Workbench split
    </p>
    <LogInspectorSplit />
  </div>
);

/**
 * The split from `md` up: index and inspector side by side, one height. Captured at the
 * harness width (900), above the `md` breakpoint (768).
 */
export const InspectorLayout: Story = {
  name: 'Log inspector',
  render: shell,
};

/**
 * The same split below `md`: the axis map falls back to `base`, so the index pane sits
 * above the inspector at full width. The direction is structural, so it gets its own
 * frame (decision 0012).
 */
export const InspectorLayoutStacked: Story = {
  name: 'Log inspector: stacked',
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  render: shell,
};
