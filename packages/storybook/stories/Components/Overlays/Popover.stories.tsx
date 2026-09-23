import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { Button, Checkbox, Input, Popover, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Popover> = {
  title: 'Components/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    offset: { control: 'number' },
    closeOnOutsideClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    matchAnchorWidth: { control: 'boolean' },
    portal: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Anchored, non-modal floating panel. Flips to the opposite side and shifts along the anchor to stay on screen; closes on outside press, Escape, or focus leaving; Escape returns focus to the trigger. Use `portal` inside plate-clipped containers (Card, Modal).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

/** Room around the trigger so the open panel fits inside the canvas. */
const Stage = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[360px] min-w-[420px] items-start justify-center p-8">{children}</div>
);

const FilterPanel = () => (
  <div className="flex w-64 flex-col gap-3">
    <p id="filters-title" className="font-mono text-sm font-medium text-[var(--text-primary)]">
      Filters
    </p>
    <Checkbox label="Only open issues" defaultChecked />
    <Checkbox label="Assigned to me" />
    <div className="flex justify-end gap-2">
      <Button variant="secondary" size="sm">
        Reset
      </Button>
      <Button size="sm">Apply</Button>
    </div>
  </div>
);

export const Default: Story = {
  // Open, so the panel is what the baseline covers. The Open story needs no play:
  // it already passes defaultOpen.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));
  },
  args: { side: 'bottom', align: 'start' },
  render: (args) => (
    <Stage>
      <Popover
        {...args}
        aria-labelledby="filters-title"
        trigger={
          <Button variant="secondary" iconLeft={<TuiIcon name="Settings" />}>
            Filters
          </Button>
        }
      >
        <FilterPanel />
      </Popover>
    </Stage>
  ),
};

/** Opens on load: the plate ring panel, stacked on `--z-index-popover`. */
export const Open: Story = {
  args: { side: 'bottom', align: 'start', defaultOpen: true, autoFocus: false },
  render: Default.render,
};

/** Every side; a panel flips to the opposite side when the canvas has no room for it. */
export const Sides: Story = {
  // Only one popover can be open at a time, so this covers `top`. The other three
  // sides share the same placement code path and differ only in direction.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'top' }));
  },
  render: () => (
    <div className="grid min-h-[420px] grid-cols-2 place-items-center gap-24 p-24">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Popover
          key={side}
          side={side}
          align="center"
          aria-label={`${side} popover`}
          trigger={
            <Button variant="secondary" size="sm">
              {side}
            </Button>
          }
        >
          <p className="w-40">Placed on the {side} side.</p>
        </Popover>
      ))}
    </div>
  ),
};

/** Controlled: the parent owns `open` and closes it from inside the panel on submit. */
export const Controlled: Story = {
  // Open, so the baseline shows the controlled panel rather than a trigger that
  // looks identical to every other closed state.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Rename' }));
  },
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <Stage>
        <Popover
          open={open}
          onOpenChange={setOpen}
          aria-labelledby="rename-title"
          trigger={
            <Button variant="secondary" iconLeft={<TuiIcon name="Edit" />}>
              Rename
            </Button>
          }
        >
          <form
            className="flex w-64 flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <p id="rename-title" className="font-medium">
              Rename file
            </p>
            <Input label="Name" size="sm" defaultValue="report-final.pdf" />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Save
              </Button>
            </div>
          </form>
        </Popover>
      </Stage>
    );
  },
};
