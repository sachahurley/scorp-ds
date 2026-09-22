import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, ListRow, Stack, TuiIcon, cn } from '@scorp-ds/components';

/**
 * Pattern: mini music player card, ported from the Scorpion UI v2 showcase
 * site and rebuilt on Scorp DS components. Album tile, track info, seekable
 * timeline, and transport controls.
 */
const meta: Meta = {
  title: 'Patterns/MusicPlayer',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**Pattern** - a compact now-playing card composing `Card`, `Button` (icon variant), and `TuiIcon` over semantic tokens only. The timeline is a real slider (click, drag, arrow keys); play/pause is emphasized by its primary fill (the card transport shares the 40px medium plate; the collapsed bar runs 32px small); shuffle and repeat are pressed-state toggles; overflowing titles bounce-scroll independently (out and back, static under prefers-reduced-motion); track changes are announced through a polite live region. The chevron collapses the card into a ~56px mini bar (thumb, title/artist, previous/play/next, expand, hairline progress); playback and drag position carry across because state lives in `useSimulatedPlayback`, which product code swaps for an `<audio>` element with the same shape. The dot grid on the left edge (desktop only) is the drag affordance: the story wires pointer dragging to it. Elevation uses the docked-Modal drop-shadow recipe, since the plate clip-path slices off box shadows.\n\n**Theme:** Storybook **Theme** toolbar for light/dark.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

interface Track {
  artist: string;
  title: string;
  /** Track length in seconds. */
  duration: number;
}

const DEMO_TRACKS: Track[] = [
  { artist: 'Sacha Hurley', title: 'Stinger', duration: 120 },
  { artist: 'Sacha Hurley', title: 'Molt', duration: 154 },
  // Deliberately long strings so the marquee overflow behavior is visible.
  {
    artist: 'Sacha Hurley & the Amber Council',
    title: 'Burrow at Dusk (Extended Desert Session)',
    duration: 98,
  },
];

/**
 * Pressed style for the shuffle/repeat toggles, keyed off aria-pressed: an
 * inverted plate fill that reads in both themes. Variant swapping (icon ->
 * secondary) is not a usable pressed indicator: in dark mode both variants
 * resolve to identical resting colors.
 */
const TOGGLE_PRESSED_CLASSES = [
  'aria-pressed:bg-secondary-800 aria-pressed:text-secondary-50 aria-pressed:hover:bg-secondary-700',
  'dark:aria-pressed:bg-secondary-300 dark:aria-pressed:text-secondary-950 dark:aria-pressed:hover:bg-secondary-400',
].join(' ');

/** Format seconds as M:SS, e.g. 125 -> "2:05". */
function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Simulated playback engine: one tick per second while playing, auto-advance
 * at the end of a track (random when shuffling, wrap when repeating, stop
 * after the last otherwise). Product code replaces this hook with an
 * <audio> element exposing the same shape (timeupdate feeds `elapsed`,
 * `seek` writes currentTime).
 */
function useSimulatedPlayback(tracks: Track[]) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const track = tracks[trackIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const tick = window.setInterval(() => {
      setElapsed((seconds) => Math.min(seconds + 1, track.duration));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [isPlaying, track.duration]);

  // Any index but the current one, so shuffle never repeats the same track.
  const randomOtherIndex = () =>
    tracks.length < 2
      ? trackIndex
      : (trackIndex + 1 + Math.floor(Math.random() * (tracks.length - 1))) % tracks.length;

  const selectTrack = (index: number) => {
    setTrackIndex(index);
    setElapsed(0);
  };

  // Auto-advance when a playing track runs out.
  useEffect(() => {
    if (!isPlaying || elapsed < track.duration) return;
    if (isShuffling) {
      selectTrack(randomOtherIndex());
    } else if (trackIndex < tracks.length - 1) {
      selectTrack(trackIndex + 1);
    } else if (isRepeating) {
      selectTrack(0);
    } else {
      setIsPlaying(false);
    }
    // Deps are deliberately narrow: selectTrack and the shuffle/repeat flags are read
    // fresh on each tick, and adding them would re-run the effect on every toggle.
  }, [elapsed, isPlaying, track.duration]);

  const togglePlay = () => {
    // Restart a finished track instead of instantly re-finishing it.
    if (!isPlaying && elapsed >= track.duration) setElapsed(0);
    setIsPlaying(!isPlaying);
  };

  return {
    tracks,
    track,
    trackIndex,
    isPlaying,
    elapsed,
    isShuffling,
    isRepeating,
    selectTrack,
    togglePlay,
    seek: (seconds: number) => setElapsed(seconds),
    previous: () => trackIndex > 0 && selectTrack(trackIndex - 1),
    next: () =>
      isShuffling
        ? selectTrack(randomOtherIndex())
        : trackIndex < tracks.length - 1
          ? selectTrack(trackIndex + 1)
          : isRepeating && selectTrack(0),
    toggleShuffle: () => setIsShuffling(!isShuffling),
    toggleRepeat: () => setIsRepeating(!isRepeating),
    previousDisabled: trackIndex === 0,
    nextDisabled: !isShuffling && !isRepeating && trackIndex === tracks.length - 1,
  };
}

type PlaybackState = ReturnType<typeof useSimulatedPlayback>;

/**
 * Single-line text that bounce-scrolls when it overflows its container and
 * stays static when it fits: the line slides left until its end is revealed,
 * holds briefly, then returns the way it came (infinite alternate). Duration
 * derives from each line's own overflow distance, so stacked lines drift out
 * of phase and read as independent. prefers-reduced-motion falls back to
 * static truncation.
 */
function MarqueeText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const copy = copyRef.current;
    if (!container || !copy) return;
    // offsetWidth needs a layout box, hence inline-block on the copy: inline
    // spans report scrollWidth 0 and overflow would never be detected.
    const measure = () => setIsOverflowing(copy.offsetWidth > container.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!isOverflowing || !container || !track || !copy) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Travel only the hidden overflow, at ~30px/s over the moving 80% of the
    // cycle; the 10% holds at each end give a reading pause before the bounce.
    const distance = copy.offsetWidth - container.clientWidth;
    const animation = track.animate(
      [
        { transform: 'translateX(0)', offset: 0 },
        { transform: 'translateX(0)', offset: 0.1 },
        { transform: `translateX(-${distance}px)`, offset: 0.9 },
        { transform: `translateX(-${distance}px)`, offset: 1 },
      ],
      {
        duration: ((distance / 30) * 1000) / 0.8,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'linear',
      }
    );
    return () => animation.cancel();
  }, [isOverflowing, text]);

  return (
    <div ref={containerRef} className={cn('overflow-hidden whitespace-nowrap', className)}>
      <span ref={trackRef} className={isOverflowing ? 'inline-flex w-max' : 'block truncate'}>
        <span ref={copyRef} className="inline-block whitespace-nowrap">
          {text}
        </span>
      </span>
    </div>
  );
}

