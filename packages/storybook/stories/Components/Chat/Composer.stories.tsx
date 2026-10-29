import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent } from '@storybook/test';
import { Badge, Button, Composer, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Composer> = {
  title: 'Components/Chat/Composer',
  component: Composer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The prompt box of a chat surface. It grows as you type, sends on Enter (Shift+Enter adds a line), and turns its send button into a stop button while a reply is streaming. The field and its buttons share one plate, like a command line. Use `Textarea` instead in forms, where Enter must add a line break.\n\n' +
          '- **Keyboard:** Enter sends and Shift+Enter breaks the line, or Cmd/Ctrl+Enter sends with `submitKey="mod-enter"`. The visible hint says which, and is linked to the field so screen readers announce it. Enter never sends during IME composition.\n' +
          '- **Label:** the field needs a name, as `label`, `aria-label` or `aria-labelledby` (required by the type); the send and stop buttons are named by `sendLabel` and `stopLabel`.\n' +
          '- **Focus:** the 1px ring turns the focus colour while the field has focus, as in every text field; the action and send buttons show their own inset ring.',
      },
    },
  },
  args: { 'aria-label': 'Message', onSubmit: fn(), onStop: fn() },
  argTypes: {
    size: { control: 'select', options: ['md', 'lg'] },
    submitKey: { control: 'select', options: ['enter', 'mod-enter'] },
    busy: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxRows: { control: 'number' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Composer>;

/** Empty, with the placeholder and the shortcut hint. Send stays disabled until there is text. */
export const Default: Story = {};

const attach = (
  <Button type="button" variant="ghost" size="sm" aria-label="Attach a file">
    <TuiIcon name="Plus" />
  </Button>
);

/** A visible label above the plate, for a prompt that sits in a form-like page rather than a chat pane. */
export const WithLabel: Story = {
  name: 'With label',
  // The meta names every story with aria-label, which would win over the label.
  render: (args) => <Composer {...args} aria-label={undefined} label="Describe a screen" />,
};

/** Context chips above the field and a leading action. With text, send is enabled. */
export const WithContext: Story = {
  name: 'With context',
  args: {
    context: (
      <>
        <Badge size="sm">@Card</Badge>
        <Badge size="sm">@Switch</Badge>
      </>
    ),
    actions: attach,
    defaultValue: 'Make a settings screen with a danger zone',
  },
};

/** Longer than `maxRows`: the field stops growing and scrolls. */
export const Growing: Story = {
  args: {
    maxRows: 4,
    defaultValue:
      'Make a settings screen.\nA profile section with name and email.\nNotification switches.\nA danger zone with a destructive delete button.\nKeep it to one column on mobile.\nUse the Card component for each group.',
  },
};

/** A reply is streaming and can be stopped: send becomes stop, and the field stays editable for the next message. */
export const Busy: Story = {
  args: { busy: true, defaultValue: 'Now add a sign-out row' },
};

/** A reply is streaming and cannot be stopped (no `onStop`): send shows Button's loading state. */
export const Sending: Story = {
  args: { busy: true, defaultValue: 'Now add a sign-out row' },
  // The meta passes onStop to every story; this state is the one without it.
  render: (args) => <Composer {...args} onStop={undefined} />,
};

/** Over the limit: the error replaces the helper text, the ring and fill turn to the error colours. */
export const Error: Story = {
  args: {
    maxLength: 2000,
    defaultValue: 'Make a settings screen with a danger zone',
    helperText: 'Up to 2000 characters.',
    errorMessage: 'Shorten this to 2000 characters or fewer.',
  },
};

/** Typing is off: the whole plate dims, actions included, and the helper text says why. */
export const Disabled: Story = {
  args: { disabled: true, actions: attach, helperText: 'Replaying a recorded session.' },
};

/** md (default) and lg. */
export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4">
      <Composer {...args} size="md" aria-label="Message, medium" />
      <Composer {...args} size="lg" aria-label="Message, large" />
    </div>
  ),
};

/** Cmd/Ctrl+Enter sends; Enter adds a line. For long, multi-paragraph messages. */
export const ModEnter: Story = {
  name: 'Mod+Enter',
  args: { submitKey: 'mod-enter' },
};

/** Keyboard focus: the ring turns the focus colour (decision 0022). */
export const Focused: Story = {
  args: { actions: attach, defaultValue: 'Make a settings screen' },
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.focus();
    // The field is the first tab stop; the actions come after it
    await userEvent.tab();
  },
};

/** Focus on the send button: only the button's inset ring shows, the field's ring stays idle. */
export const SendFocused: Story = {
  name: 'Send focused',
  args: { defaultValue: 'Make a settings screen' },
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.focus();
    // Field, then the send button (there are no leading actions here)
    await userEvent.tab();
    await userEvent.tab();
  },
};
