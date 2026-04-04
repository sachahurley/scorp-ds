import { waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';

/**
 * Runs axe against each story after it renders (requires Storybook already served, e.g. port 6006).
 * Install browsers once: `npx playwright install` from the repo root or `packages/storybook`.
 *
 * We do not call `injectAxe` when `window.axe` already exists — `@storybook/addon-a11y` loads axe-core,
 * and injecting again plus overlapping `axe.run()` calls causes "Axe is already running" failures.
 */
const config: TestRunnerConfig = {
  tags: {
    skip: ['skip-test'],
  },
  async preVisit(page) {
    const hasAxe = await page.evaluate(
      () => typeof (window as unknown as { axe?: unknown }).axe !== 'undefined'
    );
    if (!hasAxe) {
      await injectAxe(page);
    }
  },
  async postVisit(page) {
    await waitForPageReady(page);
    // Defer until addon-a11y’s scan can finish — avoids concurrent axe.run with checkA11y.
    await new Promise((r) => setTimeout(r, 750));
    await checkA11y(page, '#storybook-root');
  },
};

export default config;
