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
 * - Optional icon (iconLeft prop)
 * - Optional close button (onClose prop)
 * - Optional title and description
 * - Full light/dark theme support
 * - Accessible (ARIA attributes)
 */

import { type ReactNode } from "react";

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
  // TUI Tier 2: text severity prefixes instead of Lucide SVG icons
  const severityPrefixes: Record<string, string> = {
    default: "[i]",
    success: "[ok]",
    warning: "[!!]",
    error: "[ERR]",
    info: "[i]",
  };

  // Use custom icon if provided, otherwise use the TUI text prefix
  const icon = iconLeft || (
    <span className="font-mono text-sm font-bold whitespace-nowrap">
      {severityPrefixes[variant]}
    </span>
  );

  // VARIANT STYLES - Color combinations using semantic tokens
  // All variants support light and dark themes
  const variantStyles = {
    // Default: Neutral secondary (sepia) colors
    default: {
      container: `
        bg-secondary-50 dark:bg-secondary-950
        border-secondary-300 dark:border-secondary-700
      `,
      icon: "text-secondary-700 dark:text-secondary-300",
      title: "text-secondary-900 dark:text-secondary-50",
      description: "text-secondary-600 dark:text-secondary-400",
    },
    
    // Success: Green for positive states
    success: {
      container: `
        bg-success-50 dark:bg-success-950
        border-success-300 dark:border-success-700
      `,
      icon: "text-success-600 dark:text-success-400",
      title: "text-success-900 dark:text-success-50",
      description: "text-success-700 dark:text-success-300",
    },
    
    // Warning: Purple for warnings
    warning: {
      container: `
        bg-warning-50 dark:bg-warning-950
        border-warning-300 dark:border-warning-700
      `,
      icon: "text-warning-600 dark:text-warning-400",
      title: "text-warning-900 dark:text-warning-50",
      description: "text-warning-700 dark:text-warning-300",
    },
    
    // Error: Red for errors
    error: {
      container: `
        bg-error-50 dark:bg-error-950
        border-error-300 dark:border-error-700
      `,
      icon: "text-error-600 dark:text-error-500",
      title: "text-error-900 dark:text-error-50",
      description: "text-error-700 dark:text-error-400",
    },
    
    // Info: Blue for informational messages
    info: {
      container: `
        bg-info-50 dark:bg-info-950
        border-info-300 dark:border-info-700
      `,
      icon: "text-info-600 dark:text-info-400",
      title: "text-info-900 dark:text-info-50",
      description: "text-info-700 dark:text-info-300",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3
        p-4
        border border-solid rounded-none
        ${styles.container}
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <div className={`flex-shrink-0 ${styles.icon}`}>
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
            hover:text-term-red
            transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-offset-1
          `}
          aria-label="Close alert"
        >
          [x]
        </button>
      )}
    </div>
  );
}





