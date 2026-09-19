import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button, Toaster, type ToastItem } from '@scorp-ds/components';

/**
 * Components / Feedback / Toast
 *
 * Transient feedback plates that rise from the bottom edge on a stepped
 * transition. Don't use for errors that require action (use Alert) or
 * anything the user must read before continuing (use Modal).
 *
 * Accessibility: the region is `aria-live="polite"`; each toast is
 * `role="status"`. Click a plate to dismiss when `onDismiss` is wired.
 */
const meta: Meta<typeof Toaster> = {
  title: 'Components/Feedback/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

/** Pattern C: the story owns the queue; the Toaster just renders it. */
export const Default: Story = {
  render: function ToasterDemo() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const nextId = useRef(0);

    const push = (message: string) => {
      const id = nextId.current++;
      setToasts((t) => [...t, { id, message }]);
      // Toasts self-expire; click also dismisses
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    };

    return (
      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={() => push('+40 XP · nice find')}>
          Earn XP
        </Button>
        <Button type="button" variant="secondary" onClick={() => push('Copied to clipboard')}>
          Copy
        </Button>
        <Toaster toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      </div>
    );
  },
};
