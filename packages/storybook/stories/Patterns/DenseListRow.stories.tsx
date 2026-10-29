import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@scorp-ds/components';
import { JobRunList } from '../../presets/denseListRow';

/**
 * Pattern: compact list row: avatar, primary line, meta, status, actions.
 * Typical for jobs, inboxes, or log streams in a TUI-dense layout. The rows
 * live in `presets/denseListRow.tsx`; this story is the page shell.
 */
const meta: Meta = {
  title: 'Patterns/DenseListRow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** — repeatable row chrome for data-heavy lists. Pair with your own scroll container or virtualized list in product code.\n\n**Theme:** Storybook **Theme** toolbar for light/dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const JobRunRow: Story = {
  name: 'Job run (status + actions)',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Dense list row
        </p>
        <JobRunList />
        <Divider />
        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Rows use semantic surfaces and text tokens only — swap `Badge` variant or trailing actions per product.
        </p>
      </div>
    </div>
  ),
};
