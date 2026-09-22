import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Inline, Stack } from '@scorp-ds/components';

const meta: Meta<typeof Inline> = {
  title: 'Primitives/Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'select', options: ['none', '1', '2', '3', '4', '5', '6', '8'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline is the horizontal cluster: a row of items that wraps instead of overflowing. Use it for button rows, tag lists, meta rows and icon plus label pairs.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Inline>;

const chip = (label: string) => (
  <span
    key={label}
    className="bg-[var(--surface-muted)] px-2 py-1 font-mono text-xs text-[var(--text-primary)]"
  >
    {label}
  </span>
);

/** The default row: 8px gap, items centered, wrapping on. */
export const Default: Story = {
  args: {
    children: ['tokens', 'primitives', 'components', 'patterns'].map(chip),
  },
};

/** Gap steps come from the same spacing scale as Stack. */
export const Gap: Story = {
  render: () => (
    <Stack gap="4">
      {(['1', '2', '4', '6'] as const).map((gap) => (
        <Inline key={gap} gap={gap}>
          {chip(`gap="${gap}"`)}
          {chip('two')}
          {chip('three')}
        </Inline>
      ))}
    </Stack>
  ),
};

/** `align` decides how items of different heights line up across the row. */
export const Align: Story = {
  render: () => (
    <Stack gap="4">
      {(['start', 'center', 'end', 'baseline'] as const).map((align) => (
        <Box key={align} border="hairline" padding="3">
          <Inline gap="3" align={align}>
            <span className="font-mono text-2xl text-[var(--text-primary)]">Aa</span>
            <span className="font-mono text-sm text-[var(--text-primary)]">align=&quot;{align}&quot;</span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">smaller text</span>
          </Inline>
        </Box>
      ))}
    </Stack>
  ),
};

/** `justify="between"` pushes the ends apart across a full-width row. */
export const Justify: Story = {
  render: () => (
    <Stack gap="4">
      {(['start', 'center', 'end', 'between'] as const).map((justify) => (
        <Box key={justify} border="hairline" padding="3">
          <Inline gap="2" justify={justify}>
            {chip(`justify="${justify}"`)}
            {chip('two')}
            {chip('three')}
          </Inline>
        </Box>
      ))}
    </Stack>
  ),
};

/** With `wrap={false}` the row keeps one line, so long content overflows instead. */
export const NoWrap: Story = {
  args: {
    wrap: false,
    className: 'overflow-x-auto',
    children: ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel'].map(chip),
  },
};

/** A realistic composition: a card footer with meta on the left and actions on the right. */
export const CardFooter: Story = {
  render: () => (
    <Box border="hairline" padding="4" className="max-w-xl">
      <Stack gap="4">
        <span className="font-mono text-sm text-[var(--text-primary)]">
          Layout primitives for Scorp DS
        </span>
        <Inline gap="2" align="baseline">
          <Badge variant="success">shipped</Badge>
          <span className="font-mono text-xs text-[var(--text-secondary)]">six primitives</span>
        </Inline>
        <Inline gap="3" justify="between" className="w-full">
          <span className="font-mono text-xs text-[var(--text-secondary)]">updated 2026-09-22</span>
          <Inline gap="2">
            <Button variant="secondary" size="sm">
              Discard
            </Button>
            <Button size="sm">Save</Button>
          </Inline>
        </Inline>
      </Stack>
    </Box>
  ),
};
