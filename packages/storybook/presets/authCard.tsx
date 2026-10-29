import { useId, useState } from 'react';
import { Button, Card, Inline, Input } from '@scorp-ds/components';

/**
 * Auth card preset: a sign-in surface built from Card, Input and Button.
 * Sign-up is the same recipe plus a confirm field, so only sign-in is a preset.
 *
 * - **Password visibility toggle:** Input's `trailingAction`, a toggle button with
 *   a fixed label ("Show password") whose state rides on `pressed` (`aria-pressed`)
 *   and whose icon swaps between `Eye` and `EyeOff`. Input owns its size, hit area,
 *   focus ring and the padding that keeps text clear of it.
 * - **Auth footer:** a quiet `link` action on the left, the single primary action on
 *   the right (`Inline justify="between"`), in Card's `footerContent`. This recipe
 *   has no component of its own and lives here.
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

        {/* Password toggle: a toggle button with a fixed name, its state on
            aria-pressed. Input sizes it, pads the text clear and draws focus. */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          size="md"
          trailingAction={{
            icon: showPassword ? 'EyeOff' : 'Eye',
            label: 'Show password',
            pressed: showPassword,
            onClick: () => setShowPassword((shown) => !shown),
          }}
        />
      </form>
    </Card>
  );
}
