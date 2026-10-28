# Transcript

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.

> **Proposed, not built yet.** This spec is written ahead of the code so the API can be reviewed before anything renders. The AUTO sections describe the intended build; `/update-spec` rewrites them from source once `Transcript.tsx` exists, and the API hash row is added then.

## Status

| Field | Value |
|-------|-------|
| Component | `Transcript` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Chat` |
| File | `packages/components/src/components/Transcript.tsx` (planned) |
| Story | `Components/Chat/Transcript` (planned) |
| Version | `v1` |
| Status | `draft` |
| Last updated | 2026-10-28 |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Transcript is the scrolling region that holds a conversation's `Message`s, oldest first. It follows the newest content the way LogView follows a log: it stays pinned to the bottom while a reply streams, pauses when the reader scrolls up so they keep their place, and offers "Jump to latest" with a count of new turns.

It differs from LogView in what it follows. A log grows by whole lines; a conversation also grows inside the last turn as tokens stream in. Transcript follows content height, not just item count, so a streaming reply stays in view.

The follow logic is pulled out of LogView into one shared hook, so the two regions cannot drift apart in behavior.

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A relative, full-height wrapper holding:

1. **Scroll region**: `role="log"`, focusable, `overflow-y-auto`.
2. **Content column**: centered, `max-w-screen-md` by default, with `gap-6` between turns. Children are `Message`s and optional day or session separators (`Divider` with a label).
3. **Empty state**: `emptyState` when there are no children, centered in the region.
4. **Jump button**: `Button variant="secondary" size="sm"` with `ChevronDown`, floating at the bottom center while following is paused. Same control and copy as LogView.
5. **Status region**: a visually hidden `role="status"` that announces "Responding" and "Response complete".

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `children` | `ReactNode` | none | No | `Message`s and separators, oldest first. Append to the end. |
| `busy` | `boolean` | `false` | No | A reply is streaming. Drives the status announcements. |
| `autoScroll` | `boolean` | `true` | No | Follow new content. Pauses while the reader is scrolled up. |
| `emptyState` | `ReactNode` | none | No | Shown when there are no children. Usually an `EmptyState` with starter prompts. |
| `width` | `"sm" \| "md" \| "lg" \| "full"` | `"md"` | No | Max width of the content column, from the Container scale. |
| `framed` | `boolean` | `false` | No | Draw the plate ring, as LogView does. Off by default because a Transcript usually fills a pane that is already framed. |
| `aria-label` | `string` | `"Conversation"` | No | Accessible name of the log region. |
| `onFollowChange` | `(following: boolean) => void` | none | No | Fires when following pauses or resumes. |
| `className` | `string` | none | No | Applied to the wrapper. Set the height here or let a flex parent size it. |

<!-- AUTO-END:properties -->

---

## Token Map

<!-- AUTO-START:tokens -->

| Token | Category | Resolved Value | Usage |
|-------|----------|---------------|-------|
| `--surface-container-stroke` | Color | light `#BFB4A3`, dark `#474030` | Ring when `framed` |
| `--surface-page` | Color | light `#FDFCFB`, dark `#1A150F` | Fill when `framed` |
| `--plate-round-lg` | Shape | stepped large corner polygon | Frame when `framed` |
| `--focus-ring-primary`, `--focus-ring-width` | Color, Size | `#FBBF24`, `2px` | Inset focus ring on the scroll region |
| spacing `6` | Spacing | `24px` | Gap between turns |

No new tokens.

<!-- AUTO-END:tokens -->

---

## States & Variants

<!-- AUTO-START:states -->

| State / Variant | Controlled By | Behavior |
|----------------|--------------|----------|
| Empty | no children | `emptyState` centered |
| Following | at the bottom (within 8px, as LogView) | New turns and streamed growth scroll into view |
| Paused | reader scrolled up | No scrolling; Jump button shows the count of new turns since pausing |
| Resumed | Jump pressed, or reader scrolls back to the bottom | Count clears, following resumes |
| Busy | `busy` | Status region says "Responding" once; "Response complete" when `busy` clears |
| Framed | `framed` | Plate ring and page fill, as LogView |
| Focus | `:focus-visible` on the scroll region | Inset focus ring |

<!-- AUTO-END:states -->

---

## Storybook Coverage

<!-- AUTO-START:storybook -->

Planned stories under `Components/Chat/Transcript`:

| Story | Shows |
|-------|-------|
| `Default` | A short exchange |
| `Empty` | EmptyState with starter prompts |
| `Streaming` | A reply that grows on a timer; `tags: ['skip-visual']` with the reason |
| `Paused` | `play` scrolls up, then a turn is appended, so the Jump button shows a count (decision 0012) |
| `Framed` | `framed` |
| `Widths` | `sm`, `md`, `full` |

**Coverage:** 0% (not built)

<!-- AUTO-END:storybook -->

---

## Hardcoded Values

<!-- AUTO-START:hardcoded -->

Expected: the 8px bottom threshold, shared with LogView through the hook. Nothing else.

<!-- AUTO-END:hardcoded -->

---

## Dependencies

<!-- AUTO-START:dependencies -->

### Child Components

- `Message` (expected children)
- `Button`, `TuiIcon` (Jump button)
- `VisuallyHidden` (status region)
- A new internal `useFollowScroll` hook (`lib/use-follow-scroll.ts`), extracted from LogView. It follows on item count and on content height (`ResizeObserver` on the content column)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="log"` with `aria-live="polite"` and `aria-relevant="additions"`, named by `aria-label`. Each turn is an `<article>`, so turn-by-turn navigation works inside it.
- Streaming noise: a streaming `Message` sets `aria-busy`, so the log should announce the finished turn, not each token. Because `aria-busy` support varies, the separate status region also announces "Response complete".
- Keyboard: the region is focusable (`tabIndex=0`) so it can be scrolled with arrow keys and Page Up/Down; it is the scrollable-region-focusable case axe checks for.
- Jump button: a real button in tab order while visible, with the count in its text.
- Motion: scrolling is instant, not smooth, so `prefers-reduced-motion` needs no special case.

<!-- AUTO-END:accessibility -->

---

## Do / Don't

<!-- HUMAN-SECTION:do-dont (preserved across auto-updates) -->

- Do put the Composer below the Transcript, outside its scroll region.
- Do give the empty state starter prompts. A blank transcript does not teach anyone what to ask.
- Don't scroll the reader to the bottom while they are reading older turns; that is what pausing is for.
- Don't use Transcript for logs; LogView keeps the line-number and level grid.

<!-- /HUMAN-SECTION:do-dont -->

---

## Composition Rules

<!-- HUMAN-SECTION:composition (preserved across auto-updates) -->

- In the chat pattern, a flex column: Transcript (`flex-1 min-h-0`) above a Composer that shares its content width.
- Inside a `Window`, set `scroll={false}` on the Window so only the Transcript scrolls.
- Separators between sessions are `Divider`s with a label, placed as children.

<!-- /HUMAN-SECTION:composition -->

---

## Known Gaps & Amendments

<!-- AUTO-START:known-gaps -->

| Date | Issue | Resolution | Status |
|------|-------|------------|--------|
| 2026-10-28 | LogView's follow logic is local to LogView | Extract `useFollowScroll`; LogView adopts it in the same PR with no behavior change, covered by its existing tests | Open |
| 2026-10-28 | Long conversations render every turn | Fine for replay sessions (tens of turns). Revisit virtualization only if live sessions get long | Open |

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

`packages/components/src/components/Transcript.tsx` (planned)
