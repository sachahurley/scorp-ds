import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Button, Toast, Toaster, toast, type ToastItem } from '@scorp-ds/components';

/**
 * Components / Feedback / Toast
 *
 * Transient feedback plates that rise from the bottom edge on a stepped
 * transition. Don't use for errors that require action (use Alert) or
 * anything the user must read before continuing (use Modal).
 *
 * Imperative API (recommended): mount `<Toaster />` once, then call
 * `toast("Saved")`, `toast.success(...)`, `toast.error(...)`, etc. from
 * anywhere. Options: `action` ({ label, onClick }), `duration` (default
 * 5000ms, paused on hover/focus, `Infinity` persists), `id` (replace in place).
 * `toast.dismiss(id?)` removes one or all. The controlled
 * `<Toaster toasts onDismiss />` API still works.
 *
 * Accessibility: the region is `aria-live="polite"`; error toasts are
 * `role="alert"`, the rest `role="status"`. Persistent toasts get a dismiss
 * button; any plate can be clicked to dismiss.
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
/**
 * Deliberately has no `play` function, and should not be given one.
 *
 * Pushing a toast here starts a 3200ms self-expiry, so any screenshot becomes a
 * race between the settle wait and the dismissal. The appearance of a toast is
 * already covered, stably, by Variants and With action, which render `<Toast>`
 * directly with no queue and no timer. Opening this one would buy redundant
 * coverage at the cost of a frame that can flake.
 */
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

/** Imperative: one `<Toaster />`, then `toast()` from any handler. */
/** No `play` here either, for the same reason as Default: the queue self-expires. */
export const Imperative: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="secondary" onClick={() => toast('Link copied')}>
        Default
      </Button>
      <Button type="button" variant="secondary" onClick={() => toast.success('Profile saved')}>
        Success
      </Button>
      <Button type="button" variant="secondary" onClick={() => toast.info('New version available')}>
        Info
      </Button>
      <Button type="button" variant="secondary" onClick={() => toast.warning('Storage almost full')}>
        Warning
      </Button>
      <Button type="button" variant="secondary" onClick={() => toast.error('Upload failed')}>
        Error
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => toast('Item deleted', { action: { label: 'Undo', onClick: () => toast.success('Restored') } })}
      >
        With Undo
      </Button>
      <Button type="button" variant="secondary" onClick={() => toast.info('Syncing library', { duration: Infinity })}>
        Persistent
      </Button>
      <Toaster />
    </div>
  ),
};

/** Every variant, rendered in place (no timers) so they can be compared. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-2">
      <Toast>Link copied</Toast>
      <Toast variant="success">Profile saved</Toast>
      <Toast variant="info">New version available</Toast>
      <Toast variant="warning">Storage almost full</Toast>
      <Toast variant="error">Upload failed</Toast>
    </div>
  ),
};

/** Inline action (Undo) and the persistent dismiss button. */
export const WithAction: Story = {
  name: 'With action',
  render: () => (
    <div className="flex flex-col items-center gap-2">
      <Toast action={{ label: 'Undo', onClick: () => {} }}>Item deleted</Toast>
      <Toast variant="error" action={{ label: 'Retry', onClick: () => {} }}>
        Upload failed
      </Toast>
      <Toast variant="info" duration={Infinity} onDismiss={() => {}}>
        Syncing library
      </Toast>
    </div>
  ),
};
