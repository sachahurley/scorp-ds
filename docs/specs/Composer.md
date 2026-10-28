# Composer

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

> **Proposed, not built yet.** This spec is written ahead of the code so the API can be reviewed before anything renders. The AUTO sections describe the intended build; `/update-spec` rewrites them from source once `Composer.tsx` exists, and the API hash row is added then.

## Status

| Field | Value |
|-------|-------|
| Component | `Composer` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Chat` |
| File | `packages/components/src/components/Composer.tsx` (planned) |
| Story | `Components/Chat/Composer` (planned) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Composer is the prompt box of a chat surface. It is a multi-line field that grows with its content up to a cap, sends on Enter, inserts a line break on Shift+Enter, and turns its send button into a stop button while a reply is streaming. It reads as a command line: the field and its actions share one plate, so the send control is part of the prompt rather than a button parked beside a form.

It uses Textarea's field tokens and plate ring recipe, so a Composer and a Textarea look like the same family. It is its own component rather than a Textarea prop because the action row sits inside the ring and the keyboard model (Enter submits) is the opposite of a form textarea's.

Use Composer for any surface where a person types a request and something answers: the protodash chat, a command bar, a support prompt. Use `Textarea` for form fields, where Enter must insert a line break.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A `<form>` ring wrapper (`plate-round-lg p-px`, background = field border color) holding the fill layer (`--field-background`, clipped 1px inset). Inside the fill, top to bottom:

1. **Context row** (optional, `context` slot): chips for attachments or referenced components (`@Card`). Wraps.
2. **Field**: a `<textarea>` with no resize handle. Height follows content from `minRows` to `maxRows`, then the field scrolls internally.
3. **Action row**: the `actions` slot on the left (attach, command menu), the keyboard `hint` and the submit button on the right.

An optional `FieldMessage` renders under the ring for `helperText` or `errorMessage`, as in Textarea.

```
+--------------------------------------------------+
| [@Card] [@Window]                                |  context
| Make a settings screen with a danger zone_       |  field
| [+] [/]                 Enter send  [ > send ]   |  actions, hint, submit
+--------------------------------------------------+
  Messages are replayed, not sent to a model.         FieldMessage
```

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | One plate style. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `md` (default) | Field `text-sm`, `px-4 pt-3`, action row `p-2`, submit button `size="md"` |
| `lg` | Field `text-base`, `px-5 pt-4`, action row `p-3`, submit button `size="lg"` |

`sm` is left out on purpose: a 32px prompt cannot hold the action row at a 44px touch target.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `value` | `string` | none | No | Controlled text. Pair with `onValueChange`. |
| `defaultValue` | `string` | `""` | No | Uncontrolled starting text. |
| `onValueChange` | `(value: string) => void` | none | No | Fires on every edit. |
| `onSubmit` | `(value: string) => void` | none | Yes | Fires on Enter (per `submitKey`) or the send button, only when the trimmed text is non-empty and `busy` is false. Uncontrolled Composers clear themselves after it fires. |
| `busy` | `boolean` | `false` | No | A reply is streaming. The send button becomes a stop button and Enter stops submitting. The field stays editable so the next message can be drafted. |
| `onStop` | `() => void` | none | No | Fires when the stop button is pressed. Without it, a busy Composer shows a disabled send button in its `loading` state. |
| `submitKey` | `"enter" \| "mod-enter"` | `"enter"` | No | `enter`: Enter sends, Shift+Enter breaks the line. `mod-enter`: Cmd/Ctrl+Enter sends, Enter breaks the line. |
| `minRows` | `number` | `1` | No | Rows shown when empty. |
| `maxRows` | `number` | `8` | No | Rows before the field scrolls instead of growing. |
| `size` | `"md" \| "lg"` | `"md"` | No | Type size, padding and submit button size. |
| `context` | `ReactNode` | none | No | Row of chips above the field (attachments, references). |
| `actions` | `ReactNode` | none | No | Leading actions in the action row. Use `Button variant="ghost"` icon buttons. |
| `hint` | `ReactNode \| false` | Kbd hint for the current `submitKey` | No | Text before the send button. `false` hides it. Hidden below `sm` regardless. |
| `placeholder` | `string` | `"Message"` | No | Placeholder. Never the only description of the field. |
| `aria-label` | `string` | `"Message"` | No | Accessible name of the field when there is no visible label. |
| `helperText` | `ReactNode` | none | No | Hint under the ring, linked via `aria-describedby`. |
| `errorMessage` | `ReactNode` | none | No | Error under the ring. Sets the error ring and `aria-invalid`, replaces `helperText`. |
| `disabled` | `boolean` | `false` | No | Disables the field, actions and submit. The whole plate dims to 50%. |
| `maxLength` | `number` | none | No | Native limit on the field. State it in `helperText`. |
| `sendLabel` | `string` | `"Send message"` | No | Accessible name of the send button. |
| `stopLabel` | `string` | `"Stop response"` | No | Accessible name of the stop button. |
| `autoFocus` | `boolean` | `false` | No | Focus the field on mount. |
| `className` | `string` | none | No | Applied to the ring wrapper. |
| `ref` | `Ref<HTMLTextAreaElement>` | none | No | Forwarded to the `<textarea>`, so a parent can refocus it after a send. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--field-background` / `--field-background-error` | Color | as Textarea | Fill layer |
| `--field-border` / `--field-border-hover` / `--field-border-focus` / `--field-border-error` | Color | as Textarea | Ring wrapper |
| `--field-placeholder` | Color | as Textarea | Placeholder |
| `--text-primary` | Color | as Textarea | Field text |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Hint text |
| `--plate-round-lg` | Shape | stepped large corner polygon | Ring wrapper and fill clip |
| `--focus-ring-primary` / `--focus-ring-error`, `--focus-ring-width` | Color, Size | as Textarea | Inset focus ring on the fill layer |
| `--duration-fast` | Motion | `120ms` | Ring color transition |
| `text-sm` / `text-base` | Typography | `14px` / `16px` | Field text per size |

