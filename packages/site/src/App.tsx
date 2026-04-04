import { Button, Stack, ThemeToggle, cn } from '@scorp-ds/components';
import type { CSSProperties } from 'react';

/**
 * Light front door: narrative + links. The component catalog stays in Storybook.
 *
 * Configure `VITE_STORYBOOK_URL` in `.env` for production (e.g. Chromatic). Local dev defaults to localhost:6006.
 */
const storybookHref =
  import.meta.env.VITE_STORYBOOK_URL?.trim() || 'http://localhost:6006';

/** Primary CTA as `<a>` (valid navigation + middle-click); mirrors `Button` primary tokens. */
const storybookLinkRing = {
  '--tw-ring-color': 'var(--focus-ring-primary)',
  outline: 'none',
} as CSSProperties;

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b-[0.5px] border-solid border-[var(--surface-container-stroke)] bg-[var(--surface-card)] px-6 py-4">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Scorp DS
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-secondary-600 dark:text-secondary-400">
          Design system
        </p>
        <h1 className="mb-4 font-mono text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
          Terminal-inspired UI for product teams
        </h1>
        <p className="mb-8 max-w-2xl font-mono text-sm leading-relaxed text-secondary-800 dark:text-secondary-200">
          Scorp DS is a React library and token layer built for sharp, monospace, high-density interfaces. This page is
          the public-facing introduction; Storybook is the full interactive reference for components, tokens, and
          patterns.
        </p>

        <Stack gap="4" axis="horizontal" className="flex-wrap">
          <a
            href={storybookHref}
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-none px-5 font-mono text-sm no-underline transition-colors [transition-duration:var(--duration-normal)]',
              'bg-[var(--button-primary-background)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-background-hover)] active:brightness-95',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]'
            )}
            style={storybookLinkRing}
          >
            Open component library (Storybook)
          </a>
          <Button variant="outline" size="medium" type="button" disabled>
            Figma variables (soon)
          </Button>
        </Stack>

        <p className="mt-10 font-mono text-xs text-secondary-700 dark:text-secondary-300">
          Tip: run <code className="text-[var(--text-primary)]">npm run storybook</code> in the repo, then{' '}
          <code className="text-[var(--text-primary)]">npm run site</code> — Storybook on :6006, this site on Vite’s port.
        </p>
      </main>
    </div>
  );
}
