import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Center, Inline, Input, Stack } from '@scorp-ds/components';

const meta: Meta<typeof Center> = {
  title: 'Primitives/Layout/Center',
  component: Center,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'none'] },
    andText: { control: 'boolean' },
    fullHeight: { control: 'boolean' },
    as: { control: 'select', options: ['div', 'section', 'article', 'figure'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Center puts one column of content in the middle of its parent: a measured width, optional centered text, and optional viewport-height centering for splash and sign-in screens.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Center>;

/** The default: a 448px column, centered horizontally, text left-aligned. */
export const Default: Story = {
  args: {
    className: 'py-8',
    children: (
      <Box background="muted" padding="4">
        <span className="font-mono text-sm text-[var(--text-primary)]">
          maxWidth=&quot;md&quot;, a 448px column, centered in its parent.
        </span>
      </Box>
    ),
  },
};

/** The column widths, from a narrow callout to a full paragraph measure. */
export const MaxWidth: Story = {
  render: () => (
    <Stack gap="3" className="py-6">
      {(
        [
          ['xs', '320px'],
          ['sm', '384px'],
          ['md', '448px'],
          ['lg', '512px'],
          ['xl', '576px'],
          ['2xl', '672px'],
        ] as const
      ).map(([maxWidth, width]) => (
        <Center key={maxWidth} maxWidth={maxWidth}>
          <Box background="muted" padding="3">
            <span className="font-mono text-sm text-[var(--text-primary)]">
              maxWidth=&quot;{maxWidth}&quot;, {width}
            </span>
          </Box>
        </Center>
      ))}
    </Stack>
  ),
};

/** `andText` centers the words as well as the box; leave it off for forms and prose. */
export const AndText: Story = {
  render: () => (
    <Stack gap="4" className="py-6">
      <Center maxWidth="sm">
        <Box border="hairline" padding="4">
          <span className="font-mono text-sm text-[var(--text-primary)]">
            Default: the box is centered, the text stays ragged right, which is easier to read.
          </span>
        </Box>
      </Center>
      <Center maxWidth="sm" andText>
        <Box border="hairline" padding="4">
          <span className="font-mono text-sm text-[var(--text-primary)]">
            andText: short copy sits in the middle, which suits empty states and splash screens.
          </span>
        </Box>
      </Center>
    </Stack>
  ),
};

/** `fullHeight` also centers vertically in the viewport, for a screen that owns the page. */
export const FullHeight: Story = {
  render: () => (
    <Center maxWidth="sm" andText fullHeight as="section" aria-label="Empty state">
      <Box border="hairline" padding="6">
        <Stack gap="4">
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
            No runs yet
          </span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Trigger a build to see its output here.
          </span>
          <Inline gap="2" justify="center" className="w-full">
            <Button size="sm">Run build</Button>
          </Inline>
        </Stack>
      </Box>
    </Center>
  ),
};

/** A realistic composition: a sign-in card centered on the page. */
export const SignInCard: Story = {
  render: () => (
    <Center maxWidth="sm" fullHeight as="section" aria-label="Sign in">
      <Box border="hairline" padding="6">
        <Stack gap="5">
          <Stack gap="1">
            <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Sign in</span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              Use the account that owns the workspace.
            </span>
          </Stack>
          <Input id="center-email" type="email" label="Email" placeholder="you@example.com" />
          <Button>Continue</Button>
        </Stack>
      </Box>
    </Center>
  ),
};
