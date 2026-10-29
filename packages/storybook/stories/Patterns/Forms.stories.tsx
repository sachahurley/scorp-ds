import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@scorp-ds/components';
import { AccountSettingsForm } from '../../presets/forms';

/**
 * Pattern: a complete form, every field component composed on one column.
 * Upstreamed from the showcase's Forms pattern page (2026-09-20), which
 * shipped this composition before the DS documented it. The form lives in
 * `presets/forms.tsx`; this story is the page shell.
 */
const meta: Meta = {
  title: 'Patterns/Forms',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** — composed product UI built from existing components. Every control shares the plate field recipe: idle hairline, hover, then the accent focus ring. Labels sit above their field; radio and checkbox groups get a `fieldset` + `legend`; one primary button per form, at the end of the row.\n\n**Theme:** use the Storybook **Theme** toolbar (sun/moon) to preview light and dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

function AccountSettingsDemo() {
  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-md space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Forms
        </p>

        <AccountSettingsForm />

        <Divider />
        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Composes: Input, Select, Radio, Checkbox, Switch, Textarea, Button, Stack. One column,
          capped width (max-w-md); labels above fields, never placeholder-as-label; error text
          under its field; one primary action per form.
        </p>
      </div>
    </div>
  );
}

export const AccountSettings: Story = {
  name: 'Account settings',
  render: () => <AccountSettingsDemo />,
};
