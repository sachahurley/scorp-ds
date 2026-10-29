# Pattern: Auth card

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/AuthCard` (preset `SignInCard`, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/presets/authCard.tsx` (story shell: `packages/storybook/stories/Patterns/AuthCard.stories.tsx`) |
| Story | `Patterns/AuthCard` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

A sign-in surface: one Card with an email field, a password field with a visibility toggle, and a footer that splits a quiet "Forgot password?" link from the single primary "Sign in" action. Sign-up is the same recipe plus a confirm field, so only sign-in is documented. It carries two recipes that have no component of their own: the password toggle riding inside the field, and the auth footer. Upstreamed from the showcase's Cards page (2026-09-20).

Don't use this for: account or profile settings (use the SettingsPanel or Forms pattern instead), or a sign-in that interrupts another task (use `Modal` with the same fields in its body instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is `SignInCard` in `presets/authCard.tsx`; the story only adds the page shell (`--surface-page`, `p-6 md:p-10`, a `max-w-md` column, the eyebrow line and the footnote). On a real sign-in page, center the card with `Center maxWidth="md" fullHeight`.

| Building block | Role |
|----------------|------|
| `Card` | `title="Sign in"`, `subtitle="Enter your credentials to continue"`, `className="flex w-full flex-col"`. The form is the body; the actions are `footerContent`. |
| `<form>` | `space-y-4` (`spacing.4`) between the two fields: one group in the card. It has an `id` from `useId()` so the footer's submit button can name it. |
| `Input` | "Email" (`type="email"`) and "Password" (`type` switches between `password` and `text`), both `size="md"`; the password input takes `pr-10` to clear the toggle. |
| Password toggle | A native `<button type="button">` in a `relative` wrapper around the password Input, placed `absolute bottom-2.5 right-3`, holding a `TuiIcon` (`Eye` / `EyeOff`, size 5) in `secondary-700` / `secondary-400` that turns `--text-primary` on hover. |
| `Inline` | Footer row, `justify="between" gap="3"`: the quiet action on the left, the primary on the right. |
| `Button` | `variant="link" size="sm"` "Forgot password?" (`type="button"`), then `variant="primary" size="md"` "Sign in" (`type="submit"`, `form` = the form's id). |

---

## Storybook

- **SignIn** ("Sign in"): fullscreen story, `max-w-md` column on `--surface-page`.
- **Theme:** Storybook **Theme** toolbar (sun/moon) for light/dark.
- **Test-runner:** included in `npm run test-storybook:ci` (axe, both themes).

---

## Accessibility notes

- Both fields have a visible `label` from Input.
- The toggle's `aria-label` names the action and swaps with state ("Show password" / "Hide password"); the icon inside is `aria-hidden`.
- "Sign in" is the form's submit button although it sits in the Card footer, outside the `<form>` element: `type="submit"` with the `form` attribute. Enter in either field submits.
- Keyboard: Tab order is Email, Password, the toggle, "Forgot password?", "Sign in".
- The toggle's hit area is the 20px icon, under the 44px touch target.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-29 | The password toggle is a hand-positioned native button: Input has no trailing slot, so the toggle's offsets (`bottom-2.5 right-3`) and the input's `pr-10` are tied to the `md` field height and break at `sm` or `lg` | None yet; a trailing slot or a password variant on Input is a component change | open |
| 2026-10-29 | The toggle's hit area is 20px, under the 44px touch target, and it carries no `focus-visible` classes, so it does not draw the system's inset focus ring | None yet; follows from the gap above | open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-10-29 | added | Spec written from source; the card moved to the `SignInCard` preset; "Sign in" is `type="submit"` and names its form; the footer row is `Inline`; no rendered change (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/authCard.tsx`, `packages/storybook/stories/Patterns/AuthCard.stories.tsx`
