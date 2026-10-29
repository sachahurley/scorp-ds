import { useState } from 'react';
import { Button, Inline, Input, LogView, SideNav, SideNavItem, Stack, Window, type LogLine } from '@scorp-ds/components';

/** One open buffer in the index pane. */
export interface WorkbenchBuffer {
  /** Active-state key. */
  id: string;
  /** File name shown in the index row and as the inspector pane's title. */
  label: string;
}

/** The specimen buffers listed in the index pane. */
export const workbenchBuffers: WorkbenchBuffer[] = [
  { id: 'sessions', label: 'sessions.log' },
  { id: 'errors', label: 'errors.log' },
  { id: 'audit', label: 'audit.json' },
];

/** The specimen tail shown in the inspector pane. */
export const workbenchLogLines: LogLine[] = [
  { id: 1, level: 'info', timestamp: '12:04:01', text: 'connection accepted 127.0.0.1:44122' },
  { id: 2, level: 'warning', timestamp: '12:04:02', text: 'slow query 840ms users_by_team' },
  { id: 3, level: 'info', timestamp: '12:04:03', text: 'job=4821 status=ok duration=42s' },
  { id: 4, level: 'error', timestamp: '12:04:09', text: 'upstream timed out after 30000ms' },
];

/**
 * Workbench split preset: two terminal panes in the shape of a multiplexer layout.
 * A narrow `Window` holds the buffer index (a `SideNav` with one `SideNavItem` per
 * buffer); the focused `Window` (`variant="active"`) holds a toolbar (filter Input,
 * secondary then primary action) over a `LogView` tail.
 *
 * The panes stack below `md` and sit side by side from `md` (`gap-4` either way). The
 * index pane is `md:w-60` and does not shrink; the inspector takes the rest
 * (`min-w-0 flex-1`). The inspector sets `scroll={false}` because its LogView scrolls
 * itself. Selecting a buffer retitles the inspector; product code also swaps the lines.
 *
 * Consumed by `Patterns/WorkbenchSplit`. No consumer project renders it yet; if one
 * does, vendor this file with it.
 *
 * @example
 * <div className="min-h-screen bg-[var(--surface-page)] p-4 md:p-6">
 *   <LogInspectorSplit />
 * </div>
 */
export function LogInspectorSplit() {
  const [active, setActive] = useState('sessions');
  return (
    <div className="flex min-h-[70vh] flex-col gap-4 md:flex-row">
      {/* Pane: index / file list */}
      <Window title="~/var/log" titleAs="h3" className="w-full shrink-0 md:w-60" bodyClassName="p-2">
        <SideNav aria-label="Open buffers" className="w-full border-0 bg-transparent p-0">
          {workbenchBuffers.map((item) => (
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
        title={workbenchBuffers.find((n) => n.id === active)?.label}
        titleAs="h3"
        status="tail · last 200 lines"
        variant="active"
        scroll={false}
        className="min-w-0 flex-1"
      >
        <Stack gap="3" className="h-full">
          <Inline gap="2">
            <Input className="min-w-48 flex-1" placeholder="Filter…" aria-label="Filter log lines" size="sm" />
            <Button variant="secondary" size="sm" type="button">
              Pause
            </Button>
            <Button variant="primary" size="sm" type="button">
              Export
            </Button>
          </Inline>
          <LogView lines={workbenchLogLines} aria-label="Selected log" className="h-[40vh]" />
          <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
            Composes Window (panes, active ring on the focused one), SideNav (buffer list), and LogView (tail).
          </p>
        </Stack>
      </Window>
    </div>
  );
}
