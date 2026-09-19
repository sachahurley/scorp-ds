import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Modal } from '@scorp-ds/components';

const meta: Meta<typeof Modal> = {
  title: 'Components/Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: function ModalDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button type="button" onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Example dialog">
          <div className="p-6 font-mono text-sm text-secondary-800 dark:text-secondary-200">
            <p className="mb-4">
              Modal content scrolls when it exceeds the max height. Press Esc or click the backdrop to
              close.
            </p>
            <Button variant="primary" size="small" type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  },
};

export const LongContent: Story = {
  name: 'Long content',
  render: function LongModal() {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <Button type="button" variant="secondary" size="small" onClick={() => setOpen(true)}>
          Re-open
        </Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Scrollable region">
          <div className="space-y-3 p-6 font-mono text-sm text-secondary-800 dark:text-secondary-200">
            {Array.from({ length: 24 }, (_, i) => (
              <p key={i}>Line {i + 1} — demonstrates scroll inside the modal body.</p>
            ))}
          </div>
        </Modal>
      </div>
    );
  },
};

/** Footer variant: right-aligned CTA band (secondary cancel + primary confirm). */
export const WithFooter: Story = {
  name: 'With footer CTAs',
  render: function ModalFooterDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button type="button" onClick={() => setOpen(true)}>
          Open modal with footer
        </Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Claim reward"
          footerContent={
            <>
              <Button variant="secondary" size="small" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="button" onClick={() => setOpen(false)}>
                Claim
              </Button>
            </>
          }
        >
          <p className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
            A new theme egg is hatching on the progress track. Claim it now or keep it for later.
          </p>
        </Modal>
      </div>
    );
  },
};
