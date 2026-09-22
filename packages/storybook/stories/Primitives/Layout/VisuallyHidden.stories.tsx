import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Inline, Input, Stack, VisuallyHidden } from '@scorp-ds/components';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Primitives/Layout/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  argTypes: {
    focusable: { control: 'boolean' },
    as: { control: 'select', options: ['span', 'div', 'p', 'label', 'legend', 'li'] },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'VisuallyHidden renders text that screen readers announce and nobody sees, using the clip-rect recipe rather than display:none, which would remove the text from the accessibility tree along with the pixels.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

/**
 * The story below renders hidden text between the two rules. Nothing is
 * visible, and a screen reader still reads "Results updated".
 */
export const Default: Story = {
  render: () => (
    <Stack gap="2">
      <div className="h-px w-full bg-[var(--border-strong)]" />
      <VisuallyHidden>Results updated</VisuallyHidden>
      <div className="h-px w-full bg-[var(--border-strong)]" />
      <span className="font-mono text-xs text-[var(--text-secondary)]">
        One line of hidden text sits between these rules.
      </span>
    </Stack>
  ),
};

/** The common case: an icon-only button whose accessible name is hidden text. */
export const IconButtonLabel: Story = {
  render: () => (
    <Inline gap="3">
      <Button variant="icon" size="icon">
        <span aria-hidden="true" className="font-mono">
          x
        </span>
        <VisuallyHidden>Close panel</VisuallyHidden>
      </Button>
      <Button variant="icon" size="icon">
        <span aria-hidden="true" className="font-mono">
          +
        </span>
        <VisuallyHidden>Add row</VisuallyHidden>
      </Button>
    </Inline>
  ),
};

/**
 * `focusable` reveals the content once something inside it takes focus, the
 * behaviour a skip link needs. Tab into the frame to see the link appear.
 */
export const FocusableSkipLink: Story = {
  render: () => (
    <Box border="hairline" padding="4" className="relative">
      <VisuallyHidden focusable className="focus-within:absolute focus-within:left-4 focus-within:top-4">
        <a
          href="#vh-main"
          className="bg-[var(--surface-inverse)] px-3 py-2 font-mono text-xs text-[var(--text-on-inverse)]"
        >
          Skip to content
        </a>
      </VisuallyHidden>
      <Stack gap="2">
        <span className="font-mono text-xs text-[var(--text-secondary)]">
          Press Tab with this frame focused.
        </span>
        <span id="vh-main" className="font-mono text-sm text-[var(--text-primary)]">
          Main content starts here.
        </span>
      </Stack>
    </Box>
  ),
};

/** `as="label"` gives a control a real label element that only assistive tech sees. */
export const AsLabel: Story = {
  render: () => (
    <Stack gap="2">
      <VisuallyHidden as="label" htmlFor="vh-filter">
        Filter rows
      </VisuallyHidden>
      <Input id="vh-filter" type="search" placeholder="filter…" className="w-64" />
      <span className="font-mono text-xs text-[var(--text-secondary)]">
        The field has no visible label; the placeholder is decoration only.
      </span>
    </Stack>
  ),
};

/** A realistic composition: a table whose column of actions is named for screen readers. */
export const TableActions: Story = {
  render: () => (
    <Box border="hairline" padding="4" className="max-w-xl">
      <Stack gap="3">
        {[
          ['build 4821', 'passing'],
          ['build 4820', 'failed'],
        ].map(([name, status]) => (
          <Inline key={name} gap="3" justify="between" className="w-full">
            <Inline gap="3" align="baseline">
              <span className="font-mono text-sm text-[var(--text-primary)]">{name}</span>
              <span className="font-mono text-xs text-[var(--text-secondary)]">{status}</span>
            </Inline>
            <Button variant="ghost" size="sm">
              Rerun
              <VisuallyHidden> {name}</VisuallyHidden>
            </Button>
          </Inline>
        ))}
      </Stack>
    </Box>
  ),
};
