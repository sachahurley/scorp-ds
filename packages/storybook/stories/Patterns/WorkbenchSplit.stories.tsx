import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Input, Stack, TuiIcon } from '@scorp-ds/components';

/**
 * Pattern: two-pane workbench — narrow index / nav column + main inspector card.
 * Evokes terminal multiplexer layouts (sidebar + buffer) without bespoke layout components.
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

const navItems = [
  { id: 'sessions', label: 'sessions.log', active: true },
  { id: 'errors', label: 'errors.log', active: false },
  { id: 'audit', label: 'audit.json', active: false },
];

export const InspectorLayout: Story = {
  name: 'Log inspector',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] p-4 md:p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
        Pattern · Workbench split
      </p>
      <div className="flex min-h-[70vh] flex-col gap-4 md:flex-row md:gap-0">
        {/* Pane: index / file list */}
        <aside
          className="
            flex w-full shrink-0 flex-col border-[0.5px] border-solid border-[var(--surface-container-stroke)]
            bg-[var(--surface-subtle)] md:w-56 md:border-r-0 md:border-b-0
          "
          aria-label="Open buffers"
        >
          <div className="border-b-[0.5px] border-solid border-[var(--surface-container-stroke)] px-3 py-2 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
            ~/var/log
          </div>
          <nav className="flex flex-col p-2 font-mono text-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={[
                  'rounded-none px-2 py-2 text-left transition-colors [transition-duration:var(--duration-normal)]',
                  item.active
                    ? 'bg-[var(--surface-card)] text-[var(--text-primary)]'
                    : 'text-secondary-900 hover:bg-[var(--surface-card)] dark:text-secondary-200',
                ].join(' ')}
              >
                {/* Fixed-width marker slot keeps labels aligned whether or not the row is active */}
                <span className="inline-flex w-5 shrink-0 align-middle" aria-hidden="true">
                  {item.active && <TuiIcon name="ChevronRight" size="4" />}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Pane: main card */}
        <div className="min-w-0 flex-1">
          <Card
            className="h-full min-h-[50vh] shadow-none"
            title="sessions.log"
            subtitle="Tail · last 200 lines"
          >
            <Stack gap="3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="min-w-[12rem] flex-1"
                  placeholder="Filter…"
                  aria-label="Filter log lines"
                  size="small"
                />
                <Button variant="secondary" size="small" type="button">
                  Pause
                </Button>
                <Button variant="primary" size="small" type="button">
                  Export
                </Button>
              </div>
            </Stack>
            <Stack gap="2" className="mt-4">
              <pre
                className="
                  max-h-[40vh] overflow-auto border-[0.5px] border-solid border-[var(--surface-container-stroke)]
                  bg-[var(--surface-page)] p-3 font-mono text-xs leading-relaxed text-[var(--text-primary)]
                "
              >
                {`[12:04:01] INFO  connection accepted 127.0.0.1:44122
[12:04:02] WARN  slow query 840ms — users_by_team
[12:04:03] INFO  job=4821 status=ok duration=42s`}
              </pre>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
                Main pane is a `Card` without extra borders; outer chrome provides the TUI frame.
              </p>
            </Stack>
          </Card>
        </div>
      </div>
    </div>
  ),
};
