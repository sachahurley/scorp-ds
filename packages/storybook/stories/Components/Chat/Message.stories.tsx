import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button, CodeBlock, Message, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Message> = {
  title: 'Components/Chat/Message',
  component: Message,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One turn in a conversation, drawn as a terminal transcript, not chat bubbles. Every turn is full width and left aligned. Your turns have a prompt marker and a shaded plate; the assistant\'s have neither; system turns are one muted line. Don\'t use it outside a `Transcript`, which owns scrolling and spacing.\n\n' +
          '- **Structure:** each turn is an `<article>` named by its role label, so screen reader users can move turn by turn.\n' +
          '- **Streaming:** the turn is `aria-busy` and the block cursor is hidden from assistive tech, so the finished turn is announced, not every token. The cursor is steady: a blink lasting the length of a reply would need a way to stop it (WCAG 2.2.2).\n' +
          '- **Actions:** always in the DOM and in tab order. Icon buttons need `aria-label`s.',
      },
    },
  },
  argTypes: {
    author: { control: 'select', options: ['user', 'assistant', 'system'] },
    status: { control: 'select', options: ['done', 'streaming', 'stopped', 'error'] },
  },
  decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Message>;

const actions = (
  <>
    <Button type="button" variant="ghost" size="sm" aria-label="Copy message">
      <TuiIcon name="Copy" />
    </Button>
    <Button type="button" variant="ghost" size="sm" aria-label="Retry">
      <TuiIcon name="Repeat" />
    </Button>
  </>
);

/** A typed command: prompt marker and muted plate. */
export const User: Story = {
  args: { author: 'user', meta: '12:04', children: 'Make a settings screen with a danger zone' },
};

/** Output: no marker, no plate, with header actions. */
export const Assistant: Story = {
  args: {
    author: 'assistant',
    meta: 'replayed',
    actions,
    children:
      'Here is a settings screen composed from Card, Switch and a destructive Button. The danger zone sits last, in its own card, so it is never the first thing a thumb reaches.',
  },
};

/** One muted line. */
export const System: Story = {
  args: { author: 'system', children: 'Replaying a recorded session.' },
};

/** Streaming: a steady block cursor follows the last character, and the turn is `aria-busy`. */
export const Streaming: Story = {
  args: { author: 'assistant', status: 'streaming', children: 'Here is a settings screen composed from' },
};

/** Stopped by the reader: the partial reply stays, with a "Stopped" footer in text. */
export const Stopped: Story = {
  args: { author: 'assistant', status: 'stopped', children: 'Here is a settings screen composed from Card,' },
};

/** Failed, with Retry. */
export const Error: Story = {
  args: {
    author: 'assistant',
    status: 'error',
    errorMessage: 'The replay file for this session is missing.',
    onRetry: fn(),
    children: 'Here is a settings',
  },
};

/** A CodeBlock inside an assistant turn. */
export const RichContent: Story = {
  name: 'Rich content',
  args: {
    author: 'assistant',
    meta: 'replayed',
    children: (
      <>
        <p>The danger zone is its own card:</p>
        <CodeBlock
          title="danger-zone.tsx"
          language="tsx"
          code={'<Card title="Danger zone">\n  <Button variant="destructive">Delete account</Button>\n</Card>'}
        />
      </>
    ),
  },
};

/** User, assistant and system turns stacked: text lines up across the gutter. */
export const Exchange: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Message author="system">Replaying a recorded session.</Message>
      <Message author="user" meta="12:04">
        Make a settings screen with a danger zone
      </Message>
      <Message author="assistant" meta="replayed" actions={actions}>
        Here is a settings screen composed from Card, Switch and a destructive Button.
      </Message>
    </div>
  ),
};
