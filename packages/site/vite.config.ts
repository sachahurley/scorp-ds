import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
/** Monorepo root: packages/site → ../.. */
const repoRoot = path.resolve(dirname, '../..');

/**
 * Vite resolves `@scorp-ds/components` to package source (same idea as Storybook)
 * so `npm run dev` works without a prior components build.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [repoRoot, path.join(repoRoot, 'packages/components'), path.join(repoRoot, 'packages/tokens')],
    },
  },
  resolve: {
    alias: {
      '@scorp-ds/components': path.join(repoRoot, 'packages/components/src/index.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['@scorp-ds/components'],
    include: ['react', 'react-dom', 'react/jsx-runtime', 'next-themes'],
  },
});
