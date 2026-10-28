/**
 * MESSAGE COMPONENT
 *
 * One turn in a conversation, drawn as a terminal transcript rather than
 * chat bubbles: every turn is full width and left aligned, and turns are told
 * apart by a role label and a gutter marker, never by side or color alone.
 *
 * - user: a ChevronRight prompt marker in the gutter and a --surface-muted
 *   plate behind the text, like a typed command.
 * - assistant: no marker, no plate; the text reads as output.
 * - system: one muted line (a mode change, "Replaying a recorded session").
 *
 * STREAMING: `status="streaming"` appends a block cursor (the full block
 * character, one cell wide in the mono stack) that blinks on the
 * --duration-slower beat and holds still under prefers-reduced-motion. The
 * article is `aria-busy` meanwhile, so the transcript announces the finished
 * turn rather than every token.
 *
 * TOKENS USED:
 * - surface.muted (user plate; surface.subtle equals surface.page in dark,
 *   so it would vanish on the default theme), plate.round
 * - accent (prompt marker, cursor)
 * - text.primary (body), text.secondary (label, meta, system line)
 * - error AA pair 700 / 400 (error footer)
 * - duration.slower (cursor blink)
 */

import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { VisuallyHidden } from "../primitives/VisuallyHidden";
import { Button } from "./Button";
import { TuiIcon } from "./TuiIcon";

/** Who a turn is from. */
export type MessageAuthor = "user" | "assistant" | "system";

/** Where a turn is in its life. */
export type MessageStatus = "done" | "streaming" | "stopped" | "error";

export interface MessageProps {
  /** Who the turn is from. Named `author`, not `role`, so it never collides with the ARIA attribute. */
  author: MessageAuthor;
  /** Visible role label (default "You", "Scorp" or "System"). */
  label?: ReactNode;
  /** Secondary header text: time, model, "replayed". */
  meta?: ReactNode;
  /** done (default), streaming (cursor, aria-busy), stopped or error (footer). */
  status?: MessageStatus;
  /** Footer text when `status="error"` (default "Something went wrong."). */
  errorMessage?: ReactNode;
  /** Adds a Retry button to the error footer. */
  onRetry?: () => void;
  /** Header actions (copy, retry, edit): ghost `size="sm"` icon Buttons with aria-labels. */
  actions?: ReactNode;
  /** The turn's content. Strings keep their line breaks; nodes render as given. */
  children: ReactNode;
  /** Anchor id, for linking to a turn. */
  id?: string;
  /** Extra classes for the article. */
  className?: string;
}

const DEFAULT_LABEL: Record<MessageAuthor, string> = { user: "You", assistant: "Scorp", system: "System" };

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** The streaming block cursor. Blinks on --duration-slower; solid under reduced motion. */
function Cursor() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.(REDUCED_MOTION_QUERY).matches) return;
    // The beat is the motion token, read from CSS (motion tokens are global,
    // on :root); no token, no blink.
    const beat = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--duration-slower"));
    if (!Number.isFinite(beat) || beat <= 0) return;
    const timer = window.setInterval(() => setOn((v) => !v), beat);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span aria-hidden="true" data-cursor="" className={cn("text-[var(--accent)]", !on && "invisible")}>
      {"█"}
    </span>
  );
}

/**
 * Message
 *
 * ```tsx
 * <Message author="user" meta="12:04">Make a settings screen</Message>
 * <Message author="assistant" status="streaming">Here is a settings screen</Message>
 * ```
 */
export function Message({
  author,
  label,
  meta,
  status = "done",
  errorMessage = "Something went wrong.",
  onRetry,
  actions,
  children,
  id,
  className,
}: MessageProps) {
  const labelId = useId();
  const name = label ?? DEFAULT_LABEL[author];
  const streaming = status === "streaming";

  if (author === "system") {
    return (
      <article
        id={id}
        aria-labelledby={labelId}
        data-author="system"
        className={cn("flex gap-3 font-mono text-xs text-[var(--text-secondary)]", className)}
      >
        <span aria-hidden="true" className="w-5 shrink-0" />
        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words">
          <VisuallyHidden id={labelId}>{name}</VisuallyHidden>
          {children}
          {meta && <span className="ml-2">{meta}</span>}
        </p>
      </article>
    );
  }

  const user = author === "user";
  const body =
    typeof children === "string" ? (
      <p className="whitespace-pre-wrap break-words">
        {children}
        {streaming && <Cursor />}
      </p>
    ) : (
      <>
        {children}
        {streaming && <Cursor />}
      </>
    );

  return (
    <article
      id={id}
      aria-labelledby={labelId}
      aria-busy={streaming || undefined}
      data-author={author}
      data-status={status}
      className={cn("flex gap-3 font-mono", className)}
    >
      {/* Fixed gutter, so text aligns across turns with and without a marker.
          self-start + the header's height puts the marker on the label line. */}
      <span aria-hidden="true" className="flex min-h-control-sm w-5 shrink-0 items-center self-start text-[var(--accent)]">
        {user && <TuiIcon name="ChevronRight" size="3" />}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <header className="flex min-h-control-sm items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span id={labelId} className="uppercase tracking-wider">
            {name}
          </span>
          {meta && <span>{meta}</span>}
          {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
        </header>
        <div
          className={cn(
            "space-y-3 text-sm leading-relaxed text-[var(--text-primary)]",
            user && "plate-round bg-[var(--surface-muted)] px-3 py-2"
          )}
        >
          {body}
        </div>
        {status === "stopped" && <p className="text-xs text-[var(--text-secondary)]">Stopped</p>}
        {status === "error" && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-error-700 dark:text-error-400">
            <p className="flex items-center gap-1.5">
              <TuiIcon name="AlertCircle" size="3" className="shrink-0" />
              {errorMessage}
            </p>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry} iconLeft={<TuiIcon name="Repeat" size="3" />}>
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

Message.displayName = "Message";
