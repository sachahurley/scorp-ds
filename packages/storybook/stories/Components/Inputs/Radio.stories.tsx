import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent } from '@storybook/test';
import { Radio } from '@scorp-ds/components';

const meta: Meta<typeof Radio> = {
  title: 'Components/Inputs/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Group: Story = {
  name: 'Radio group',
  render: () => (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 font-mono text-sm text-secondary-700 dark:text-secondary-300">
        Pick one
      </legend>
      <Radio name="plan" value="free" label="Free" defaultChecked onChange={fn()} />
      <Radio name="plan" value="pro" label="Pro" onChange={fn()} />
      <Radio name="plan" value="team" label="Team" onChange={fn()} />
    </fieldset>
  ),
};

/**
 * `helperText` explains the option; `errorMessage` replaces it, sets the error
 * state and is announced through `aria-describedby` (same plumbing as Checkbox).
 */
export const WithMessages: Story = {
  name: 'Helper and error text',
  render: () => (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="mb-2 font-mono text-sm text-secondary-700 dark:text-secondary-300">
        Billing
      </legend>
      <Radio name="billing" value="monthly" label="Monthly" helperText="Cancel any time." onChange={fn()} />
      <Radio
        name="billing"
        value="invoice"
        label="Invoice"
        errorMessage="Not available on the free plan."
        onChange={fn()}
      />
    </fieldset>
  ),
};

export const Error: Story = {
  args: {
    name: 'solo',
    value: 'x',
    label: 'Invalid choice',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'solo',
    value: 'y',
    label: 'Disabled',
    disabled: true,
  },
};

/**
 * Keyboard focus. Covers the smallest ring in the system, about 25 px, on a round-plate control.
 *
 * Tab rather than `.focus()`: the recipe is `focus-visible`, which does not match
 * programmatic focus, so a story focusing the control in JS would render no ring
 * at all and still look like passing coverage.
 */
export const Focus: Story = {
  ...Group,
  play: async ({ canvasElement }) => {
    canvasElement.ownerDocument.defaultView?.focus();
    await userEvent.tab();
  },
};