/** Drag affordance: desktop only, visually centered in the left padding
    gutter (the wrapper spans the gutter width and flex-centers the dots, so
    no off-scale pixel offsets are needed). Pointer-only convenience, hence
    aria-hidden; every control stays reachable without it. */
function DragHandle({
  dragHandleProps,
  gutterClassName = 'w-4 lg:w-6',
}: {
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Width classes matching the host layout's left padding gutter. */
  gutterClassName?: string;
}) {
  return (
    <div
      className={cn(
        // left-px: the visual gutter starts inside the 1px plate stroke, so
        // the wrapper must too or the dots sit a step left of center.
        'absolute left-px top-1/2 hidden -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing lg:flex lg:justify-center',
        gutterClassName
      )}
      aria-hidden="true"
      {...dragHandleProps}
    >
      <div className="grid grid-cols-2 gap-0.5">
        {Array.from({ length: 6 }, (_, dot) => (
          <span
            key={dot}
            className="h-0.5 w-0.5 rounded-none bg-secondary-900 dark:bg-secondary-200"
          />
        ))}
      </div>
    </div>
  );
}

function MusicPlayerCard({
  player,
  onClose,
  onCollapse,
  dragHandleProps,
}: {
  player: PlaybackState;
  onClose?: () => void;
  /** Collapse to the mini bar; renders the chevron affordance when provided. */
  onCollapse?: () => void;
  /** Pointer handlers for the drag handle; the consumer owns the actual move logic. */
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const { track } = player;
  const seekPercentage = Math.min(100, (player.elapsed / track.duration) * 100);

  // Album tile sizing: the tile stretches flush with the content box (top of
  // the artist line to the bottom of the transport row) and the observer
  // mirrors that height into the width, so the square hugs its height. CSS
  // aspect-square cannot resolve here: the flex row's height depends on its
  // own items, so the browser falls back to content width.
  const tileRef = useRef<HTMLDivElement>(null);
  const [tileWidth, setTileWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    const observer = new ResizeObserver(() => setTileWidth(tile.offsetHeight));
    observer.observe(tile);
    return () => observer.disconnect();
  }, []);

  return (
    // Elevation: the plate clip-path slices box shadows off, so the shadow is a
    // drop-shadow filter on a wrapper (same recipe and values as the docked Modal).
    <div
      className="w-full max-w-md"
      style={{ filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.35))' }}
    >
      <Card className="relative w-full">
        {/* Screen reader parity with the visual track change. */}
        <span className="sr-only" aria-live="polite">
          {`Now playing: ${track.title}, ${track.artist}`}
        </span>

        <DragHandle dragHandleProps={dragHandleProps} />

        {(onClose || onCollapse) && (
          <div className="absolute right-4 top-4 flex items-center gap-1 lg:right-6 lg:top-6">
            {onCollapse && (
              <Button
                variant="icon"
                size="sm"
                type="button"
                aria-label="Collapse player"
                aria-expanded={true}
                onClick={onCollapse}
              >
                <TuiIcon name="ChevronDown" />
              </Button>
            )}
            {onClose && (
              <Button
                variant="icon"
                size="sm"
                type="button"
                aria-label="Close music player"
                onClick={onClose}
              >
                <TuiIcon name="X" />
              </Button>
            )}
          </div>
        )}

        <div className="flex items-stretch gap-3">
          {/* Album tile: same plate-ring frame as the equipment tiles (stroke
              clipped to the plate, fill re-clipped 1px inset). Flush with the
              content box top and bottom; width hugs the measured height. Swap
              the glyph for cover art with h-full w-full object-cover in
              product code. */}
          <div
            ref={tileRef}
            className="plate-round flex-shrink-0 self-stretch bg-[var(--surface-container-stroke)] p-px"
            style={{ width: tileWidth }}
          >
            <div className="plate-round flex h-full w-full items-center justify-center overflow-hidden bg-secondary-200 dark:bg-secondary-800">
              <TuiIcon
                name="Music2"
                size="8"
                className="text-secondary-900 dark:text-secondary-200"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 font-mono">
            <div
              className={cn(
                'min-w-0',
                onClose && onCollapse ? 'pr-20' : onClose || onCollapse ? 'pr-10' : ''
              )}
            >
              <MarqueeText
                text={track.artist}
                className="text-xs text-secondary-700 dark:text-secondary-500"
              />
              <MarqueeText
                text={track.title}
                className="text-sm font-medium text-[var(--text-primary)]"
              />
            </div>

            <div>
              <div className="mb-0.5 flex items-center justify-between text-xs text-secondary-900 dark:text-secondary-200">
                <span>{formatTime(player.elapsed)}</span>
                <span>{formatTime(track.duration)}</span>
              </div>
              {/* Seekable timeline: native range input, so click/drag/arrow keys
                  come free. Fill is a two-stop gradient over theme-scoped custom
                  props; the thumb is a sharp text-primary nub. */}
              <input
                type="range"
                min={0}
                max={track.duration}
                step={1}
                value={Math.round(player.elapsed)}
                onChange={(event) => player.seek(Number(event.target.value))}
                aria-label="Seek"
                aria-valuetext={`${formatTime(player.elapsed)} of ${formatTime(track.duration)}`}
                className="h-2 w-full cursor-pointer appearance-none rounded-none
                  [--scrub-fill:var(--color-secondary-600)] [--scrub-track:var(--color-secondary-200)]
                  dark:[--scrub-fill:var(--color-secondary-400)] dark:[--scrub-track:var(--color-secondary-800)]
                  focus:outline-none focus-visible:[box-shadow:0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]
                  [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--text-primary)]
                  [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-[var(--text-primary)]"
                style={{
                  background: `linear-gradient(to right, var(--scrub-fill) ${seekPercentage}%, var(--scrub-track) ${seekPercentage}%)`,
                }}
              />
            </div>

            {/* Transport: uniform 40px medium plates; play carries the
                emphasis through its primary fill alone. Shuffle/repeat are
                pressed toggles whose plate fill changes with state, not
                color alone. */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="icon"
                size="md"
                type="button"
                aria-pressed={player.isShuffling}
                aria-label="Shuffle"
                className={TOGGLE_PRESSED_CLASSES}
                onClick={player.toggleShuffle}
              >
                <TuiIcon name="Shuffle" />
              </Button>
              <Button
                variant="icon"
                size="md"
                type="button"
                aria-label="Previous track"
                disabled={player.previousDisabled}
                onClick={player.previous}
              >
                <TuiIcon name="SkipBack" />
              </Button>
              <Button
                variant="primary"
                size="md"
                type="button"
                aria-label={player.isPlaying ? 'Pause' : 'Play'}
                onClick={player.togglePlay}
              >
                <TuiIcon name={player.isPlaying ? 'Pause' : 'Play'} />
              </Button>
              <Button
                variant="icon"
                size="md"
                type="button"
                aria-label="Next track"
                disabled={player.nextDisabled}
                onClick={player.next}
              >
                <TuiIcon name="SkipForward" />
              </Button>
              <Button
                variant="icon"
                size="md"
                type="button"
                aria-pressed={player.isRepeating}
                aria-label="Repeat"
                className={TOGGLE_PRESSED_CLASSES}
                onClick={player.toggleRepeat}
              >
                <TuiIcon name="Repeat" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Collapsed mini bar: the same playback state at mini-player density (~56px).
 * Core transport only (previous, play/pause, next, expand); shuffle, repeat,
 * close, and seeking live in the expanded card. The hairline progress strip
 * is display-only: a 4px seek target would be an accessibility trap.
 */
function MusicPlayerBar({
  player,
  onExpand,
  dragHandleProps,
}: {
  player: PlaybackState;
  onExpand: () => void;
  /** Pointer handlers for the drag handle; the consumer owns the actual move logic. */
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const { track } = player;
  const seekPercentage = Math.min(100, (player.elapsed / track.duration) * 100);

  return (
    <div
      className="w-full max-w-md"
      style={{ filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.35))' }}
    >
      {/* Compact plate ring: Card's recipe at bar density (Card's fixed
          content padding is too deep for a mini bar). */}
      <div className="plate-round-lg bg-[var(--surface-container-stroke)] p-px">
        <div className="plate-round-lg relative flex items-center gap-3 bg-[var(--surface-card)] p-2 pl-4 lg:pl-5">
          {/* Screen reader parity with the visual track change. */}
          <span className="sr-only" aria-live="polite">
            {`Now playing: ${track.title}, ${track.artist}`}
          </span>

          <DragHandle dragHandleProps={dragHandleProps} gutterClassName="w-4 lg:w-5" />

          {/* Album thumb: plate ring at thumb scale; cover art fills with
              h-full w-full object-cover in product code. */}
          <div className="plate-round h-10 w-10 flex-shrink-0 bg-[var(--surface-container-stroke)] p-px">
            <div className="plate-round flex h-full w-full items-center justify-center overflow-hidden bg-secondary-200 dark:bg-secondary-800">
              <TuiIcon name="Music2" className="text-secondary-900 dark:text-secondary-200" />
            </div>
          </div>

          {/* Artist eyebrow above title, matching the card and ListRow's
              meta-above-title house convention. */}
          <div className="min-w-0 flex-1 font-mono">
            <MarqueeText
              text={track.artist}
              className="text-xs text-secondary-700 dark:text-secondary-500"
            />
            <MarqueeText
              text={track.title}
              className="text-xs font-medium text-[var(--text-primary)]"
            />
          </div>

          {/* Transport group sits tight (gap-2); the expand control stands
              apart (root gap + ml-3) so mode switching reads as a separate
              cluster from playback. The whole bar runs the smallest control
              size (32px small, matching the card's collapse control); play
              carries the emphasis through its primary fill alone. */}
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              size="sm"
              type="button"
              aria-label="Previous track"
              disabled={player.previousDisabled}
              onClick={player.previous}
            >
              <TuiIcon name="SkipBack" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="button"
              aria-label={player.isPlaying ? 'Pause' : 'Play'}
              onClick={player.togglePlay}
            >
              <TuiIcon name={player.isPlaying ? 'Pause' : 'Play'} />
            </Button>
            <Button
              variant="icon"
              size="sm"
              type="button"
              aria-label="Next track"
              disabled={player.nextDisabled}
              onClick={player.next}
            >
              <TuiIcon name="SkipForward" />
            </Button>
          </div>
          {/* Expand matches the transport cluster at small (32px). */}
          <Button
            variant="icon"
            size="sm"
            type="button"
            aria-label="Expand player"
            aria-expanded={false}
            className="ml-3"
            onClick={onExpand}
          >
            <TuiIcon name="ChevronUp" />
          </Button>

          {/* Hairline progress along the bar's bottom edge (display only). */}
          <div
            className="absolute inset-x-0 bottom-0 h-0.5 bg-secondary-200 dark:bg-secondary-800"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={track.duration}
            aria-valuenow={Math.round(player.elapsed)}
            aria-valuetext={`${formatTime(player.elapsed)} of ${formatTime(track.duration)}`}
          >
            <div
              className="h-full bg-secondary-600 dark:bg-secondary-400"
              style={{ width: `${seekPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function useCardDrag() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef<{
    pointerX: number;
    pointerY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  // Story-level drag wiring: pointer capture on the handle moves the card.
  const dragHandleProps: React.HTMLAttributes<HTMLDivElement> = {
    onPointerDown: (e) => {
      dragOrigin.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        baseX: offset.x,
        baseY: offset.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e) => {
      if (!dragOrigin.current) return;
      setOffset({
        x: dragOrigin.current.baseX + (e.clientX - dragOrigin.current.pointerX),
        y: dragOrigin.current.baseY + (e.clientY - dragOrigin.current.pointerY),
      });
    },
    onPointerUp: (e) => {
      dragOrigin.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
  };

  return { offset, dragHandleProps };
}

function PatternShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--surface-page)] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]">
          Pattern · Music player
        </p>
        {children}
        <Divider />
        <p className="font-mono text-xs text-secondary-900 dark:text-secondary-200">
          Composes: Card, Button (icon + primary), TuiIcon, ListRow (queue). The timeline seeks by
          click, drag, or arrow keys; tracks auto-advance and honor shuffle/repeat. The chevron
          collapses to a mini bar without interrupting playback. Grab the left-edge dot handle to
          move the card (desktop).
        </p>
      </div>
    </div>
  );
}

function NowPlayingDemo({ initialCollapsed = false }: { initialCollapsed?: boolean }) {
  const player = useSimulatedPlayback(DEMO_TRACKS);
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const { offset, dragHandleProps } = useCardDrag();

  // Collapse/expand swaps the layout only: the playback hook and the drag
  // offset live here, so the track keeps playing and the player stays where
  // it was dragged across the transition.
  return (
    <PatternShell>
      {isOpen ? (
        <div style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
          {isCollapsed ? (
            <MusicPlayerBar
              player={player}
              onExpand={() => setIsCollapsed(false)}
              dragHandleProps={dragHandleProps}
            />
          ) : (
            <MusicPlayerCard
              player={player}
              onClose={() => setIsOpen(false)}
              onCollapse={() => setIsCollapsed(true)}
              dragHandleProps={dragHandleProps}
            />
          )}
        </div>
      ) : (
        <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(true)}>
          Reopen player
        </Button>
      )}
    </PatternShell>
  );
}

/**
 * Queue variant: the same playback state drives the card and a ListRow list.
 * The current row keeps a muted fill, a glyph, and aria-current, so state is
 * never carried by color alone.
 */
function WithQueueDemo() {
  const player = useSimulatedPlayback(DEMO_TRACKS);

  return (
    <PatternShell>
      <MusicPlayerCard player={player} />
      <Stack gap="1" className="w-full max-w-md">
        {player.tracks.map((queued, index) => {
          const isCurrent = index === player.trackIndex;
          return (
            <ListRow
              key={queued.title}
              meta={`Track ${index + 1} · ${formatTime(queued.duration)}`}
              title={queued.title}
              titleSuffix={
                isCurrent ? <TuiIcon name="Music2" size="3" className="align-middle" /> : undefined
              }
              onClick={() => player.selectTrack(index)}
              aria-current={isCurrent ? 'true' : undefined}
              className={isCurrent ? 'bg-[var(--surface-muted)]' : ''}
            />
          );
        })}
      </Stack>
    </PatternShell>
  );
}

export const NowPlaying: Story = {
  name: 'Now playing (mini player)',
  render: () => <NowPlayingDemo />,
};

export const Collapsed: Story = {
  name: 'Collapsed (mini bar)',
  render: () => <NowPlayingDemo initialCollapsed />,
};

export const WithQueue: Story = {
  name: 'With queue',
  render: () => <WithQueueDemo />,
};
