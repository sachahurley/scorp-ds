/**
 * MODAL COMPONENT
 * 
 * A reusable modal dialog component with backdrop overlay
 * Built entirely from design tokens defined in tokens.json
 * 
 * FEATURES:
 * - Fixed header with title and a secondary-plate close button (always visible)
 * - Optional fixed footer band for CTAs via `footerContent`
 * - Scrollable content area (max-height: 66vh)
 * - Fades in on open and out on close (duration.normal); stays mounted
 *   through the exit animation and unmounts on animationend
 * - Backdrop scrim (semi-transparent overlay)
 * - `docked` variant: on wide viewports (>=960px) the panel skips the scrim
 *   and pins bottom-center as a NON-modal dialog (no aria-modal, no scroll
 *   lock, page stays interactive), so the content behind stays in view while
 *   the dialog acts on it. Below 960px docked falls back to the standard
 *   centered modal, so consumers never branch on breakpoint themselves.
 * - Drop shadow using elevation tokens
 * - Click outside to close
 * - ESC key to close
 * - Full light/dark theme support
 * 
 * DIMENSIONS:
 * - Width: 740px fixed
 * - Max height: 80% of viewport height
 *
 * SHAPE: the panel is a large plate (--plate-round-lg, stepped one-bit corners)
 * built with the ring recipe — outer layer is the stroke color clipped to the
 * plate, inner layer is the card fill clipped 1px inset (clip-path slices real
 * borders, so a border property cannot draw the ring).
 *
 * TOKENS USED:
 * - surface.card, surface.container-stroke, surface.overlay
 * - text.primary (title)
 * - plate.round-lg: panel silhouette
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { TuiIcon } from "./TuiIcon";

// Define the props interface for the Modal component
export interface ModalProps {
  isOpen: boolean;                    // Controls whether modal is visible
  onClose: () => void;                // Function to call when modal should close
  title: string;                      // Title text displayed in fixed header
  children: ReactNode;                // Content to display in scrollable area
  /**
   * Optional fixed footer for CTAs. Render DS Buttons here (e.g. a secondary
   * "Cancel" + primary confirm); actions align to the right on a subtle band.
   */
  footerContent?: ReactNode;
  /**
   * Panel width (default 740). Numbers are px; strings pass through
   * (e.g. "min(320px, 90vw)"). Small celebratory dialogs want ~320.
   */
  width?: number | string;
  /**
   * Dock instead of covering: on viewports >= 960px the panel pins
   * bottom-center with no scrim and no scroll lock (a non-modal dialog),
   * keeping the page behind visible and interactive. Below 960px this is
   * ignored and the standard centered modal renders, so the responsive
   * fallback lives here, not in the consumer.
   */
  docked?: boolean;
}

/**
 * Modal Component
 * 
 * @param isOpen - Whether the modal is currently visible
 * @param onClose - Callback function triggered when user closes modal
 * @param title - Header title text
 * @param children - Modal content (will be scrollable if it exceeds max-height)
 */
