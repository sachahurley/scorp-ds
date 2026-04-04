import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { getToken } from '@scorp-ds/tokens';

import { TokenDocTable, type TokenDocRow } from '../doc-blocks/TokenDocTable';

/**
 * Semantic / Focus
 *
 * Ring colors and offset fill are theme-aware; ring width / offset are global sizing tokens.
 */

function RingSwatch({ cssVar }: { cssVar: string }) {
  return (
    <div
      className="h-10 w-14 bg-surface-page"
      style={{
        boxShadow: `0 0 0 var(--focus-ring-width) var(${cssVar})`,
      }}
    />
  );
}

function MiniColorSwatch({ cssVar }: { cssVar: string }) {
  return (
    <div
      className="h-6 w-6 border border-secondary-400 dark:border-secondary-600"
      style={{ backgroundColor: `var(${cssVar})` }}
    />
  );
}

function GeometrySwatch() {
  return (
    <div className="flex h-10 w-14 items-center justify-center bg-surface-page">
      <div
        className="rounded-none"
        style={{
          backgroundColor: 'var(--button-primary-background)',
          width: 24,
          height: 24,
          boxShadow: `0 0 0 var(--focus-ring-offset) var(--focus-offset-color), 0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-primary)`,
        }}
      />
    </div>
  );
}

function pair(parserKey: string) {
  const light = getToken(parserKey, 'light') ?? '—';
  const dark = getToken(parserKey, 'dark') ?? '—';
  return { light, dark, raw: light };
}

