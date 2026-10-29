import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Badge, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'error', 'primary', 'bone'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Label' },
};

export const Primary: Story = {
  args: { tone: 'primary', children: 'New' },
};

export const WithIcon: Story = {
  args: {
    tone: 'success',
    children: 'Synced',
    iconLeft: <TuiIcon name="Check" size="4" />,
  },
};

export const Dismissible: Story = {
  args: {
    tone: 'info',
    children: 'Filter on',
    onDismiss: fn(),
  },
};

// The export keeps its old name: it is the story id the visual baselines are keyed by.
export const AllVariants: Story = {
  name: 'All tones',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral">Default</Badge>
      <Badge tone="primary">Primary</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="error">Error</Badge>
      <Badge tone="info">Info</Badge>
    </div>
  ),
};

/**
 * Bone: the tier-neutral filled chip. Identical in both themes on purpose,
 * for state markers that must never ride the accent or re-theme (equipped
 * gear, loot tiers).
 */
export const Bone: Story = {
  args: { tone: 'bone', size: 'sm', children: 'equipped' },
};

/**
 * Caps: the uppercase eyebrow voice (uppercase + .08em tracking) for
 * state chips, baked in so consumers stop pasting className overrides.
 */
export const Caps: Story = {
  args: { tone: 'primary', size: 'sm', caps: true, iconLeft: <TuiIcon name="ChevronUp" size="3" />, children: 'level up' },
};

/**
 * Dashed: the not-yet-real voice — transparent fill, 1px dashed hairline in
 * the tone's text color, sharp corners (no plate clip). For placeholders,
 * empty slots, and free tiers. Composes with caps and any tone; dashed
 * bone keeps the theme-stable sepia-500 dash (the empty-slot counterpart to
 * the filled bone chip) with per-theme text so it stays AA on light.
 */
export const Dashed: Story = {
  args: { size: 'sm', caps: true, dashed: true, children: 'free' },
};

/** Dashed composes with every tone; the dash follows the text color. */
export const DashedVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge dashed size="sm" caps>
        free
      </Badge>
      <Badge dashed tone="primary" size="sm" caps>
        slot open
      </Badge>
      <Badge dashed tone="bone" size="sm" caps>
        empty slot
      </Badge>
    </div>
  ),
};
