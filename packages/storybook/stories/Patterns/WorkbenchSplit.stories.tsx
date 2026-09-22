import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Input, LogView, SideNav, SideNavItem, Stack, Window, type LogLine } from '@scorp-ds/components';

/**
 * Pattern: two-pane workbench — narrow index / nav column + main inspector card.
 * Evokes terminal multiplexer layouts (sidebar + buffer) with Window panes, SideNav, and LogView.
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
  { id: 'sessions', label: 'sessions.log' },
  { id: 'errors', label: 'errors.log' },
  { id: 'audit', label: 'audit.json' },
];

const logLines: LogLine[] = [
  { id: 1, level: 'info', timestamp: '12:04:01', text: 'connection accepted 127.0.0.1:44122' },
  { id: 2, level: 'warn', timestamp: '12:04:02', text: 'slow query 840ms users_by_team' },
  { id: 3, level: 'info', timestamp: '12:04:03', text: 'job=4821 status=ok duration=42s' },
  { id: 4, level: 'error', timestamp: '12:04:09', text: 'upstream timed out after 30000ms' },
];

export const InspectorLayout: Story = {
  name: 'Log inspector',
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState('sessions');
      return (
        <div className="min-h-screen bg-[var(--surface-page)] p-4 md:p-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
            Pattern · Workbench split
          </p>
          <div className="flex min-h-[70vh] flex-col gap-4 md:flex-row">
            {/* Pane: index / file list */}
            <Window title="~/var/log" titleAs="h3" className="w-full shrink-0 md:w-60" bodyClassName="p-2">
              <SideNav aria-label="Open buffers" className="w-full border-0 bg-transparent p-0">
                {navItems.map((item) => (
                  <SideNavItem
                    key={item.id}
                    icon="FileText"
                    label={item.label}
                    active={active === item.id}
                    onClick={() => setActive(item.id)}
                  />
                ))}
              </SideNav>
            </Window>
            {/* Pane: main inspector (the focused pane) */}
            <Window
              title={navItems.find((n) => n.id === active)?.label}
              titleAs="h3"
              status="tail · last 200 lines"
              variant="active"
              scroll={false}
              className="min-w-0 flex-1"
            >
              <Stack gap="3" className="h-full">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    className="min-w-[12rem] flex-1"
                    placeholder="Filter…"
                    aria-label="Filter log lines"
                    size="sm"
                  />
                  <Button variant="secondary" size="sm" type="button">
                    Pause
                  </Button>
                  <Button variant="primary" size="sm" type="button">
                    Export
                  </Button>
                </div>
                <LogView lines={logLines} aria-label="Selected log" className="h-[40vh]" />
                <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
                  Composes Window (panes, active ring on the focused one), SideNav (buffer list), and LogView (tail).
                </p>
              </Stack>
            </Window>
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};