function buildRows(): TokenDocRow[] {
  const rings: { label: string; cssVar: string; key: string; usage: string }[] = [
    { label: 'focus.ring.primary', cssVar: '--focus-ring-primary', key: 'focus-ring-primary', usage: 'Default keyboard / focus-visible ring' },
    { label: 'focus.ring.secondary', cssVar: '--focus-ring-secondary', key: 'focus-ring-secondary', usage: 'Neutral controls on busy surfaces' },
    { label: 'focus.ring.error', cssVar: '--focus-ring-error', key: 'focus-ring-error', usage: 'Invalid fields when focused' },
    { label: 'focus.ring.destructive', cssVar: '--focus-ring-destructive', key: 'focus-ring-destructive', usage: 'Destructive actions (delete, remove)' },
    { label: 'focus.ring.icon', cssVar: '--focus-ring-icon', key: 'focus-ring-icon', usage: 'Icon buttons and square targets' },
  ];

  const colorRows: TokenDocRow[] = rings.map((r) => {
    const { light, dark, raw } = pair(r.key);
    return {
      swatch: <MiniColorSwatch cssVar={r.cssVar} />,
      tokenLabel: r.label,
      cssVar: r.cssVar,
      rawValue: raw,
      lightValue: light,
      darkValue: dark,
      usage: r.usage,
    };
  });

  const offset = pair('focus-offset-color');
  colorRows.push({
    swatch: <MiniColorSwatch cssVar="--focus-offset-color" />,
    tokenLabel: 'focus.offset-color',
    cssVar: '--focus-offset-color',
    rawValue: offset.raw,
    lightValue: offset.light,
    darkValue: offset.dark,
    usage: 'Gap color between control and outer ring (double-ring preview)',
  });

  const w = pair('focus-ring-width');
  const o = pair('focus-ring-offset');

  const geometryRows: TokenDocRow[] = [
    {
      swatch: <GeometrySwatch />,
      tokenLabel: 'focus.ring.width',
      cssVar: '--focus-ring-width',
      rawValue: w.raw,
      lightValue: w.light,
      darkValue: w.dark,
      usage: 'Outline thickness (global foundation)',
    },
    {
      swatch: <GeometrySwatch />,
      tokenLabel: 'focus.ring.offset',
      cssVar: '--focus-ring-offset',
      rawValue: o.raw,
      lightValue: o.light,
      darkValue: o.dark,
      usage: 'Space between control edge and ring (global foundation)',
    },
  ];

  const chrome = pair('border-focus');
  const field = pair('field-border-focus');

  const chromeRows: TokenDocRow[] = [
    {
      swatch: <MiniColorSwatch cssVar="--border-focus" />,
      tokenLabel: 'border.focus',
      cssVar: '--border-focus',
      rawValue: chrome.raw,
      lightValue: chrome.light,
      darkValue: chrome.dark,
      usage: 'Divider / container focus accent (pairs with ring width)',
    },
    {
      swatch: <MiniColorSwatch cssVar="--field-border-focus" />,
      tokenLabel: 'field.border-focus',
      cssVar: '--field-border-focus',
      rawValue: field.raw,
      lightValue: field.light,
      darkValue: field.dark,
      usage: 'Input focus border (often matches primary ring hue)',
    },
  ];

  return [...colorRows, ...geometryRows, ...chromeRows];
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

function FocusPage() {
  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Semantic / Focus</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">[Stable] · Last updated Apr 2026</p>
      <p className="mb-4 max-w-3xl text-secondary-600 dark:text-secondary-400">
        Focus tokens describe how keyboard and pointer focus looks: ring color roles, the gap (offset) fill, and global
        width/offset measurements. Use them with <code className="text-primary-600">:focus-visible</code> patterns so
        mouse clicks stay quiet while keyboards stay legible.
      </p>

      <nav aria-label="On this page" className="mb-8 max-w-3xl border border-secondary-300 p-4 dark:border-secondary-700">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">On this page</div>
        <ul className="mt-2 list-inside list-disc text-secondary-600 dark:text-secondary-400">
          <li>
            <a className="text-primary-700 underline dark:text-primary-400" href="#visual">
              Ring previews
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
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Ring previews</h2>
        <p className="mb-6 max-w-3xl text-secondary-600 dark:text-secondary-400">
          Each sample uses <code className="text-primary-600">--focus-ring-width</code> with the semantic ring color. The
          second column forces dark context.
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          <ThemedPanel>
            <h3 className="mb-4 font-bold text-[var(--text-primary)]">Current theme</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-primary" />
                <span className="text-xs text-[var(--text-secondary)]">primary</span>
              </div>
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-secondary" />
                <span className="text-xs text-[var(--text-secondary)]">secondary</span>
              </div>
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-error" />
                <span className="text-xs text-[var(--text-secondary)]">error</span>
              </div>
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-destructive" />
                <span className="text-xs text-[var(--text-secondary)]">destructive</span>
              </div>
            </div>
          </ThemedPanel>
          <ThemedPanel forcedDark>
            <h3 className="mb-4 font-bold text-[var(--text-primary)]">Dark context (forced)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-primary" />
                <span className="text-xs text-[var(--text-secondary)]">primary</span>
              </div>
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-secondary" />
                <span className="text-xs text-[var(--text-secondary)]">secondary</span>
              </div>
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-error" />
                <span className="text-xs text-[var(--text-secondary)]">error</span>
              </div>
              <div className="flex items-center gap-3">
                <RingSwatch cssVar="--focus-ring-destructive" />
                <span className="text-xs text-[var(--text-secondary)]">destructive</span>
              </div>
            </div>
          </ThemedPanel>
        </div>
      </section>

      <section id="tokens" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Token table</h2>
        <p className="mb-4 max-w-3xl text-secondary-600 dark:text-secondary-400">
          Values resolve from <code className="text-primary-600">tokens.json</code> (light/dark) plus global sizing for
          width/offset. Full color role list also appears under <strong>Semantic / Colors</strong>.
        </p>
        <TokenDocTable rows={ROWS} />
      </section>

      <section id="code" className="mb-8">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Code</h2>
        <p className="mb-4 text-secondary-600 dark:text-secondary-400">
          Prefer <code className="text-primary-600">box-shadow</code> rings (no radius change) to match sharp TUI corners.
        </p>
        <pre className="overflow-x-auto rounded-none border border-secondary-300 bg-secondary-50 p-4 text-xs dark:border-secondary-700 dark:bg-secondary-950">
          {`.interactive:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--focus-ring-offset) var(--focus-offset-color),
    0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-primary);
}`}
        </pre>
      </section>

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Related
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          <strong>Semantic / Colors</strong> lists the same focus swatches alongside surfaces and buttons.{' '}
          <strong>Foundation / Motion</strong> covers duration for focus transitions.
        </p>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Semantic/Focus',
  component: FocusPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Focus rings & offset',
};
