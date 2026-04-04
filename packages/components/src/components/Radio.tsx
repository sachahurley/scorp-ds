/**
 * RADIO COMPONENT
 * 
 * Reusable radio button component with multiple sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * SIZES: Proportional to button/input height system
 * - small: 16px × 16px
 * - medium: 20px × 20px (default)
 * - large: 24px × 24px
 * 
 * STATES:
 * - unchecked: Default state with border
 * - checked: Filled with primary color, inner dot
 * - disabled: Reduced opacity, not interactive
 * - error: Red border to indicate validation issues
 * 
 * Features:
 * - Accessible (ARIA attributes, keyboard support)
 * - Focus states matching design system
 * - Smooth transitions
 * - Optional label
 * - Works with radio groups (use same name prop)
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: "small" | "medium" | "large";
  label?: string | ReactNode;
  error?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Radio Component
 * 
 * @param size - Radio size (default: "medium")
 * @param label - Optional label text displayed next to radio
 * @param error - Whether radio has a validation error
 * @param disabled - Whether radio is disabled
 * @param checked - Whether radio is checked
 * @param name - Name attribute for radio group (required for grouping)
 * @param value - Value attribute for this radio option
 * @param onCheckedChange - Callback when radio state changes (alternative to onChange)
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = "medium",
      label,
      error = false,
      disabled = false,
      checked = false,
      onChange,
      onCheckedChange,
      className = "",
      ...props
    },
    ref
  ) => {
    // Size styles proportional to button/input system
    // Small: 16px × 16px
    // Medium: 20px × 20px (matches medium icon size)
    // Large: 24px × 24px (matches large icon size)
    const sizeStyles = {
      small: {
        radio: "w-4 h-4",                          // 16px × 16px
        dot: "w-1.5 h-1.5",                       // 6px inner dot
        label: "text-sm",                         // 14px text
      },
      medium: {
        radio: "w-5 h-5",                         // 20px × 20px
        dot: "w-2 h-2",                           // 8px inner dot
        label: "text-sm",                         // 14px text
      },
      large: {
        radio: "w-6 h-6",                         // 24px × 24px
        dot: "w-2.5 h-2.5",                       // 10px inner dot
        label: "text-sm",                         // 14px text
      },
    };

    const currentSizeStyles = sizeStyles[size];

    // STATE STYLES - Color combinations for different states using SEMANTIC TOKENS
    // Priority: error > disabled > checked > default
    // Includes hover states for unchecked radios
    // Includes focus states with ring
    const radioStyles = error
      ? `
        border-error-600 dark:border-error-500
        ${checked 
          ? 'bg-error-600 dark:bg-error-500 border-error-600 dark:border-error-500' 
          : 'bg-white dark:bg-sepia-975 hover:border-error-500 dark:hover:border-error-400 hover:bg-error-50 dark:hover:bg-error-950/20'
        }
        focus:ring-2 focus:ring-error-600 dark:focus:ring-error-500
        focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
        transition-all duration-200
      `
      : `
        border-sepia-300 dark:border-sepia-700
        ${checked 
          ? 'bg-primary-400 dark:bg-primary-400 border-primary-400 dark:border-primary-400 hover:bg-primary-500 dark:hover:bg-primary-500' 
          : 'bg-white dark:bg-sepia-975 hover:border-sepia-400 dark:hover:border-sepia-600 hover:bg-sepia-50 dark:hover:bg-sepia-900'
        }
        focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-400
        focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
        transition-all duration-200
      `;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    const handleClick = () => {
      if (!disabled) {
        const syntheticEvent = {
          target: { checked: !checked },
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
        e.preventDefault();
        const syntheticEvent = {
          target: { checked: !checked },
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      }
    };

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Hidden native radio for form submission and accessibility */}
        <input
          ref={ref}
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-invalid={error}
          {...props}
        />
        
        {/* Custom styled radio */}
        <div
          className={`
            relative inline-flex items-center justify-center
            ${currentSizeStyles.radio}
            rounded-none
            border-2
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${radioStyles}
          `}
          role="radio"
          aria-checked={checked}
          aria-disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Inner dot - only visible when checked */}
          {checked && (
            <div 
              className={`
                ${currentSizeStyles.dot}
                rounded-none
                ${error 
                  ? 'bg-white dark:bg-white' 
                  : 'bg-black dark:bg-black'
                }
              `}
            />
          )}
        </div>

        {/* Optional Label */}
        {label && (
          <label 
            className={`
              ${currentSizeStyles.label} 
              font-mono 
              text-sepia-900 dark:text-sepia-50 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={handleClick}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

