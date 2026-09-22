/**
 * TOOLTIP COMPONENT
 * 
 * Reusable tooltip component for helpful hints and descriptions
 * Built entirely from design tokens defined in tokens.json
 * 
 * POSITIONS:
 * - top: Above the trigger element (default)
 * - bottom: Below the trigger element
 * - left: To the left of the trigger element
 * - right: To the right of the trigger element
 * 
 * FEATURES:
 * - Arrow/pointer indicator
 * - Auto-positioning (adjusts if near viewport edge)
 * - Delay for show/hide (prevents accidental triggers)
 * - Max width constraint
 * - Full light/dark theme support
 *
 * ACCESSIBILITY (WCAG 2.1.1, 1.4.13):
 * - Opens on keyboard focus as well as hover; closes on blur.
 * - Escape dismisses it without moving focus or the pointer.
 * - Hoverable: the pointer can travel from the trigger onto the tooltip (a
 *   transparent bridge spans the gap) without it closing.
 * - The trigger is described by the tooltip via `aria-describedby`. That
 *   wiring needs a single element child (a Button, a link); the tooltip
 *   still opens for other children but can't describe them.
 * - Content is for supplementary hints only: never put the only copy of
 *   essential information, or anything interactive, in a tooltip.
 */

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from "react";

export interface TooltipProps {
  /** Short supplementary hint. Plain text; no links or buttons. */
  content: ReactNode;
  /** The trigger. Pass one focusable element so keyboard users can open the tooltip and hear it. */
  children: ReactNode;
  /** Side of the trigger the tooltip sits on (default: "top"). */
  position?: "top" | "bottom" | "left" | "right";
  /** Milliseconds before showing on hover or focus (default: 200). */
  delay?: number;
  /** Max width of the balloon, any CSS length (default: "200px"). */
  maxWidth?: string;
  /** Extra classes for the wrapper (e.g. a width class for a full-width trigger). */
  className?: string;
}

/**
 * Tooltip Component
 * 
 * @param content - Tooltip text/content to display
 * @param children - Trigger element (wrapped with tooltip)
 * @param position - Tooltip position relative to trigger (default: "top")
 * @param delay - Delay before showing tooltip in ms (default: 200)
 * @param maxWidth - Maximum width of tooltip (default: "200px")
 * @param className - Additional CSS classes for tooltip wrapper
 */
export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  maxWidth = "200px",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const clearTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fadeRef.current) clearTimeout(fadeRef.current);
  };

  // Show after the delay (hover or focus)
  const show = () => {
    clearTimers();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Small delay before actually showing to allow positioning calculation
      fadeRef.current = setTimeout(() => setShowTooltip(true), 50);
    }, delay);
  };

  // Hide immediately (pointer leaves, focus leaves, Escape)
  const hide = useCallback(() => {
    clearTimers();
    setIsVisible(false);
    setShowTooltip(false);
  }, []);

  // Blur only hides when focus leaves the wrapper entirely
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) hide();
  };

  // Escape dismisses from anywhere while open (1.4.13 "dismissible")
  useEffect(() => {
    if (!isVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isVisible, hide]);

  // Cleanup timeouts on unmount
  useEffect(() => clearTimers, []);

  // Describe the trigger while the tooltip is open. Only possible when the
  // child is a single element we can clone.
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby":
          [
            (children as ReactElement<{ "aria-describedby"?: string }>).props["aria-describedby"],
            isVisible ? tooltipId : undefined,
          ]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children;

  // POSITION STYLES - Positioning tooltip relative to trigger.
  // The container needs w-max: an absolutely-positioned box's auto width is
  // capped by the space from its `left` offset to the containing block edge,
  // so on a narrow trigger the box collapses and the min-width balloon
  // overflows it — translate centering then centers the collapsed box, not
  // the visible balloon.
  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // 1-BIT STEPPED CARET — two stacked stepped polygons (ring layer + fill layer,
  // fill overlapping the tooltip edge 1px so the ring reads continuous). The
  // assembly is authored pointing DOWN (tooltip above trigger) and rotated per
  // side. Geometry is structural (shape language), not a themable value —
  // colors come from the same tokens as the plate ring.
  // 16×8 outer / 12×6 inner on the 2px step grid: the visible ring is ~2px,
  // matching the plate's hairline weight instead of reading as a dense wedge.
  const CARET_OUTER =
    "polygon(0 0, 16px 0, 16px 2px, 14px 2px, 14px 4px, 12px 4px, 12px 6px, 10px 6px, 10px 8px, 6px 8px, 6px 6px, 4px 6px, 4px 4px, 2px 4px, 2px 2px, 0 2px)";
  const CARET_INNER =
    "polygon(0 0, 12px 0, 12px 2px, 10px 2px, 10px 4px, 8px 4px, 8px 6px, 4px 6px, 4px 4px, 2px 4px, 2px 2px, 0 2px)";

  // Placement + rotation per position; the 1px translate keeps the fill layer
  // overlapping the tooltip body so ring and plate read as one outline.
  const caretPlacement = {
    top: "top-full left-1/2 -translate-x-1/2 -translate-y-px",
    bottom: "bottom-full left-1/2 -translate-x-1/2 translate-y-px rotate-180",
    left: "left-full top-1/2 -translate-y-1/2 -translate-x-[5px] -rotate-90",
    right: "right-full top-1/2 -translate-y-1/2 translate-x-[5px] rotate-90",
  };

  // HOVER BRIDGE: transparent strip filling the 8px gap between trigger and
  // balloon, so the pointer can cross onto the tooltip without leaving the
  // wrapper (the tooltip is a DOM child of the wrapper).
  const bridgePlacement = {
    top: "top-full inset-x-0 h-2",
    bottom: "bottom-full inset-x-0 h-2",
    left: "left-full inset-y-0 w-2",
    right: "right-full inset-y-0 w-2",
  };

  return (
    <div
      ref={wrapperRef}
      // w-fit keeps the wrapper hugging the trigger even where the container
      // blockifies/stretches it (grid or flex items) — otherwise the tooltip
      // centers on the stretched wrapper, not the trigger. Pass a width class
      // via `className` if the trigger itself is full-width.
      className={`relative inline-block w-fit ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={handleBlur}
    >
      {/* Trigger Element */}
      {trigger}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`
            absolute
            ${positionStyles[position]}
            w-max
            z-[var(--z-index-tooltip)]
            ${showTooltip ? "opacity-100" : "opacity-0"}
            transition-opacity [transition-duration:var(--duration-fast)]
          `}
          style={{ maxWidth }}
        >
          <span className={`absolute ${bridgePlacement[position]}`} aria-hidden="true" />

          {/* Tooltip Content — plate ring recipe (stroke layer + fill inset 1px) */}
          <div className="plate-round p-px bg-[var(--surface-container-stroke)]">
            <div className="plate-round bg-[var(--surface-card)] min-w-16 px-3 py-2 text-center font-mono text-xs text-[var(--text-primary)] whitespace-normal">
              {content}
            </div>
          </div>

          {/* 1-bit stepped caret pointing at the trigger */}
          <div className={`absolute ${caretPlacement[position]}`} aria-hidden="true">
            <div className="relative h-[8px] w-[16px]">
              <div
                className="absolute inset-0 bg-[var(--surface-container-stroke)]"
                style={{ clipPath: CARET_OUTER }}
              />
              <div
                className="absolute left-[2px] top-[-1px] h-[6px] w-[12px] bg-[var(--surface-card)]"
                style={{ clipPath: CARET_INNER }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





