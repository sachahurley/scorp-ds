import type { Meta, StoryObj } from '@storybook/react';

/**
 * Foundation / Typography
 *
 * Font family (mono), sizes, weights, and line heights from tokens.
 */
const SIZES = [
  { token: '3xs', cls: 'text-3xs', varName: '--font-size-3xs' },
  { token: '2xs', cls: 'text-2xs', varName: '--font-size-2xs' },
  { token: 'xs', cls: 'text-xs', varName: '--font-size-xs' },
  { token: 'sm', cls: 'text-sm', varName: '--font-size-sm' },
  { token: 'base', cls: 'text-base', varName: '--font-size-base' },
  { token: 'lg', cls: 'text-lg', varName: '--font-size-lg' },
  { token: 'xl', cls: 'text-xl', varName: '--font-size-xl' },
  { token: '2xl', cls: 'text-2xl', varName: '--font-size-2xl' },
];

function TypographyPage() {
  return (
    <div className="min-h-screen max-w-3xl bg-[var(--surface-page)] p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold">Foundation / Typography</h1>
      <p className="mb-2 text-secondary-800 dark:text-secondary-300">
        [Stable] · Last updated Apr 2026
      </p>
      <p className="mb-8 text-secondary-800 dark:text-secondary-300">
        Scorp DS uses Fragment Mono site-wide. Sizes map to CSS variables via the Tailwind preset.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-secondary-800 dark:text-secondary-200">Font family</h2>
        <p className="font-mono text-base">Fragment Mono — var(--font-family-mono)</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-secondary-800 dark:text-secondary-200">Type scale</h2>
        <div className="space-y-4 border border-secondary-300 dark:border-secondary-700 p-4">
          {SIZES.map(({ token, cls, varName }) => (
            <div key={token} className="flex flex-wrap items-baseline gap-4 border-b border-secondary-200 pb-3 last:border-0 dark:border-secondary-800">
              <span className={`shrink-0 ${cls} font-mono text-[var(--text-primary)]`}>Ag — {token}</span>
              <span className="text-xs text-secondary-800 dark:text-secondary-300">{varName}</span>
              <span className="text-xs text-secondary-800 dark:text-secondary-300">class: {cls}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-secondary-800 dark:text-secondary-200">Weights</h2>
        <div className="space-y-2 border border-secondary-300 dark:border-secondary-700 p-4">
          <p className="font-mono font-normal">Regular 400</p>
          <p className="font-mono font-medium">Medium 500</p>
          <p className="font-mono font-bold">Bold 700</p>
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Typography',
  component: TypographyPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScale: Story = {
  name: 'Type scale',
};
