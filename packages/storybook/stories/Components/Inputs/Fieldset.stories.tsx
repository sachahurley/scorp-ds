import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Fieldset, Input, Radio, Switch } from '@scorp-ds/components';

const meta: Meta<typeof Fieldset> = {
  title: 'Components/Inputs/Fieldset',
  component: Fieldset,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A native `fieldset` whose `legend` names a group of controls, announced when focus enters the group. ' +
          'Use it around radios that answer one question, a set of checkboxes, or a titled group of settings. ' +
          'It draws no frame: put it in a Card or a form column. `variant="eyebrow"` (default) titles a settings group; ' +
          '`variant="field"` matches the Input label for a question in a form. ' +
          'For a single control use its own `label`; for a framed group with a header and footer use Card.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['eyebrow', 'field'] },
    gap: { control: 'select', options: ['none', '1', '2', '3', '4', '5', '6', '8'] },
    role: { control: 'select', options: [undefined, 'group', 'radiogroup'] },
    legend: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Fieldset>;

/** Every prop on the controls panel; the eyebrow legend over a mixed settings group, as in SettingsPanel. */
export const Playground: Story = {
  args: {
    legend: 'Notifications',
    gap: '4',
    children: (
      <>
        <Switch label="Email digests" defaultChecked />
        <Checkbox label="Push for deploy failures" defaultChecked />
        <Checkbox label="Marketing updates" />
      </>
    ),
  },
};

/** `description` sits under the legend and is read after it through `aria-describedby`. */
export const WithDescription: Story = {
  args: {
    legend: 'Email notifications',
    variant: 'field',
    description: 'Sent to the address on your account',
    children: (
      <>
        <Checkbox label="Product updates" defaultChecked />
        <Checkbox label="Weekly digest" />
        <Checkbox label="Marketing and promotions" />
      </>
    ),
  },
};

/**
 * A radio group with a group-level error. `role="radiogroup"` lets the group carry
 * `aria-invalid`; each Radio takes `error` for the styling only (`Radio.md`).
 */
export const RadioGroup: Story = {
  args: {
    legend: 'Plan',
    variant: 'field',
    role: 'radiogroup',
    errorMessage: 'Pick a plan to continue',
    children: (
      <>
        <Radio name="fieldset-story-plan" value="free" label="Free" error />
        <Radio name="fieldset-story-plan" value="pro" label="Pro" error />
        <Radio name="fieldset-story-plan" value="team" label="Team" error />
      </>
    ),
  },
};

/** `disabled` disables every control in the group natively and dims the controls once; the legend keeps full contrast. */
export const Disabled: Story = {
  args: {
    legend: 'Profile',
    gap: '3',
    disabled: true,
    children: (
      <>
        <Input label="Display name" defaultValue="sacha" size="md" />
        <Checkbox label="Show profile publicly" defaultChecked />
      </>
    ),
  },
};
