import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Radio,
  Select,
  Stack,
  Switch,
  Textarea,
} from '@scorp-ds/components';

/**
 * Pattern: a complete form — every field component composed on one column.
 * Upstreamed from the showcase's Forms pattern page (2026-09-20), which
 * shipped this composition before the DS documented it.
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
  // The display-name field stays in error until it has a value; the switch
  // is controlled. Everything else is uncontrolled — the pattern is the
  // composition, not the state management.
  const [displayName, setDisplayName] = useState('');
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-md space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Forms
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Error state: message renders directly under the field it belongs to */}
          <div>
            <Input
              label="Display name"
              placeholder="How you appear to others"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={displayName === ''}
              size="medium"
            />
            {displayName === '' && (
              <p className="mt-1 font-mono text-xs text-error-600 dark:text-error-500">
                Display name is required
              </p>
            )}
          </div>

          <Input label="Email" type="email" placeholder="you@example.com" size="medium" />

          <Select label="Timezone" size="medium" defaultValue="pt">
            <option value="pt">Pacific Time (UTC-8)</option>
            <option value="mt">Mountain Time (UTC-7)</option>
            <option value="ct">Central Time (UTC-6)</option>
            <option value="et">Eastern Time (UTC-5)</option>
          </Select>

          {/* Radio group: fieldset + legend in the label style */}
          <fieldset>
            <legend className="mb-2 block font-mono text-sm text-secondary-800 dark:text-secondary-200">
              Theme
            </legend>
            <Stack gap="2">
              <Radio name="forms-theme" value="system" label="Match system" defaultChecked />
              <Radio name="forms-theme" value="light" label="Light" />
              <Radio name="forms-theme" value="dark" label="Dark" />
            </Stack>
          </fieldset>

          {/* Checkbox group: same legend treatment */}
          <fieldset>
            <legend className="mb-2 block font-mono text-sm text-secondary-800 dark:text-secondary-200">
              Email notifications
            </legend>
            <Stack gap="2">
              <Checkbox label="Product updates" defaultChecked />
              <Checkbox label="Weekly digest" defaultChecked />
              <Checkbox label="Marketing and promotions" />
            </Stack>
          </fieldset>

          {/* Switch row: setting name + consequence on the left, control right */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-[var(--text-primary)]">Public profile</p>
              <p className="font-mono text-xs text-secondary-700 dark:text-secondary-600">
                Anyone can view your profile page
              </p>
            </div>
            <Switch
              checked={publicProfile}
              onCheckedChange={setPublicProfile}
              size="medium"
              label="Toggle public profile"
            />
          </div>

          <Textarea label="Bio" placeholder="A short introduction..." rows={4} size="medium" />

          {/* Button row: primary at the end, quiet action beside it */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="medium" type="button">
              Cancel
            </Button>
            <Button variant="primary" size="medium" type="submit">
              Save changes
            </Button>
          </div>
        </form>

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
