import {
  Badge,
  Button,
  Card,
  CodeBlock,
  Composer,
  DescriptionList,
  Message,
  Stack,
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

/** The specimen source shown in the canvas pane's Code tab: what the conversation produced. */
export const chatGeneratedSource = `<Card title="Notifications">
  <Switch label="Email digests" />
  <Switch label="Mentions" />
</Card>
<Card title="Danger zone">
  <Button variant="destructive">Delete account</Button>
</Card>`;

/** The specimen conversation: a replay notice, one prompt and one reply. */
const chatTurns = [
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

/**
 * The chat pane: a `Window` whose body is a `Transcript` over a `Composer`. The Window
 * turns its own scroll off (`scroll={false}`, body `flex flex-col p-0`) so the
 * Transcript is the only scroll region, and the Composer stays pinned under it. In
 * replay the Composer is `disabled` and says why in its `helperText`.
 */
export function ChatPane({ className }: { className?: string }) {
  return (
    <Window title="chat" status="replay" scroll={false} bodyClassName="flex flex-col p-0" className={className}>
      <Transcript aria-label="Conversation" width="full" className="min-h-0 flex-1">
        {chatTurns}
      </Transcript>
      <div className="p-3 pt-0">
        <Composer
          aria-label="Message"
          onSubmit={() => {}}
          disabled
          helperText="Replaying a recorded session. Typing is off."
        />
      </div>
    </Window>
  );
}

/** The screen the conversation produced, rendered in the canvas pane's Preview tab. */
function GeneratedScreen() {
  return (
    <Stack gap="4" className="mx-auto max-w-md">
      <Card title="Notifications">
        <Stack gap="3">
          <Switch label="Email digests" checked onCheckedChange={() => {}} />
          <Switch label="Mentions" onCheckedChange={() => {}} />
        </Stack>
      </Card>
      <Card title="Danger zone">
        <Button type="button" variant="destructive">
          Delete account
        </Button>
      </Card>
    </Stack>
  );
}

/**
 * The canvas pane: a `Window` titled with the generated screen's name, holding `Tabs`
 * for the three views of what the conversation produced: Preview (the rendered
 * screen), Code (an unframed `CodeBlock`, since the Window is the frame) and Spec (a
 * `DescriptionList` of components, node count and system gaps).
 */
export function ChatCanvasPane({ className }: { className?: string }) {
  return (
    <Window
      title="settings-screen"
      status="6 nodes"
      scroll={false}
      bodyClassName="flex flex-col p-0"
      className={className}
    >
      <Tabs defaultValue="preview" className="flex min-h-0 flex-1 flex-col">
        <TabsList aria-label="Canvas views" className="px-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="spec">Spec</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="min-h-0 flex-1 overflow-auto p-4">
          <GeneratedScreen />
        </TabsContent>
        <TabsContent value="code" className="min-h-0 flex-1">
          <CodeBlock
            title="settings-screen.tsx"
            language="tsx"
            code={chatGeneratedSource}
            framed={false}
            showLineNumbers
          />
        </TabsContent>
        <TabsContent value="spec" className="p-4">
          <DescriptionList
            items={[
              { term: 'Components', description: 'Card, Switch, Button' },
              { term: 'Nodes', description: '6' },
              { term: 'Gaps', description: <Badge tone="success">none</Badge> },
            ]}
          />
        </TabsContent>
      </Tabs>
    </Window>
  );
}

/**
 * The session status line: the mode in text (`REPLAY`, never colour alone), the
 * session name, and what the generation used and missed. Gaps are `success` at zero
 * and `warning` above.
 */
export function ChatSessionStatus() {
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

/** How the two panes share the screen. */
export type ChatComposerLayout = 'split' | 'tabs';

/**
 * Chat composer preset: a terminal workbench for describing a screen and seeing it
 * built from Scorp DS components. A chat pane (`Transcript` over `Composer` in a
 * `Window`) beside a canvas pane (Preview, Code and Spec tabs in a `Window`), with a
 * `StatusLine` under both that says the session is replayed.
 *
 * `layout="split"` (default) puts the panes side by side: a horizontal `Stack` with
 * `align="stretch"` and `gap="4"`, the chat pane `w-96` and not shrinking, the canvas
 * taking the rest. `layout="tabs"` shows one pane at a time behind a real `Tabs`
 * control, for widths below `lg`; product code picks the layout from the viewport.
 * The preset fills its parent's height (`min-h-0 flex-1`), so put it in a flex column
 * that owns the viewport.
 *
 * Consumed by `Patterns/ChatComposer`. It is the reference composition for
 * scorp-protodash's composer; if that project renders it, vendor this file with it.
 *
 * @example
 * <div className="flex h-screen flex-col bg-[var(--surface-page)] p-4 md:p-6">
 *   <ChatComposerWorkbench layout="split" />
 * </div>
 */
export function ChatComposerWorkbench({ layout = 'split' }: { layout?: ChatComposerLayout }) {
  return (
    <Stack gap="4" className="min-h-0 flex-1">
      {layout === 'split' ? (
        <Stack axis="horizontal" align="stretch" gap="4" className="min-h-0 flex-1">
          <ChatPane className="w-96 shrink-0" />
          <ChatCanvasPane className="min-w-0 flex-1" />
        </Stack>
      ) : (
        <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col gap-4">
          <TabsList aria-label="Panes">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex min-h-0 flex-1 flex-col">
            <ChatPane className="min-h-0 flex-1" />
          </TabsContent>
          <TabsContent value="canvas" className="flex min-h-0 flex-1 flex-col">
            <ChatCanvasPane className="min-h-0 flex-1" />
          </TabsContent>
        </Tabs>
      )}
      <ChatSessionStatus />
    </Stack>
  );
}
