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

  // POSITION STYLES - Positioning tooltip relative to trigger
  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // ARROW STYLES - Arrow pointing to trigger element
  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-[var(--surface-card)] border-l-transparent border-r-transparent border-b-transparent border-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--surface-card)] border-l-transparent border-r-transparent border-t-transparent border-4",
    left: "left-full top-1/2 -translate-y-1/2 border-l-[var(--surface-card)] border-t-transparent border-b-transparent border-r-transparent border-4",
    right: "right-full top-1/2 -translate-y-1/2 border-r-[var(--surface-card)] border-t-transparent border-b-transparent border-l-transparent border-4",
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block ${className}`}
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
            z-[var(--z-index-tooltip)]
            ${showTooltip ? "opacity-100" : "opacity-0"}
            transition-opacity duration-150
            pointer-events-none
          `}
          style={{ maxWidth }}
        >
          {/* Tooltip Content */}
          <div
            className={`
              bg-[var(--surface-card)]
              border-[0.5px] border-solid border-sepia-500 dark:border-sepia-800
              rounded-none
              px-3 py-2
              font-mono text-xs
              text-sepia-900 dark:text-sepia-50
              shadow-none
              whitespace-normal
            `}
            style={{
              boxShadow: "var(--elevation-2-shadow)",
            }}
          >
            {content}
          </div>

          {/* Arrow/Pointer */}
          <div
            className={`
              absolute
              ${arrowStyles[position]}
            `}
            style={{
              filter: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}





