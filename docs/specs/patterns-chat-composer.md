# Pattern: Chat composer

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

> **Proposed, not built yet.** Written ahead of the story so the composition can be reviewed with the component specs it depends on: [Composer](Composer.md), [Message](Message.md), [Transcript](Transcript.md), [CodeBlock](CodeBlock.md).

## Status

| Field | Value |
|-------|-------|
| Pattern | `Patterns/ChatComposer` (story-only, not an exported component) |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/ChatComposer.stories.tsx` (planned) |
| Story | `Patterns/ChatComposer` (planned) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

The Scorp DS chat surface: a conversation on one side, and what the conversation produced on the other. It is the reference composition for scorp-protodash's composer, where someone describes a screen and a layout built from Scorp DS components appears beside the chat.

It is a terminal workbench, not a chat app. Two framed panes, a status line that says what mode the session is in, and a transcript that reads like a shell history. It should not look like ChatGPT or Claude: no bubbles, no avatars, no rounded input pill.

The first consumer runs in **replay mode**: recorded sessions played back, with no model call. The pattern says so on screen (a `REPLAY` segment in the status line, "replayed" in each turn's meta), because the system is honest about state.

<!-- /HUMAN-SECTION:intent -->

---

## Composition

| Building block | Role |
|----------------|------|
| Outer grid | Desktop (`lg`): two columns, chat pane `lg:w-96` fixed, canvas pane fills. Below `lg`: one pane at a time, switched by `Tabs` (Chat, Canvas). |
| `Window` (chat pane) | `title="chat"`, `variant="active"` while the Composer has focus, `scroll={false}`. Body is a flex column. |
| `Transcript` | `flex-1 min-h-0`, `width="full"` inside the narrow pane. Empty state is an `EmptyState` with starter prompts. |
| `Message` | One per turn. Assistant turns hold text plus a short summary of what changed on the canvas. |
| `Composer` | Pinned under the Transcript. In replay mode the field is filled by the replay and `helperText` says "Replaying a recorded session". |
| `Window` (canvas pane) | `title` = the generated screen's name, `status` = node count. Body holds `Tabs`: Preview, Code, Spec. |
| Preview tab | The rendered layout. |
| Code tab | One `CodeBlock` per generated file, `framed={false}`. |
| Spec tab | `DescriptionList` of the components used, and any system gaps the generation ran into. |
| `StatusLine` | Under both panes. Left: mode segment (`REPLAY`, tone `info`). Center: session name. Right: components used, gaps found (tone `warning` when non-zero). |

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

<!-- AUTO-END:changelog -->
