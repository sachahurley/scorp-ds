import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { getToken } from '@scorp-ds/tokens';

import { TokenDocTable, type TokenDocRow } from '../doc-blocks/TokenDocTable';

/**
 * Foundation / Breakpoints
 *
 * Responsive scale from `global.breakpoint` in tokens.json. The Tailwind preset
 * builds its `screens` straight from the same group, so the `sm:` / `md:` /
 * `lg:` / `xl:` utilities and the `--breakpoint-*` custom properties cannot
 * drift apart.
 */

type BreakpointRow = {
  /** Token path as written in tokens.json. */
  label: string;
  /** Flattened parser key, identical to the CSS custom property without `--`. */
  key: string;
  /** Tailwind responsive prefix, or null when the step is not a layout step. */
  prefix: string | null;
  /** What the step is for. */
  usage: string;
  /** Which parts of the system change at this width today. */
  usedBy: string;
};

const BREAKPOINTS: BreakpointRow[] = [
  {
    label: 'breakpoint.sm',
    key: 'breakpoint-sm',
    prefix: 'sm:',
    usage: 'First responsive step: phone landscape and up',
    usedBy: 'CaseStudy (sm:mt-24 section rhythm, sm:grid-cols-2 stat grid)',
  },
  {
    label: 'breakpoint.md',
    key: 'breakpoint-md',
    prefix: 'md:',
    usage: 'Tablet portrait and up',
    usedBy: 'AppHeader (md:block desktop nav, md:hidden menu button)',
  },
  {
    label: 'breakpoint.docked',
    key: 'breakpoint-docked',
    prefix: null,
    usage: 'Component breakpoint, not a layout step. Read from JS, no utility prefix',
    usedBy: 'Modal docked variant: pins bottom-center at or above this width, centers below it',
  },
  {
    label: 'breakpoint.lg',
    key: 'breakpoint-lg',
    prefix: 'lg:',
    usage: 'Tablet landscape and small laptops',
    usedBy: 'Card (lg:p-6 padding step)',
  },
  {
    label: 'breakpoint.xl',
    key: 'breakpoint-xl',
    prefix: 'xl:',
    usage: 'Desktop',
    usedBy: 'No component uses it yet; available for wide screen compositions',
  },
];

/** Resolved pixel number for a breakpoint token (values are global, so light is enough). */
function px(key: string): number {
  return Number.parseFloat(getToken(key, 'light') ?? '0');
}

const WIDEST = Math.max(...BREAKPOINTS.map((b) => px(b.key)));

