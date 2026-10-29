import { useId, useState } from 'react';
import { Button, Card, Inline, Input, TuiIcon } from '@scorp-ds/components';

/**
 * Auth card preset: a sign-in surface built from Card, Input, Button and
 * TuiIcon. Sign-up is the same recipe plus a confirm field, so only sign-in is
 * a preset.
 *
 * Two recipes have no component of their own and live here:
 * - **Password visibility toggle:** a native button positioned inside the field
 *   wrapper, cleared by `pr-10` on the input, with an `aria-label` that names the
 *   action ("Show password" / "Hide password").
 * - **Auth footer:** a quiet `link` action on the left, the single primary action on
 *   the right (`Inline justify="between"`), in Card's `footerContent`.
 *
 * The form sits in the Card body and the actions in the footer, so the primary
 * action is outside the `<form>` element. It is still the form's submit button:
 * `type="submit"` with `form` pointing at the form's id, so Enter in a field and a
 * click on "Sign in" both submit. Render it in a column capped at `max-w-md`.
 *
 * Consumed by `Patterns/AuthCard`. No consumer project renders it yet (the
 * showcase's Cards page shipped the original); if one does, vendor this file with it.
 *
 * @example
 * <div className="mx-auto max-w-md">
 *   <SignInCard />
 * </div>
 */
export function SignInCard() {
  // The toggle is the pattern; the credentials are inert specimen state.
  const [showPassword, setShowPassword] = useState(false);
  const formId = useId();

  return (
    <Card
      layout="flex"
      className="flex w-full flex-col"
      title="Sign in"
      subtitle="Enter your credentials to continue"
      footerContent={
        <Inline justify="between" gap="3">
          <Button variant="link" size="sm" type="button">
            Forgot password?
          </Button>
          <Button variant="primary" size="md" type="submit" form={formId}>
            Sign in
          </Button>
        </Inline>
      }
    >
      <form id={formId} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" type="email" placeholder="you@example.com" size="md" />

        {/* Password toggle recipe: the button rides inside the field wrapper,
            cleared by pr-10 on the input, and names its action for AT. */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            size="md"
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
  );
}
