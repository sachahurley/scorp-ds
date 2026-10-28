import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Button,
  Card,
  CodeBlock,
  Composer,
  DescriptionList,
  Message,
  StatusLine,
  StatusLineSegment,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Transcript,
  Window,
} from '@scorp-ds/components';

/**
 * The chat composer pattern: a conversation on one side, what it produced on
 * the other, and a status line that says the session is replayed. Reference
 * composition for scorp-protodash's composer. Composes Window, Transcript,
 * Message, Composer, Tabs, CodeBlock, DescriptionList and StatusLine.
 */
const meta: Meta = {
  title: 'Patterns/ChatComposer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A terminal workbench for describing a screen and seeing it built from Scorp DS components. Two framed panes on desktop, one at a time below `lg`, and a status line that says the session is replayed. Composes Window, Transcript, Message, Composer, Tabs, CodeBlock, DescriptionList and StatusLine.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const generated = `<Card title="Notifications">
  <Switch label="Email digests" />
  <Switch label="Mentions" />
</Card>
<Card title="Danger zone">
  <Button variant="destructive">Delete account</Button>
</Card>`;

const turns = [
  <Message key="s" author="system">
    Replaying a recorded session.
  </Message>,
  <Message key="u" author="user" meta="12:04">
    Make a settings screen with a danger zone
  </Message>,
  <Message key="a" author="assistant" meta="replayed">
    Here is a settings screen: notification switches in one card, and the danger zone last, in its own card, with
    the only destructive button on the screen.
  </Message>,
];

function ChatPane({ className }: { className?: string }) {
  return (
    <Window title="chat" status="replay" scroll={false} bodyClassName="flex flex-col p-0" className={className}>
      <Transcript width="full" className="min-h-0 flex-1">
        {turns}
      </Transcript>
      <div className="p-3 pt-0">
        <Composer onSubmit={() => {}} disabled helperText="Replaying a recorded session. Typing is off." />
      </div>
    </Window>
  );
}

function Preview() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <Card title="Notifications">
        <div className="flex flex-col gap-3">
          <Switch label="Email digests" checked onCheckedChange={() => {}} />
          <Switch label="Mentions" onCheckedChange={() => {}} />
        </div>
      </Card>
      <Card title="Danger zone">
        <Button variant="destructive">Delete account</Button>
      </Card>
    </div>
  );
}

function CanvasPane({ className }: { className?: string }) {
  return (
    <Window title="settings-screen" status="6 nodes" scroll={false} bodyClassName="flex flex-col p-0" className={className}>
      <Tabs defaultValue="preview" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="px-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="spec">Spec</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="min-h-0 flex-1 overflow-auto p-4">
          <Preview />
        </TabsContent>
        <TabsContent value="code" className="min-h-0 flex-1">
          <CodeBlock title="settings-screen.tsx" language="tsx" code={generated} framed={false} showLineNumbers />
        </TabsContent>
        <TabsContent value="spec" className="p-4">
          <DescriptionList
            items={[
              { term: 'Components', description: 'Card, Switch, Button' },
              { term: 'Nodes', description: '6' },
              { term: 'Gaps', description: <Badge variant="warning">none</Badge> },
            ]}
          />
        </TabsContent>
      </Tabs>
    </Window>
  );
}

function Status() {
  return (
    <StatusLine
      left={
        <StatusLineSegment tone="info" icon="Play">
          REPLAY
        </StatusLineSegment>
      }
      center={<StatusLineSegment>settings-screen.session</StatusLineSegment>}
      right={
        <>
          <StatusLineSegment>3 components</StatusLineSegment>
          <StatusLineSegment tone="success" icon="Check">
            0 gaps
          </StatusLineSegment>
        </>
      }
    />
  );
}

function Frame({ children }: { children: ReactNode }) {
  return <div className="flex h-screen flex-col gap-3 bg-[var(--surface-page)] p-4">{children}</div>;
}

/** Desktop: chat and canvas side by side. */
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktopSm' } },
  render: () => (
    <Frame>
      <div className="flex min-h-0 flex-1 gap-3">
        <ChatPane className="w-96 shrink-0" />
        <CanvasPane className="min-w-0 flex-1" />
      </div>
      <Status />
    </Frame>
  ),
};

/** Below `lg`: one pane at a time, switched with Tabs. */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  render: () => (
    <Frame>
      <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col gap-3">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex min-h-0 flex-1 flex-col">
          <ChatPane className="min-h-0 flex-1" />
        </TabsContent>
        <TabsContent value="canvas" className="flex min-h-0 flex-1 flex-col">
          <CanvasPane className="min-h-0 flex-1" />
        </TabsContent>
      </Tabs>
      <Status />
    </Frame>
  ),
};
