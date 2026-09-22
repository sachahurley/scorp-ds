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
    const t = process.env.STORYBOOK_TEST_THEME;
    if (t === 'dark' || t === 'light') {
      await page.evaluate((theme) => {
        (window as unknown as { __STORYBOOK_TEST_THEME__?: 'light' | 'dark' }).__STORYBOOK_TEST_THEME__ =
          theme;
      }, t);
    } else {
      await page.evaluate(() => {
        delete (window as unknown as { __STORYBOOK_TEST_THEME__?: 'light' | 'dark' }).__STORYBOOK_TEST_THEME__;
      });
    }

    const hasAxe = await page.evaluate(
      () => typeof (window as unknown as { axe?: unknown }).axe !== 'undefined'
    );
    if (!hasAxe) {
      await injectAxe(page);
    }
  },
  async postVisit(page) {
    await waitForPageReady(page);
    // Defer so addon-a11y's own scan can finish first: two overlapping
    // axe.run() calls on one page throw "Axe is already running".
    await new Promise((r) => setTimeout(r, 750));
    // The wait alone is not enough on a loaded CI machine, where the addon
    // scan can start late. axe-core has no public "is running" flag, so the
    // supported workaround is to retry that specific error.
    for (let attempt = 1; ; attempt += 1) {
      try {
        await checkA11y(page, '#storybook-root');
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (attempt >= 4 || !message.includes('Axe is already running')) throw error;
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  },
};

export default config;
