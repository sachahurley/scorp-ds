import { Button, ListRow, ThemeToggle, TuiIcon } from '@scorp-ds/components';

/**
 * Light front door: narrative + links. The component catalog stays in Storybook.
 *
 * Configure `VITE_STORYBOOK_URL` in `.env` for production (e.g. Chromatic). Local dev defaults to localhost:6006.
 */
const storybookHref =
  import.meta.env.VITE_STORYBOOK_URL?.trim() || 'http://localhost:6006';

/** Rows for the explore section; external rows carry the arrow suffix. */
const EXPLORE_ROWS: { title: string; description: string; href: string; external?: boolean }[] = [
  {
    title: 'Components',
    description: 'The interactive reference: every component, pattern, and screen in Storybook.',
    href: storybookHref,
  },
  {
    title: 'Tokens',
    description: 'Color, typography, spacing, and motion foundations, documented with live specimens.',
    href: `${storybookHref}/?path=/docs/foundation-colors--docs`,
  },
  {
    title: 'Source',
    description: 'The scorp-ds monorepo: tokens, components, and the Storybook that documents them.',
    href: 'https://github.com/sachahurley/scorp-ds',
    external: true,
  },
  {
    title: 'Portfolio',
    description: 'The system in production: the portfolio site runs on these tokens and components.',
    href: 'https://portfolio-iota-lac-28.vercel.app',
    external: true,
  },
  {
    title: 'Showcase',
    description: 'Scorpion Design System, the showcase site, restyled onto the merged system.',
    href: 'https://sachahurley.github.io/scorpion-design-system/',
    external: true,
  },
];

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-solid border-[var(--border-hairline)] bg-[var(--surface-container)] px-6 py-4">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          {/* Emphasis by color, not weight (single-weight convention) */}
          <span className="font-mono text-sm tracking-tight text-[var(--accent)]">
            Scorp DS
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-secondary-700 dark:text-secondary-600">
          Design system
        </p>
        <h1 className="mb-4 font-mono text-2xl text-[var(--text-primary)] md:text-3xl">
          Warm sepia, gold accent, plate corners
        </h1>
        <p className="mb-8 max-w-2xl font-mono text-sm leading-relaxed text-secondary-800 dark:text-secondary-500">
          Scorp DS is a React component library and token layer: a monospace, high-contrast system
          with stepped plate silhouettes instead of rounded corners, built to retheme from a single
          token source. This page is the front door; Storybook is the full interactive reference.
        </p>

        <Button href={storybookHref} size="large">
          Open the component library
        </Button>

        <section aria-label="Explore" className="mt-12">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-secondary-700 dark:text-secondary-600">
            Explore
          </p>
          <div className="space-y-1">
            {EXPLORE_ROWS.map((row) => (
              <ListRow
                key={row.title}
                title={row.title}
                description={row.description}
                href={row.href}
                titleSuffix={row.external ? <TuiIcon name="ExternalLink" size="3" /> : undefined}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              />
            ))}
          </div>
        </section>

        <p className="mt-10 font-mono text-xs text-secondary-800 dark:text-secondary-500">
          Tip: run <code className="text-[var(--text-primary)]">npm run storybook</code> in the repo, then{' '}
          <code className="text-[var(--text-primary)]">npm run site</code>, Storybook on :6006, this site on Vite's port.
        </p>
      </main>
    </div>
  );
}
