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

A sign-in surface: one Card with an email field, a password field with a visibility toggle, and a footer that splits a quiet "Forgot password?" link from the single primary "Sign in" action. Sign-up is the same recipe plus a confirm field, so only sign-in is documented. The password toggle is Input's `trailingAction`; the auth footer is a recipe with no component of its own. Upstreamed from the showcase's Cards page (2026-09-20).

Don't use this for: account or profile settings (use the SettingsPanel or Forms pattern instead), or a sign-in that interrupts another task (use `Modal` with the same fields in its body instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

All of it is `SignInCard` in `presets/authCard.tsx`; the story only adds the page shell (`--surface-page`, `p-6 md:p-10`, a `max-w-md` column, the eyebrow line and the footnote). On a real sign-in page, center the card with `Center maxWidth="md" fullHeight`.

| Building block | Role |
|----------------|------|
| `Card` | `title="Sign in"`, `subtitle="Enter your credentials to continue"`, `layout="flex"`, `className="flex w-full flex-col"`. The form is the body; the actions are `footerContent`. |
| `<form>` | `space-y-4` (`spacing.4`) between the two fields: one group in the card. It has an `id` from `useId()` so the footer's submit button can name it. |
| `Input` | "Email" (`type="email"`) and "Password" (`type` switches between `password` and `text`), both `size="md"`. |
| Password toggle | The password Input's `trailingAction`: `icon` `Eye` / `EyeOff`, a fixed `label` "Show password", `pressed` = visible, `onClick` flips it. Input renders the button at the field height (40px at `md`, 20px icon in `--text-secondary`, `--text-primary` on hover), pads the text clear and draws the focus ring, so the recipe holds at any size. |
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
- The toggle is a toggle button: its name stays "Show password" and `aria-pressed` carries the state, so a screen reader hears "Show password, toggle button, pressed" once the password is visible. The icon inside is `aria-hidden`.
- "Sign in" is the form's submit button although it sits in the Card footer, outside the `<form>` element: `type="submit"` with the `form` attribute. Enter in either field submits.
- Keyboard: Tab order is Email, Password, the toggle, "Forgot password?", "Sign in". The toggle draws the system's 2px inset focus ring (`docs/decisions/0002`).
- The toggle's hit area is 44px (Input's trailing action recipe), meeting the touch target.

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-29 | The password toggle is a hand-positioned native button: Input has no trailing slot, so the toggle's offsets (`bottom-2.5 right-3`) and the input's `pr-10` are tied to the `md` field height and break at `sm` or `lg` | Input gained `trailingAction`; the preset uses it and the hand-placed button and `pr-10` are gone | resolved |
| 2026-10-29 | The toggle's hit area is 20px, under the 44px touch target, and it carries no `focus-visible` classes, so it does not draw the system's inset focus ring | `trailingAction` gives it a 44px hit area and the inset focus ring | resolved |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| v1 | 2026-10-29 | changed | The password toggle is Input's `trailingAction`: the label stays "Show password" with `aria-pressed` for the state; 44px hit area and inset focus ring. Rendered: the eye icon moves 1px right and 2px down, to the exact center of a 40px square at the input's end (the old native button was 24px tall from its line height, which lifted the icon off center), and in dark takes `--text-secondary` (sepia-500, the Select and Combobox chevron colour) instead of `secondary-400`; light is unchanged |
| v1 | 2026-10-29 | added | Spec written from source; the card moved to the `SignInCard` preset; "Sign in" is `type="submit"` and names its form; the footer row is `Inline`; no rendered change (decision 0028) |

<!-- AUTO-END:changelog -->

---

## Reference

`packages/storybook/presets/authCard.tsx`, `packages/storybook/stories/Patterns/AuthCard.stories.tsx`
