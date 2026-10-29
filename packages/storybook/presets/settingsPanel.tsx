import { Button, Card, Checkbox, Divider, Inline, Input, Select, Stack, Switch } from '@scorp-ds/components';

/**
 * Settings panel preset: one Card holding a group of profile fields, a
 * notifications group and the footer actions. It is the reference for the
 * spacing hierarchy in `composition-presets-guidelines.md` ("Composition rules"):
 * `Stack gap="3"` between fields inside a group, `gap="6"` between groups, a
 * `Divider` plus `gap="4"` before a titled group, and Card's own section padding.
 *
 * The notifications group is a `fieldset` with a `legend`, so a screen reader
 * announces "Notifications" when focus enters it. The footer buttons are
 * `type="button"` because nothing here is a form; in product code wrap the Card
 * in a `<form>` and make "Save changes" `type="submit"`.
 *
 * Consumed by `Patterns/SettingsPanel`. No consumer project renders it yet; if one
 * does, vendor this file with it.
 *
 * @example
 * <div className="mx-auto max-w-xl">
 *   <WorkspaceSettingsPanel />
 * </div>
 */
export function WorkspaceSettingsPanel() {
  return (
    <Card
      className="flex w-full flex-col"
      title="Workspace"
      subtitle="Profile, locale, and alert defaults"
      footerContent={
        <Inline justify="end" gap="2">
          <Button variant="outline" size="sm" type="button">
            Reset
          </Button>
          <Button variant="primary" size="sm" type="button">
            Save changes
          </Button>
        </Inline>
      }
    >
      <Stack gap="6">
        <Stack gap="3">
          <Input label="Display name" defaultValue="sacha" size="md" />
          <Input label="Workspace slug" defaultValue="scorp-ds" size="md" />
          <Select label="Locale" defaultValue="en" size="md">
            <option value="en">English</option>
            <option value="fr">Français</option>
          </Select>
        </Stack>
        <Stack gap="4">
          <Divider spacing="none" />
          <fieldset>
            <legend className="mb-3 block font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
              Notifications
            </legend>
            <Stack gap="4">
              <Switch label="Email digests" defaultChecked />
              <Checkbox label="Push for deploy failures" defaultChecked />
              <Checkbox label="Marketing updates" />
            </Stack>
          </fieldset>
        </Stack>
      </Stack>
    </Card>
  );
}
