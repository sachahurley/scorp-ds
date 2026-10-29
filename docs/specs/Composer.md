# Composer

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.


## Status

| Field | Value |
|-------|-------|
| Component | `Composer` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Chat` |
| File | `packages/components/src/components/Composer.tsx` |
| Story | `Components/Chat/Composer` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-29 |
| API hash | `cb5c8b802244a86c` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Composer is the prompt box of a chat surface. It is a multi-line field that grows with its content up to a cap, sends on Enter, inserts a line break on Shift+Enter, and turns its send button into a stop button while a reply is streaming. It reads as a command line: the field and its actions share one plate, so the send control is part of the prompt rather than a button parked beside a form.

It uses Textarea's field tokens and plate ring recipe, so a Composer and a Textarea look like the same family. It is its own component rather than a Textarea prop because the action row sits inside the ring and the keyboard model (Enter submits) is the opposite of a form textarea's.

Use Composer for any surface where a person types a request and something answers: the protodash chat, a command bar, a support prompt.

Don't use this for: a multi-line field in a form, where Enter must insert a line break (use `Textarea` instead), a one-line search or filter (use `Input` instead), or picking from a known list of commands (use `Combobox` instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

An optional visible `<label>` (from `label`, styled as Textarea's), then a `<form>` ring wrapper (`plate-round-lg p-px`, background = field border color) holding a native `<fieldset>` fill layer (`--field-background`, clipped 1px inset). The fieldset is how `disabled` reaches every control inside, caller actions included; it has no legend, because it groups nothing a screen reader needs to hear (the `Fieldset` component requires one). Inside, top to bottom:

1. **Context row** (optional, `context` slot): chips for attachments or referenced components (`@Card`). Wraps.
2. **Field**: a `<textarea>` with `resize-none`. `useAutosize` sets its height from its content, between `minRows` and `maxRows`; past that it scrolls internally.
3. **Action row**: the `actions` slot on the left; the keyboard `hint` (hidden below `sm`) and the send button on the right.

A `FieldMessage` renders under the ring for `helperText` or `errorMessage`, as in Textarea.

```
+--------------------------------------------------+
| [@Card] [@Switch]                                |  context
| Make a settings screen with a danger zone_       |  field
| [+]           Enter send  Shift+Enter new line [>]|  actions, hint, send
+--------------------------------------------------+
  Replaying a recorded session.                       FieldMessage