export function Modal({ isOpen, onClose, title, children, footerContent, width = 740, docked = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // Stay mounted while the exit fade plays; unmount on animationend so the
  // timing always matches the CSS duration token (same pattern as BottomSheet).
  const [visible, setVisible] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);
  const closing = visible && !isOpen;

  // Docked applies on wide viewports only; below the breakpoint the docked
  // request degrades to the standard centered modal. Environments without
  // matchMedia (SSR, jsdom test runners) fall back to the centered modal.
  const [wideViewport, setWideViewport] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 960px)").matches
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(min-width: 960px)");
    const onChange = () => setWideViewport(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const isDocked = docked && wideViewport;

  // FOCUS MANAGEMENT: on open, remember the invoker and move focus into the
  // dialog (the panel itself, so screen readers announce the dialog name);
  // on close, hand focus back to wherever the user was. Keyed on the panel
  // actually being mounted: on the render where `isOpen` flips true,
  // `visible` is still false and the panel isn't in the DOM yet.
  const panelMounted = isOpen && visible;
  useEffect(() => {
    if (panelMounted) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      panelRef.current?.focus();
      return () => {
        prevFocusRef.current?.focus();
        prevFocusRef.current = null;
      };
    }
  }, [panelMounted]);

  
  // EFFECT: Handle ESC key press to close modal
  // This listens for keyboard events and closes the modal when ESC is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Only add listener when modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    // Cleanup: Remove listener when modal closes or component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // EFFECT: Prevent body scroll when modal is open. Docked mode is
  // non-modal, so the page keeps scrolling underneath.
  useEffect(() => {
    if (isOpen && !isDocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: Restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isDocked]);

  // Fully unmounted only after the exit fade has finished
  if (!visible) return null;

  // MODAL CONTAINER — plate ring recipe
  // - Outer layer: stroke color clipped to the large plate (the ring)
  // - Inner layer: card fill clipped 1px inset (p-px on the outer)
  // - Clicking inside the panel does NOT close it (stopPropagation)
  const panel = (
        <div
          ref={panelRef}
          tabIndex={-1}
          className="max-w-full max-h-[80vh] plate-round-lg p-px bg-[var(--surface-container-stroke)] flex focus:outline-none"
          style={{ width: typeof width === "number" ? `${width}px` : width }}
          role="dialog"
          aria-modal={isDocked ? undefined : "true"}
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="w-full plate-round-lg bg-[var(--surface-card)] flex flex-col overflow-hidden">
          {/* 
            FIXED HEADER
            - Always visible at top (does not scroll)
            - Contains title on left, close button on right
            - Flexbox layout for positioning
            - Padding: 24px horizontal (px-6), 20px vertical (py-5)
            - Border bottom separates header from content
          */}
          {/* Header — plain title (box-drawing decoration retired with the TUI tier) */}
          <div className="flex items-center justify-between px-6 py-5 border-b-[0.5px] border-solid border-[var(--surface-container-stroke)]">
            <h2 className="text-base font-mono text-[var(--text-primary)] font-medium flex-1 min-w-0 truncate">
              {title}
            </h2>

            {/* Close control: icon-only secondary plate button (square, gold drawn X) */}
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="ml-4 shrink-0"
            >
              <TuiIcon name="X" />
            </Button>
          </div>

          {/* 
            SCROLLABLE CONTENT AREA
            - Takes remaining height after header
            - Scrolls vertically when content exceeds available space
            - Padding: 24px horizontal (px-6), 20px vertical (py-5), matching the header
            - overflow-y-auto adds scrollbar only when needed
          */}
          {/* tabIndex allows keyboard focus into the scroll region (axe scrollable-region-focusable / Safari). */}
          <div className="overflow-y-auto px-6 py-5" tabIndex={0}>
            {children}
          </div>

          {/* Optional fixed footer — CTA band, actions right-aligned. Same
              card fill as the header (no tint), separated by the hairline. */}
          {footerContent && (
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t-[0.5px] border-solid border-[var(--surface-container-stroke)]">
              {footerContent}
            </div>
          )}
        </div>
        </div>
  );

  // DOCKED (wide viewports): no scrim, no backdrop click-away — the panel
  // floats bottom-center over a live page. Elevation is a drop-shadow, not
  // the boxShadow tokens: the plate clip-path slices box shadows off, and
  // drop-shadow follows the stepped silhouette (values track
  // elevation.high's dark blur).
  // Centered with inset-x-0 + mx-auto (NOT a translate): the enter/exit
  // animations interpolate the transform, so a -translate-x-1/2 centering
  // would make the panel slide in from the side instead of fading in place.
  if (isDocked) {
    return (
      <div
        className={`fixed inset-x-0 mx-auto w-fit max-w-full ${
          closing ? "animate-out fade-out fill-mode-forwards" : "animate-in fade-in"
        }`}
        style={{
          zIndex: "var(--z-index-modal)",
          bottom: "48px",
          animationDuration: "var(--duration-normal)",
          filter: "drop-shadow(0 10px 40px rgba(0, 0, 0, 0.35))",
        }}
        onAnimationEnd={() => {
          if (closing) setVisible(false);
        }}
      >
        {panel}
      </div>
    );
  }

  return (
    <>
      {/*
        BACKDROP / SCRIM
        - Full-screen semi-transparent overlay
        - Covers entire viewport with dark shade (including sidebar)
        - Clicking it closes the modal
        - Uses fade-in/fade-out animation
        - Uses z-index token for modal layer (1040) to ensure it covers sidebar
      */}
      <div
        className={`fixed inset-0 flex items-center justify-center p-5 bg-[var(--surface-overlay)] ${
          closing ? "animate-out fade-out fill-mode-forwards" : "animate-in fade-in"
        }`}
        style={{ zIndex: "var(--z-index-modal)", animationDuration: "var(--duration-normal)" }}
        onClick={onClose}
        onAnimationEnd={() => {
          if (closing) setVisible(false);
        }}
      >
        {panel}
      </div>
    </>
  );
}

