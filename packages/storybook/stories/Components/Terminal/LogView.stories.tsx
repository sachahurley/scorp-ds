import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, LogView, type LogLine } from '@scorp-ds/components';

const meta: Meta<typeof LogView> = {
  title: 'Components/Terminal/LogView',
  component: LogView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Monospace scrolling log. Each line: optional line number, optional timestamp, level as a 1-bit icon plus a text tag (INFO / WARN / ERROR / DEBUG, never color alone), and the message. `autoScroll` follows new lines like `tail -f`; scrolling up pauses it and shows a "Jump to latest" button with the unseen count. The container is `role="log"` with `aria-live="polite"` and is keyboard focusable.',
      },
    },
  },
  argTypes: {
    autoScroll: { control: 'boolean' },
    showLineNumbers: { control: 'boolean' },
    wrap: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LogView>;

const sample: LogLine[] = [
  { id: 1, level: 'info', timestamp: '12:04:01', text: 'connection accepted 127.0.0.1:44122' },
  { id: 2, level: 'debug', timestamp: '12:04:01', text: 'pool size=8 idle=6' },
  { id: 3, level: 'warn', timestamp: '12:04:02', text: 'slow query 840ms users_by_team' },
  { id: 4, level: 'info', timestamp: '12:04:03', text: 'job=4821 status=ok duration=42s' },
  { id: 5, level: 'error', timestamp: '12:04:09', text: 'upstream timed out after 30000ms (GET /api/teams)' },
  { id: 6, level: 'info', timestamp: '12:04:10', text: 'retry 1/3 scheduled in 2s' },
  { id: 7, timestamp: '12:04:12', text: 'plain line without a level' },
];

/** Levels, timestamps, and a plain line. */
export const Default: Story = {
  args: { lines: sample, 'aria-label': 'Server log', className: 'h-64 w-full max-w-2xl' },
};

/** With the line-number gutter. */
export const LineNumbers: Story = {
  args: { lines: sample, showLineNumbers: true, 'aria-label': 'Server log', className: 'h-64 w-full max-w-2xl' },
};

/** No wrapping: long lines scroll horizontally. */
export const NoWrap: Story = {
  name: 'No wrap',
  args: {
    lines: [
      ...sample,
      { id: 8, level: 'debug', text: 'payload='.concat('{"team":"core","members":["a","b","c"]} '.repeat(6)) },
    ],
    wrap: false,
    'aria-label': 'Server log',
    className: 'h-64 w-full max-w-2xl',
  },
};

/** No lines yet. */
export const Empty: Story = {
  args: { lines: [], 'aria-label': 'Build output', className: 'h-32 w-full max-w-2xl' },
};

const messages = [
  'GET /api/teams 200 12ms',
  'cache hit key=teams:core',
  'POST /api/jobs 201 48ms',
  'slow query 610ms jobs_by_owner',
  'worker 3 heartbeat',
];

/**
 * Streaming: a line every 700ms. Scroll up to pause following; the
 * "Jump to latest" button resumes it.
 */
export const Streaming: Story = {
  render: () => {
    const Demo = () => {
      const [lines, setLines] = useState<LogLine[]>(sample);
      const [running, setRunning] = useState(true);
      useEffect(() => {
        if (!running) return;
        const t = setInterval(() => {
          setLines((prev) => {
            const n = prev.length + 1;
            const level = n % 9 === 0 ? 'error' : n % 4 === 0 ? 'warn' : 'info';
            return [
              ...prev,
              { id: n, level, timestamp: `12:05:${String(n % 60).padStart(2, '0')}`, text: messages[n % messages.length] },
            ];
          });
        }, 700);
        return () => clearInterval(t);
      }, [running]);
      return (
        <div className="flex w-full max-w-2xl flex-col gap-3">
          <Button variant="secondary" size="sm" className="self-start" onClick={() => setRunning((r) => !r)}>
            {running ? 'Stop stream' : 'Start stream'}
          </Button>
          <LogView lines={lines} showLineNumbers aria-label="Live server log" className="h-64" />
        </div>
      );
    };
    return <Demo />;
  },
};
