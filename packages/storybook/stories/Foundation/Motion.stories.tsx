import type { Meta, StoryObj } from '@storybook/react';

/**
 * Foundation / Motion
 *
 * Durations and easing from `tokens.json`; `--duration-*` in `tokens.css` matches JSON (single source of truth).
 */
const DURATIONS = [
  { name: 'instant', varName: '--duration-instant' },
  { name: 'fast', varName: '--duration-fast' },
  { name: 'normal', varName: '--duration-normal' },
  { name: 'slow', varName: '--duration-slow' },
  { name: 'slower', varName: '--duration-slower' },
];

function MotionPage() {
  return (
    <div className="max-w-2xl p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold">Foundation / Motion</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">
        [Stable] · Last updated Apr 2026
      </p>
      <p className="mb-8 text-secondary-600 dark:text-secondary-400">
        Prefer Tailwind `duration-*` / `transition-*` classes that map to tokens. Interactive motion target: 150–200ms.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold">Duration tokens</h2>
        <div className="space-y-6">
          {DURATIONS.map(({ name, varName }) => (
            <div key={name} className="flex items-center gap-6 border border-secondary-300 p-4 dark:border-secondary-700">
              <div
                className="h-10 w-10 shrink-0 bg-primary-500 transition-transform hover:translate-x-16"
                style={{ transitionDuration: `var(${varName})` }}
              />
              <div>
                <div className="font-bold">duration.{name}</div>
                <div className="text-secondary-500">{varName}</div>
                <p className="mt-1 text-xs text-secondary-500">Hover the square — travel uses this duration.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">Easing (reference)</h2>
        <ul className="list-inside list-disc space-y-1 text-secondary-600 dark:text-secondary-400">
          <li>
            <code className="text-secondary-800 dark:text-secondary-200">--easing-linear</code>
          </li>
          <li>
            <code className="text-secondary-800 dark:text-secondary-200">--easing-ease-in</code>
          </li>
          <li>
            <code className="text-secondary-800 dark:text-secondary-200">--easing-ease-out</code>
          </li>
          <li>
            <code className="text-secondary-800 dark:text-secondary-200">--easing-ease-in-out</code>
          </li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Motion',
  component: MotionPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Durations: Story = {
  name: 'Durations & easing',
};
