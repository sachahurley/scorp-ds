import type { Meta, StoryObj } from '@storybook/react';
import { TUI_ICON_GLYPHS } from '@scorp-ds/components';

/** Human-readable Unicode scalar values for catalog tables (handles supplementary planes). */
function formatCodePoints(glyph: string): string {
  return [...glyph]
    .map((ch) => {
      const cp = ch.codePointAt(0)!;
      return `U+${cp.toString(16).toUpperCase().padStart(cp > 0xffff ? 5 : 4, '0')}`;
    })
    .join(' ');
}

const ICON_ROWS = (Object.keys(TUI_ICON_GLYPHS) as (keyof typeof TUI_ICON_GLYPHS)[])
  .slice()
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({
    name,
    glyph: TUI_ICON_GLYPHS[name],
    codePoints: formatCodePoints(TUI_ICON_GLYPHS[name]),
  }));

/**
 * Foundation / Unicode icons
 *
 * Single place to browse every `TuiIcon` name, its glyph, and code points.
 * See **Components → Display → TuiIcon** for interactive controls and size scale.
 */
function UnicodeIconsPage() {
  return (
    <div className="min-h-screen max-w-5xl bg-[var(--surface-page)] p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold">Foundation / Unicode icons</h1>
      <p className="mb-2 text-secondary-800 dark:text-secondary-300">
        [Stable] · Last updated Apr 2026
      </p>
      <p className="mb-4 text-secondary-800 dark:text-secondary-300">
        Scorp DS uses Unicode glyphs in monospace instead of SVG icons for a terminal-native look. Use{' '}
        <code className="text-primary-700 dark:text-primary-400">&lt;TuiIcon name=&quot;…&quot; /&gt;</code> in
        product UI; this page is the full registry.
      </p>

      <nav className="mb-8 border border-secondary-300 p-3 text-xs text-secondary-800 dark:border-secondary-700 dark:text-secondary-300">
        <span className="font-bold text-secondary-900 dark:text-secondary-100">On this page:</span>{' '}
        <a className="text-primary-700 underline dark:text-primary-400" href="#catalog">
          Full catalog
        </a>
        {' · '}
        <a className="text-primary-700 underline dark:text-primary-400" href="#tui-graphics">
          Line art &amp; ASCII-style graphics
        </a>
        {' · '}
        <span className="text-secondary-800 dark:text-secondary-400">
          Live generator: <strong>Lab / Tui art playground</strong>
        </span>
      </nav>

      <section id="catalog" className="mb-12">
        <h2 className="mb-3 text-lg font-bold text-secondary-800 dark:text-secondary-200">Full catalog</h2>
        <p className="mb-4 text-secondary-800 dark:text-secondary-300">
          Each row shows the live glyph (same rendering as <code className="text-primary-700 dark:text-primary-400">TuiIcon</code>), the
          component <code className="text-primary-700 dark:text-primary-400">name</code> prop, and official Unicode code point(s).
        </p>

        <div className="mb-6 flex flex-wrap gap-3 border border-secondary-300 p-4 dark:border-secondary-700">
          {ICON_ROWS.map(({ name, glyph }) => (
            <span
              key={name}
              className="inline-flex min-w-[3rem] flex-col items-center gap-1 border border-secondary-200 px-2 py-2 dark:border-secondary-800"
              title={name}
            >
              <span className="text-2xl leading-none text-primary-700 dark:text-primary-400">{glyph}</span>
              <span className="max-w-[6rem] truncate text-[10px] text-secondary-800 dark:text-secondary-400">{name}</span>
            </span>
          ))}
        </div>

        <div className="overflow-x-auto border border-secondary-300 dark:border-secondary-700">
          <table className="w-full min-w-[36rem] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-secondary-300 bg-secondary-100 dark:border-secondary-700 dark:bg-secondary-900">
                <th className="p-2 font-bold">Glyph</th>
                <th className="p-2 font-bold">Name</th>
                <th className="p-2 font-bold">Unicode</th>
                <th className="p-2 font-bold">Usage</th>
              </tr>
            </thead>
            <tbody>
              {ICON_ROWS.map(({ name, glyph, codePoints }) => (
                <tr
                  key={name}
                  className="border-b border-secondary-200 odd:bg-[var(--surface-default)] even:bg-secondary-50 dark:border-secondary-800 dark:even:bg-secondary-950"
                >
                  <td className="p-2 align-middle">
                    <span className="inline-flex text-xl leading-none text-primary-700 dark:text-primary-400">{glyph}</span>
                  </td>
                  <td className="p-2 align-middle font-mono text-secondary-900 dark:text-secondary-100">{name}</td>
                  <td className="p-2 align-middle font-mono text-secondary-800 dark:text-secondary-300">{codePoints}</td>
                  <td className="p-2 align-middle text-secondary-800 dark:text-secondary-300">
                    <code className="text-[11px] text-primary-800 dark:text-primary-300">{`<TuiIcon name="${name}" />`}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="tui-graphics">
        <h2 className="mb-3 text-lg font-bold text-secondary-800 dark:text-secondary-200">
          Line art &amp; ASCII-style graphics
        </h2>
        <p className="mb-4 text-secondary-800 dark:text-secondary-300">
          For decorative banners, log panes, or “terminal chrome,” you can compose multi-line text in a{' '}
          <code className="text-primary-700 dark:text-primary-400">font-mono</code> block. Prefer box-drawing characters (
          <span className="whitespace-nowrap">U+2500–U+257F</span>) and light punctuation so layouts stay aligned in monospace.
        </p>
        <div className="border border-secondary-300 bg-secondary-50 p-4 text-secondary-900 dark:border-secondary-700 dark:bg-secondary-950 dark:text-secondary-100">
          <p className="mb-2 text-xs font-bold text-secondary-800 dark:text-secondary-300">Example (static)</p>
          <pre className="overflow-x-auto text-xs leading-tight text-primary-800 dark:text-primary-300" aria-label="Sample TUI line art">
            {`┌──────────────────────────────┐
│  Scorp DS · Unicode / TUI    │
├──────────────────────────────┤
│  ${TUI_ICON_GLYPHS.Check} ok   ${TUI_ICON_GLYPHS.AlertTriangle} warn   ${TUI_ICON_GLYPHS.X} fail   │
└──────────────────────────────┘`}
          </pre>
        </div>
        <p className="mt-4 text-secondary-800 dark:text-secondary-300">
          A dedicated generator (CLI or Figma plugin) would typically output: fixed column width, chosen character set (pure ASCII vs.
          Unicode box drawing), and optional comments for designers — see team discussion for scope.
        </p>
      </section>

      <section className="mt-10 border-t border-secondary-300 pt-6 dark:border-secondary-700">
        <p className="text-xs text-secondary-800 dark:text-secondary-400">
          Related: <strong>Components / Display / TuiIcon</strong> — sizes and playground. ·{' '}
          <strong>Lab / Tui art playground</strong> — live frames via <code className="text-primary-700 dark:text-primary-400">@scorp-ds/tui-art</code>.
        </p>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundation/Unicode icons',
  component: UnicodeIconsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Catalog: Story = {
  name: 'Catalog',
  render: () => <UnicodeIconsPage />,
};
