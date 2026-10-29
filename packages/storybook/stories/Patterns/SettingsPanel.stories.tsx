import type { Meta, StoryObj } from '@storybook/react';
import { WorkspaceSettingsPanel } from '../../presets/settingsPanel';

/**
 * Pattern: settings / preferences surface, one card, grouped fields, primary save.
 * Shows how inputs, toggles, and actions compose without new primitives. The
 * composition lives in `presets/settingsPanel.tsx`; this story is the page shell.
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
        <WorkspaceSettingsPanel />
      </div>
    </div>
  ),
};
