import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Input, TuiIcon } from '@scorp-ds/components';

/**
 * Pattern: authentication card — Card + Input composed into a sign-in surface.
 * Upstreamed from the showcase's Cards page (2026-09-20), which shipped it
 * before the DS documented it. Two recipes had no upstream home: the
 * password-visibility toggle riding inside the field, and the auth footer
 * (quiet link left, primary action right).
 */
const meta: Meta = {
  title: 'Patterns/AuthCard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** — composed product UI built from existing components. The password toggle is a positioned button inside the field wrapper with an `aria-label` that names the action; the footer splits a quiet link from the single primary action. Sign-up is this same recipe plus a confirm field, so only sign-in is documented.\n\n**Theme:** use the Storybook **Theme** toolbar (sun/moon) to preview light and dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

function SignInDemo() {
  // The toggle is the pattern; the credentials are inert specimen state.
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-md space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Auth card
        </p>

        <Card
          className="flex w-full flex-col"
          title="Sign in"
          subtitle="Enter your credentials to continue"
          footerContent={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="link" size="small" type="button">
                Forgot password?
              </Button>
              <Button variant="primary" size="medium" type="button">
                Sign in
              </Button>
            </div>
          }
        >
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Email" type="email" placeholder="you@example.com" size="medium" />

            {/* Password toggle recipe: the button rides inside the field wrapper,
                cleared by pr-10 on the input, and names its action for AT. */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                size="medium"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute bottom-2.5 right-3 text-secondary-700 hover:text-[var(--text-primary)] dark:text-secondary-400 dark:hover:text-[var(--text-primary)]"
              >
                <TuiIcon name={showPassword ? 'EyeOff' : 'Eye'} size="5" />
              </button>
            </div>
          </form>
        </Card>

        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Composes: Card, Input, Button, TuiIcon. Labels come from Input&apos;s label prop; the
          footer holds the actions so the form body stays fields-only; one primary action per card.
        </p>
      </div>
    </div>
  );
}

export const SignIn: Story = {
  name: 'Sign in',
  render: () => <SignInDemo />,
};
