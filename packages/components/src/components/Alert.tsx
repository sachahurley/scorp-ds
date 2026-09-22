/**
 * ALERT COMPONENT
 * 
 * Reusable alert/notification component for user feedback
 * Built entirely from design tokens defined in tokens.json
 * 
 * VARIANTS:
 * - default: Neutral gray alert
 * - success: Green for success messages
 * - warning: Purple for warnings
 * - error: Red for error messages
 * - info: Blue for informational messages
 * 
 * FEATURES:
 * - Severity icon per variant from the 1-bit set: default Bell, info Info,
 *   success CheckCircle, warning AlertTriangle, error AlertCircle
 *   (override with iconLeft)
 * - Optional close button (onClose prop), a 1-bit X
 * - Optional title and description
 * - Full light/dark theme support
 * - Accessible (ARIA attributes)
 */

import { type ReactNode } from "react";
import { TuiIcon, type TuiIconName } from "./TuiIcon";

export interface AlertProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
  description?: ReactNode;
  iconLeft?: ReactNode;
  onClose?: () => void;
  className?: string;
}

/**
 * Alert Component
 * 
 * @param variant - Alert color variant (default: "default")
 * @param title - Optional alert title
 * @param description - Optional alert description/content
 * @param iconLeft - Optional custom icon (defaults to variant icon)
 * @param onClose - Optional callback when close button is clicked
 * @param className - Additional CSS classes
 */
export function Alert({
  variant = "default",
  title,
  description,
  iconLeft,
  onClose,
  className = "",
}: AlertProps) {
  // 1-bit severity icons, one per variant (default and info differ, so the
  // icon, not just the color, tells them apart)
  const severityIcons: Record<NonNullable<AlertProps["variant"]>, TuiIconName> = {
    default: "Bell",
    success: "CheckCircle",
    warning: "AlertTriangle",
    error: "AlertCircle",
    info: "Info",
  };

  // Use custom icon if provided, otherwise the variant's 1-bit icon
  const icon = iconLeft || <TuiIcon name={severityIcons[variant]} size="4" />;

  // VARIANT STYLES - Color combinations using semantic tokens
  // All variants support light and dark themes.
  // PLATE RING RECIPE: `ring` is the border color painted on the outer layer
  // (clipped to the plate), `fill` is the surface painted on the inner layer
  // 1px inset — clip-path slices real borders, so the ring is a layer.
  const variantStyles = {
    // Default: neutral semantic surfaces (surface + border roles)
    default: {
      ring: "bg-[var(--border-default)]",
      fill: "bg-[var(--surface-subtle)]",
      icon: "text-secondary-800 dark:text-secondary-300",
      title: "text-[var(--text-primary)]",
      description: "text-secondary-800 dark:text-secondary-300",
    },
    
    // Success: Green for positive states
    success: {
      ring: "bg-success-300 dark:bg-success-700",
      fill: "bg-success-50 dark:bg-success-950",
      icon: "text-success-800 dark:text-success-400",
      title: "text-success-900 dark:text-success-50",
      description: "text-success-900 dark:text-success-300",
    },
    
    // Warning: Purple for warnings
    warning: {
      ring: "bg-warning-300 dark:bg-warning-700",
      fill: "bg-warning-50 dark:bg-warning-950",
      icon: "text-warning-800 dark:text-warning-400",
      title: "text-warning-900 dark:text-warning-50",
      description: "text-warning-900 dark:text-warning-300",
    },
    
    // Error: Red for errors
    error: {
      ring: "bg-error-300 dark:bg-error-700",
      fill: "bg-error-50 dark:bg-error-950",
      icon: "text-error-700 dark:text-error-400",
      title: "text-error-900 dark:text-error-50",
      description: "text-error-900 dark:text-error-300",
    },
    
    // Info: Blue for informational messages
    info: {
      ring: "bg-info-300 dark:bg-info-700",
      fill: "bg-info-50 dark:bg-info-950",
      icon: "text-info-800 dark:text-info-400",
      title: "text-info-900 dark:text-info-50",
      description: "text-info-900 dark:text-info-300",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div role="alert" className={`plate-round p-px ${styles.ring} ${className}`}>
    <div
      className={`
        plate-round
        flex items-start gap-3
        p-4
        ${styles.fill}
      `}
    >
      {/* Icon — boxed to the title's first-line height (text-sm = 20px) and
          centered in it, so the prefix sits optically level with the title */}
      {icon && (
        <div className={`flex h-5 flex-shrink-0 items-center ${styles.icon}`}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-mono text-sm font-bold mb-1 ${styles.title}`}>
            {title}
          </h4>
        )}
        {description && (
          <div className={`font-mono text-sm ${styles.description}`}>
            {description}
          </div>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`
            flex-shrink-0
            font-mono text-xs font-bold
            ${styles.description}
            hover:text-error-800 dark:hover:text-error-300
            transition-colors [transition-duration:var(--duration-fast)]
            focus:outline-none focus:ring-1 focus:ring-offset-1
          `}
          aria-label="Close alert"
        >
          <TuiIcon name="X" size="3" />
        </button>
      )}
    </div>
    </div>
  );
}





