import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from '@scorp-ds/components';

const meta: Meta<typeof Meter> = {
  title: 'Components/Terminal/Meter',
  component: Meter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gauge for a value in a known range (disk, quota, battery), not a progress bar. `role="meter"` with `aria-valuenow` / `min` / `max` / `aria-valuetext`, drawn as stepped blocks. Thresholds follow the native `<meter>` model: `low` / `high` split the range into three regions and `optimum` names the good one; the optimum region is `success`, one region away is `warning`, two away is `error` (no thresholds: `primary`). The label and value text are always visible, and warning / error add a 1-bit icon, so color is never the only signal.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'radio', options: ['sm', 'md'] },
    segments: { control: { type: 'number', min: 4, max: 40 } },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Meter>;

/** No thresholds: primary tone, percentage value text. */
export const Default: Story = {
  args: { label: 'Quota', value: 42, className: 'w-full max-w-sm' },
};

/** Disk usage: low is good (`optimum={0}`), so the tone climbs from success to error. */
export const Thresholds: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Meter label="Disk /" value={20} max={64} low={38} high={54} optimum={0} valueText="20 GB of 64 GB" />
      <Meter label="Disk /home" value={45} max={64} low={38} high={54} optimum={0} valueText="45 GB of 64 GB" />
      <Meter label="Disk /var" value={61} max={64} low={38} high={54} optimum={0} valueText="61 GB of 64 GB" />
    </div>
  ),
};

/** Battery: high is good (`optimum={100}`). */
export const HighIsGood: Story = {
  name: 'High is good (battery)',
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Meter label="Battery A" value={90} low={20} high={60} optimum={100} />
      <Meter label="Battery B" value={40} low={20} high={60} optimum={100} />
      <Meter label="Battery C" value={8} low={20} high={60} optimum={100} />
    </div>
  ),
};

/** Small blocks and a coarser grid. */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Meter label="Small, 10 blocks" value={70} size="sm" segments={10} />
      <Meter label="Medium, 20 blocks" value={70} />
      <Meter label="Medium, 32 blocks" value={70} segments={32} />
    </div>
  ),
};

/** Forced tone, independent of thresholds. */
export const ForcedTone: Story = {
  args: { label: 'CPU', value: 55, tone: 'warning', valueText: '55% (throttled)', className: 'w-full max-w-sm' },
};
