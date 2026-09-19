import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import {
  BOX_CHARS,
  type BoxStyle,
  formatTableRow,
  frameBox,
} from '@scorp-ds/tui-art';

/**
 * Lab / TUI art playground
 *
 * Live preview for `@scorp-ds/tui-art`: frames and a sample table row.
 * Spec: `docs/specs/patterns-tui-unicode-art.md`.
 */
function TuiArtPlaygroundPage() {
  const [title, setTitle] = useState('Scorp DS');
  const [bodyText, setBodyText] = useState('Line one\nLine two\n✓ ok  ⚠ check logs');
  const [widthStr, setWidthStr] = useState('');
  const [style, setStyle] = useState<BoxStyle>('light');
  const [c0, setC0] = useState('job');
  const [c1, setC1] = useState('running');
  const [c2, setC2] = useState('42');
  const [w0, setW0] = useState('12');
  const [w1, setW1] = useState('10');
  const [w2, setW2] = useState('4');
  const [rowDense, setRowDense] = useState(false);

  const framed = useMemo(() => {
    const lines = bodyText.split(/\r?\n/);
    const width = widthStr.trim() === '' ? undefined : Number(widthStr);
    return frameBox({
      title: title.trim() || undefined,
      lines,
      style,
      width:
        width !== undefined && Number.isFinite(width) && width >= 4
          ? Math.floor(width)
          : undefined,
    });
  }, [bodyText, title, widthStr, style]);

  const tableRow = useMemo(() => {
    const widths = [w0, w1, w2].map((s) => Math.max(1, Math.floor(Number(s) || 1)));
    return formatTableRow([c0, c1, c2], widths, {
      style,
      dense: rowDense,
    });
  }, [c0, c1, c2, w0, w1, w2, style, rowDense]);

  const b = BOX_CHARS[style];
  const tableTop = b.tl + b.h.repeat(tableRow.length - 2) + b.tr;
  const tableBot = b.bl + b.h.repeat(tableRow.length - 2) + b.br;

  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-8 font-mono text-sm text-secondary-900 dark:text-secondary-50">
      <h1 className="mb-2 text-xl font-bold">Lab / TUI art playground</h1>
      <p className="mb-2 text-secondary-800 dark:text-secondary-300">
        [Beta] · Last updated Apr 2026
      </p>
      <p className="mb-8 max-w-2xl text-secondary-800 dark:text-secondary-300">
        This page calls <code className="text-primary-700 dark:text-primary-400">@scorp-ds/tui-art</code> in the
        browser. Output is plain text in a <code className="text-primary-700 dark:text-primary-400">pre</code> — use
        the same strings in logs, CLI tools, or decorative panels. Related:{' '}
        <strong>Foundation / Unicode icons</strong> for <code className="text-primary-700 dark:text-primary-400">TuiIcon</code> names.
      </p>

      <div className="mb-10 grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="space-y-3 border border-secondary-300 p-4 dark:border-secondary-700">
          <h2 className="text-base font-bold text-secondary-800 dark:text-secondary-200">Frame</h2>
          <label className="block text-xs font-bold text-secondary-800 dark:text-secondary-400" htmlFor="tui-art-title">
            Title (optional)
          </label>
          <input
            id="tui-art-title"
            className="w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          <label className="block text-xs font-bold text-secondary-800 dark:text-secondary-400" htmlFor="tui-art-body">
            Body (one line per row)
          </label>
          <textarea
            id="tui-art-body"
            className="h-32 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
          />
          <label className="block text-xs font-bold text-secondary-800 dark:text-secondary-400" htmlFor="tui-art-width">
            Outer width (empty = auto)
          </label>
          <input
            id="tui-art-width"
            className="w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
            value={widthStr}
            onChange={(e) => setWidthStr(e.target.value)}
            inputMode="numeric"
            type="text"
            placeholder="e.g. 48"
          />
          <label className="block text-xs font-bold text-secondary-800 dark:text-secondary-400" htmlFor="tui-art-style">
            Style
          </label>
          <select
            id="tui-art-style"
            className="w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
            value={style}
            onChange={(e) => setStyle(e.target.value as BoxStyle)}
          >
            <option value="light">light (Unicode box drawing)</option>
            <option value="heavy">heavy (double-line Unicode)</option>
            <option value="ascii">ascii (+ - |)</option>
          </select>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-secondary-800 dark:text-secondary-200">Preview</h2>
          <p className="text-xs text-secondary-800 dark:text-secondary-400">
            Decorative monospace output; pair with real text labels for accessibility in product UI.
          </p>
          <pre
            className="overflow-x-auto border border-secondary-300 bg-secondary-50 p-4 text-xs leading-tight text-primary-900 dark:border-secondary-700 dark:bg-secondary-950 dark:text-primary-300"
            aria-label="TUI frame preview"
          >
            {framed}
          </pre>
        </div>
      </div>

      <div className="max-w-4xl border-t border-secondary-300 pt-10 dark:border-secondary-700">
        <h2 className="mb-4 text-base font-bold text-secondary-800 dark:text-secondary-200">Table row helper</h2>
        <p className="mb-4 text-secondary-800 dark:text-secondary-300">
          <code className="text-primary-700 dark:text-primary-400">formatTableRow</code> returns a single line; wrap with
          horizontal rules using the same border style (<code className="text-primary-700 dark:text-primary-400">BOX_CHARS</code>) for a mini table.
        </p>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <label className="block text-xs" htmlFor="tui-row-c0">
            <span className="font-bold text-secondary-800 dark:text-secondary-400">Cell 0</span>
            <input
              id="tui-row-c0"
              className="mt-1 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
              value={c0}
              onChange={(e) => setC0(e.target.value)}
              type="text"
            />
          </label>
          <label className="block text-xs" htmlFor="tui-row-c1">
            <span className="font-bold text-secondary-800 dark:text-secondary-400">Cell 1</span>
            <input
              id="tui-row-c1"
              className="mt-1 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
              value={c1}
              onChange={(e) => setC1(e.target.value)}
              type="text"
            />
          </label>
          <label className="block text-xs" htmlFor="tui-row-c2">
            <span className="font-bold text-secondary-800 dark:text-secondary-400">Cell 2</span>
            <input
              id="tui-row-c2"
              className="mt-1 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
              value={c2}
              onChange={(e) => setC2(e.target.value)}
              type="text"
            />
          </label>
        </div>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <label className="block text-xs" htmlFor="tui-row-w0">
            <span className="font-bold text-secondary-800 dark:text-secondary-400">Width 0</span>
            <input
              id="tui-row-w0"
              className="mt-1 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
              value={w0}
              onChange={(e) => setW0(e.target.value)}
              type="text"
            />
          </label>
          <label className="block text-xs" htmlFor="tui-row-w1">
            <span className="font-bold text-secondary-800 dark:text-secondary-400">Width 1</span>
            <input
              id="tui-row-w1"
              className="mt-1 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
              value={w1}
              onChange={(e) => setW1(e.target.value)}
              type="text"
            />
          </label>
          <label className="block text-xs" htmlFor="tui-row-w2">
            <span className="font-bold text-secondary-800 dark:text-secondary-400">Width 2</span>
            <input
              id="tui-row-w2"
              className="mt-1 w-full border border-secondary-400 bg-[var(--surface-default)] px-2 py-1 text-secondary-900 dark:border-secondary-600 dark:text-secondary-100"
              value={w2}
              onChange={(e) => setW2(e.target.value)}
              type="text"
            />
          </label>
        </div>
        <label className="mb-4 flex items-center gap-2 text-xs text-secondary-800 dark:text-secondary-300">
          <input type="checkbox" checked={rowDense} onChange={(e) => setRowDense(e.target.checked)} />
          Dense row (no extra spaces inside cells)
        </label>
        <pre
          className="overflow-x-auto border border-secondary-300 bg-secondary-50 p-4 text-xs leading-tight text-primary-900 dark:border-secondary-700 dark:bg-secondary-950 dark:text-primary-300"
          aria-label="TUI table row preview"
        >
          {tableTop}
          {'\n'}
          {tableRow}
          {'\n'}
          {tableBot}
        </pre>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Lab/Tui art playground',
  component: TuiArtPlaygroundPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: 'Playground',
  render: () => <TuiArtPlaygroundPage />,
};
