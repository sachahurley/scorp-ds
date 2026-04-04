import type { Meta, StoryObj } from '@storybook/react';

/**
 * Semantic / Colors
 *
 * Theme-aware role tokens from `light` / `dark` in tokens.json → `--*` in tokens.css.
 * Tailwind (with `@scorp-ds/tokens` preset): `bg-surface-card`, `text-foreground-primary`,
 * `border-line-default`, `bg-field-bg`, etc.
 */
type Row = { label: string; varName: string; usage: string };

const SURFACE: Row[] = [
  { label: 'surface.page', varName: '--surface-page', usage: 'App / canvas background' },
  { label: 'surface.container', varName: '--surface-container', usage: 'Sections, panels' },
  { label: 'surface.card', varName: '--surface-card', usage: 'Cards, modal panels' },
  { label: 'surface.raised', varName: '--surface-raised', usage: 'Slightly lifted surface (often matches card)' },
  { label: 'surface.container-stroke', varName: '--surface-container-stroke', usage: 'Hairline chrome borders' },
  { label: 'surface.subtle', varName: '--surface-subtle', usage: 'Zebra rows, inset bands' },
  { label: 'surface.muted', varName: '--surface-muted', usage: 'Disabled / low-emphasis blocks' },
  { label: 'surface.overlay', varName: '--surface-overlay', usage: 'Modal / drawer scrim' },
  { label: 'surface.inverse', varName: '--surface-inverse', usage: 'Inverse band (dark bar in light theme)' },
];

const TEXT: Row[] = [
  { label: 'text.primary', varName: '--text-primary', usage: 'Body, headings' },
  { label: 'text.secondary', varName: '--text-secondary', usage: 'Supporting copy' },
  { label: 'text.tertiary', varName: '--text-tertiary', usage: 'Meta, timestamps, hints' },
  { label: 'text.disabled', varName: '--text-disabled', usage: 'Disabled labels (pair with opacity if needed)' },
  { label: 'text.link', varName: '--text-link', usage: 'Default link color' },
  { label: 'text.link-hover', varName: '--text-link-hover', usage: 'Link hover' },
  { label: 'text.on-inverse', varName: '--text-on-inverse', usage: 'Text on surface.inverse' },
];

const BORDER: Row[] = [
  { label: 'border.default', varName: '--border-default', usage: 'Default dividers, input borders' },
  { label: 'border.muted', varName: '--border-muted', usage: 'Softer separators' },
  { label: 'border.strong', varName: '--border-strong', usage: 'Emphasized outlines' },
  { label: 'border.error', varName: '--border-error', usage: 'Validation / error chrome' },
  { label: 'border.focus', varName: '--border-focus', usage: 'Focus outline color (with ring width from global)' },
];

const FIELD: Row[] = [
  { label: 'field.background', varName: '--field-background', usage: 'Input / textarea fill' },
  { label: 'field.background-error', varName: '--field-background-error', usage: 'Invalid field fill' },
  { label: 'field.border', varName: '--field-border', usage: 'Default control border' },
  { label: 'field.border-hover', varName: '--field-border-hover', usage: 'Hovered control' },
  { label: 'field.border-focus', varName: '--field-border-focus', usage: 'Focused control' },
  { label: 'field.border-error', varName: '--field-border-error', usage: 'Invalid control' },
  { label: 'field.placeholder', varName: '--field-placeholder', usage: 'Placeholder text' },
];

const FOCUS: Row[] = [
  { label: 'focus.ring.primary', varName: '--focus-ring-primary', usage: 'Default focus ring' },
  { label: 'focus.ring.secondary', varName: '--focus-ring-secondary', usage: 'Neutral focus' },
  { label: 'focus.ring.error', varName: '--focus-ring-error', usage: 'Invalid field focus' },
  { label: 'focus.ring.destructive', varName: '--focus-ring-destructive', usage: 'Destructive control focus' },
  { label: 'focus.ring.icon', varName: '--focus-ring-icon', usage: 'Icon / square button focus (often matches primary)' },
  { label: 'focus.offset-color', varName: '--focus-offset-color', usage: 'Gap between control and ring' },
];

