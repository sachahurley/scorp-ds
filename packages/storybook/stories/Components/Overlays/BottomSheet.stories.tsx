import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { BottomSheet, Button } from '@scorp-ds/components';

/**
 * Components / Overlays / BottomSheet
 *
 * A bottom-anchored panel on the top-only large plate (stepped top corners,
 * square bottom edge). Don't use for blocking confirmations (use Modal) or
 * persistent navigation — sheets are for menus and quick actions.
 *
 * Accessibility: `role="dialog"` + `aria-modal` with an `ariaLabel` name;
 * Tab and Shift+Tab are trapped inside the sheet; the close button, ESC and a
 * scrim click all dismiss; the content region is keyboard-scrollable. The
 * grabber is a static seam marker, not a drag handle.
 */
const meta: Meta<typeof BottomSheet> = {
  title: 'Components/Overlays/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

/** Pattern C: the sheet owns its interaction lifecycle. */
export const Default: Story = {
  // Opens on render so the baseline captures the sheet and its stepped top corners, which is the whole
  // point of this story and is invisible while it is closed. Storybook runs play
  // functions in the preview, so the visual harness and the a11y runner both see
  // the open state without either needing to know this story exists.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
  },

  render: function SheetDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button type="button" onClick={() => setOpen(true)}>
          Open menu
        </Button>
        <BottomSheet isOpen={open} onClose={() => setOpen(false)} ariaLabel="Site menu">
          <nav className="flex flex-col gap-1 font-mono text-sm text-foreground-primary">
            {['Projects', 'Lab', 'Notes', 'Character sheet'].map((item) => (
              <button
                key={item}
                type="button"
                className="plate-round px-3 py-2.5 text-left transition-colors [transition-duration:var(--duration-fast)] hover:bg-surface-muted"
                onClick={() => setOpen(false)}
              >
                {item}
              </button>
            ))}
          </nav>
        </BottomSheet>
      </div>
    );
  },
};
