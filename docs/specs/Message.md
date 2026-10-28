# Message

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

> **Proposed, not built yet.** This spec is written ahead of the code so the API can be reviewed before anything renders. The AUTO sections describe the intended build; `/update-spec` rewrites them from source once `Message.tsx` exists, and the API hash row is added then.

## Status

| Field | Value |
|-------|-------|
| Component | `Message` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Chat` |
| File | `packages/components/src/components/Message.tsx` (planned) |
| Story | `Components/Chat/Message` (planned) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Message is one turn in a conversation. Scorp DS draws a conversation as a terminal transcript, not as chat bubbles: every turn is full width and left aligned, and turns are told apart by a role label and a gutter marker, never by which side of the screen they sit on or by color alone.

- **User turns** read as typed commands: a `ChevronRight` prompt marker in the gutter and a `--surface-muted` plate behind the text.
- **Assistant turns** read as output: no plate, the text sits on the surface it is placed on.
- **System turns** are one muted line (a mode change, "Replaying a recorded session").

While an assistant turn streams, a block cursor follows the last character, like a terminal waiting on output.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

An `<article>` with two columns: a fixed `w-5` gutter for the marker (so text aligns across turns whether or not a marker is shown) and the turn itself.

1. **Header row**: the role `label` in `text-xs uppercase` `--text-secondary`, optional `meta` (time, model, "replayed") after it, and the `actions` slot pushed right.
2. **Body**: `children`. Strings render with `whitespace-pre-wrap`; nodes render as given (Prose, CodeBlock, a rendered preview).
3. **Footer** (optional): the error line, or "Stopped".

```
> YOU                                    12:04
  Make a settings screen with a danger zone       <- --surface-muted plate

  SCORP . replayed                [copy] [retry]
  Here is a settings screen composed from Card,
  Switch and a destructive Button.#               <- block cursor while streaming
```

### Variants

| Enum Value | Description |
|-----------|-------------|
| `author="user"` | Prompt marker, muted plate, label "You" |
| `author="assistant"` | No marker, no plate, label "Scorp" |
| `author="system"` | One line, `text-xs` `--text-secondary`, label hidden visually but kept for screen readers |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `author` | `"user" \| "assistant" \| "system"` | none | Yes | Who the turn is from. Named `author`, not `role`, so it never collides with the ARIA attribute. |
| `label` | `ReactNode` | `"You"` / `"Scorp"` / `"System"` | No | Visible role label. |
| `meta` | `ReactNode` | none | No | Secondary header text: time, model, "replayed". |
| `status` | `"done" \| "streaming" \| "stopped" \| "error"` | `"done"` | No | Streaming draws the cursor and sets `aria-busy`; stopped and error add the footer. |
| `errorMessage` | `ReactNode` | `"Something went wrong."` | No | Footer text when `status="error"`. |
| `onRetry` | `() => void` | none | No | Adds a Retry button to the error footer. |
| `actions` | `ReactNode` | none | No | Header actions (copy, retry, edit). Use `Button variant="ghost" size="sm"` icon buttons. |
| `children` | `ReactNode` | none | Yes | The turn's content. |
| `id` | `string` | none | No | Anchor id, for linking to a turn. |
| `className` | `string` | none | No | Applied to the `<article>`. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-muted` | Color | light `#F7F5F2`, dark `#221E13` | User turn plate. Not `--surface-subtle`: in dark it equals `--surface-page` (`#1A150F`), so the plate would vanish on the default theme |
| `--plate-round` | Shape | stepped 6px corner polygon | User turn plate |
| `--accent` | Color | light `#B45309`, dark `#E0A26A` | Prompt marker; block cursor |
| `--text-primary` | Color | light `#2B2718`, dark `#FDFCFB` | Body |
| `--text-secondary` | Color | light `#695F4D`, dark `#BFB4A3` | Label, meta, system line, "Stopped" |
| `error-700` / `dark:error-400` | Color | Badge AA pair | Error footer text and icon |
| `--duration-slower` | Motion | `500ms` | Cursor blink half-period: 500ms on, 500ms off, stepped with no fade |
| `text-sm` / `text-xs` | Typography | `14px` / `12px` | Body / label, meta, system line |

No new tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Tokens Affected |
|----------------|--------------|-----------------|
| Done | `status="done"` | none |
| Streaming | `status="streaming"` | Block cursor in `--accent` after the last character, blinking in steps; solid under `prefers-reduced-motion`. `aria-busy="true"` |
| Stopped | `status="stopped"` | Footer "Stopped" in `--text-secondary` |
| Error | `status="error"` | Footer with AlertCircle, `errorMessage` and optional Retry, in the error AA pair |
| Actions idle | default | Header actions at `--text-tertiary` |
| Actions active | `:hover` or `:focus-within` on the article | Header actions at `--text-primary`. They are dimmed, never hidden, so keyboard and touch users can reach them |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

Planned stories under `Components/Chat/Message`:

| Story | Shows |
|-------|-------|
| `User` | Prompt marker and plate |
| `Assistant` | Output turn with actions |
| `System` | One-line notice |
| `Streaming` | Cursor; `tags: ['skip-visual']` because it blinks, with a reduced-motion twin that stays in visual regression |
| `Stopped` | Footer |
| `Error` | Footer with Retry |
| `RichContent` | A CodeBlock inside an assistant turn |
| `Exchange` | User, assistant and system turns stacked, to check alignment across the gutter |

**Coverage:** 0% (not built)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

Expected: the cursor is a `1ch` by `1lh` block, sized from the type, not a pixel value. Nothing else.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`ChevronRight` marker, `AlertCircle` error)
- `Button` (Retry)
- `VisuallyHidden` (system turn label)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic structure: `<article>` named by its header (`aria-labelledby` on the label), so screen reader users can move turn by turn with article navigation.
- Role is carried by the label text in every variant. The marker and plate are decorative (`aria-hidden` marker).
- Streaming: `aria-busy="true"` while streaming, so a polite live region (the Transcript) announces the finished turn rather than every token. The cursor is `aria-hidden`.
- Actions: always in the DOM and in tab order, dimmed rather than hidden. Icon buttons need `aria-label`s ("Copy message", "Retry").
- Contrast: body and label text meet AA on both the page and the muted plate. The `--accent` marker is decorative and still clears 3:1.
- Motion: the cursor blink stops under `prefers-reduced-motion`.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do say where a turn came from in `meta` when it matters ("replayed", the model name). The system is honest about state.
- Do put code in a `CodeBlock` inside the body, not in a raw `<pre>`.
- Don't right-align user turns or color them to tell speakers apart. The label and marker do that.
- Don't hide actions until hover.
- Don't use a system turn for errors in a reply; set `status="error"` on that turn.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- Lives in a `Transcript`, which owns scrolling and spacing between turns.
- Width comes from the Transcript's content column. A Message never sets its own max width.
- Rich assistant content (Prose, CodeBlock, a rendered layout preview) goes in `children`; Message adds no padding around it beyond the body column.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-28 | No `Prose` component for formatted assistant text (lists, inline code, links) | Plain strings render pre-wrapped until `Prose` lands | Open |
| 2026-10-28 | Tool calls and progress steps ("validated 14 nodes") have no component | Planned `ActivityStep`; until then, a system turn | Open |
| 2026-10-28 | `aria-busy` is honored unevenly across screen readers | Verify with VoiceOver and NVDA when built; fall back to announcing completion from the Transcript's status region | Open |

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

`packages/components/src/components/Message.tsx` (planned)