/** Proportional ruler: bar length is the breakpoint's share of the widest step. */
function Ruler() {
  return (
    <div className="max-w-3xl">
      {BREAKPOINTS.map((b) => {
        const value = px(b.key);
        const share = WIDEST === 0 ? 0 : (value / WIDEST) * 100;
        const isComponentStep = b.prefix === null;
        return (
          <div key={b.key} className="mb-4">
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3 text-secondary-900 dark:text-secondary-100">
              <span className="font-bold">{b.label}</span>
              <span className="text-secondary-800 dark:text-secondary-300">{value}px</span>
              <code className="text-xs text-secondary-800 dark:text-secondary-300">
                {b.prefix ? `${b.prefix}…` : 'no utility prefix'}
              </code>
            </div>
            <div
              aria-hidden="true"
              className="h-4 w-full border border-line-strong bg-surface-muted"
            >
              <div
                className={`h-full ${isComponentStep ? 'bg-secondary-600' : 'bg-primary-400'}`}
                style={{ width: `${share}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniBar({ tokenKey, componentStep }: { tokenKey: string; componentStep: boolean }) {
  const share = WIDEST === 0 ? 0 : (px(tokenKey) / WIDEST) * 100;
  return (
    <div aria-hidden="true" className="h-4 w-14 border border-line-strong bg-surface-muted">
      <div className={`h-full ${componentStep ? 'bg-secondary-600' : 'bg-primary-400'}`} style={{ width: `${share}%` }} />
    </div>
  );
}

function buildRows(): TokenDocRow[] {
  return BREAKPOINTS.map((b) => {
    const value = getToken(b.key, 'light') ?? '—';
    return {
      swatch: <MiniBar tokenKey={b.key} componentStep={b.prefix === null} />,
      tokenLabel: b.label,
      cssVar: `--${b.key}`,
      rawValue: value,
      lightValue: value,
      darkValue: value,
      usage: b.usage,
    };
  });
}

const ROWS = buildRows();

function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-secondary-800 dark:text-secondary-300 ${className}`.trim()}>{children}</p>;
}

function BreakpointsPage() {
  return (
    <div className="min-h-screen bg-surface-page p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Foundation / Breakpoints</h1>
      <p className="mb-2 text-secondary-800 dark:text-secondary-300">[Stable] · Last updated Sep 2026</p>
      <p className="mb-4 max-w-3xl text-secondary-800 dark:text-secondary-300">
        Five widths at which the interface is allowed to change. Four of them are the layout steps behind Tailwind&apos;s{' '}
        <code className="text-primary-800 dark:text-primary-400">sm:</code>, <code className="text-primary-800 dark:text-primary-400">md:</code>,{' '}
        <code className="text-primary-800 dark:text-primary-400">lg:</code> and <code className="text-primary-800 dark:text-primary-400">xl:</code>{' '}
        prefixes; the fifth, <code className="text-primary-800 dark:text-primary-400">docked</code>, belongs to one component. The values are
        global: they do not change between light and dark.
      </p>

      <nav aria-label="On this page" className="mb-8 max-w-3xl border border-secondary-300 p-4 dark:border-secondary-700">
        <div className="font-bold text-secondary-900 dark:text-secondary-100">On this page</div>
        <ul className="mt-2 list-inside list-disc text-secondary-800 dark:text-secondary-300">
          <li>
            <a className="text-primary-900 underline dark:text-primary-300" href="#visual">
              The scale
            </a>
          </li>
          <li>
            <a className="text-primary-900 underline dark:text-primary-300" href="#who">
              Who uses which
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
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">The scale</h2>
        <Note className="mb-6">
          Bars are drawn to scale against the widest step. The amber bars are layout steps with a Tailwind prefix; the
          sepia bar is the component-only <code className="text-primary-800 dark:text-primary-400">docked</code> width, which sits between{' '}
          <code className="text-primary-800 dark:text-primary-400">md</code> and <code className="text-primary-800 dark:text-primary-400">lg</code>.
        </Note>
        <Ruler />
      </section>

      <section id="who" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Who uses which</h2>
        <Note className="mb-4">
          Every responsive rule in the component library, in one place. If a component is not listed, it looks the same
          at every width.
        </Note>
        <div className="max-w-3xl overflow-x-auto border border-secondary-300 dark:border-secondary-700">
          <table className="w-full min-w-[560px] border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-secondary-300 bg-secondary-100 dark:border-secondary-700 dark:bg-secondary-950">
                <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
                  Breakpoint
                </th>
                <th scope="col" className="p-3 font-bold text-secondary-900 dark:text-secondary-100">
                  Used by
                </th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((b) => (
                <tr key={b.key} className="border-b border-secondary-200 dark:border-secondary-800">
                  <td className="align-top p-3 text-secondary-900 dark:text-secondary-100">
                    <div className="font-bold">{b.label}</div>
                    <div className="mt-0.5 text-secondary-800 dark:text-secondary-300">{getToken(b.key, 'light')}</div>
                  </td>
                  <td className="align-top p-3 text-secondary-800 dark:text-secondary-300">{b.usedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="tokens" className="mb-12">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Token table</h2>
        <Note className="mb-4">
          The Tailwind preset reads <code className="text-primary-800 dark:text-primary-400">global.breakpoint</code> out of tokens.json to
          build its <code className="text-primary-800 dark:text-primary-400">screens</code>, and a drift test asserts every{' '}
          <code className="text-primary-800 dark:text-primary-400">--breakpoint-*</code> custom property matches. Tailwind&apos;s{' '}
          <code className="text-primary-800 dark:text-primary-400">2xl:</code> default (1536px) is still available but is not part of the
          token scale.
        </Note>
        <TokenDocTable rows={ROWS} />
      </section>

      <section id="code" className="mb-8">
        <h2 className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">Code</h2>
        <Note className="mb-4">
          Reach for the Tailwind prefix in markup. Read the custom property only when the decision has to happen in
          JavaScript, the way Modal picks its docked layout.
        </Note>
        <pre className="overflow-x-auto rounded-none border border-secondary-300 bg-secondary-50 p-4 text-xs dark:border-secondary-700 dark:bg-secondary-950">
          {`// Markup: the prefix is the API
<nav className="hidden md:block">…</nav>

// JavaScript: read the token, never a literal
const raw = getComputedStyle(document.documentElement)
  .getPropertyValue("--breakpoint-docked");
const wide = window.matchMedia(\`(min-width: \${parseFloat(raw)}px)\`).matches;`}
        </pre>
      </section>

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-2 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Related
        </h2>
        <p className="text-secondary-800 dark:text-secondary-300">
          <strong>Foundation / Spacing</strong> is the rhythm inside a breakpoint; <strong>Components / Overlays / Modal</strong>{' '}
          documents the docked variant this scale drives.
        </p>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Breakpoints',
  component: BreakpointsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Responsive scale',
};
