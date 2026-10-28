# Message

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.


## Status

| Field | Value |
|-------|-------|
| Component | `Message` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Chat` |
| File | `packages/components/src/components/Message.tsx` |
| Story | `Components/Chat/Message` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |
| API hash | `38334b3cfd69f257` |

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

An `<article>` with two columns: a fixed `w-5` gutter (so text aligns across turns whether or not a marker is shown) and the turn itself.

1. **Gutter**: `self-start`, one header row tall, so the user marker sits on the label line. `ChevronRight` in `--accent` for user turns; empty otherwise.
2. **Header row** (`min-h-control-sm`, `text-xs` `--text-secondary`): the role `label` in uppercase, optional `meta`, and the `actions` slot pushed right.
3. **Body** (`text-sm leading-relaxed`, `space-y-3`): `children`. A string renders in a `<p>` with `whitespace-pre-wrap`; nodes render as given. User turns put the body on a `--surface-muted` plate (`plate-round px-3 py-2`).
4. **Footer** (optional): "Stopped", or the error line with an optional Retry.

System turns are a single `text-xs` line in the gutter's column; the label is visually hidden but still names the article.

```
> YOU 12:04
  Make a settings screen with a danger zone       <- --surface-muted plate

  SCORP replayed                  [copy] [retry]
  Here is a settings screen composed from Card,
  Switch and a destructive Button.#               <- block cursor while streaming
```

### Variants

| Enum Value | Description |
|-----------|-------------|
| `author="user"` | Prompt marker, muted plate, label "You" |
| `author="assistant"` | No marker, no plate, label "Scorp" |
| `author="system"` | One muted line; label visually hidden |

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `author` | `"user" \| "assistant" \| "system"` | none | Yes | Who the turn is from. Named `author`, not `role`, so it never collides with the ARIA attribute. |
| `children` | `ReactNode` | none | Yes | The turn's content. Strings keep their line breaks. |
| `label` | `ReactNode` | `"You"` / `"Scorp"` / `"System"` | No | Visible role label; also the article's accessible name. |
| `meta` | `ReactNode` | none | No | Secondary header text: time, model, "replayed". |
| `status` | `"done" \| "streaming" \| "stopped" \| "error"` | `"done"` | No | Streaming draws the cursor and sets `aria-busy`; stopped and error add the footer. |
| `errorMessage` | `ReactNode` | `"Something went wrong."` | No | Footer text when `status="error"`. |
| `onRetry` | `() => void` | none | No | Adds a Retry button to the error footer. |
| `actions` | `ReactNode` | none | No | Header actions. Use `Button variant="ghost" size="sm"` icon buttons with `aria-label`s. |
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
| Streaming | `status="streaming"` | Block cursor (the full block character, one cell wide in the mono stack) in `--accent` after the content. It toggles every `--duration-slower`, read from `:root`; it stays solid under `prefers-reduced-motion` or when the token is missing. `aria-busy="true"` |
| Stopped | `status="stopped"` | Footer "Stopped" in `--text-secondary` |
| Error | `status="error"` | Footer with AlertCircle, `errorMessage` and an optional `secondary` `sm` Retry button, in the error AA pair |
| Actions | `actions` | Always rendered at full strength. The proposal dimmed them until hover; that was dropped, since dimmed icon buttons would fall below non-text contrast |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| User | Yes | Yes | `User` |
| Assistant with actions | Yes | Yes | `Assistant` |
| System | Yes | Yes | `System` |
| Streaming | Yes | Yes | `Streaming`, `skip-visual` (the cursor blinks on a timer); stays in the a11y pass |
| Stopped | Yes | Yes | `Stopped` |
| Error with Retry | Yes | Yes | `Error` |
| Rich content | Yes | Yes | `Rich content` (a CodeBlock in the body) |
| Turns stacked | Yes | Yes | `Exchange` |

Interactive controls: `author`, `status`.

**Coverage:** 100% (8/8). The streaming cursor itself has no visual-regression frame.

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

None. The cursor is a text character, so its size comes from the type; its beat comes from `--duration-slower`.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `TuiIcon` (`ChevronRight` marker, `AlertCircle` error, `Repeat` retry)
- `Button` (Retry)
- `VisuallyHidden` (system turn label)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic structure: `<article>` named by its label (`aria-labelledby`), so screen reader users can move turn by turn.
- Role is carried by the label text in every variant. The marker is `aria-hidden`; the plate is decoration.
- Streaming: `aria-busy="true"`, so a polite log (the Transcript) can announce the finished turn rather than every token. The cursor is `aria-hidden`.
- Actions: always in the DOM, visible and in tab order.
- Contrast: body and label text meet AA on the page and on the muted plate. The `--accent` marker is decorative.
- Motion: the cursor holds still under `prefers-reduced-motion`.

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
| 2026-10-28 | `aria-busy` is honored unevenly across screen readers | Transcript's status region also announces "Response complete". Still to verify with VoiceOver and NVDA | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-28 | docs | Proposed spec, written ahead of the code for review |
| v1 | 2026-10-28 | added | Built to the reviewed spec. Changes from the proposal: actions are full strength rather than dimmed until hover; the cursor is a block character rather than a sized box |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Message.tsx`
