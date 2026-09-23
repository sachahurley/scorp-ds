import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { Button, Tooltip } from '@scorp-ds/components';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Display/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    delay: { control: 'number' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const OnButton: Story = {
  // A tooltip has no controlled `open` prop: hover and focus are the only ways in,
  // so the baseline is a picture of the trigger unless a play function opens it.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Hover or focus me' }));
  },
  args: {
    content: 'Opens on hover or keyboard focus. Escape closes it.',
    position: 'top',
    delay: 200,
    children: <Button variant="secondary">Hover or focus me</Button>,
  },
};

/**
 * Only one tooltip can be hovered at a time, so a single story can only ever
 * capture one placement. This one covers `top`; {@link PositionLeft} covers the
 * rotated path (`left` and `right` share the rotate-plus-offset recipe, which is
 * the geometry most likely to break). `bottom` is the mirror of `top`.
 */
export const Positions: Story = {
  name: 'Positions',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Top' }));
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <Tooltip content="Top" position="top">
        <Button variant="ghost" size="sm">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Bottom" position="bottom">
        <Button variant="ghost" size="sm">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left" position="left">
        <Button variant="ghost" size="sm">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Right" position="right">
        <Button variant="ghost" size="sm">
          Right
        </Button>
      </Tooltip>
    </div>
  ),
};

/**
 * The rotated caret path. `left` and `right` share a recipe the vertical
 * placements do not use: the caret is rotated 90 degrees and nudged by
 * `--plate-caret-offset` so it stays flush against the balloon. Worth its own
 * story because that offset is the part a token change breaks quietly.
 */
export const PositionLeft: Story = {
  name: 'Position: left',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Left' }));
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <Tooltip content="Left" position="left">
        <Button variant="ghost" size="sm">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Right" position="right">
        <Button variant="ghost" size="sm">
          Right
        </Button>
      </Tooltip>
    </div>
  ),
};

/**
 * Viewport flip: each trigger sits against a viewport edge and asks for the
 * side facing it. Hover or focus one: the tooltip flips to the opposite side,
 * and top/bottom tooltips slide sideways to stay on screen (the caret keeps
 * pointing at the trigger).
 */
export const ViewportFlip: Story = {
  name: 'Viewport flip',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="relative h-screen w-full">
      <div className="absolute left-0 top-0">
        <Tooltip content="Asked for top, flipped below" position="top">
          <Button variant="secondary" size="sm">
            Top edge
          </Button>
        </Tooltip>
      </div>
      <div className="absolute bottom-0 right-0">
        <Tooltip content="Asked for bottom, flipped above" position="bottom">
          <Button variant="secondary" size="sm">
            Bottom edge
          </Button>
        </Tooltip>
      </div>
      <div className="absolute right-0 top-1/2">
        <Tooltip content="Asked for right, flipped left" position="right">
          <Button variant="secondary" size="sm">
            Right edge
          </Button>
        </Tooltip>
      </div>
      <div className="absolute left-0 top-1/2">
        <Tooltip content="Asked for left, flipped right" position="left">
          <Button variant="secondary" size="sm">
            Left edge
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};
