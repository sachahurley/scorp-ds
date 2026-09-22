import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { getToken } from '@scorp-ds/tokens';

import { TokenDocTable, type TokenDocRow } from '../doc-blocks/TokenDocTable';

/**
 * Foundation / Z-index
 *
 * Global stacking scale from tokens.json → `--z-index-*` in tokens.css (not theme-specific).
 */

const LAYERS: { label: string; cssVar: string; parserKey: string; usage: string }[] = [
  { label: 'zIndex.base', cssVar: '--z-index-base', parserKey: 'z-index-base', usage: 'Default document flow' },
  { label: 'zIndex.dropdown', cssVar: '--z-index-dropdown', parserKey: 'z-index-dropdown', usage: 'Menus attached to inputs' },
  { label: 'zIndex.sticky', cssVar: '--z-index-sticky', parserKey: 'z-index-sticky', usage: 'Sticky headers or columns' },
  { label: 'zIndex.overlay', cssVar: '--z-index-overlay', parserKey: 'z-index-overlay', usage: 'Scrim below modals' },
  { label: 'zIndex.modal', cssVar: '--z-index-modal', parserKey: 'z-index-modal', usage: 'Modal dialog surfaces' },
  { label: 'zIndex.popover', cssVar: '--z-index-popover', parserKey: 'z-index-popover', usage: 'Popovers above modals when needed' },
  { label: 'zIndex.tooltip', cssVar: '--z-index-tooltip', parserKey: 'z-index-tooltip', usage: 'Highest hints and coach marks' },
];

/** Opaque semantic fills — cards stay empty; copy lives in the label column. */
const STACK_FILLS = [
  'var(--surface-muted)',
  'var(--surface-subtle)',
  'var(--surface-card)',
  'var(--field-background)',
  'var(--surface-subtle)',
  'var(--surface-card)',
  'var(--surface-muted)',
] as const;

/**
 * Diagonal stack uses real token z-index on cards only. Labels + leaders sit in a separate overlay layer
 * (painted after the isolated stack) so tooltip-level z-index never covers the typography.
 * Outer `isolate` still prevents the stack from painting over the doc page below.
 */
