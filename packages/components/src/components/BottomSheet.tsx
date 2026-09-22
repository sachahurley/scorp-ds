/**
 * BOTTOM SHEET COMPONENT
 *
 * A bottom-anchored panel, upstreamed from the portfolio's iOS-style sheet.
 * The sheet is a large plate whose top corners step (--plate-round-lg-top)
 * while the bottom edge squares off against the viewport, built with the
 * ring recipe (stroke layer + fill layer, since clip-path slices borders).
 *
 * Don't use this for: blocking confirmations (use Modal) or persistent
 * navigation. Sheets are for menus and quick actions that dismiss easily.
 *
 * FEATURES:
 * - Scrim backdrop (surface.overlay), click or ESC to close
 * - Focus moves onto the sheet on open and returns to the invoker on close
 * - Grabber affordance at the top seam
 * - Slides up with the slow duration token
 * - Body scroll is locked while open
 *
 * TOKENS USED:
 * - plate.round-lg-top (silhouette), surface.container-stroke (ring), surface.card (fill)
 * - surface.overlay (scrim), z-index.overlay / z-index.modal (layers)
 * - duration.slow (enter/exit)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface BottomSheetProps {
  /** Controls whether the sheet is visible. */
  isOpen: boolean;
  /** Called when the user dismisses the sheet (scrim click or ESC). */
  onClose: () => void;
  /** Accessible name for the sheet dialog. */
  ariaLabel: string;
  /** Sheet content. */
  children: ReactNode;
}

/**
 * BottomSheet Component
 *
 * @param isOpen - Whether the sheet is currently visible
 * @param onClose - Callback when the user dismisses (scrim click or ESC)
 * @param ariaLabel - Accessible name announced for the dialog
 * @param children - Sheet content
 */
export function BottomSheet({ isOpen, onClose, ariaLabel, children }: BottomSheetProps) {
  // Stay mounted while the exit animation plays; unmount on animationend so the
  // timing always matches the CSS duration token (no JS timer to drift).
  const [visible, setVisible] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);
  const closing = visible && !isOpen;

  // FOCUS MANAGEMENT (matches Modal): once the sheet is in the DOM, move
  // focus onto it so screen readers announce the dialog and keyboard users
  // start inside it; on close, hand focus back to the invoker. Keyed on the
  // panel being mounted: `visible` flips true one render after `isOpen`.
  const sheetRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const sheetMounted = isOpen && visible;
  useEffect(() => {
    if (!sheetMounted) return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus();
    return () => {
      prevFocusRef.current?.focus();
      prevFocusRef.current = null;
    };
  }, [sheetMounted]);

  // ESC closes the sheet, matching Modal behavior
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      {/* Scrim — overlay layer, click to dismiss */}
      <div
        className={`fixed inset-0 bg-[var(--surface-overlay)] ${
          closing ? "animate-out fade-out fill-mode-forwards" : "animate-in fade-in"
        }`}
        style={{ zIndex: "var(--z-index-overlay)", animationDuration: "var(--duration-slow)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet — ring recipe on the top-only large plate; bottom edge squares
          off against the viewport, so the ring layer needs no bottom padding.
          Centered with inset-x-0 + mx-auto (NOT a translate): the slide
          animation interpolates the transform, so a -translate-x-1/2 centering
          would make the sheet travel diagonally instead of straight up. */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`focus:outline-none fixed bottom-0 inset-x-0 mx-auto w-[min(540px,100%)] plate-round-lg-top bg-[var(--surface-container-stroke)] pt-px px-px ${
          closing ? "animate-out slide-out-to-bottom fill-mode-forwards" : "animate-in slide-in-from-bottom"
        }`}
        style={{ zIndex: "var(--z-index-modal)", animationDuration: "var(--duration-slow)" }}
        onAnimationEnd={() => {
          if (closing) setVisible(false);
        }}
      >
        <div className="plate-round-lg-top bg-[var(--surface-card)] px-5 pb-6 pt-2.5 flex flex-col items-center gap-3 max-h-[70vh]">
          {/* Grabber affordance */}
          <div className="w-9 h-1 bg-[var(--surface-container-stroke)]" aria-hidden="true" />
          {/* Scrollable content region (focusable for keyboard scrolling) */}
          <div className="w-full overflow-y-auto" tabIndex={0}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
