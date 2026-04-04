import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@scorp-ds/components';

/**
 * Components / Actions / Button
 *
 * The primary interactive element. All variants and sizes are built from
 * tokens. Scorp DS buttons use sharp corners and Fragment Mono font.
 *
 * Variants: primary, secondary, ghost, link, outline, destructive, icon
 * Sizes: small (32px), medium (40px), large (48px)
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'link', 'outline', 'destructive', 'icon'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size (32/40/48px height)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    children: {
      control: 'text',
      description: 'Button label',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Get started',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Learn more',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'medium',
    children: 'Cancel',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'medium',
    children: 'View details',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'medium',
    children: 'Delete account',
  },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary" size="small">Small</Button>
      <Button variant="primary" size="medium">Medium</Button>
      <Button variant="primary" size="large">Large</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const DisabledState: Story = {
  name: 'Disabled',
  render: () => (
    <div className="flex gap-3">
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
    </div>
  ),
};

/** Icon-only triggers must include `aria-label` (or `aria-labelledby`) so assistive tech knows the purpose. */
export const IconWithAriaLabel: Story = {
  name: 'Icon (aria-label)',
  render: () => (
    <Button variant="icon" size="medium" aria-label="Open menu">
      ☰
    </Button>
  ),
};

// Playground — single interactive instance with all controls
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    children: 'Button label',
  },
};
