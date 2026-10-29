import type { Meta, StoryObj } from '@storybook/react';
import { ChatComposerWorkbench, type ChatComposerLayout } from '../../presets/chatComposer';

/**
 * Pattern: the chat composer, a conversation on one side and what it produced on the
 * other, with a status line that says the session is replayed. The composition lives
 * in `presets/chatComposer.tsx`; this story is the page shell.
 */
const meta: Meta = {
  title: 'Patterns/ChatComposer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A terminal workbench for describing a screen and seeing it built from Scorp DS components. Two framed panes on desktop, one at a time below `lg`, and a status line that says the session is replayed. Composes Window, Transcript, Message, Composer, Tabs, CodeBlock, DescriptionList and StatusLine.\n\n**Theme:** Storybook **Theme** toolbar for light/dark.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** The page shell around the preset: the page fill and the tool-screen edge (`p-4`, `p-6` from `md`). */
const shell = (layout: ChatComposerLayout) => () => (
  <div className="flex h-screen flex-col bg-[var(--surface-page)] p-4 md:p-6">
    <ChatComposerWorkbench layout={layout} />
  </div>
);

/** Desktop: chat and canvas side by side. */
export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: 'desktopSm' } },
  render: shell('split'),
};

/** Below `lg`: one pane at a time, switched with Tabs. The structure changes, so it gets its own frame (decision 0012). */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  render: shell('tabs'),
};