No new tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Empty | trimmed value is `""` | Send button disabled |
| Idle / hover | default / `:hover` | Ring `--field-border` to `--field-border-hover` |
| Focus | field has focus (`has-[textarea:focus-visible]` on the fill) | Ring `--field-border-focus` plus the 2px inset `--focus-ring-primary` ring on the whole fill layer, so the focus box includes the action row |
| Growing | content height between `minRows` and `maxRows` | Field height |
| Capped | content taller than `maxRows` | Field scrolls internally; the action row stays put |
| Busy | `busy` | Send becomes stop (`Stop` glyph, `stopLabel`); Enter no longer submits |
| Busy without `onStop` | `busy`, no `onStop` | Send button disabled in `loading` |
| Error | `errorMessage` | Ring `--field-border-error`, fill `--field-background-error`, inset ring `--focus-ring-error`, FieldMessage with AlertCircle |
| Disabled | `disabled` | `opacity-50` on the ring wrapper, `cursor-not-allowed` |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

Planned stories under `Components/Chat/Composer`:

| Story | Shows |
|-------|-------|
| `Default` | Empty, placeholder, hint |
| `WithContext` | Context chips and leading actions |
| `Growing` | Multi-line value at `maxRows`, scrolling |
| `Busy` | Stop button |
| `Error` | Error message (over `maxLength`) |
| `Disabled` | Whole plate dimmed |
| `Sizes` | `md` and `lg` |
| `Focused` | `play` tabs into the field (decision 0012) |
| `ModEnter` | `submitKey="mod-enter"` hint |

**Coverage:** 0% (not built)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

Expected: the `maxRows` cap is content-derived, written as an inline `max-height` in `lh` units (as LogView sizes its gutter in `ch`). Nothing else.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Button` (submit and stop, icon-only)
- `Kbd` (default hint)
- `TuiIcon` (`Send`, and a new `Stop` glyph, see Known Gaps)
- `FieldMessage` / `useFieldMessage` (`lib/field.tsx`)
- `useControllableState` (`lib/use-controllable-state.ts`)
- A new internal `useAutosize` hook (`lib/use-autosize.ts`), shared later with Textarea

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic structure: `<form>` with the field and a `type="submit"` button, so assistive tech and password managers see a real form. `onSubmit` is called from the form's submit event.
- Field name: `aria-label` (default "Message") or a visible label from the parent via `aria-labelledby`.
- Keyboard: Enter sends and Shift+Enter breaks the line (or the reverse with `mod-enter`). The hint says so in visible text and is linked to the field with `aria-describedby`, so the behavior is announced, not guessed. Enter never submits while an IME composition is active (`isComposing`), so CJK input is safe.
- Busy: the button swaps its accessible name to `stopLabel` and the swap is announced through a polite live region ("Responding", "Response stopped"). Focus stays in the field.
- Focus: the inset ring covers the whole fill layer, so it stays visible while the cursor sits in the field and includes the controls it governs.
- Touch target: the submit button gets a 44px hit area at `md` (the 40px plate plus padding), as Alert's close button does.
- Color independence: error carries the AlertCircle icon and text; busy carries a different glyph and name, not just a color.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do refocus the field after a send (the forwarded ref) so a conversation can be typed without reaching for the mouse.
- Do keep the hint unless the surface teaches the shortcut elsewhere.
- Do use `mod-enter` when messages are usually long and multi-paragraph.
- Don't put the send button outside the Composer; the action row is the place for it.
- Don't use Composer in a form where Enter should insert a line break; use `Textarea`.
- Don't disable the field while busy; let people draft the next message.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Sits under a `Transcript`, pinned to the bottom of the chat pane. The Transcript scrolls; the Composer does not.
- Width comes from the parent. In the chat pattern it shares the Transcript's content column so the prompt lines up with the messages.
- Leading actions are ghost icon buttons. More than three belong in a command menu.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-28 | No `Stop` glyph in the 1-bit set; `Pause` means something else | Add a 7x7 `Stop` glyph (filled square) to TuiIcon in the same PR, through the glyph audit | Open |
| 2026-10-28 | No interactive chip for the `context` row; Badge is display-only | Use Badge until a `Chip` component lands | Open |
| 2026-10-28 | Textarea cannot grow with content | `useAutosize` is written for Composer and offered to Textarea as `autoGrow` in a follow-up | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-28 | docs | Proposed spec, written ahead of the code for review |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Composer.tsx` (planned)
