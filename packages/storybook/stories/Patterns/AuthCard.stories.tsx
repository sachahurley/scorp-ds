import type { Meta, StoryObj } from '@storybook/react';
import { SignInCard } from '../../presets/authCard';

/**
 * Pattern: authentication card, Card + Input composed into a sign-in surface.
 * Upstreamed from the showcase's Cards page (2026-09-20), which shipped it
 * before the DS documented it. Two recipes had no upstream home: the
 * password-visibility toggle riding inside the field, and the auth footer
 * (quiet link left, primary action right). The card lives in
 * `presets/authCard.tsx`; this story is the page shell.
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
  return (
    <div className="min-h-screen bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-md space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Auth card
        </p>

        <SignInCard />

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
