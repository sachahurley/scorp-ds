import type { Meta, StoryObj } from '@storybook/react';

/**
 * Semantic / Colors
 *
 * Theme-aware tokens: surfaces, text, primary button. Values switch with `.dark` on an ancestor (same as app + Storybook preview).
 */
type Row = { label: string; varName: string; usage: string };

const SURFACE: Row[] = [
  { label: 'surface.page', varName: '--surface-page', usage: 'App / canvas background' },
  { label: 'surface.container', varName: '--surface-container', usage: 'Sections, panels' },
  { label: 'surface.card', varName: '--surface-card', usage: 'Cards, modals' },
  { label: 'surface.container-stroke', varName: '--surface-container-stroke', usage: 'Hairline borders' },
];

const TEXT: Row[] = [
  { label: 'text.primary', varName: '--text-primary', usage: 'Body, headings' },
  { label: 'text.secondary', varName: '--text-secondary', usage: 'Supporting copy' },
];

const BUTTON_PRIMARY: Row[] = [
  { label: 'button.primary.background', varName: '--button-primary-background', usage: 'Primary CTA fill' },
  { label: 'button.primary.background-hover', varName: '--button-primary-background-hover', usage: 'Primary hover' },
  { label: 'button.primary.text', varName: '--button-primary-text', usage: 'Label on primary' },
];

function Swatch({ varName }: { varName: string }) {
  return (
    <div
      className="h-12 w-full max-w-xs border border-secondary-400 dark:border-secondary-600"
      style={{ backgroundColor: `var(${varName})` }}
    />
  );
}

function Table({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.varName} className="flex flex-col gap-2 border border-secondary-300 p-4 sm:flex-row sm:items-center sm:gap-6 dark:border-secondary-700">
            <Swatch varName={row.varName} />
            <div className="min-w-0 flex-1 font-mono text-xs">
              <div className="font-bold text-secondary-900 dark:text-secondary-100">{row.label}</div>
              <div className="text-secondary-500">{row.varName}</div>
              <div className="mt-1 text-secondary-600 dark:text-secondary-400">{row.usage}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SemanticColorsPage() {
  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Semantic / Colors</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">
        [Stable] · Last updated Apr 2026
      </p>
      <p className="mb-10 max-w-2xl text-secondary-600 dark:text-secondary-400">
        Use these semantic CSS variables (or Tailwind semantic colors like `bg-primary-400`, `text-secondary-600`) in
        components — not raw `amber-*` / `sepia-*` scale names in product code.
      </p>

      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-none border border-secondary-300 bg-[var(--surface-page)] p-6 dark:border-secondary-700">
          <h3 className="mb-4 font-bold text-[var(--text-primary)]">Current theme</h3>
          <p className="mb-6 text-[var(--text-secondary)]">Follows Storybook preview (toolbar / system).</p>
          <Table rows={SURFACE} title="Surface" />
          <Table rows={TEXT} title="Text" />
          <Table rows={BUTTON_PRIMARY} title="Button · primary" />
        </div>
        <div className="dark rounded-none border border-secondary-700 bg-[var(--surface-page)] p-6">
          <h3 className="mb-4 font-bold text-[var(--text-primary)]">Dark context (forced)</h3>
          <p className="mb-6 text-[var(--text-secondary)]">
            Same token names; values resolve from the `.dark` block in tokens.css.
          </p>
          <Table rows={SURFACE} title="Surface" />
          <Table rows={TEXT} title="Text" />
          <Table rows={BUTTON_PRIMARY} title="Button · primary" />
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Semantic/Colors',
  component: SemanticColorsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SemanticPalette: Story = {
  name: 'Surfaces, text & primary button',
};
