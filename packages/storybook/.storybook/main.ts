import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root (packages/storybook/.storybook → ../../../) */
const repoRoot = path.resolve(dirname, '../../..');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
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
        },
        dedupe: ['react', 'react-dom'],
      },
      optimizeDeps: {
        // Linked TS source: pre-bundling this package often causes stale chunks → dynamic import fetch failures
        exclude: ['@scorp-ds/components'],
        include: ['react', 'react-dom', 'react/jsx-runtime', 'next-themes'],
      },
    });
  },
};

export default config;
