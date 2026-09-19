import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Avatar, Badge, Button, Divider, Stack, TuiIcon } from '@scorp-ds/components';

/**
 * Pattern: compact list row — avatar, primary line, meta, status, actions.
 * Typical for jobs, inboxes, or log streams in a TUI-dense layout.
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

function RowShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        flex flex-wrap items-center gap-3 border-[0.5px] border-solid border-[var(--surface-container-stroke)]
        bg-[var(--surface-card)] px-3 py-2 font-mono text-sm text-[var(--text-primary)]
      "
    >
      {children}
    </div>
  );
}

export const JobRunRow: Story = {
  name: 'Job run (status + actions)',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Dense list row
        </p>
        <Stack gap="2">
          <RowShell>
            <Avatar initials="BR" size="small" status="online" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="truncate font-medium">build · main</span>
                <span className="text-secondary-900 dark:text-secondary-200">#4821</span>
              </div>
              <p className="truncate text-xs text-secondary-900 dark:text-secondary-200">
                chore: token sweep — 2m ago
              </p>
            </div>
            <Badge variant="success">passed</Badge>
            <Button variant="outline" size="small" type="button">
              Logs
            </Button>
            <Button variant="icon" size="small" type="button" aria-label="Open menu">
              <TuiIcon name="MoreVertical" />
            </Button>
          </RowShell>
          <RowShell>
            <Avatar initials="QA" size="small" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="truncate font-medium">e2e · nightly</span>
                <span className="text-secondary-900 dark:text-secondary-200">#119</span>
              </div>
              <p className="truncate text-xs text-secondary-900 dark:text-secondary-200">
                queued on runner-east — just now
              </p>
            </div>
            <Badge variant="default">queued</Badge>
            <Button variant="outline" size="small" type="button" disabled>
              Logs
            </Button>
            <Button variant="icon" size="small" type="button" aria-label="Open menu">
              <TuiIcon name="MoreVertical" />
            </Button>
          </RowShell>
        </Stack>
        <Divider />
        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Rows use semantic surfaces and text tokens only — swap `Badge` variant or trailing actions per product.
        </p>
      </div>
    </div>
  ),
};
