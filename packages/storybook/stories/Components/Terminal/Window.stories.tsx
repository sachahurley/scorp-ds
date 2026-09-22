import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button, DescriptionList, LogView, TuiIcon, Window } from '@scorp-ds/components';

const meta: Meta<typeof Window> = {
  title: 'Components/Terminal/Window',
  component: Window,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A framed terminal pane: large plate ring, a TUI title bar (title, a hairline rule, optional `status` text and `actions`), and a keyboard-focusable scroll body. `variant="active"` marks the focused pane with the accent ring, a muted title bar, and a ChevronRight marker, so focus never relies on color alone. Set the pane size with `className`; set `scroll={false}` when the child scrolls itself (an unframed LogView: `framed={false}`).',
      },
    },
  },
  argTypes: {
    variant: { control: 'radio', options: ['default', 'active'] },
    scroll: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Window>;

const body = (
  <div className="space-y-2">
    {Array.from({ length: 16 }, (_, i) => (
      <p key={i}>
        {String(i + 1).padStart(2, '0')} scorp-ds pane content, scroll to see more.
      </p>
    ))}
  </div>
);

/** Title, status text, and a scrolling body. */
export const Default: Story = {
  args: { title: 'README.md', status: 'utf-8', children: body, className: 'h-72 w-full max-w-lg' },
};

/** The focused pane: accent ring and a marker before the title. */
export const Active: Story = {
  args: { title: 'sessions.log', status: 'tail -f', variant: 'active', children: body, className: 'h-72 w-full max-w-lg' },
};

/** Title bar actions (keep them small). */
export const WithActions: Story = {
  args: {
    title: 'build #4821',
    status: <Badge size="sm" variant="success">passed</Badge>,
    actions: (
      <>
        <Button variant="ghost" size="sm" aria-label="Copy output">
          <TuiIcon name="Copy" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Close pane">
          <TuiIcon name="X" />
        </Button>
      </>
    ),
    children: (
      <DescriptionList
        leader
        items={[
          { term: 'Branch', description: 'main' },
          { term: 'Commit', description: '6308da0' },
          { term: 'Duration', description: '42s' },
        ]}
      />
    ),
    className: 'w-full max-w-lg',
    scroll: false,
  },
};

/** Two panes side by side: one active, one idle. */
export const SplitPanes: Story = {
  render: () => (
    <div className="grid h-80 w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
      <Window title="errors.log" status="3 lines">
        <p>12:04:02 slow query</p>
        <p>12:04:09 retry scheduled</p>
        <p>12:05:13 connection reset</p>
      </Window>
      <Window title="sessions.log" status="tail -f" variant="active" scroll={false} bodyClassName="p-0">
        <LogView
          aria-label="Session log"
          framed={false}
          className="h-full"
          lines={[
            { id: 1, level: 'info', timestamp: '12:04:01', text: 'connection accepted 127.0.0.1:44122' },
            { id: 2, level: 'warn', timestamp: '12:04:02', text: 'slow query 840ms users_by_team' },
            { id: 3, level: 'info', timestamp: '12:04:03', text: 'job=4821 status=ok duration=42s' },
          ]}
        />
      </Window>
    </div>
  ),
};
