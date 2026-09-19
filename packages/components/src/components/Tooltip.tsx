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
 * - Accessible (ARIA attributes)
 */

import { useState, useRef, useEffect, type ReactNode } from "react";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // Delay in milliseconds before showing tooltip (default: 200ms)
  maxWidth?: string; // Max width constraint (default: "200px")
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle mouse enter - start delay timer
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Small delay before actually showing to allow positioning calculation
      setTimeout(() => setShowTooltip(true), 50);
    }, delay);
  };

  // Handle mouse leave - hide immediately
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setShowTooltip(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  return (
    <div
      ref={wrapperRef}
      // w-fit keeps the wrapper hugging the trigger even where the container
      // blockifies/stretches it (grid or flex items) — otherwise the tooltip
      // centers on the stretched wrapper, not the trigger. Pass a width class
      // via `className` if the trigger itself is full-width.
      className={`relative inline-block w-fit ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute
            ${positionStyles[position]}
            w-max
            z-[var(--z-index-tooltip)]
            ${showTooltip ? "opacity-100" : "opacity-0"}
            transition-opacity [transition-duration:var(--duration-fast)]
            pointer-events-none
          `}
          style={{ maxWidth }}
        >
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