```

### Variants

| Enum Value | Description |
|-----------|-------------|
| (none) | One plate style. |

### Sizes

| Enum Value | Description |
|-----------|-------------|
| `md` (default) | Field `text-sm`, `px-4 pt-3`; action row `p-2`; send button `size="md"` |
| `lg` | Field `text-base`, `px-5 pt-4`; action row `p-3`; send button `size="lg"` |

`sm` is left out on purpose: a 32px prompt cannot hold the action row at a 44px touch target.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

The field's accessible name is required by the type (decision 0029): pass one of `label`, `aria-label` or `aria-labelledby`. Leaving all three out is a compile error. The manifest lists the three as optional because the generator records only props every union member shares.

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `label` / `aria-label` / `aria-labelledby` | `ReactNode` / `string` / `string` | none | One of them | The field's name. `label` renders a visible `<label>` above the plate; `aria-label` names it with no visible text (the usual choice in a chat pane); `aria-labelledby` points at visible text elsewhere, such as the pane title. `aria-labelledby` wins over `aria-label`, which wins over `label`. There is no default name. |
| `onSubmit` | `(value: string) => void` | none | Yes | Fires with the trimmed text on Enter (per `submitKey`) or the send button, only when the text is not blank and the Composer is not `busy` or `disabled`. Uncontrolled Composers clear themselves after it fires. |
| `value` | `string` | none | No | Controlled text. Pair with `onValueChange`; the parent clears it after a send. |
| `defaultValue` | `string` | `""` | No | Uncontrolled starting text. |
| `onValueChange` | `(value: string) => void` | none | No | Fires on every edit, and when an uncontrolled Composer clears itself. |
| `busy` | `boolean` | `false` | No | A reply is streaming: with `onStop` the send button becomes a stop button; Enter stops sending. The field stays editable. |
| `onStop` | `() => void` | none | No | Called by the stop button. Without it, a busy Composer shows the send button in Button's `loading` state. |
| `submitKey` | `"enter" \| "mod-enter"` | `"enter"` | No | `enter`: Enter sends, Shift+Enter breaks the line. `mod-enter`: Cmd/Ctrl+Enter sends, Enter breaks the line. |
| `minRows` | `number` | `1` | No | Rows shown when empty. |
| `maxRows` | `number` | `8` | No | Rows before the field scrolls instead of growing. |
| `size` | `ComposerSize` (`"md" \| "lg"`) | `"md"` | No | Type size, padding and send button size. |
| `context` | `ReactNode` | none | No | Row of chips above the field. |
| `actions` | `ReactNode` | none | No | Leading actions. Use ghost icon Buttons with `aria-label`s. |
| `hint` | `ReactNode \| false` | Kbd shortcut for `submitKey` | No | Text before the send button, linked to the field via `aria-describedby`. `false` hides it. Hidden below `sm`. |
| `placeholder` | `string` | `"Message"` | No | Placeholder. Never the only description of the field, and never its name. |
| `helperText` | `ReactNode` | none | No | Hint under the ring. Hidden while `errorMessage` is set. |
| `errorMessage` | `ReactNode` | none | No | Error under the ring. Sets the error ring and `aria-invalid`, replaces `helperText`. |
| `disabled` | `boolean` | `false` | No | Disables the field, the actions and send (one disabled fieldset). The plate dims to 50%. |
| `maxLength` | `number` | none | No | Native limit on the field. State it in `helperText`. |
| `sendLabel` | `string` | `"Send message"` | No | Accessible name of the send button. |
| `stopLabel` | `string` | `"Stop response"` | No | Accessible name of the stop button. |
| `name` | `string` | none | No | Field `name`, for native form handling. |
| `className` | `string` | none | No | Applied to the ring wrapper. |
| `ref` | `Ref<HTMLTextAreaElement>` | none | No | Forwarded to the `<textarea>`, so a parent can focus it on mount or refocus it after a send. There is no `autoFocus` prop (jsx-a11y `no-autofocus`): focusing on mount is the parent's deliberate choice, through the ref. |

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
| Focus (field) | `has-[textarea:focus]` on the ring | Ring `--field-border-focus`, and nothing else (decision 0022). Wins over error |
| Focus (a button) | `:focus-visible` on the action or send button | The button's own 2px inset ring; the plate's ring stays idle, so focus is shown once |
| Growing | content between `minRows` and `maxRows` | Field height (inline, from `useAutosize`) |
| Capped | content taller than `maxRows` | Field scrolls internally (`overflow-y: auto`); the action row stays put |
| Busy, with `onStop` | `busy` | Send becomes a `secondary` stop button with the `Stop` glyph and `stopLabel`; Enter no longer sends |
| Busy, no `onStop` | `busy` | Send button in Button's `loading` state (`aria-busy`) |
| Error | `errorMessage` | Ring `--field-border-error` (turning `--field-border-focus` while the field has focus), fill `--field-background-error`, FieldMessage with AlertCircle |
| Disabled | `disabled` | Fieldset disabled; `opacity-50` and `cursor-not-allowed` on the ring wrapper |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Empty with hint | Yes | Yes | `Default` |
| Visible label | Yes | Yes | `With label` |
| Context chips and actions | Yes | Yes | `With context` |
| Capped at `maxRows` | Yes | Yes | `Growing` |
| Busy with stop | Yes | Yes | `Busy` |
| Busy without `onStop` (loading send) | Yes | Yes | `Sending` |
| Error | Yes | Yes | `Error` |
| Disabled | Yes | Yes | `Disabled` |
| md / lg | Yes | Yes | `Sizes` |
| `mod-enter` hint | Yes | Yes | `Mod+Enter` |
| Keyboard focus on the field | Yes | Yes | `Focused` (`play` tabs into the field) |
| Keyboard focus on send | Yes | Yes | `Send focused` (`play` tabs twice) |

Interactive controls: `size`, `submitKey`, `busy`, `disabled`, `maxRows`, `helperText`, `errorMessage`.

**Coverage:** 100% (12/12)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None in `Composer.tsx`. Heights are set inline by `useAutosize`, measured from the field's own computed line height, padding and border, so they follow the size classes.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Button` (send and stop, icon-only, with a 44px hit area)
- `Kbd` (default hint)
- `TuiIcon` (`Send`, `Stop`)
- `FieldMessage` / `useFieldMessage` (`lib/field.tsx`)
- `useControllableState` (`lib/use-controllable-state.ts`)
- `useAutosize` (`lib/use-autosize.ts`)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic structure: a `<form>` with a `type="submit"` send button, so Enter and the button both go through the form's submit event. The form itself is unnamed, so it is not announced as a landmark.
- Field name: required by the type (decision 0029), as a visible `label`, an `aria-label` or an `aria-labelledby`. There is no default: a generic "Message" would pass axe on a surface where the prompt means something more specific.
- Keyboard: Enter sends and Shift+Enter breaks the line (or Cmd/Ctrl+Enter with `mod-enter`). The hint says which in visible text and is linked to the field with `aria-describedby`, so the behavior is announced rather than guessed. Enter never sends during IME composition (`isComposing`).
- Busy: the stop button is named by `stopLabel`. Start and end of a reply are announced by the Transcript's status region, not here, so a chat surface announces each once. Focus stays in the field.
- Focus: the field shows focus as the ring's colour change, like every text field (decision 0022), plus its caret; focus wins over error. The field is the first tab stop; the actions and send button follow, each with Button's inset ring, and the plate's ring stays idle while they have focus.
- Touch target: the send button gets a 44px hit area at `md` (the 40px plate plus a centered pseudo-element), as Alert's close button.
- Color independence: errors carry the AlertCircle icon and text; busy changes the glyph and the name.

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
| 2026-10-28 | No `Stop` glyph in the 1-bit set; `Pause` means something else | `Stop` added to TuiIcon (#97) | Resolved |
| 2026-10-28 | Textarea could not grow with content | `useAutosize` added (#97) and used here; Textarea can adopt it as `autoGrow` | Resolved for Composer |
| 2026-10-28 | No interactive chip for the `context` row; Badge is display-only | Use Badge until a `Chip` component lands | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-28 | docs | Proposed spec, written ahead of the code for review |
| v1 | 2026-10-28 | added | Built to the reviewed spec. Changes from the proposal: the fill is a `<fieldset>` so `disabled` reaches the actions; the form is unnamed; busy announcements moved to Transcript; heights come from `useAutosize` in px, not inline `lh` units |
| v1 | 2026-10-29 | changed | Rebuilt on current main (takeover of #99): the name is required by type (`label`, `aria-label` or `aria-labelledby`, no default "Message"), with a new visible `label`; focus is the ring colour change only (decision 0022), keyed on the field so a focused button is not ringed twice; `autoFocus` removed (use the ref); `size` typed `ComposerSize`; `Sending`, `With label` and `Send focused` stories |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Composer.tsx`
