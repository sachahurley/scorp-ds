import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { getToken } from '@scorp-ds/tokens';

import { TokenDocTable, type TokenDocRow } from '../doc-blocks/TokenDocTable';

/**
 * Semantic / Elevation
 *
 * Theme-aware depth via `--elevation-*-shadow` and `--elevation-*-border` in tokens.css.
 * Scorp TUI ships flat layers (shadow `none`); borders communicate level.
 */

const LEVELS = [0, 1, 2, 3] as const;

function elevationBorderToken(n: (typeof LEVELS)[number]) {
  return getToken(`elevation-${n}-border`, 'light') ?? '';
}

function elevationBorderDark(n: (typeof LEVELS)[number]) {
  return getToken(`elevation-${n}-border`, 'dark') ?? '';
}

/** Shipped CSS uses no box-shadow for TUI; JSON may list richer shadows for other pipelines. */
const SHIPPED_SHADOW = 'none';

function ElevationSwatch({ level }: { level: (typeof LEVELS)[number] }) {
  return (
    <div
      className="h-16 w-28 bg-surface-card"
      style={{
        boxShadow: `var(--elevation-${level}-shadow)`,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: `var(--elevation-${level}-border)`,
      }}
    />
  );
}

function MiniElevationSwatch({ level }: { level: (typeof LEVELS)[number] }) {
  return (
    <div
      className="h-6 w-10 bg-surface-card"
      style={{
        boxShadow: `var(--elevation-${level}-shadow)`,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: `var(--elevation-${level}-border)`,
      }}
    />
  );
}

function buildRows(): TokenDocRow[] {
  const rows: TokenDocRow[] = [];
  for (const n of LEVELS) {
    const bL = elevationBorderToken(n);
    const bD = elevationBorderDark(n);
    rows.push({
      swatch: <MiniElevationSwatch level={n} />,
      tokenLabel: `elevation.${n}.shadow`,
      cssVar: `--elevation-${n}-shadow`,
      rawValue: SHIPPED_SHADOW,
      lightValue: SHIPPED_SHADOW,
      darkValue: SHIPPED_SHADOW,
      usage: n === 0 ? 'Ground / flush surface' : `Depth level ${n}; TUI uses flat shadow, border carries lift`,
    });
    rows.push({
      swatch: (
        <div
          className="h-6 w-10 bg-surface-page"
          style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `var(--elevation-${n}-border)` }}
        />
      ),
      tokenLabel: `elevation.${n}.border`,
      cssVar: `--elevation-${n}-border`,
      rawValue: bL,
      lightValue: bL,
      darkValue: bD,
      usage: 'Hairline frame paired with the level’s shadow token (border-forward TUI)',
    });
  }
  return rows;
}

const ROWS = buildRows();

function ThemedPanel({ forcedDark, children }: { forcedDark?: boolean; children: ReactNode }) {
  const wrap = forcedDark ? 'dark' : '';
  return (
    <div
      className={`rounded-none border border-secondary-300 bg-[var(--surface-page)] p-6 dark:border-secondary-700 ${wrap}`}
    >
      {children}
    </div>
  );
}

function ElevationPage() {
  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Semantic / Elevation</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">[Stable] · Last updated Apr 2026</p>
      <p className="mb-4 max-w-3xl text-secondary-600 dark:text-secondary-400">
        Elevation tokens stack cards and overlays. In Scorp’s TUI language, depth is expressed with crisp borders and
        surface steps — shipped <code className="text-primary-600">tokens.css</code> keeps box-shadow at{' '}
        <code className="text-primary-600">none</code> so interfaces stay flat and terminal-like.
      </p>

      <nav aria-label="On this page" className="mb-8 max-w-3xl border border-secondary-300 p-4 dark:border-secondary-700">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">On this page</div>
        <ul className="mt-2 list-inside list-disc text-secondary-600 dark:text-secondary-400">
          <li>
            <a className="text-primary-700 underline dark:text-primary-400" href="#visual">
              Visual scale (light &amp; dark)
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
          Each block uses the same semantic surface fill with the level’s shadow and border variables. Toggle the
          Storybook theme to compare; the second column forces a dark context.
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          <ThemedPanel>
            <h3 className="mb-4 font-bold text-[var(--text-primary)]">Current theme</h3>
            <div className="flex flex-wrap gap-4">
              {LEVELS.map((n) => (
                <div key={n} className="text-center">
                  <ElevationSwatch level={n} />
                  <div className="mt-2 text-xs text-[var(--text-tertiary)]">Level {n}</div>
                </div>
              ))}
            </div>
          </ThemedPanel>
          <ThemedPanel forcedDark>
            <h3 className="mb-4 font-bold text-[var(--text-primary)]">Dark context (forced)</h3>
            <div className="flex flex-wrap gap-4">
              {LEVELS.map((n) => (
                <div key={n} className="text-center">
                  <ElevationSwatch level={n} />
                  <div className="mt-2 text-xs text-[var(--text-tertiary)]">Level {n}</div>
                </div>
              ))}
            </div>
          </ThemedPanel>
        </div>
      </section>

      <section id="tokens" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Token table</h2>
        <p className="mb-4 max-w-3xl text-secondary-600 dark:text-secondary-400">
          Border strings are resolved from <code className="text-primary-600">tokens.json</code> (same as{' '}
          <code className="text-primary-600">tokens.css</code>). Shadow cells reflect the shipped stylesheet.
        </p>
        <TokenDocTable rows={ROWS} />
      </section>

      <section id="code" className="mb-8">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Code</h2>
        <p className="mb-4 text-secondary-600 dark:text-secondary-400">
          Prefer CSS variables so light/dark tracks the theme. Pair with <code className="text-primary-600">bg-surface-card</code>{' '}
          or other semantic surfaces.
        </p>
        <pre className="overflow-x-auto rounded-none border border-secondary-300 bg-secondary-50 p-4 text-xs dark:border-secondary-700 dark:bg-secondary-950">
          {`/* Level 2 card */
.card {
  background-color: var(--surface-card);
  box-shadow: var(--elevation-2-shadow);
  border: 1px solid var(--elevation-2-border);
}`}
        </pre>
      </section>

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Related
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          See <strong>Semantic / Colors</strong> for base surfaces (<code className="text-primary-600">surface.*</code>) and{' '}
          <strong>Foundation / Z-index</strong> for stacking above elevation styling.
        </p>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Semantic/Elevation',
  component: ElevationPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Elevation (light & dark)',
};
