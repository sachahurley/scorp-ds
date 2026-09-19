import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Select,
  Stack,
  Switch,
} from '@scorp-ds/components';

/**
 * Pattern: settings / preferences surface — one card, grouped fields, primary save.
 * Shows how inputs, toggles, and actions compose without new primitives.
 */
const meta: Meta = {
  title: 'Patterns/SettingsPanel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** — composed product UI built from existing components. Use as a reference for spacing, hierarchy, and TUI-style density. Not a new export from `@scorp-ds/components`.\n\n**Theme:** use the Storybook **Theme** toolbar (sun/moon) to preview light and dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AccountPreferences: Story = {
  name: 'Account & notifications',
  render: () => (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Settings panel
        </p>
        <Card
          className="flex w-full flex-col"
          title="Workspace"
          subtitle="Profile, locale, and alert defaults"
          footerContent={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="small" type="button">
                Reset
              </Button>
              <Button variant="primary" size="small" type="button">
                Save changes
              </Button>
            </div>
          }
        >
          <Stack gap="6">
            <Stack gap="3">
              <Input label="Display name" defaultValue="sacha" size="medium" />
              <Input label="Workspace slug" defaultValue="scorp-ds" size="medium" />
              <Select label="Locale" defaultValue="en" size="medium">
                <option value="en">English</option>
                <option value="fr">Français</option>
              </Select>
            </Stack>
            <div className="border-t-[0.5px] border-solid border-[var(--surface-container-stroke)] pt-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
                Notifications
              </p>
              <Stack gap="4">
                <Switch label="Email digests" defaultChecked />
                <Checkbox label="Push for deploy failures" defaultChecked />
                <Checkbox label="Marketing updates" />
              </Stack>
            </div>
          </Stack>
        </Card>
      </div>
    </div>
  ),
};
