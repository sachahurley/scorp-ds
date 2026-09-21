# Pattern: Music player

> Pattern spec, not an exported component. Story: `Patterns/MusicPlayer`.

## Status

| Field | Value |
|-------|-------|
| Widget | `PatternMusicPlayer` |
| Layer | `pattern` |
| Category | `Patterns` |
| File | `packages/storybook/stories/Patterns/MusicPlayer.stories.tsx` |
| Story | `Patterns/MusicPlayer` |
| Version | `v2` |
| Status | `draft` |
| Last synced | 2026-09-19 |
| Notion Page | `` |

---

## Intent

Compact **now-playing card**: plate-framed album tile, artist + track title, seekable timeline with timestamps, transport controls (shuffle, previous, play/pause, next, repeat), a desktop drag handle, close and collapse affordances, an optional queue list, and a **collapsed mini bar** variant (~56px: thumb, title/artist, previous/play/next, expand, hairline progress).

Ported from the Scorpion UI v2 showcase site (`scorpion-ui-v2/src/components/ui/MusicPlayer.tsx`), rebuilt on Scorp DS components and semantic tokens, then brought up to standard mini-player anatomy (audited against the Spotify and Apple Music compact players). The original's mute toggle was dropped: its glyph read as "music", and volume is meaningless without a real audio element.

---

## Composition

| Building block | Role |
|----------------|------|
| `Card` | Plate-ring container on `--surface-card`, `max-w-md`. |
| `Button` | `variant="icon"` for transport and close; `variant="primary"` for play/pause; card transport at `size="medium"`, collapsed-bar transport at `size="small"`. |
| `TuiIcon` | `Shuffle`, `SkipBack`, `Play`/`Pause`, `SkipForward`, `Repeat`, `Music2` (album placeholder + current-row marker), `X` (close). |
| `ListRow` | Queue rows in the `WithQueue` story. |
| `Divider`, `Stack` | Story shell and queue layout. |

Recipe details:

