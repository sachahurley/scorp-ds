/**
 * MODAL COMPONENT
 * 
 * A reusable modal dialog component with backdrop overlay
 * Built entirely from design tokens defined in tokens.json
 * 
 * FEATURES:
 * - Fixed header with title and close button (always visible)
 * - Scrollable content area (max-height: 66vh)
 * - Fade in/out animations (200ms duration)
 * - Backdrop scrim (semi-transparent overlay)
 * - Drop shadow using elevation tokens
 * - Click outside to close
 * - ESC key to close
 * - Full light/dark theme support
 * 
 * DIMENSIONS:
 * - Width: 740px fixed
 * - Max height: 80% of viewport height
 * - Border radius: 24px (radius.container token)
 * 
 * TOKENS USED:
 * - surface.card, surface.container-stroke, surface.overlay
 * - text.primary (title)
 * - radius.container: 24px border radius
 * - elevation.2: Drop shadow
 */

import { useEffect, type ReactNode } from "react";

// Define the props interface for the Modal component
export interface ModalProps {
  isOpen: boolean;                    // Controls whether modal is visible
  onClose: () => void;                // Function to call when modal should close
  title: string;                      // Title text displayed in fixed header
  children: ReactNode;                // Content to display in scrollable area
}

/**
 * Modal Component
 * 
 * @param isOpen - Whether the modal is currently visible
 * @param onClose - Callback function triggered when user closes modal
 * @param title - Header title text
 * @param children - Modal content (will be scrollable if it exceeds max-height)
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  
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

  // EFFECT: Prevent body scroll when modal is open
  // This keeps the background page from scrolling while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: Restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;

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
        className="fixed inset-0 flex items-center justify-center p-5 animate-in fade-in bg-[var(--surface-overlay)]"
        style={{ zIndex: "var(--z-index-modal)", animationDuration: "var(--duration-normal)" }}
        onClick={onClose}
      >
        {/* 
          MODAL CONTAINER
          - 740px fixed width
          - Max height: 80% of viewport (80vh)
          - Card styling with background, border, and shadow
          - Clicking inside the modal does NOT close it (stopPropagation)
          - Uses elevation-2 shadow tokens for medium elevation
          - rounded-[24px] uses radius.container token
        */}
        <div
          className="w-[740px] max-h-[80vh] bg-[var(--surface-card)] rounded-none flex flex-col overflow-hidden"
          style={{
            boxShadow: 'var(--elevation-2-shadow)',
            border: '0.5px solid var(--elevation-2-border)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 
            FIXED HEADER
            - Always visible at top (does not scroll)
            - Contains title on left, close button on right
            - Flexbox layout for positioning
            - 24px padding matches card padding from Colors page
            - Border bottom separates header from content
          */}
          {/* TUI Tier 2: double-line box-drawing title bar ╔══ Title ══╗ */}
          <div className="flex items-center justify-between px-8 py-6 border-b-[0.5px] border-solid border-[var(--surface-container-stroke)]">
            {/* Title with double-line box-drawing decoration */}
            <h2 className="text-base font-mono text-[var(--text-primary)] font-medium flex items-center gap-0 flex-1 min-w-0">
              <span className="whitespace-pre text-secondary-600 dark:text-secondary-400" aria-hidden="true">╔══ </span>
              <span className="truncate">{title}</span>
              <span className="ml-1 flex-1 overflow-hidden whitespace-nowrap text-secondary-600 dark:text-secondary-400" aria-hidden="true">
                {"═".repeat(80)}
              </span>
              <span className="whitespace-pre text-secondary-600 dark:text-secondary-400" aria-hidden="true"> ══╗</span>
            </h2>

            {/* TUI close button: [x] text instead of icon */}
            <button
              type="button"
              onClick={onClose}
              className="ml-4 font-mono text-sm leading-none text-secondary-700 transition-colors [transition-duration:var(--duration-normal)] hover:text-error-700 dark:text-secondary-300 dark:hover:text-error-400"
              aria-label="Close modal"
            >
              [x]
            </button>
          </div>

          {/* 
            SCROLLABLE CONTENT AREA
            - Takes remaining height after header
            - Scrolls vertically when content exceeds available space
            - 24px padding matches card padding
            - overflow-y-auto adds scrollbar only when needed
          */}
          {/* tabIndex allows keyboard focus into the scroll region (axe scrollable-region-focusable / Safari). */}
          <div className="overflow-y-auto px-8 py-6" tabIndex={0}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

