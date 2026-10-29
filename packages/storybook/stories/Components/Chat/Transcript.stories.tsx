import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Button, EmptyState, Message, Transcript } from '@scorp-ds/components';

const meta: Meta<typeof Transcript> = {
  title: 'Components/Chat/Transcript',
  component: Transcript,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The scrolling list of messages in a conversation. It stays pinned to the newest text while a reply streams in, pauses when you scroll up so you keep your place, and offers "Jump to latest" with a count of new turns. Use `LogView` for logs, which keeps line numbers and levels.\n\n' +
          '- **Role:** `role="log"`, polite and additions only, named by `aria-label` or `aria-labelledby` (one is required by the type). Each turn inside is an article.\n' +
          '- **Announcements:** a separate status region says "Responding" and "Response complete", once each, not every token.\n' +
          '- **Keyboard:** the region is focusable, so arrow keys and Page Up/Down scroll it.',
      },
    },
  },
  args: { 'aria-label': 'Conversation' },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Transcript>;

const exchange = [
  <Message key="s" author="system">
    Replaying a recorded session.
  </Message>,
  <Message key="u1" author="user" meta="12:04">
    Make a settings screen with a danger zone
  </Message>,
  <Message key="a1" author="assistant" meta="replayed">
    Here is a settings screen composed from Card, Switch and a destructive Button. The danger zone sits last, in its
    own card.
  </Message>,
  <Message key="u2" author="user" meta="12:05">
    Add a sign-out row above the danger zone
  </Message>,
  <Message key="a2" author="assistant" meta="replayed">
    Added a ListRow with a sign-out action. It uses the secondary button so the destructive one stays the only red
    thing on the screen.
  </Message>,
];

/** A short exchange in a fixed-height region. */
export const Default: Story = {
  args: { className: 'h-96', children: exchange },
};

/** No turns yet: the empty state teaches what to ask. */
export const Empty: Story = {
  args: {
    className: 'h-96',
    framed: true,
    emptyState: (
      <EmptyState
        icon="Search"
        title="Describe a screen"
        description="Ask for a layout and it is built from Scorp DS components."
        primaryAction={{ label: 'Try a settings screen', onClick: () => {} }}
        secondaryAction={{ label: 'Try a sign-in flow', onClick: () => {} }}
      />
    ),
  },
};

/** With the plate ring, as LogView. */
export const Framed: Story = {
  args: { className: 'h-96', framed: true, children: exchange },
};

/** Scrolled up while a turn arrives: following pauses and the jump button counts it. */
export const Paused: Story = {
  render: () => {
    const Demo = () => {
      const [turns, setTurns] = useState(exchange.slice(0, 4));
      return (
        <div className="space-y-3">
          <Transcript aria-label="Conversation" className="h-64" framed>
            {turns}
          </Transcript>
          <Button variant="secondary" size="sm" onClick={() => setTurns(exchange)}>
            Append a turn
          </Button>
        </div>
      );
    };
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const log = canvas.getByRole('log');
    // Wait for layout: before it settles nothing overflows, so scrolling up is
    // a no-op and the transcript never pauses.
    await waitFor(() => expect(log.scrollHeight).toBeGreaterThan(log.clientHeight + 8));
    log.scrollTop = 0;
    await canvas.findByRole('button', { name: 'Jump to latest' });
    await userEvent.click(canvas.getByRole('button', { name: 'Append a turn' }));
    await canvas.findByRole('button', { name: /Jump to latest \(1 new\)/ });
  },
};

/** A reply is streaming: the last turn carries the steady cursor and `aria-busy`, and the region follows it. */
export const Responding: Story = {
  args: {
    className: 'h-96',
    framed: true,
    busy: true,
    children: [
      ...exchange.slice(0, 4),
      <Message key="a2" author="assistant" status="streaming">
        Added a ListRow with a sign-out action. It uses the secondary button so
      </Message>,
    ],
  },
};

const words =
  'Here is a settings screen composed from Card, Switch and a destructive Button. The danger zone sits last, in its own card, so it is never the first thing a thumb reaches.'.split(
    ' '
  );

/** A reply streaming in, a word every 120ms, then starting over. */
export const Streaming: Story = {
  // Excluded from visual regression: the reply grows on a timer, so the frame
  // depends on when the capture lands. Responding covers the same state as a
  // still frame, and this story stays in the a11y pass.
  tags: ['skip-visual'],
  render: () => {
    const Demo = () => {
      const [n, setN] = useState(0);
      useEffect(() => {
        const t = window.setInterval(() => setN((v) => (v >= words.length + 8 ? 0 : v + 1)), 120);
        return () => window.clearInterval(t);
      }, []);
      const streaming = n < words.length;
      return (
        <Transcript aria-label="Conversation" className="h-64" framed busy={streaming}>
          {exchange.slice(0, 2)}
          <Message author="assistant" status={streaming ? 'streaming' : 'done'}>
            {words.slice(0, Math.max(n, 1)).join(' ')}
          </Message>
        </Transcript>
      );
    };
    return <Demo />;
  },
};
