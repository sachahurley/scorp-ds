import type { Meta, StoryObj } from '@storybook/react';
import { StatusLine, StatusLineSegment } from '@scorp-ds/components';

const meta: Meta<typeof StatusLine> = {
  title: 'Components/Terminal/StatusLine',
  component: StatusLine,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The bottom bar of a terminal app: `left`, `center`, and `right` zones of `StatusLineSegment`s. Segments take a 1-bit `icon` and a semantic `tone` (`neutral`, `primary` for the mode segment, `success` / `warning` / `error` / `info` tinted plates). Always pair a tone with an icon or words. The bar is a named group; set `live` to announce changes politely (`role="status"`).',
      },
    },
  },
  argTypes: {
    live: { control: 'boolean' },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof StatusLine>;

/** Editor-style bar: mode, file, position. */
export const Default: Story = {
  args: {
    left: (
      <>
        <StatusLineSegment tone="primary">NORMAL</StatusLineSegment>
        <StatusLineSegment icon="Tag">main</StatusLineSegment>
      </>
    ),
    center: <StatusLineSegment icon="FileText">packages/components/src/index.ts</StatusLineSegment>,
    right: (
      <>
        <StatusLineSegment>utf-8</StatusLineSegment>
        <StatusLineSegment>ln 42, col 7</StatusLineSegment>
      </>
    ),
  },
};

/** Every tone, each paired with an icon and words. */
export const Tones: Story = {
  args: {
    left: (
      <>
        <StatusLineSegment tone="primary">INSERT</StatusLineSegment>
        <StatusLineSegment tone="success" icon="CheckCircle">build ok</StatusLineSegment>
      </>
    ),
    center: <StatusLineSegment tone="info" icon="Info">3 updates</StatusLineSegment>,
    right: (
      <>
        <StatusLineSegment tone="warning" icon="AlertTriangle">2 warnings</StatusLineSegment>
        <StatusLineSegment tone="error" icon="AlertCircle">1 error</StatusLineSegment>
      </>
    ),
  },
};

/** Only a right zone (tmux clock style). */
export const RightOnly: Story = {
  args: {
    right: (
      <>
        <StatusLineSegment icon="Globe">eu-west-1</StatusLineSegment>
        <StatusLineSegment>21 Sep 20:14</StatusLineSegment>
      </>
    ),
  },
};

/** At the bottom of a pane, announcing changes (`live`). */
export const InPane: Story = {
  name: 'In a pane (live)',
  render: () => (
    <div className="plate-round-lg w-full max-w-2xl bg-[var(--surface-container-stroke)] p-px">
      <div className="plate-round-lg flex h-48 flex-col bg-[var(--surface-card)]">
        <p className="flex-1 p-4 font-mono text-sm text-[var(--text-primary)]">~/scorp-ds $ npm test</p>
        <StatusLine
          live
          aria-label="Test status"
          left={<StatusLineSegment tone="success" icon="Check">84 passed</StatusLineSegment>}
          right={<StatusLineSegment>3.6s</StatusLineSegment>}
        />
      </div>
    </div>
  ),
};
