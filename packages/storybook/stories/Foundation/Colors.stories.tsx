import type { Meta, StoryObj } from '@storybook/react';
import { getTokensForTheme } from '@scorp-ds/tokens';

/**
 * Foundation / Colors
 *
 * All scales are driven from `getTokensForTheme('light')` so this page stays in sync with
 * `tokens.json` — no duplicated hex in source (values shown are resolved for handoff).
 */

/** Raw pigment scales in tokens.json `global.color` (use semantic aliases in components). */
const RAW_SCALE_ORDER = ['amber', 'sepia', 'green', 'blue', 'purple', 'red'] as const;

/** Semantic alias scales (primary→amber, secondary→sepia, success→green, etc.). */
const ALIAS_SCALE_ORDER = ['primary', 'secondary', 'success', 'info', 'warning', 'error'] as const;

/** TUI tier 2 — defined in `tokens.css` only (values change in `.dark`). */
const TERMINAL_VARS = [
  'green',
  'amber',
  'cyan',
  'magenta',
  'red',
  'blue',
  'white',
  'dim',
] as const;

type SwatchRow = { step: string; hex: string; cssVar: string };

function stepSortKey(step: string): number {
  const n = parseInt(step, 10);
  return Number.isNaN(n) ? 0 : n;
}

/** Build scale groups from flattened light-theme tokens (`color-{scale}-{step}`). */
function buildColorScales(): {
  scales: Map<string, SwatchRow[]>;
  singles: { name: string; hex: string; cssVar: string }[];
} {
  const light = getTokensForTheme('light');
  const scales = new Map<string, SwatchRow[]>();
  const singles: { name: string; hex: string; cssVar: string }[] = [];

  for (const [key, hex] of Object.entries(light)) {
    if (!key.startsWith('color-')) continue;
    const rest = key.slice('color-'.length);

    if (rest === 'black' || rest === 'white') {
      singles.push({
        name: rest,
        hex,
        cssVar: `--color-${rest}`,
      });
      continue;
    }

    const hyphen = rest.lastIndexOf('-');
    if (hyphen === -1) continue;
    const scale = rest.slice(0, hyphen);
    const step = rest.slice(hyphen + 1);
    if (!scale || !step) continue;

    const row: SwatchRow = { step, hex, cssVar: `--color-${scale}-${step}` };
    const list = scales.get(scale) ?? [];
    list.push(row);
    scales.set(scale, list);
  }

  for (const list of scales.values()) {
    list.sort((a, b) => stepSortKey(a.step) - stepSortKey(b.step));
  }

  singles.sort((a, b) => a.name.localeCompare(b.name));
  return { scales, singles };
}

const { scales: COLOR_SCALES, singles: NEUTRALS } = buildColorScales();

function ColorSwatch({ name, value, cssVar }: { name: string; value: string; cssVar: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <div
        className="h-12 w-12 shrink-0 border border-secondary-400 dark:border-secondary-600"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="font-mono text-sm">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">{name}</div>
        <div className="text-secondary-600 dark:text-secondary-400">{cssVar}</div>
        <div className="text-xs text-secondary-600 dark:text-secondary-400">{value}</div>
      </div>
    </div>
  );
}

function ColorScale({ title, scaleName, rows }: { title: string; scaleName: string; rows: SwatchRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mb-10">
      <h3 className="mb-4 font-mono text-lg font-bold capitalize text-secondary-800 dark:text-secondary-200">
        {title}
        <span className="ml-2 text-sm font-normal normal-case text-secondary-600 dark:text-secondary-400">({scaleName})</span>
      </h3>
      <div>
        {rows.map((row) => (
          <ColorSwatch
            key={`${scaleName}-${row.step}`}
            name={`${scaleName}.${row.step}`}
            value={row.hex}
            cssVar={row.cssVar}
          />
        ))}
      </div>
    </section>
  );
}

