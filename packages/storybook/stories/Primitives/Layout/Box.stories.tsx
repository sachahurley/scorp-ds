import type { Meta, StoryObj } from '@storybook/react';
import { Box, Inline, Stack } from '@scorp-ds/components';

const meta: Meta<typeof Box> = {
  title: 'Primitives/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    padding: { control: 'select', options: ['none', '1', '2', '3', '4', '5', '6', '8'] },
    paddingX: { control: 'select', options: [undefined, 'none', '1', '2', '3', '4', '5', '6', '8'] },
    paddingY: { control: 'select', options: [undefined, 'none', '1', '2', '3', '4', '5', '6', '8'] },
    background: {
      control: 'select',
      options: ['none', 'page', 'container', 'card', 'subtle', 'muted', 'raised', 'inverse'],
    },
    border: { control: 'inline-radio', options: ['none', 'hairline'] },
    as: { control: 'select', options: ['div', 'section', 'article', 'aside', 'figure', 'span'] },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Box is the base surface: padding from the spacing scale, a semantic background, and an optional hairline plate ring. Use a plain div when the wrapper only needs layout classes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

/** The default Box: a padded, ringed plate on the card surface. */
export const Default: Story = {
  args: {
    padding: '4',
    border: 'hairline',
    children: (
      <span className="font-mono text-sm text-[var(--text-primary)]">
        A padded plate on the card surface.
      </span>
    ),
  },
};

/** Every semantic surface a Box can paint, each with the same 16px inset. */
export const Backgrounds: Story = {
  render: () => (
    <Stack gap="3">
      {(['page', 'container', 'card', 'subtle', 'muted', 'raised', 'inverse'] as const).map(
        (background) => (
          <Box key={background} background={background} padding="4">
            <span className="font-mono text-sm">background=&quot;{background}&quot;</span>
          </Box>
        )
      )}
    </Stack>
  ),
};

/** Padding steps, and the axis props that replace `padding` on one axis. */
export const Padding: Story = {
  render: () => (
    <Stack gap="3">
      {(['1', '2', '4', '6', '8'] as const).map((padding) => (
        <Box key={padding} padding={padding} border="hairline">
          <span className="font-mono text-sm text-[var(--text-primary)]">padding=&quot;{padding}&quot;</span>
        </Box>
      ))}
      <Box paddingX="8" paddingY="2" border="hairline">
        <span className="font-mono text-sm text-[var(--text-primary)]">
          paddingX=&quot;8&quot; paddingY=&quot;2&quot;
        </span>
      </Box>
    </Stack>
  ),
};

/** `border="hairline"` draws the plate ring: a stroke layer with the fill clipped 1px inside it. */
export const Border: Story = {
  render: () => (
    <Inline gap="4" align="start">
      <Box padding="4" background="muted">
        <span className="font-mono text-sm text-[var(--text-primary)]">border=&quot;none&quot;</span>
      </Box>
      <Box padding="4" border="hairline">
        <span className="font-mono text-sm text-[var(--text-primary)]">border=&quot;hairline&quot;</span>
      </Box>
    </Inline>
  ),
};

/** A realistic composition: a labelled panel built from Box, Stack and Inline. */
export const StatusPanel: Story = {
  render: () => (
    <Box as="section" border="hairline" padding="6" aria-label="Build status" className="max-w-md">
      <Stack gap="4">
        <Stack gap="1">
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">build 4821</span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            main · 2026-09-22 14:02
          </span>
        </Stack>
        <Box background="muted" padding="3">
          <Stack gap="1">
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              &gt; tsc --noEmit ... clean
            </span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              &gt; vitest run ... 49 passed
            </span>
          </Stack>
        </Box>
        <Inline gap="2">
          <Box background="inverse" paddingX="3" paddingY="1">
            <span className="font-mono text-xs">passing</span>
          </Box>
          <Box border="hairline" paddingX="3" paddingY="1">
            <span className="font-mono text-xs text-[var(--text-primary)]">12.4s</span>
          </Box>
        </Inline>
      </Stack>
    </Box>
  ),
};
