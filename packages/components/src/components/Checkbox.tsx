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
        transition-all [transition-duration:var(--duration-normal)]
      `
      : `
        border-[var(--field-border)]
        ${checked
          ? 'bg-[var(--button-primary-background)] border-[var(--button-primary-background)] hover:bg-[var(--button-primary-background-hover)]'
          : 'bg-[var(--field-background)] hover:border-[var(--field-border-hover)] hover:bg-[var(--surface-subtle)]'
        }
        transition-all [transition-duration:var(--duration-normal)]
      `;

    const focusPeerRing = error
      ? `peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring-error)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--focus-offset-color)]`
      : `peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring-primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--focus-offset-color)]`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    const hasLabel = label != null && label !== false && label !== '';

    const control = (
      <>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          aria-invalid={error || undefined}
          {...props}
        />
        <span
          aria-hidden="true"
          className={`
            relative inline-flex shrink-0 items-center justify-center
            ${currentSizeStyles.checkbox}
            border-2
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${checkboxStyles}
            ${focusPeerRing}
          `}
        >
          {checked && (
            <span
              className={`
                ${currentSizeStyles.icon}
                inline-flex items-center justify-center font-mono font-bold leading-none
                ${error ? 'text-white dark:text-white' : 'text-black dark:text-black'}
              `}
              aria-hidden="true"
            >
              ✓
            </span>
          )}
        </span>
      </>
    );

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {hasLabel ? (
          <label
            className={`inline-flex items-center gap-2 font-mono ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {control}
            <span className={`${currentSizeStyles.label} text-[var(--text-primary)]`}>{label}</span>
          </label>
        ) : (
          <span className="inline-flex items-center gap-2">{control}</span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

