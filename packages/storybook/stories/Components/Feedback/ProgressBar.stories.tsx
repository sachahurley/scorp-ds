import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '@scorp-ds/components';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: { control: 'select', options: ['primary', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    segments: { control: { type: 'number', min: 4, max: 40 } },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

const Frame = ({ children }: { children: ReactNode }) => <div className="flex w-80 flex-col gap-5">{children}</div>;

export const Default: Story = {
  render: (args) => (
    <Frame>
      <ProgressBar {...args} />
    </Frame>
  ),
  args: { label: 'Uploading report.pdf', value: 42 },
};

/** Omit `value` when the duration is unknown: a run of blocks hops along the track (held still under reduced motion). */
export const Indeterminate: Story = {
  render: Default.render,
  args: { label: 'Connecting to server' },
};

export const Variants: Story = {
  render: () => (
    <Frame>
      <ProgressBar label="Primary" value={60} />
      <ProgressBar label="Success" value={100} variant="success" />
      <ProgressBar label="Warning: storage almost full" value={85} variant="warning" />
      <ProgressBar label="Error: upload failed" value={30} variant="error" />
    </Frame>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Frame>
      <ProgressBar label="Small" value={40} size="sm" />
      <ProgressBar label="Medium" value={40} size="md" />
      <ProgressBar label="Large" value={40} size="lg" />
    </Frame>
  ),
};

/** `showLabel={false}` hides the text but keeps the accessible name. */
export const HiddenLabel: Story = {
  name: 'Hidden label',
  render: Default.render,
  args: { label: 'Sync progress', value: 70, showLabel: false },
};

/** A live bar stepping from 0 to 100. */
export const Live: Story = {
  render: function LiveStory() {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const id = window.setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 400);
      return () => window.clearInterval(id);
    }, []);
    return (
      <Frame>
        <ProgressBar label="Installing packages" value={value} />
      </Frame>
    );
  },
};
