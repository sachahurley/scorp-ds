import type { Meta, StoryObj } from '@storybook/react';
import { Box, Container, Inline, Stack } from '@scorp-ds/components';

const meta: Meta<typeof Container> = {
  title: 'Primitives/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    gutter: { control: 'boolean' },
    as: { control: 'select', options: ['div', 'section', 'article', 'nav', 'aside'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Container is the page-width wrapper: one max width and one set of gutters, in place of hand-written mx-auto max-w-* px-* runs. Widths follow the breakpoint scale.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

const ruler = (label: string) => (
  <Box background="muted" padding="4">
    <span className="font-mono text-sm text-[var(--text-primary)]">{label}</span>
  </Box>
);

/** The default container: a 1024px column, centered, with 20px gutters (40px from `lg`). */
export const Default: Story = {
  args: {
    children: ruler('size="lg", a 1024px max width'),
  },
};

/** Each size stops at a breakpoint width, so a container never straddles one. */
export const Sizes: Story = {
  render: () => (
    <Stack gap="3" className="py-4">
      {(
        [
          ['sm', '640px'],
          ['md', '768px'],
          ['lg', '1024px'],
          ['xl', '1280px'],
          ['full', 'no limit'],
        ] as const
      ).map(([size, width]) => (
        <Container key={size} size={size}>
          {ruler(`size="${size}", ${width}`)}
        </Container>
      ))}
    </Stack>
  ),
};

/** `gutter={false}` removes the horizontal inset, for a band that owns the edge itself. */
export const WithoutGutter: Story = {
  args: {
    gutter: false,
    children: ruler('gutter={false}, flush to the container edge'),
  },
};

/**
 * A realistic composition: a full-bleed band whose background reaches the
 * viewport edges while the text stays inside the measure.
 */
export const PageShell: Story = {
  render: () => (
    <Stack gap="none">
      <Box background="inverse" paddingY="4" as="section" aria-label="Site header">
        <Container>
          <Inline justify="between" className="w-full">
            <span className="font-mono text-sm font-bold">scorp-ds</span>
            <Inline gap="4">
              <span className="font-mono text-xs">tokens</span>
              <span className="font-mono text-xs">components</span>
              <span className="font-mono text-xs">patterns</span>
            </Inline>
          </Inline>
        </Container>
      </Box>
      <Container as="section" aria-label="Page content" className="py-8">
        <Stack gap="4">
          <span className="font-mono text-lg font-bold text-[var(--text-primary)]">
            Layout primitives
          </span>
          <span className="font-mono text-sm leading-relaxed text-[var(--text-secondary)]">
            The band above is a Box with an inverse surface; the Container inside it keeps the nav
            aligned with this paragraph. Vertical rhythm stays with Stack, so the Container only
            decides width and gutters.
          </span>
        </Stack>
      </Container>
    </Stack>
  ),
};
