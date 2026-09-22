import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from '@scorp-ds/components';

const meta: Meta<typeof Kbd> = {
  title: 'Components/Terminal/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inline keyboard key (`<kbd>`) on a small plate with the ring recipe and a keycap lip. Pass `children` for one key or `keys` for a combo: combos render the nested `<kbd>` form with a visible "+" separator (customize with `separator`). Sizes: `sm` (default, inline text and menus) and `md` (standalone hints).',
      },
    },
  },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Kbd>;

/** A single key. */
export const Default: Story = {
  args: { children: 'Esc' },
};

/** A key combo with the visible separator. */
export const Combo: Story = {
  args: { keys: ['Ctrl', 'K'] },
};

/** Both sizes, single and combo. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <Kbd size="sm">Enter</Kbd>
        <Kbd size="sm" keys={['Ctrl', 'Shift', 'P']} />
      </div>
      <div className="flex items-center gap-3">
        <Kbd size="md">Enter</Kbd>
        <Kbd size="md" keys={['Ctrl', 'Shift', 'P']} />
      </div>
    </div>
  ),
};

/** Inline in running text. */
export const InText: Story = {
  name: 'In text',
  render: () => (
    <p className="max-w-md font-mono text-sm leading-7 text-[var(--text-primary)]">
      Press <Kbd keys={['Ctrl', 'K']} /> to open the command palette, <Kbd>Esc</Kbd> to close it, and{' '}
      <Kbd keys={['G', 'H']} separator="then" /> to jump home.
    </p>
  ),
};

/** A shortcut cheat sheet. */
export const CheatSheet: Story = {
  render: () => (
    <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 font-mono text-sm text-[var(--text-primary)]">
      <dt>Command palette</dt>
      <dd><Kbd keys={['Ctrl', 'K']} /></dd>
      <dt>Toggle sidebar</dt>
      <dd><Kbd keys={['Ctrl', 'B']} /></dd>
      <dt>Next pane</dt>
      <dd><Kbd keys={['Ctrl', 'W', 'L']} /></dd>
      <dt>Quit</dt>
      <dd><Kbd>q</Kbd></dd>
    </dl>
  ),
};
