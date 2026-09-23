import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
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
          <div className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
            <p className="mb-4">
              Modal content scrolls when it exceeds the max height. Press Esc or click the backdrop to
              close.
            </p>
            <Button variant="primary" size="sm" type="button" onClick={() => setOpen(false)}>
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
        <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Re-open
        </Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Scrollable region">
          <div className="space-y-3 font-mono text-sm text-secondary-800 dark:text-secondary-200">
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
  // Opens on render so the baseline captures the modal, its hairline-ruled header and footer, which is the whole
  // point of this story and is invisible while it is closed. Storybook runs play
  // functions in the preview, so the visual harness and the a11y runner both see
  // the open state without either needing to know this story exists.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal with footer' }));
  },

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
              <Button variant="secondary" size="sm" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="button" onClick={() => setOpen(false)}>
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

/**
 * Docked: on wide viewports the panel pins bottom-center with no scrim and
 * no scroll lock — a non-modal dialog acting on a page that stays visible
 * (the portfolio's equip/compare card). The switch point is the
 * --breakpoint-docked token (960px); narrow the viewport below it and
 * the same props render the standard centered modal.
 */
export const Docked: Story = {
  // Opens on render so the baseline captures the docked panel and its drop-shadow elevation, which is the whole
  // point of this story and is invisible while it is closed. Storybook runs play
  // functions in the preview, so the visual harness and the a11y runner both see
  // the open state without either needing to know this story exists.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open docked panel' }));
  },

  render: function DockedModalDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button type="button" onClick={() => setOpen(true)}>
          Open docked panel
        </Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Compare"
          docked
          width={640}
          footerContent={
            <Button variant="primary" size="sm" type="button" onClick={() => setOpen(false)}>
              Equip
            </Button>
          }
        >
          <div className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
            The page behind stays visible and interactive; Esc or the close plate dismisses.
          </div>
        </Modal>
      </div>
    );
  },
};
