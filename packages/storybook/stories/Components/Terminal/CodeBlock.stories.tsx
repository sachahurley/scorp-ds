import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from '@storybook/test';
import { CodeBlock, Window } from '@scorp-ds/components';

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/Terminal/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Read-only code with a file-name title bar, optional line numbers and highlighted lines, and a copy button, in the same frame as LogView. There are no syntax colors yet. Don\'t use it for streaming output (use `LogView`) or for code inside a sentence.\n\n' +
          '- **Name:** the block is a `<figure>` named by `aria-label`, the title when it is text, or the language.\n' +
          '- **Keyboard:** the code is focusable, so overflowing lines can be scrolled without a mouse.\n' +
          '- **Copy:** the result ("Copied", "Copy failed") is announced, not only shown. Line numbers and markers are hidden from screen readers and from manual copying.',
      },
    },
  },
  argTypes: {
    showLineNumbers: { control: 'boolean' },
    wrap: { control: 'boolean' },
    copyable: { control: 'boolean' },
    framed: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CodeBlock>;

const screen = `import { Button, Card, Switch } from '@scorp-ds/components';

export function SettingsScreen() {
  return (
    <Card title="Notifications">
      <Switch label="Email digests" />
      <Switch label="Mentions" />
    </Card>
  );
}`;

/** Title, code and copy. */
export const Default: Story = {
  args: { title: 'settings-screen.tsx', language: 'tsx', code: screen },
};

/** With the line-number gutter. */
export const LineNumbers: Story = {
  name: 'Line numbers',
  args: { title: 'settings-screen.tsx', language: 'tsx', code: screen, showLineNumbers: true },
};

/** Marked lines: a muted row plus a gutter marker, so not color alone. */
export const Highlighted: Story = {
  args: { title: 'settings-screen.tsx', language: 'tsx', code: screen, showLineNumbers: true, highlightLines: [6, 7] },
};

const long = `{ "screen": "settings", "components": ["Card", "Switch", "Button", "ListRow"], "gaps": ["no tab bar component; composed from Buttons"] }`;

/** Long lines scroll horizontally, or wrap with `wrap`. */
export const LongLines: Story = {
  name: 'Long lines',
  render: () => (
    <div className="space-y-4">
      <CodeBlock title="session.json" language="json" code={long} />
      <CodeBlock title="session.json (wrapped)" language="json" code={long} wrap />
    </div>
  ),
};

/** Inside a Window body: the Window draws the frame. */
export const Unframed: Story = {
  render: () => (
    <Window title="code" status="1 file" scroll={false} bodyClassName="p-0">
      <CodeBlock title="settings-screen.tsx" language="tsx" code={screen} framed={false} />
    </Window>
  ),
};

/** Keyboard focus on the code region (after the copy button). */
export const Focused: Story = {
  args: { title: 'session.json', language: 'json', code: long },
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.focus();
    await userEvent.tab();
    await userEvent.tab();
  },
};
