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
