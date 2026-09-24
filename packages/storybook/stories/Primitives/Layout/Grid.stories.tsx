import type { Meta, StoryObj } from '@storybook/react';
import { Box, Grid, Stack } from '@scorp-ds/components';

const meta: Meta<typeof Grid> = {
  title: 'Primitives/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 4, 5, 6, 8, 12] },
    gap: { control: 'select', options: ['none', '1', '2', '3', '4', '5', '6', '8'] },
    rowGap: { control: 'select', options: [undefined, 'none', '1', '2', '3', '4', '5', '6', '8'] },
    columnGap: { control: 'select', options: [undefined, 'none', '1', '2', '3', '4', '5', '6', '8'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Grid lays items out in rows and columns with a token-backed gap. The column count can change per breakpoint: pass a number, or a map such as { base: 1, md: 2, lg: 3 }.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const cell = (label: string) => (
  <Box key={label} background="muted" padding="4">
    <span className="font-mono text-sm text-[var(--text-primary)]">{label}</span>
  </Box>
);

const cells = (count: number) =>
  Array.from({ length: count }, (_, index) => cell(String(index + 1).padStart(2, '0')));

/** The default grid: one column, 16px gap. */
export const Default: Story = {
  args: {
    columns: 3,
    gap: '4',
    children: cells(6),
  },
};

/** A fixed column count for a layout that keeps its shape at every width. */
export const Columns: Story = {
  render: () => (
    <Stack gap="6">
      {([2, 3, 4] as const).map((columns) => (
        <Stack key={columns} gap="2">
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            columns={'{'}
            {columns}
            {'}'}
          </span>
          <Grid columns={columns} gap="3">
            {cells(columns * 2)}
          </Grid>
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * A responsive map: one column on phones, two from `md` (768px) and four from
 * `xl` (1280px). Resize the preview to see it change.
 */
/**
 * `columns` takes a breakpoint map. One frame can only ever show one breakpoint,
 * so the three states are three stories: this one is `md` (2 columns), captured
 * at the harness default width. {@link ResponsiveColumnsBase} and
 * {@link ResponsiveColumnsWide} cover the other two.
 */
export const ResponsiveColumns: Story = {
  name: 'Responsive Columns: md',
  args: {
    columns: { base: 1, md: 2, xl: 4 },
    gap: '4',
    children: cells(8),
  },
};

/** The same grid below `md`: the map falls back to `base`, one column. */
export const ResponsiveColumnsBase: Story = {
  name: 'Responsive Columns: base',
  parameters: { viewport: { defaultViewport: 'mobileSmall' } },
  args: ResponsiveColumns.args,
};

/** The same grid at `xl` and above: four columns. */
export const ResponsiveColumnsWide: Story = {
  name: 'Responsive Columns: xl',
  parameters: { viewport: { defaultViewport: 'desktopSm' } },
  args: ResponsiveColumns.args,
};

/** `rowGap` and `columnGap` split the gap when rows need more air than columns. */
export const SplitGaps: Story = {
  args: {
    columns: 3,
    columnGap: '2',
    rowGap: '8',
    children: cells(6),
  },
};

/** `align` decides whether short cells stretch to the tallest one in their row. */
export const Align: Story = {
  render: () => (
    <Stack gap="6">
      {(['stretch', 'start', 'center'] as const).map((align) => (
        <Stack key={align} gap="2">
          <span className="font-mono text-xs text-[var(--text-secondary)]">align=&quot;{align}&quot;</span>
          <Grid columns={3} gap="3" align={align}>
            <Box background="muted" padding="3">
              <span className="font-mono text-sm text-[var(--text-primary)]">
                A taller cell with two lines of content in it.
              </span>
            </Box>
            {cell('short')}
            {cell('short')}
          </Grid>
        </Stack>
      ))}
    </Stack>
  ),
};

/** A realistic composition: a responsive gallery of plates. */
export const ProjectGallery: Story = {
  render: () => (
    <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap="4" role="list" aria-label="Projects">
      {[
        ['scorp-ds', 'design system'],
        ['protodash', 'prototype dashboard'],
        ['portfolio', 'marketing site'],
        ['tui-art', 'frame renderer'],
        ['showcase', 'documentation site'],
        ['tokens', 'W3C token source'],
      ].map(([name, description]) => (
        <Box key={name} role="listitem" border="hairline" padding="4">
          <Stack gap="2">
            <span className="font-mono text-sm font-bold text-[var(--text-primary)]">{name}</span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">{description}</span>
          </Stack>
        </Box>
      ))}
    </Grid>
  ),
};
