import type { Meta, StoryObj } from '@storybook/react';

/**
 * Foundation / Spacing
 *
 * Spacing scale from `tokens.json` → CSS variables `--spacing-*`.
 * In components use Tailwind spacing classes (`p-4`, `gap-6`) that map to this scale.
 */
const STEPS = [
  { step: '0', varName: '--spacing-0', tailwind: '0' },
  { step: '1', varName: '--spacing-1', tailwind: '4px / 1 unit' },
  { step: '2', varName: '--spacing-2', tailwind: '8px / 2' },
  { step: '3', varName: '--spacing-3', tailwind: '12px / 3' },
  { step: '4', varName: '--spacing-4', tailwind: '16px / 4' },
  { step: '5', varName: '--spacing-5', tailwind: '20px / 5' },
  { step: '6', varName: '--spacing-6', tailwind: '24px / 6' },
  { step: '8', varName: '--spacing-8', tailwind: '32px / 8' },
  { step: '10', varName: '--spacing-10', tailwind: '40px / 10' },
  { step: '12', varName: '--spacing-12', tailwind: '48px / 12' },
  { step: '16', varName: '--spacing-16', tailwind: '64px / 16' },
  { step: '20', varName: '--spacing-20', tailwind: '80px / 20' },
  { step: '24', varName: '--spacing-24', tailwind: '96px / 24' },
];

function SpacingPage() {
  return (
    <div className="min-h-screen max-w-2xl bg-[var(--surface-page)] p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold">Foundation / Spacing</h1>
      <p className="mb-2 text-secondary-800 dark:text-secondary-300">
        [Stable] · Last updated Apr 2026
      </p>
      <p className="mb-8 text-secondary-800 dark:text-secondary-300">
        Visual: bar width = token value. Use semantic layout with Tailwind (`gap-4`, `p-6`) — never raw px in
        components.
      </p>

      <div className="space-y-4">
        {STEPS.map(({ step, varName, tailwind }) => (
          <div key={step} className="flex items-center gap-4 border border-secondary-300 dark:border-secondary-700 p-3">
            <div
              aria-hidden="true"
              className="h-8 shrink-0 bg-primary-400 dark:bg-primary-500"
              style={{ width: `var(${varName})` }}
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[var(--text-primary)]">spacing.{step}</div>
              <div className="text-secondary-800 dark:text-secondary-300">{varName}</div>
              <div className="text-xs text-secondary-800 dark:text-secondary-300">Tailwind scale: {tailwind}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Spacing',
  component: SpacingPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  name: 'Spacing scale',
};