function ColorsPage() {
  return (
    <div className="min-h-screen max-w-3xl bg-[var(--surface-page)] p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Foundation / Colors</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">[Stable] · Last updated Apr 2026</p>
      <p className="mb-4 text-secondary-600 dark:text-secondary-400">
        Swatches resolve from <code className="text-primary-800 dark:text-primary-400">tokens.json</code> via{' '}
        <code className="text-primary-800 dark:text-primary-400">getTokensForTheme(&apos;light&apos;)</code>. In product code use{' '}
        <strong>semantic</strong> Tailwind (<code className="text-primary-800 dark:text-primary-400">primary-*</code>,{' '}
        <code className="text-primary-800 dark:text-primary-400">secondary-*</code>, <code className="text-primary-800 dark:text-primary-400">surface.*</code>, …),
        not raw scale names.
      </p>

      <nav aria-label="On this page" className="mb-10 border border-secondary-300 p-4 dark:border-secondary-700">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">On this page</div>
        <ul className="mt-2 list-inside list-disc text-secondary-600 dark:text-secondary-400">
          <li>Raw scales (amber, sepia, green, blue, purple, red)</li>
          <li>Semantic alias scales (primary, secondary, success, info, warning, error)</li>
          <li>Neutrals (black, white)</li>
          <li>Terminal accents (tokens.css)</li>
        </ul>
      </nav>

      <h2 className="mb-4 font-mono text-base font-bold text-secondary-800 dark:text-secondary-200">Raw scales</h2>
      {RAW_SCALE_ORDER.map((scale) => (
        <ColorScale key={scale} title={scale} scaleName={scale} rows={COLOR_SCALES.get(scale) ?? []} />
      ))}

      <h2 className="mb-4 mt-12 font-mono text-base font-bold text-secondary-800 dark:text-secondary-200">
        Semantic alias scales
      </h2>
      <p className="mb-6 text-secondary-600 dark:text-secondary-400">
        Same hex as underlying pigments where referenced from JSON — kept separate so components use{' '}
        <code className="text-primary-800 dark:text-primary-400">primary-*</code> / <code className="text-primary-800 dark:text-primary-400">error-*</code> etc.
      </p>
      {ALIAS_SCALE_ORDER.map((scale) => (
        <ColorScale key={scale} title={scale} scaleName={scale} rows={COLOR_SCALES.get(scale) ?? []} />
      ))}

      <h2 className="mb-4 mt-12 font-mono text-base font-bold text-secondary-800 dark:text-secondary-200">Neutrals</h2>
      <div className="mb-10 space-y-2">
        {NEUTRALS.map((n) => (
          <ColorSwatch key={n.name} name={n.name} value={n.hex} cssVar={n.cssVar} />
        ))}
      </div>

      <h2 className="mb-4 font-mono text-base font-bold text-secondary-800 dark:text-secondary-200">
        Terminal accents (TUI tier 2)
      </h2>
      <p className="mb-4 text-secondary-600 dark:text-secondary-400">
        Theme-specific: they live in the <code className="text-primary-800 dark:text-primary-400">light</code> and{' '}
        <code className="text-primary-800 dark:text-primary-400">dark</code> sets of{' '}
        <code className="text-primary-800 dark:text-primary-400">tokens.json</code> and in{' '}
        <code className="text-primary-800 dark:text-primary-400">tokens.css</code>, with different values per theme. Tailwind:{' '}
        <code className="text-primary-800 dark:text-primary-400">text-term-green</code>, …
      </p>
      <div className="space-y-2">
        {TERMINAL_VARS.map((t) => {
          const cssVar = `--color-term-${t}`;
          return (
            <div key={t} className="mb-2 flex items-center gap-3">
              <div
                className="h-12 w-12 shrink-0 border border-secondary-400 dark:border-secondary-600"
                style={{ backgroundColor: `var(${cssVar})` }}
              />
              <div className="font-mono text-sm">
                <div className="font-bold text-secondary-900 dark:text-secondary-100">term.{t}</div>
                <div className="text-secondary-600 dark:text-secondary-400">{cssVar}</div>
                <div className="text-xs text-secondary-400">Toggle Storybook theme — value follows .dark</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Colors',
  component: ColorsPage,
  /** `skip-test`: pigment atlas shows every step; many labels sit on saturated swatches and will not pass axe. */
  tags: ['autodocs', 'skip-test'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const BaseScales: Story = {
  name: 'All foundation scales',
};
