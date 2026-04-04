import type { Meta, StoryObj } from '@storybook/react';
import { getToken } from '@scorp-ds/tokens';

import { TokenDocTable, type TokenDocRow } from '../doc-blocks/TokenDocTable';

/**
 * Semantic / Opacity
 *
 * Opacity steps live in `global` in tokens.json and ship as `--opacity-*` (theme-independent).
 */

const STEPS = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

function OpacityStrip({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div className="h-6 w-16 overflow-hidden rounded-none border border-secondary-400 dark:border-secondary-600">
      <div
        className="h-full w-full"
        style={{
          backgroundColor: 'var(--button-primary-background)',
          opacity: `var(--opacity-${step})`,
        }}
      />
    </div>
  );
}

function buildRows(): TokenDocRow[] {
  return STEPS.map((step) => {
    const key = `opacity-${step}`;
    const v = getToken(key, 'light') ?? '—';
    return {
      swatch: <OpacityStrip step={step} />,
      tokenLabel: `opacity.${step}`,
      cssVar: `--opacity-${step}`,
      rawValue: v,
      lightValue: v,
      darkValue: v,
      usage:
        step === 0
          ? 'Fully transparent layer'
          : step === 100
            ? 'Opaque overlay tint'
            : 'Scrim, disabled washes, subtle hierarchy',
    };
  });
}

const ROWS = buildRows();

function OpacityPage() {
  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Semantic / Opacity</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">[Stable] · Last updated Apr 2026</p>
      <p className="mb-4 max-w-3xl text-secondary-600 dark:text-secondary-400">
        These steps are <strong>global</strong> numbers (0–1) exposed as CSS variables. Light and dark themes share the
        same values — apply them on top of semantic colors (for example a scrim over{' '}
        <code className="text-primary-600">surface.overlay</code>).
      </p>

      <nav aria-label="On this page" className="mb-8 max-w-3xl border border-secondary-300 p-4 dark:border-secondary-700">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">On this page</div>
        <ul className="mt-2 list-inside list-disc text-secondary-600 dark:text-secondary-400">
          <li>
            <a className="text-primary-700 underline dark:text-primary-400" href="#visual">
              Visual scale
            </a>
          </li>
          <li>
            <a className="text-primary-700 underline dark:text-primary-400" href="#tokens">
              Token table
            </a>
          </li>
          <li>
            <a className="text-primary-700 underline dark:text-primary-400" href="#code">
              Code
            </a>
          </li>
        </ul>
      </nav>

      <section id="visual" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Visual scale</h2>
        <p className="mb-6 max-w-3xl text-secondary-600 dark:text-secondary-400">
          Strips use the same semantic fill with only the opacity token changing — step 0 reads as empty, 100 as solid.
        </p>
        <div className="flex max-w-3xl flex-wrap gap-3 border border-secondary-300 bg-surface-page p-4 dark:border-secondary-700">
          {STEPS.map((step) => (
            <div key={step} className="text-center">
              <OpacityStrip step={step} />
              <div className="mt-1 text-[10px] text-secondary-500">{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tokens" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Token table</h2>
        <p className="mb-4 max-w-3xl text-secondary-600 dark:text-secondary-400">
          Light mode and dark mode columns match because opacity is defined once in the global token set.
        </p>
        <TokenDocTable rows={ROWS} />
      </section>

      <section id="code" className="mb-8">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Code</h2>
        <p className="mb-4 text-secondary-600 dark:text-secondary-400">
          Reference the variable in <code className="text-primary-600">opacity</code> or in alpha compositing — avoid
          magic decimals in components.
        </p>
        <pre className="overflow-x-auto rounded-none border border-secondary-300 bg-secondary-50 p-4 text-xs dark:border-secondary-700 dark:bg-secondary-950">
          {`<div
  style={{
    backgroundColor: 'var(--surface-overlay)',
    opacity: 'var(--opacity-70)',
  }}
/>`}
        </pre>
      </section>

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Related
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Pair with <strong>Semantic / Colors</strong> for <code className="text-primary-600">surface.overlay</code> and
          disabled text guidance.
        </p>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Semantic/Opacity',
  component: OpacityPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Opacity scale',
};
