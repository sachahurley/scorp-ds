import type { Meta, StoryObj } from '@storybook/react';
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
  args: {
    content: 'Opens on hover or keyboard focus. Escape closes it.',
    position: 'top',
    delay: 200,
    children: <Button variant="secondary">Hover or focus me</Button>,
  },
};

export const Positions: Story = {
  name: 'Positions',
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