- **Album tile:** same plate-ring frame as the equipment tiles (`plate-round` stroke wrapper, `p-px`, fill re-clipped inside). `self-stretch` keeps it flush with the content box top and bottom; a ResizeObserver mirrors the measured height into the width so the square hugs its height (CSS `aspect-square` cannot resolve in a flex row sized by its own items). Real cover art uses `h-full w-full object-cover`.
- **Timeline:** a native `input[type=range]` (click, drag, arrow keys for free). Fill is a two-stop gradient over theme-scoped custom props (`--scrub-fill`/`--scrub-track` mapped to `secondary-600/200`, dark `400/800`); the thumb is a sharp `--text-primary` nub; focus uses the `--focus-ring-*` tokens. Seed for a future `Slider`/`Progress` component.
- **Transport hierarchy:** the expanded card's transport controls are uniform 40px medium plates (Sacha's call, 2026-09-19; the collapsed bar dropped to 32px small on 2026-09-20, see Collapsed bar); play/pause carries the emphasis through its primary fill alone. Known deviation: 40px sits under the DS's 44px touch-target law; the 48px play was the only compliant control and was traded for the uniform row. Shuffle/repeat expose `aria-pressed`, and the pressed style is driven off that attribute with `aria-pressed:` utilities (inverted plate fill, `secondary-800/50` light and `secondary-300/950` dark, with explicit pressed-hover steps). Do not mark toggles by swapping to the `secondary` variant: in dark mode `secondary` and `icon` resolve to identical resting colors, and `secondary`'s gold hover reads as a glitch on click.
- **Elevation:** drop-shadow filter on a wrapper (docked-Modal recipe): the elevation shadow tokens are `none` by design and the plate clip-path slices box shadows off.
- **Drag handle:** 2x3 dot grid (`w-0.5 h-0.5 gap-0.5` squares) centered in the left padding gutter, `hidden lg:block`, `cursor-grab`. The pattern renders the affordance; the consumer wires the pointer handlers.
- **Artist line:** subtle tone, `text-secondary-700 dark:text-secondary-500` (the semantic `--text-secondary` light value fails AA at body sizes on the card surface, so the scale step that clears 4.5:1 is used instead).
- **Overflowing text:** title and artist render through `MarqueeText` in both layouts: static when the string fits, bounce-scroll when it overflows (slides left to reveal the end, holds ~10% of the cycle, returns; ~30px/s via the Web Animations API, `direction: alternate`). Each line's duration derives from its own overflow distance, so stacked lines drift out of phase and animate independently. `prefers-reduced-motion` falls back to static truncation.
- **Close/collapse buttons:** sit together on the Card content padding grid (`right-4 top-4`, `lg:right-6 lg:top-6`); collapse uses `ChevronDown` with `aria-expanded="true"`, expand on the bar uses `ChevronUp` with `aria-expanded="false"`. Both mode toggles are `size="small"` (32px) in both layouts so the affordance keeps one size across states.
- **Collapsed bar:** hand-rolled compact plate ring (Card's recipe at bar density; Card's fixed content padding is too deep for a ~56px bar). Core transport only: previous, play/pause, next as a tight cluster (all 32px small, matching the expand control, so the whole bar runs one control scale; play keeps the primary fill for emphasis but not the large size, which belongs to the expanded card), then the expand control set apart with extra spacing so mode switching reads as a separate cluster. Sizing note (Sacha's call, 2026-09-20, superseding the 2026-09-19 uniform-40 bar): 32px sits further under the 44px touch-target law than the previous 40px; accepted for the compact bar, where the expanded card remains the full-size surface. Shuffle, repeat, close, and seeking live in the expanded card. The hairline progress strip along the bottom edge is display-only (`role="progressbar"`): a 4px seek target would be an accessibility trap. The 40px album thumb is a fixed inset square, not the flush-fill treatment, so the thumb never dictates bar height. Text order matches the card: artist eyebrow above title (the house meta-above-title convention, same as `ListRow`), not the streaming-app title-first order.

---

## Behavior

`useSimulatedPlayback(tracks)` owns all state and is the contract product code re-implements over an `<audio>` element (`timeupdate` feeds `elapsed`, `seek` writes `currentTime`, `ended` triggers the advance logic; consider the MediaSession API for hardware keys):

- One tick per second while playing; seeking is instant.
- **Auto-advance** when a playing track ends: random other track when shuffling, next track otherwise, wrap to the first when repeating, stop after the last.
- Previous is disabled on the first track; next is disabled on the last only when neither shuffle nor repeat is active.
- Play on a finished track restarts it. Selecting a track (buttons or queue) keeps the playing/paused state, matching mainstream players.
- The story wires pointer-capture dragging to the handle; placement policy (bounds, persistence, mobile pinning) is app chrome.
- **Collapse/expand is layout-only:** the hook and drag offset live outside both layouts, so playback, toggles, and position persist across the transition. Product code must keep its `<audio>` element mounted across the swap for the same continuity.

---

## Accessibility notes

- Every icon-only button carries an `aria-label`; the play/pause label swaps with state; shuffle/repeat expose `aria-pressed`.
- The timeline is a labeled slider with `aria-valuetext` ("0:42 of 2:00"); keyboard arrows seek.
- Track changes are announced through a visually hidden `aria-live="polite"` region ("Now playing: Molt, Sacha Hurley").
- The current queue row combines three signals: muted fill, a glyph suffix, and `aria-current`.
- The drag handle is `aria-hidden`: a pointer-only convenience; every function stays reachable without it.
- Text tones clear the axe AA contrast gate in both themes (`test-storybook:ci` covers both).

---

## Storybook

- **NowPlaying** ("Now playing (mini player)"): interactive card with drag, close, collapse, and reopen demo state.
- **Collapsed** ("Collapsed (mini bar)"): the same demo starting in the collapsed bar.
- **WithQueue** ("With queue"): the same playback state driving the card plus a ListRow queue.
- **Theme:** Storybook **Theme** toolbar for light/dark.
- **Test-runner:** covered by `npm run test-storybook:ci`.

## Reference

`packages/storybook/stories/Patterns/MusicPlayer.stories.tsx`