const BUTTON_PRIMARY: Row[] = [
  { label: 'button.primary.background', varName: '--button-primary-background', usage: 'Primary CTA fill' },
  { label: 'button.primary.background-hover', varName: '--button-primary-background-hover', usage: 'Primary hover' },
  { label: 'button.primary.text', varName: '--button-primary-text', usage: 'Label on primary' },
];

const BUTTON_SECONDARY: Row[] = [
  { label: 'button.secondary.background', varName: '--button-secondary-background', usage: 'Secondary fill' },
  { label: 'button.secondary.background-hover', varName: '--button-secondary-background-hover', usage: 'Secondary hover' },
  { label: 'button.secondary.text', varName: '--button-secondary-text', usage: 'Label on secondary' },
];

const BUTTON_GHOST: Row[] = [
  { label: 'button.ghost.background', varName: '--button-ghost-background', usage: 'Ghost (often transparent)' },
  { label: 'button.ghost.background-hover', varName: '--button-ghost-background-hover', usage: 'Ghost hover fill' },
  { label: 'button.ghost.text', varName: '--button-ghost-text', usage: 'Ghost label' },
];

const BUTTON_OUTLINE: Row[] = [
  { label: 'button.outline.border', varName: '--button-outline-border', usage: 'Outline border' },
  { label: 'button.outline.background', varName: '--button-outline-background', usage: 'Outline fill' },
  { label: 'button.outline.background-hover', varName: '--button-outline-background-hover', usage: 'Outline hover fill' },
  { label: 'button.outline.text', varName: '--button-outline-text', usage: 'Outline label' },
];

const BUTTON_DESTRUCTIVE: Row[] = [
  { label: 'button.destructive.background', varName: '--button-destructive-background', usage: 'Destructive fill' },
  { label: 'button.destructive.background-hover', varName: '--button-destructive-background-hover', usage: 'Destructive hover' },
  { label: 'button.destructive.text', varName: '--button-destructive-text', usage: 'Label on destructive' },
];

const BUTTON_LINK: Row[] = [
  { label: 'button.link.text', varName: '--button-link-text', usage: 'Text-style button' },
  { label: 'button.link.text-hover', varName: '--button-link-text-hover', usage: 'Text button hover' },
];

const BUTTON_ICON: Row[] = [
  { label: 'button.icon.background', varName: '--button-icon-background', usage: 'Icon / square button fill' },
  { label: 'button.icon.background-hover', varName: '--button-icon-background-hover', usage: 'Hover fill' },
  { label: 'button.icon.text', varName: '--button-icon-text', usage: 'Glyph color (inherits to SVG via currentColor)' },
  {
    label: 'button.icon.disabled-background',
    varName: '--button-icon-disabled-background',
    usage: 'Disabled icon button fill',
  },
  { label: 'button.icon.disabled-text', varName: '--button-icon-disabled-text', usage: 'Disabled glyph' },
];

/** Filled swatch; checker behind so transparent tokens read clearly */
function FillSwatch({ varName }: { varName: string }) {
  return (
    <div className="rounded-none bg-secondary-200 p-1 dark:bg-secondary-900">
      <div
        className="h-12 w-full max-w-xs border border-secondary-400 dark:border-secondary-600"
        style={{ backgroundColor: `var(${varName})` }}
      />
    </div>
  );
}

function TextSwatch({ varName }: { varName: string }) {
  return (
    <div className="flex h-12 max-w-xs items-center border border-secondary-300 bg-surface-page px-3 dark:border-secondary-700">
      <span className="truncate font-mono text-sm" style={{ color: `var(${varName})` }}>
        The quick brown fox
      </span>
    </div>
  );
}

