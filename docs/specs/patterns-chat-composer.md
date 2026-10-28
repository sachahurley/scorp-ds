# Pattern: Chat composer

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.


## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/ChatComposer` (story-only, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/ChatComposer.stories.tsx` |
| Story | `Patterns/ChatComposer` |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

The Scorp DS chat surface: a conversation on one side, and what the conversation produced on the other. It is the reference composition for scorp-protodash's composer, where someone describes a screen and a layout built from Scorp DS components appears beside the chat.

It is a terminal workbench, not a chat app. Two framed panes, a status line that says what mode the session is in, and a transcript that reads like a shell history. It should not look like ChatGPT or Claude: no bubbles, no avatars, no rounded input pill.

The first consumer runs in **replay mode**: recorded sessions played back, with no model call. The pattern says so on screen (a `REPLAY` segment in the status line, "replayed" in each turn's meta), because the system is honest about state.

Don't use this for: a source list beside a detail view with no conversation (use the WorkbenchSplit pattern instead), machine output with no turns (use `LogView` instead), or a single multi-line text field in a form (use `Textarea` instead).

<!-- /HUMAN-SECTION:intent -->

---

## Composition

| Building block | Role |
|----------------|------|
| Frame | `flex h-screen flex-col gap-3 p-4` on `--surface-page`: the panes above, the StatusLine below. |
| Desktop (`Desktop` story, 1280) | The chat pane `w-96 shrink-0` beside the canvas pane `min-w-0 flex-1`, `gap-3`. |
| Below `lg` (`Mobile` story, 375) | One pane at a time: `Tabs` with Chat and Canvas triggers above the panes. |
| `Window` (chat pane) | `title="chat"`, `status="replay"`, `scroll={false}`, body `flex flex-col p-0`. |
| `Transcript` | `width="full"`, `min-h-0 flex-1`, so only the transcript scrolls. |
| `Message` | One per turn: a system "Replaying a recorded session.", the user prompt, the assistant reply with `meta="replayed"`. |
| `Composer` | Pinned under the Transcript (`p-3 pt-0`). In replay it is `disabled`, with `helperText` "Replaying a recorded session. Typing is off." |
| `Window` (canvas pane) | `title` = the generated screen's name, `status` = node count, `scroll={false}`. Body holds `Tabs`: Preview, Code, Spec. |
| Preview tab | The rendered layout (here two `Card`s with `Switch`es and a destructive `Button`), centered `max-w-md`. |
| Code tab | `CodeBlock`, `framed={false}`, with line numbers, titled with the file name. |
| Spec tab | `DescriptionList`: components used, node count, gaps (a `Badge`). |
| `StatusLine` | Left: `REPLAY` (tone `info`, `Play` icon). Center: the session name. Right: components used, and gaps (tone `success` at zero, `warning` above). |

---

## Behavior

| Moment | What happens |
|--------|--------------|
| First load | Transcript empty state with three starter prompts; canvas shows an `EmptyState` |
| Prompt chosen | The prompt types into the Composer, sends, and the reply streams into the Transcript while the canvas fills in |
| Streaming | Composer `busy`, Message `status="streaming"`, Transcript `busy` |
| Done | Canvas tabs become available; StatusLine updates counts |
| Gap found | The generated layout composed something the system lacks: the Spec tab lists it, and StatusLine shows the count in `warning` |

---

## Components this pattern needs

Phase 1 (this set of specs): `Composer`, `Message`, `Transcript`, `CodeBlock`.

Later, each with its own spec when it is next:

| Component | Why |
|-----------|-----|
| `Prose` | Formatted assistant text: lists, inline code, links |
| `ActivityStep` | Collapsible progress rows ("composing layout", "validated 14 nodes") with a status icon and elapsed time |
| `Chip` | Interactive, removable chips for starter prompts and Composer context (`@Card`). Badge is display-only |
| `CommandMenu` | Slash commands in the Composer (`/screen`, `/component`, `/theme`), built on Combobox and Popover |
| `SplitView` | A resizable divider between the panes. The pattern ships with a fixed split until then |

Also needed: a `Stop` glyph in TuiIcon (with Composer), and syntax color roles as a token proposal (with CodeBlock, later).

---

## Accessibility

- Each pane is a `Window`, so each has a named region and a visible focus marker.
- Below `lg`, switching panes is a real `Tabs` control, not a hidden layout swap.
- The `REPLAY` mode is in text, in the StatusLine and in each turn's meta, not color alone.
- Focus returns to the Composer after every send.

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do say on screen when a session is replayed.
- Do show system gaps the generation hit. They are the most useful output for the design system.
- Don't add avatars or speech bubbles to make it feel like a chat app.
- Don't let the canvas scroll the chat pane, or the other way round. Each pane scrolls on its own.

<!-- /HUMAN-SECTION:do-dont -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-28 | docs | Proposed pattern, written with the four Phase 1 component specs |
| v1 | 2026-10-28 | added | `Patterns/ChatComposer` story: `Desktop` (1280) and `Mobile` (375), since the layout changes structure at `lg` |

<!-- AUTO-END:changelog -->
