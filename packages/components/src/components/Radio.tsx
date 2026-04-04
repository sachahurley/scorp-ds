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
    // Focus ring lives on the visual (peer of native input) so only one radio is exposed to assistive tech.
    const radioStyles = error
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
          type="radio"
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
            ${currentSizeStyles.radio}
            rounded-none
            border-2
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${radioStyles}
            ${focusPeerRing}
          `}
        >
          {checked && (
            <span
              className={`
                ${currentSizeStyles.dot}
                rounded-none
                ${error ? 'bg-white dark:bg-white' : 'bg-black dark:bg-black'}
              `}
            />
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

Radio.displayName = "Radio";

