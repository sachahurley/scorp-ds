import { Button, Card, Stack } from '@scorp-ds/components';

/**
 * Canonical marketing hero block — compose only DS components + primitives.
 * Screens should import this (or copy the pattern) instead of bespoke layout CSS.
 */
export function MarketingHeroScreen() {
  return (
    <div className="w-full max-w-lg p-6">
      <Card
        title="Scorp DS"
        subtitle="Sample screen — preset-driven composition"
        className="flex flex-col"
        footerContent={
          <Stack axis="horizontal" gap="3">
            <Button variant="secondary" size="small" type="button">
              Docs
            </Button>
            <Button variant="primary" size="small" type="button">
              Get started
            </Button>
          </Stack>
        }
      >
        <Stack gap="3">
          <p className="font-mono text-sm text-secondary-600 dark:text-secondary-400">
            Built from Card, Stack, and Button. Extend presets under{' '}
            <code className="text-secondary-800 dark:text-secondary-200">packages/storybook/presets/</code>.
          </p>
        </Stack>
      </Card>
    </div>
  );
}