function BorderSwatch({ varName }: { varName: string }) {
  return (
    <div
      className="h-12 w-full max-w-xs bg-surface-card"
      style={{ borderWidth: 3, borderStyle: 'solid', borderColor: `var(${varName})` }}
    />
  );
}

function TableFill({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
      <div className="space-y-6">
        {rows.map((row) => (
          <div
            key={row.varName}
            className="flex flex-col gap-2 border border-secondary-300 p-4 sm:flex-row sm:items-center sm:gap-6 dark:border-secondary-700"
          >
            <FillSwatch varName={row.varName} />
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

function TableText({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
      <div className="space-y-6">
        {rows.map((row) => (
          <div
            key={row.varName}
            className="flex flex-col gap-2 border border-secondary-300 p-4 sm:flex-row sm:items-center sm:gap-6 dark:border-secondary-700"
          >
            <TextSwatch varName={row.varName} />
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

function TableBorder({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-mono text-lg font-bold text-secondary-800 dark:text-secondary-200">{title}</h2>
      <div className="space-y-6">
        {rows.map((row) => (
          <div
            key={row.varName}
            className="flex flex-col gap-2 border border-secondary-300 p-4 sm:flex-row sm:items-center sm:gap-6 dark:border-secondary-700"
          >
            <BorderSwatch varName={row.varName} />
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

function SemanticPanel({ forcedDark }: { forcedDark?: boolean }) {
  const wrap = forcedDark ? 'dark' : '';
  return (
    <div
      className={`rounded-none border border-secondary-300 bg-[var(--surface-page)] p-6 dark:border-secondary-700 ${wrap}`}
    >
      <h3 className={`mb-4 font-bold text-[var(--text-primary)]`}>
        {forcedDark ? 'Dark context (forced)' : 'Current theme'}
      </h3>
      <p className="mb-6 text-[var(--text-secondary)]">
        {forcedDark
          ? 'Same token names; values from the `.dark` block in tokens.css.'
          : 'Follows Storybook preview (toolbar / system).'}
      </p>
      <TableFill rows={SURFACE} title="Surface" />
      <TableText rows={TEXT} title="Text" />
      <TableBorder rows={BORDER} title="Border" />
      <TableFill rows={FIELD} title="Field" />
      <TableFill rows={FOCUS} title="Focus" />
      <TableFill rows={BUTTON_PRIMARY} title="Button · primary" />
      <TableFill rows={BUTTON_SECONDARY} title="Button · secondary" />
      <TableFill rows={BUTTON_GHOST} title="Button · ghost" />
      <TableFill rows={BUTTON_OUTLINE} title="Button · outline" />
      <TableFill rows={BUTTON_DESTRUCTIVE} title="Button · destructive" />
      <TableFill rows={BUTTON_LINK} title="Button · link" />
      <TableFill rows={BUTTON_ICON} title="Button · icon" />
    </div>
  );
}

function SemanticColorsPage() {
  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="mb-2 text-xl font-bold text-secondary-900 dark:text-secondary-50">Semantic / Colors</h1>
      <p className="mb-2 text-secondary-600 dark:text-secondary-400">[Stable] · Last updated Apr 2026</p>
      <p className="mb-6 max-w-3xl text-secondary-600 dark:text-secondary-400">
        Prefer these <strong>role</strong> variables (or Tailwind groups <code className="text-primary-600">surface.*</code>,{' '}
        <code className="text-primary-600">foreground.*</code>, <code className="text-primary-600">line.*</code>,{' '}
        <code className="text-primary-600">field.*</code>) for layout, type, forms, and buttons. Keep{' '}
        <code className="text-primary-600">primary-*</code> / <code className="text-primary-600">secondary-*</code> scales for
        illustrations and rare cases — not for default app chrome.
      </p>

      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <SemanticPanel />
        <SemanticPanel forcedDark />
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
  name: 'Semantic roles (light & dark)',
};
