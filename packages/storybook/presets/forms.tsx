import { useState } from 'react';
import { Button, Checkbox, Fieldset, Inline, Input, Radio, Select, Switch, Textarea } from '@scorp-ds/components';

/**
 * Forms preset: a complete single-column form that uses every field component
 * once, in the order a settings form usually asks for them. It is the reference for
 * the form rules in `composition-presets-guidelines.md` ("Composition rules"):
 * a visible label on every field, a `Fieldset` (field-label legend) around each
 * radio or checkbox group, the error message under its field, the switch row (name and
 * consequence left, control right), and the action row (quiet action, then the
 * one primary `type="submit"` action at the end).
 *
 * State: the display-name field stays in error until it has a value, and the
 * switch is controlled. Everything else is uncontrolled: the pattern is the
 * composition, not the state management. Render it in a column capped at
 * `max-w-md`; the form does not set its own width.
 *
 * Consumed by `Patterns/Forms`. No consumer project renders it yet; if one does,
 * vendor this file with it.
 *
 * @example
 * <div className="mx-auto max-w-md">
 *   <AccountSettingsForm />
 * </div>
 */
export function AccountSettingsForm() {
  const [displayName, setDisplayName] = useState('');
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Error state: errorMessage renders under the field and links it
          via aria-describedby, so screen readers hear why it's invalid */}
      <Input
        label="Display name"
        placeholder="How you appear to others"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        errorMessage={displayName === '' ? 'Display name is required' : undefined}
        size="md"
      />

      <Input label="Email" type="email" placeholder="you@example.com" size="md" />

      <Select label="Timezone" size="md" defaultValue="pt">
        <option value="pt">Pacific Time (UTC-8)</option>
        <option value="mt">Mountain Time (UTC-7)</option>
        <option value="ct">Central Time (UTC-6)</option>
        <option value="et">Eastern Time (UTC-5)</option>
      </Select>

      {/* Radio group: a Fieldset with the field-label legend; radiogroup so the
          group, not each radio, can carry an invalid state */}
      <Fieldset legend="Theme" variant="field" role="radiogroup">
        <Radio name="forms-theme" value="system" label="Match system" defaultChecked />
        <Radio name="forms-theme" value="light" label="Light" />
        <Radio name="forms-theme" value="dark" label="Dark" />
      </Fieldset>

      {/* Checkbox group: same legend treatment */}
      <Fieldset legend="Email notifications" variant="field">
        <Checkbox label="Product updates" defaultChecked />
        <Checkbox label="Weekly digest" defaultChecked />
        <Checkbox label="Marketing and promotions" />
      </Fieldset>

      {/* Switch row: setting name + consequence on the left, control right */}
      <Inline justify="between" gap="4" wrap={false}>
        <div>
          <p className="font-mono text-sm text-[var(--text-primary)]">Public profile</p>
          <p className="font-mono text-xs text-secondary-700 dark:text-secondary-600">
            Anyone can view your profile page
          </p>
        </div>
        <Switch
          checked={publicProfile}
          onCheckedChange={setPublicProfile}
          size="md"
          label="Public profile"
          hideLabel
        />
      </Inline>

      <Textarea label="Bio" placeholder="A short introduction..." rows={4} size="md" />

      {/* Button row: primary at the end, quiet action beside it */}
      <Inline justify="end" gap="3" className="pt-2">
        <Button variant="ghost" size="md" type="button">
          Cancel
        </Button>
        <Button variant="primary" size="md" type="submit">
          Save changes
        </Button>
      </Inline>
    </form>
  );
}