function StackPreview() {
  const n = LAYERS.length;
  const pad = 36;
  /** Vertical gap between row centers — must clear label block height so callouts do not overlap. */
  const stepX = 30;
  const stepY = 84;
  const cardW = 100;
  const cardH = 52;
  const leaderGap = 28;
  const labelW = 300;

  const lastI = n - 1;
  const stackRight = pad + lastI * stepX + cardW;
  const lineEndX = stackRight + leaderGap;
  const labelX = lineEndX + 10;
  const width = labelX + labelW + pad;
  const height = pad + lastI * stepY + cardH + pad;

  return (
    <div className="relative rounded-none" style={{ width, height }}>
      <div
        className="relative isolate z-0 h-full w-full overflow-hidden rounded-none border border-secondary-400 bg-surface-page dark:border-secondary-600"
        style={{ contain: 'layout paint' }}
      >
        {LAYERS.map((layer, i) => {
          const left = pad + i * stepX;
          const top = pad + i * stepY;
          const shortName = layer.label.replace('zIndex.', '');
          return (
            <div
              key={layer.cssVar}
              aria-hidden="true"
              className="absolute rounded-none border-2 border-line-strong shadow-none"
              style={{
                left,
                top,
                width: cardW,
                height: cardH,
                zIndex: `var(${layer.cssVar})`,
                backgroundColor: STACK_FILLS[i] ?? 'var(--surface-card)',
              }}
              title={`${shortName} — ${layer.cssVar}`}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <svg
          width={width}
          height={height}
          className="absolute left-0 top-0 block"
          aria-hidden
        >
          {LAYERS.map((layer, i) => {
            const left = pad + i * stepX;
            const top = pad + i * stepY;
            const yMid = top + cardH / 2;
            const x1 = left + cardW;
            const x2 = lineEndX;
            return (
              <line
                key={`leader-${layer.cssVar}`}
                x1={x1}
                y1={yMid}
                x2={x2}
                y2={yMid}
                stroke="var(--border-strong)"
                strokeWidth={1.5}
              />
            );
          })}
        </svg>

        {LAYERS.map((layer, i) => {
          const top = pad + i * stepY;
          const yMid = top + cardH / 2;
          const shortName = layer.label.replace('zIndex.', '');
          const zNum = getToken(layer.parserKey, 'light') ?? '—';
          return (
            <div
              key={`label-${layer.cssVar}`}
              className="absolute flex flex-col justify-center gap-0.5 bg-surface-page/95 px-1 font-mono leading-snug dark:bg-secondary-1000/95"
              style={{
                left: labelX,
                top: yMid,
                width: labelW,
                transform: 'translateY(-50%)',
              }}
            >
              <span className="text-base font-bold text-secondary-900 dark:text-secondary-100">{shortName}</span>
              <span className="text-sm text-secondary-800 dark:text-secondary-300">
                z-index: <span className="text-secondary-900 dark:text-secondary-100">{zNum}</span>
              </span>
              <code className="break-all text-xs text-secondary-800 dark:text-secondary-300">{layer.cssVar}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStackSwatch({ cssVar }: { cssVar: string }) {
  return (
    <div className="relative h-8 w-14 overflow-hidden border border-secondary-400 bg-surface-page dark:border-secondary-600">
      <div
        className="absolute left-1 top-1 h-5 w-10 border border-line-strong bg-surface-card"
        style={{ zIndex: `var(${cssVar})` }}
      />
    </div>
  );
}

function buildRows(): TokenDocRow[] {
  return LAYERS.map((layer) => {
    const v = getToken(layer.parserKey, 'light') ?? '—';
    return {
      swatch: <MiniStackSwatch cssVar={layer.cssVar} />,
      tokenLabel: layer.label,
      cssVar: layer.cssVar,
      rawValue: v,
      lightValue: v,
      darkValue: v,
      usage: layer.usage,
    };
  });
}

const ROWS = buildRows();

function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-secondary-800 dark:text-secondary-300 ${className}`.trim()}>{children}</p>;
}

function ZIndexPage() {
  return (
    <div className="min-h-screen bg-surface-page p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Foundation / Z-index</h1>
      <p className="mb-2 text-secondary-800 dark:text-secondary-300">[Stable] · Last updated Apr 2026</p>
      <p className="mb-4 max-w-3xl text-secondary-800 dark:text-secondary-300">
        Use the numbered scale so overlays, modals, and tooltips stay predictable across products. Values are global —
        they do not swap between light and dark.
      </p>

      <nav aria-label="On this page" className="mb-8 max-w-3xl border border-secondary-300 p-4 dark:border-secondary-700">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">On this page</div>
        <ul className="mt-2 list-inside list-disc text-secondary-800 dark:text-secondary-300">
          <li>
            <a className="text-primary-900 underline dark:text-primary-300" href="#visual">
              Stacking preview
            </a>
          </li>
          <li>
            <a className="text-primary-900 underline dark:text-primary-300" href="#tokens">
              Token table
            </a>
          </li>
          <li>
            <a className="text-primary-900 underline dark:text-primary-300" href="#code">
              Code
            </a>
          </li>
        </ul>
      </nav>

      <section id="visual" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Stacking preview</h2>
        <Note>
          Cards step diagonally and use real token z-index (back → front). <strong>Names, numbers, and CSS variables</strong>{' '}
          sit in a column to the right, with leader lines pointing at each card — nothing is typed inside the stack, so
          nothing gets covered. The card stack uses <code className="text-primary-800 dark:text-primary-400">isolation: isolate</code> so it
          cannot paint over the token table below.
        </Note>
        <div className="mt-6 flex justify-start">
          <StackPreview />
        </div>
      </section>

      <section id="tokens" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Token table</h2>
        <Note className="mb-4">
          The JSON path is camelCase (<code className="text-primary-800 dark:text-primary-400">zIndex.modal</code>); the parser and the
          CSS variable are both kebab-case (<code className="text-primary-800 dark:text-primary-400">z-index-modal</code>), and a drift
          test keeps them identical.
        </Note>
        <TokenDocTable rows={ROWS} />
      </section>

      <section id="code" className="mb-8">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Code</h2>
        <Note className="mb-4">
          Pass the custom property to <code className="text-primary-800 dark:text-primary-400">z-index</code> (works when the variable resolves
          to an integer).
        </Note>
        <pre className="overflow-x-auto rounded-none border border-secondary-300 bg-secondary-50 p-4 text-xs dark:border-secondary-700 dark:bg-secondary-950">
          {`.modal-root {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-modal);
}

.tooltip {
  position: absolute;
  z-index: var(--z-index-tooltip);
}`}
        </pre>
      </section>

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Related
        </h2>
        <p className="text-secondary-800 dark:text-secondary-300">
          <strong>Semantic / Elevation</strong> handles borders and shadows on surfaces; z-index handles overlap order.
        </p>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Z-index',
  component: ZIndexPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Stacking scale',
};
