/**
 * TRANSCRIPT COMPONENT
 *
 * The scrolling region that holds a conversation's Messages, oldest first.
 * It follows the newest content the way LogView follows a log: pinned to the
 * bottom while a reply streams, paused when the reader scrolls up, and a
 * "Jump to latest" button with the count of new turns.
 *
 * Unlike a log, a conversation also grows inside its last turn as tokens
 * stream in, so Transcript follows content height (a ResizeObserver on the
 * content column) as well as the number of turns. Both behaviors come from
 * the shared useFollowScroll hook, so LogView and Transcript cannot drift.
 *
 * ACCESSIBILITY: the scroll region is `role="log"` (polite, additions only)
 * and focusable for keyboard scrolling. Streaming turns are `aria-busy`;
 * because support for that varies, a separate visually hidden status region
 * also says "Responding" and "Response complete" as `busy` changes.
 *
 * TOKENS USED:
 * - surface.container-stroke (ring) and surface.page (fill) when `framed`
 * - plate.round-lg, focus-ring.primary, focus-ring.width
 * - spacing 6 between turns
 */

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { useFollowScroll } from "../lib/use-follow-scroll";
import { cn } from "../lib/utils";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { Button } from "./Button";
import { TuiIcon } from "./TuiIcon";

/** Max width of the content column, from the Container scale. */
export type TranscriptWidth = "sm" | "md" | "lg" | "full";

export interface TranscriptProps {
  /** Messages and separators, oldest first. Append to the end. */
  children?: ReactNode;
  /** A reply is streaming. Drives the "Responding" / "Response complete" announcements. */
  busy?: boolean;
  /** Follow new content (default true). Pauses while the reader is scrolled up. */
  autoScroll?: boolean;
  /** Shown when there are no children, centered. Usually an EmptyState with starter prompts. */
  emptyState?: ReactNode;
  /** Max width of the content column: sm, md (default), lg or full. */
  width?: TranscriptWidth;
  /** Draw the plate ring, as LogView does (default false: a Transcript usually fills a framed pane). */
  framed?: boolean;
  /** Accessible name of the log region (default "Conversation"). */
  "aria-label"?: string;
  /** Fires when following pauses or resumes. */
  onFollowChange?: (following: boolean) => void;
  /** Extra classes for the wrapper. Set the height here or let a flex parent size it. */
  className?: string;
}

const WIDTHS: Record<TranscriptWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  full: "max-w-full",
};

/**
 * Transcript
 *
 * ```tsx
 * <Transcript busy={streaming} className="flex-1 min-h-0">
 *   {turns.map((t) => <Message key={t.id} author={t.author}>{t.text}</Message>)}
 * </Transcript>
 * ```
 */
export function Transcript({
  children,
  busy = false,
  autoScroll = true,
  emptyState,
  width = "md",
  framed = false,
  "aria-label": ariaLabel = "Conversation",
  onFollowChange,
  className,
}: TranscriptProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const count = Children.toArray(children).length;
  const { scrollRef, onScroll, following, unseen, resume } = useFollowScroll<HTMLDivElement>({
    content: children,
    count,
    enabled: autoScroll,
    onFollowChange,
    contentRef,
  });

  // Announce the start and end of a reply once each, not the tokens between.
  const [announcement, setAnnouncement] = useState("");
  const wasBusy = useRef(busy);
  useEffect(() => {
    if (busy === wasBusy.current) return;
    wasBusy.current = busy;
    setAnnouncement(busy ? "Responding" : "Response complete");
  }, [busy]);

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col",
        framed && "plate-round-lg bg-[var(--surface-container-stroke)] p-px",
        className
      )}
    >
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={onScroll}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto font-mono",
          framed && "plate-round-lg bg-[var(--surface-page)]",
          "focus:outline-none focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]"
        )}
      >
        {/* Always rendered, so the size observer is attached before the first turn arrives */}
        <div
          ref={contentRef}
          className={cn(
            "mx-auto flex w-full flex-col p-4",
            WIDTHS[width],
            count === 0 ? "h-full items-center justify-center" : "gap-6"
          )}
        >
          {count === 0 ? emptyState : children}
        </div>
      </div>
      {autoScroll && !following && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={resume}
            iconLeft={<TuiIcon name="ChevronDown" size="4" />}
            className="pointer-events-auto"
          >
            {unseen > 0 ? `Jump to latest (${unseen} new)` : "Jump to latest"}
          </Button>
        </div>
      )}
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </div>
  );
}

Transcript.displayName = "Transcript";
