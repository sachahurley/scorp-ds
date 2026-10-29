# Transcript

> Maintained with `/update-spec`. The repo copy is the only copy: human-written sections are preserved across updates.


## Status

| Field | Value |
|-------|-------|
| Component | `Transcript` (import from `@scorp-ds/components`) |
| Layer | `component` |
| Category | `Chat` |
| File | `packages/components/src/components/Transcript.tsx` |
| Story | `Components/Chat/Transcript` |
| Version | `v1` |
| Status | `stable` |
| Last updated | 2026-10-29 |
| API hash | `84ad744a629e1f7d` |

---

## Intent

<!-- HUMAN-SECTION:intent (preserved across auto-updates) -->

Transcript is the scrolling region that holds a conversation's `Message`s, oldest first. It follows the newest content the way LogView follows a log: it stays pinned to the bottom while a reply streams, pauses when the reader scrolls up so they keep their place, and offers "Jump to latest" with a count of new turns.

It differs from LogView in what it follows. A log grows by whole lines; a conversation also grows inside the last turn as tokens stream in. Transcript follows content height, not just item count, so a streaming reply stays in view.

The follow logic is pulled out of LogView into one shared hook, so the two regions cannot drift apart in behavior.

Don't use this for: machine output with no turns, such as build or server logs (use `LogView` instead), a list of records people scan and act on (use `ListRow` or `Table` instead), or a feed of notifications (use `Toast` instead).

<!-- /HUMAN-SECTION:intent -->

---

## Anatomy

<!-- AUTO-START:anatomy -->

A relative wrapper (`flex min-h-0 flex-col`) holding:

1. **Scroll region**: `role="log"`, focusable, `overflow-y-auto`.
2. **Content column**: centered, `max-w-screen-md` by default (`width`), `p-4`, `gap-6` between turns. It is always rendered, even when empty, so the size observer is attached before the first turn arrives. With no children it centers `emptyState`.
3. **Jump button**: `Button type="button" variant="secondary" size="sm" iconLeft="ChevronDown"`, floating at the bottom center while following is paused. Same control and copy as LogView.
4. **Status region**: a visually hidden `role="status"` that says "Responding" and "Response complete" as `busy` changes.

<!-- AUTO-END:anatomy -->

---

## Properties

<!-- AUTO-START:properties -->

The log region's accessible name is required by the type (decision 0029): pass `aria-label` or `aria-labelledby`. Leaving both out is a compile error. The manifest lists them as optional because the generator records only props every union member shares.

| Property | Type | Default | Required | Description |
|----------|------|---------|----------|-------------|
| `aria-label` / `aria-labelledby` | `string` | none | One of them | Name of the log region: `aria-label` ("Conversation"), or `aria-labelledby` pointing at visible text such as the pane title. There is no default name. |
| `children` | `ReactNode` | none | No | `Message`s, oldest first. Append to the end; a streaming reply grows in place as the last child. |
| `busy` | `boolean` | `false` | No | A reply is streaming. Drives the status announcements. |
| `autoScroll` | `boolean` | `true` | No | Follow new content. Pauses while the reader is scrolled up. |
| `emptyState` | `ReactNode` | none | No | Shown when there are no children. Usually an `EmptyState` with starter prompts. |
| `width` | `"sm" \| "md" \| "lg" \| "full"` | `"md"` | No | Max width of the content column, on the Container scale (`sm` 640px, `md` 768px, `lg` 1024px). `full` inside a narrow pane. |
| `framed` | `boolean` | `false` | No | Draw the plate ring, as LogView does. Off by default because a Transcript usually fills a pane that is already framed. |
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

| State / Variant | In Code | In Storybook | Notes |
|----------------|---------|--------------|-------|
| Exchange | Yes | Yes | `Default` |
| Empty state | Yes | Yes | `Empty` (EmptyState with starter prompts) |
| Framed | Yes | Yes | `Framed` |
| Paused, with a count | Yes | Yes | `Paused` (`play` scrolls up and appends a turn) |
| Busy, a reply streaming | Yes | Yes | `Responding` (a still frame: `busy` and a streaming last turn) |
| Streaming, live | Yes | Yes | `Streaming`, `skip-visual` (grows on a timer); stays in the a11y pass |
| Widths | Yes | Controls only | `width` |

There is no loading state: the API has no `loading` prop. If history ever loads asynchronously, add one the way Table and TreeView do (Skeleton rows, `aria-busy`), with its story (decision 0030).

**Coverage:** 86% (6/7)

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
- `Button` (Jump button, icon by name through `iconLeft`)
- `VisuallyHidden` (status region)
- `useFollowScroll` (`lib/use-follow-scroll.ts`), shared with LogView: follows on turn count and on content height (`ResizeObserver` on the content column)

### Foundation Files Referenced

- `packages/tokens/src/styles/tokens.css`

<!-- AUTO-END:dependencies -->

---

## Accessibility

<!-- AUTO-START:accessibility -->

- Semantic role: `role="log"` with `aria-live="polite"` and `aria-relevant="additions"`, named by `aria-label` or `aria-labelledby`, one of which the type requires (decision 0029). Each turn is an `<article>`, so turn-by-turn navigation works inside it.
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
| 2026-10-28 | LogView's follow logic was local to LogView | Extracted as `useFollowScroll` (#97); both use it | Resolved |
| 2026-10-28 | Long conversations render every turn | Fine for replay sessions (tens of turns). Revisit virtualization only if live sessions get long | Open |

<!-- AUTO-END:known-gaps -->

---

## Changelog

<!-- AUTO-START:changelog -->

| Version | Date | Type | Summary |
|---------|------|------|---------|
| Unreleased | 2026-10-29 | docs | Promoted to `stable`: meets the decision 0026 bar and was reviewed by Sacha |
| Unreleased | 2026-10-28 | docs | Proposed spec, written ahead of the code for review |
| v1 | 2026-10-28 | added | Built to the reviewed spec. The content column is always rendered so streaming growth is followed from the first turn |
| v1 | 2026-10-29 | changed | Rebuilt on current main (takeover of #99): the name is required by type (`aria-label` or `aria-labelledby`, no default "Conversation"); the Jump button takes its icon by name; a still `Responding` story covers the busy state |

<!-- AUTO-END:changelog -->

---

## Reference Implementation

`packages/components/src/components/Transcript.tsx`
