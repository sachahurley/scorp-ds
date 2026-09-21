import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Badge, TuiIcon } from '@scorp-ds/components';

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Label' },
};

export const Primary: Story = {
  args: { variant: 'primary', children: 'New' },
};

export const WithIcon: Story = {
  args: {
    variant: 'success',
    children: 'Synced',
    iconLeft: <TuiIcon name="Check" size="4" />,
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    children: 'Filter on',
    onClose: fn(),
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

/**
 * Bone: the tier-neutral filled chip. Identical in both themes on purpose,
 * for state markers that must never ride the accent or re-theme (equipped
 * gear, loot tiers).
 */
export const Bone: Story = {
  args: { variant: 'bone', size: 'small', children: 'equipped' },
};

/**
 * Caps: the uppercase eyebrow voice (uppercase + .08em tracking) for
 * state chips, baked in so consumers stop pasting className overrides.
 */
export const Caps: Story = {
  args: { variant: 'primary', size: 'small', caps: true, children: '▴ level up' },
};

/**
 * Dashed: the not-yet-real voice — transparent fill, 1px dashed hairline in
 * the variant's text color, sharp corners (no plate clip). For placeholders,
 * empty slots, and free tiers. Composes with caps and any variant; dashed
 * bone is the empty-slot counterpart to the filled bone chip.
 */
export const Dashed: Story = {
  args: { size: 'small', caps: true, dashed: true, children: 'free' },
};

/** Dashed composes with every variant; the dash follows the text color. */
export const DashedVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge dashed size="small" caps>
        free
      </Badge>
      <Badge dashed variant="primary" size="small" caps>
        slot open
      </Badge>
      <Badge dashed variant="bone" size="small" caps>
        empty slot
      </Badge>
    </div>
  ),
};
