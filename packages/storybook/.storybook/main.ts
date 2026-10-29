import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root (packages/storybook/.storybook → ../../../) */
const repoRoot = path.resolve(dirname, '../../..');

/**
 * Resolves a framework or addon to its folder from THIS package, not from wherever
 * the `storybook` CLI happens to be hoisted. npm may nest `@storybook/react-vite`
 * under packages/storybook/node_modules (beside the Vite 6 that only this package
 * uses) while the CLI sits at the root; a bare name then fails with
 * "Cannot find module '@storybook/react-vite/preset'". Storybook documents this
 * pattern for monorepos.
 */
const require = createRequire(import.meta.url);
const getAbsolutePath = (value: string): string =>
  path.dirname(require.resolve(path.join(value, 'package.json')));

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-viewport'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite') as '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  /**
   * Resolve the components package to TypeScript source so `npm run storybook`
   * works without a prior `npm run build:components` (faster local dev).
   */
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    /**
     * "Failed to fetch dynamically imported module" in Storybook + Vite often comes from:
     * 1) Vite blocking files outside the default server root (monorepo) — fix with server.fs.allow
     * 2) Stale chunk URLs after HMR / server restart — hard-refresh or run `npm run storybook:clean`
     * 3) Duplicate React copies — fix with resolve.dedupe
     */
    const priorAllow = config.server?.fs?.allow ?? [];
    const allow = new Set<string>([
      repoRoot,
      path.join(repoRoot, 'packages', 'components'),
      path.join(repoRoot, 'packages', 'tokens'),
      path.join(repoRoot, 'packages', 'tui-art'),
      ...priorAllow,
    ]);

    return mergeConfig(config, {
      server: {
        fs: {
          allow: [...allow],
        },
      },
      resolve: {
        alias: {
          '@scorp-ds/components': path.join(
            repoRoot,
            'packages',
            'components',
            'src',
            'index.ts'
          ),
          '@scorp-ds/tui-art': path.join(repoRoot, 'packages', 'tui-art', 'src', 'index.ts'),
        },
        dedupe: ['react', 'react-dom'],
      },
      optimizeDeps: {
        // Linked TS source: pre-bundling this package often causes stale chunks → dynamic import fetch failures
        exclude: ['@scorp-ds/components', '@scorp-ds/tui-art'],
        include: ['react', 'react-dom', 'react/jsx-runtime', 'next-themes'],
      },
    });
  },
};

export default config;
