/**
 * TOAST COMPONENT
 *
 * Transient feedback plates, upstreamed from the portfolio's XP toaster.
 * A Toast is a small plate (ring recipe: hairline ring + muted fill) that
 * rises from the bottom edge on a stepped transition — steps(), not an ease,
 * so the plate hops on the pixel grid like the rest of the system's art.
 *
 * Don't use this for: errors that require action (use Alert), or anything
 * the user must read before continuing (use Modal).
 *
 * TOKENS USED:
 * - plate.round (silhouette), border.hairline (ring), surface.muted (fill)
 * - text.primary, duration.normal + steps(5) (motion)
 * - z-index.popover (toasts stack above modals by decision)
 */

import { useEffect, useState, type ReactNode } from "react";

/** A single toast entry rendered by the Toaster region. */
export interface ToastItem {
  /** Stable key for the toast (also used by dismissal callbacks). */
  id: string | number;
  /** Toast content — keep it to one short line. */
  message: ReactNode;
}

export interface ToasterProps {
  /** Toasts to render, oldest first; the newest renders closest to the screen edge. */
  toasts: ToastItem[];
  /** Called when a toast's plate is clicked (wire to your dismiss/queue logic). */
  onDismiss?: (id: ToastItem["id"]) => void;
}

/**
 * A single toast plate. Usually rendered via `Toaster`, but exported for
 * custom placements. Announced politely via `role="status"`.
 */
export function Toast({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  // Rise-in: start below, hop up on mount. steps(5) matches the portfolio's
  // "physical plate" motion — no fade, position snaps on a pixel grid.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      role="status"
      onClick={onClick}
      className={`
        plate-round p-px bg-[var(--border-hairline)]
        transition-transform [transition-duration:var(--duration-normal)] [transition-timing-function:steps(5)]
        ${entered ? "translate-y-0" : "translate-y-16"}
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      <div className="plate-round bg-[var(--surface-muted)] px-3 py-2.5 font-mono text-sm text-[var(--text-primary)] whitespace-nowrap overflow-hidden text-ellipsis">
        {children}
      </div>
    </div>
  );
}

/**
 * Fixed toast region, bottom-center. Screen readers are told about new
 * toasts via the polite live region; pointer users can click a plate to
 * dismiss it when `onDismiss` is wired.
 *
 * @param toasts - The queue to render (state lives in the app, not here)
 * @param onDismiss - Optional click-to-dismiss callback
 */
export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      style={{ zIndex: "var(--z-index-popover)" }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} onClick={onDismiss ? () => onDismiss(t.id) : undefined}>
          {t.message}
        </Toast>
      ))}
    </div>
  );
}
