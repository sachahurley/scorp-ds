/**
 * BADGE COMPONENT
 * 
 * Reusable badge/tag component for labels, status indicators, and counts
 * Built entirely from design tokens defined in tokens.json
 * 
 * VARIANTS:
 * - default: Neutral gray badge
 * - primary: Amber/primary brand color
 * - success: Green for positive states
 * - warning: Purple for warnings
 * - error: Red for errors
 * - info: Blue for informational messages
 * 
 * SIZES:
 * - small: Compact badge (20px height)
 * - medium: Standard badge (24px height, default)
 * - large: Larger badge (28px height)
 * 
 * FEATURES:
 * - Optional close button (onClose prop)
 * - Icon support (iconLeft prop)
 * - Full light/dark theme support
 */

import { type ReactNode } from "react";

export interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  size?: "small" | "medium" | "large";
  children: ReactNode;
  iconLeft?: ReactNode;
  onClose?: () => void;
  className?: string;
}

/**
 * Badge Component
 * 
 * @param variant - Badge color variant (default: "default")
 * @param size - Badge size (default: "medium")
 * @param children - Badge content (text, numbers, etc.)
 * @param iconLeft - Optional icon to display on the left
 * @param onClose - Optional callback when close button is clicked
 * @param className - Additional CSS classes
 */
export function Badge({
  variant = "default",
  size = "medium",
  children,
  iconLeft,
  onClose,
  className = "",
}: BadgeProps) {
  // SIZE STYLES - Heights and padding matching design system
  // Small: 20px height, 8px horizontal padding, 4px vertical padding
  // Medium: 24px height, 10px horizontal padding, 4px vertical padding
  // Large: 28px height, 12px horizontal padding, 6px vertical padding
  const sizeStyles = {
    small: "h-5 px-2 py-1 text-xs",      // h-5 = 20px, px-2 = 8px, text-xs = 12px
    medium: "h-6 px-2.5 py-1 text-xs",   // h-6 = 24px, px-2.5 = 10px, text-xs = 12px
    large: "h-7 px-3 py-1.5 text-sm",    // h-7 = 28px, px-3 = 12px, text-sm = 14px
  };

  // TUI Tier 2: bracket-style badges with ANSI terminal accent colors
  // Transparent background, colored text only -- e.g. [SUCCESS]
  const variantStyles = {
    default: `
      bg-transparent
      text-term-dim
    `,
    primary: `
      bg-transparent
      text-term-amber
    `,
    success: `
      bg-transparent
      text-term-green
    `,
    warning: `
      bg-transparent
      text-term-magenta
    `,
    error: `
      bg-transparent
      text-term-red
    `,
    info: `
      bg-transparent
      text-term-cyan
    `,
  };

  // ICON SIZES - Icons scale with badge size
  const iconSizes = {
    small: "w-3 h-3",    // 12px
    medium: "w-3.5 h-3.5", // 14px
    large: "w-4 h-4",    // 16px
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-mono font-medium
        rounded-none
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {/* Left Icon */}
      {iconLeft && (
        <span className={`inline-flex items-center justify-center ${iconSizes[size]} flex-shrink-0`}>
          {iconLeft}
        </span>
      )}
      
      {/* TUI Tier 2: bracket-wrapped content [LABEL] */}
      <span className="inline-flex items-center">
        <span aria-hidden="true">[</span>
        {children}
        <span aria-hidden="true">]</span>
      </span>
      
      {/* Close Button -- TUI text "x" instead of Lucide icon */}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`
            inline-flex items-center justify-center
            font-mono font-bold
            hover:text-term-red
            transition-colors duration-150
            flex-shrink-0
            focus:outline-none focus:ring-1 focus:ring-offset-1
          `}
          aria-label="Remove badge"
        >
          x
        </button>
      )}
    </span>
  );
}





