import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@scorp-ds/components';

const meta: Meta<typeof Stack> = {
  title: 'Primitives/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'select', options: ['none', '1', '2', '3', '4', '5', '6', '8'] },
    axis: { control: 'object' },
    align: { control: 'select', options: [undefined, 'start', 'center', 'end', 'stretch'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: {
    gap: '4',
    axis: 'vertical',
    children: (
      <>
        <div className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">Block A</div>
        <div className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">Block B</div>
        <div className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">Block C</div>
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    gap: '3',
    axis: 'horizontal',
    children: (
      <>
        <span className="bg-primary-200 px-2 py-1 font-mono text-xs dark:bg-primary-900">One</span>
        <span className="bg-primary-200 px-2 py-1 font-mono text-xs dark:bg-primary-900">Two</span>
        <span className="bg-primary-200 px-2 py-1 font-mono text-xs dark:bg-primary-900">Three</span>
      </>
    ),
  },
};

const pane = (label: string, key: string = label) => (
  <div key={key} className="bg-secondary-200 px-3 py-2 font-mono text-sm dark:bg-secondary-800">
    {label}
  </div>
);

/**
 * `axis` takes a breakpoint map: `{ base: 'vertical', md: 'horizontal' }` stacks the
 * children on phones and sets them side by side from `md` (768px). One frame shows one
 * width, so the two directions are two stories (decision 0012): this one is captured at
 * 1024, above `md`; {@link ResponsiveAxisBase} is the frame below it.
 */
export const ResponsiveAxis: Story = {
  name: 'Responsive Axis: md',
  parameters: { viewport: { defaultViewport: 'tabletLandscape' } },
  args: {
    gap: '3',
    axis: { base: 'vertical', md: 'horizontal' },
    children: [pane('Index'), pane('Inspector'), pane('Status')],
  },
};

/** The same stack below `md`: the map falls back to `base`, a column. */
export const ResponsiveAxisBase: Story = {
  name: 'Responsive Axis: base',
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  args: ResponsiveAxis.args,
};

/**
 * `align` sets the cross-axis placement at every breakpoint. Unset, a row centres its
 * children; `stretch` gives them the height of the tallest, which is what a split of
 * panes wants.
 */
export const Align: Story = {
  render: () => (
    <Stack gap="6">
      {([undefined, 'stretch', 'start', 'end'] as const).map((align) => (
        <Stack key={align ?? 'unset'} gap="2">
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {align === undefined ? 'align unset (centred)' : `align="${align}"`}
          </span>
          <Stack axis="horizontal" align={align} gap="3">
            <div className="bg-secondary-200 px-3 py-6 font-mono text-sm dark:bg-secondary-800">Tall</div>
            {pane('Short', 'a')}
            {pane('Short', 'b')}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};
