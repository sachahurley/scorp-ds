/**
 * CHECKBOX COMPONENT
 * 
 * Reusable checkbox component with multiple sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * SIZES: Proportional to button/input height system
 * - small: 16px × 16px
 * - medium: 20px × 20px (default)
 * - large: 24px × 24px
 * 
 * STATES:
 * - unchecked: Default state with border
 * - checked: Filled with primary color, checkmark icon
 * - disabled: Reduced opacity, not interactive
 * - error: Red border to indicate validation issues
 * 
 * Features:
 * - Accessible (ARIA attributes, keyboard support)
 * - Focus states matching design system
 * - Smooth transitions
 * - Optional label
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: "small" | "medium" | "large";
  label?: string | ReactNode;
  error?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Checkbox Component
 * 
 * @param size - Checkbox size (default: "medium")
 * @param label - Optional label text displayed next to checkbox
 * @param error - Whether checkbox has a validation error
 * @param disabled - Whether checkbox is disabled
 * @param checked - Whether checkbox is checked
 * @param onCheckedChange - Callback when checkbox state changes (alternative to onChange)
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
        checkbox: "w-4 h-4 rounded-none",          // TUI: sharp corners
        icon: "w-2.5 h-2.5",
        label: "text-sm",
      },
      medium: {
        checkbox: "w-5 h-5 rounded-none",          // TUI: sharp corners
        icon: "w-3 h-3",
        label: "text-sm",
      },
      large: {
        checkbox: "w-6 h-6 rounded-none",          // TUI: sharp corners
        icon: "w-3.5 h-3.5",                      // 14px icon (smaller for better fit)
        label: "text-sm",                         // 14px text
      },
    };

    const currentSizeStyles = sizeStyles[size];

    // STATE STYLES - Color combinations for different states using SEMANTIC TOKENS
    // Priority: error > disabled > checked > default
    // Includes hover states for unchecked checkboxes
    // Includes focus states with ring
    const checkboxStyles = error
      ? `
        border-[var(--field-border-error)]
        ${checked
          ? 'bg-[var(--field-border-error)] border-[var(--field-border-error)]'
          : 'bg-[var(--field-background)] hover:border-[var(--field-border-error)] hover:bg-[var(--field-background-error)]'
        }
        focus:ring-2 focus:ring-[var(--focus-ring-error)]
        focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
        transition-all [transition-duration:var(--duration-normal)]
      `
      : `
        border-[var(--field-border)]
        ${checked
          ? 'bg-[var(--button-primary-background)] border-[var(--button-primary-background)] hover:bg-[var(--button-primary-background-hover)]'
          : 'bg-[var(--field-background)] hover:border-[var(--field-border-hover)] hover:bg-[var(--surface-subtle)]'
        }
        focus:ring-2 focus:ring-[var(--focus-ring-primary)]
        focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
        transition-all [transition-duration:var(--duration-normal)]
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
        {/* Hidden native checkbox for form submission and accessibility */}
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-invalid={error}
          {...props}
        />
        
        {/* Custom styled checkbox */}
        <div
          className={`
            relative inline-flex items-center justify-center
            ${currentSizeStyles.checkbox}
            border-2
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${checkboxStyles}
          `}
          role="checkbox"
          aria-checked={checked}
          aria-disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          {/* TUI Tier 2: Unicode checkmark ✓ instead of Lucide Check icon */}
          {checked && (
            <span
              className={`
                ${currentSizeStyles.icon}
                inline-flex items-center justify-center font-mono font-bold leading-none
                ${error 
                  ? 'text-white dark:text-white' 
                  : 'text-black dark:text-black'
                }
              `}
              aria-hidden="true"
            >
              ✓
            </span>
          )}
        </div>

        {/* Optional Label */}
        {label && (
          <label 
            className={`
              ${currentSizeStyles.label} 
              font-mono 
              text-[var(--text-primary)] 
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

Checkbox.displayName = "Checkbox";

