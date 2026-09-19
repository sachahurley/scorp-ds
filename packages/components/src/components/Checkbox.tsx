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
 * @param checked - Controlled checked state; omit it to use the native
 *                  uncontrolled behavior (`defaultChecked`)
 * @param onCheckedChange - Callback when checkbox state changes (alternative to onChange)
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "medium",
      label,
      error = false,
      disabled = false,
      checked,
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
    // Box wears the plate silhouette; glyph gets an explicit token size so it
    // renders predictably inside the box (no inherited-size overflow).
    const sizeStyles = {
      small: {
        checkbox: "w-4 h-4",
        glyph: "text-3xs",
        label: "text-sm",
      },
      medium: {
        checkbox: "w-5 h-5",
        glyph: "text-xs",
        label: "text-sm",
      },
      large: {
        checkbox: "w-6 h-6",
        glyph: "text-sm",
        label: "text-sm",
      },
    };

    const currentSizeStyles = sizeStyles[size];

    // STATE STYLES - Color combinations for different states using SEMANTIC TOKENS
    // Priority: error > disabled > checked > default
    // Includes hover states for unchecked checkboxes
    // Includes focus states with ring
    // PLATE RING RECIPE — outer layer is the border color clipped to the plate,
    // inner layer is the fill clipped 1px inset. Checked floods both layers
    // with the primary (gold) fill, matching the primary button. State renders
    // from the NATIVE input via peer-checked so controlled and uncontrolled
    // (`defaultChecked`) checkboxes both show the checkmark.
    const ringStyles = error
      ? 'bg-[var(--field-border-error)]'
      : `bg-[var(--field-border)] hover:bg-[var(--field-border-hover)]
         peer-checked:bg-[var(--button-primary-background)]
         peer-checked:hover:bg-[var(--button-primary-background-hover)]`;

    // Focus: inset ring on the plate (the clip swallows outside rings)
    const focusPeerRing = error
      ? 'peer-focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-error)]'
      : 'peer-focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]';

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
          {...(checked !== undefined ? { checked } : {})}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          aria-invalid={error || undefined}
          {...props}
        />
        <span
          aria-hidden="true"
          className={`
            plate-round p-px inline-flex shrink-0
            ${currentSizeStyles.checkbox}
            transition-colors [transition-duration:var(--duration-fast)]
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${ringStyles}
            ${error ? 'peer-checked:[&>span]:bg-[var(--field-border-error)]' : 'peer-checked:[&>span]:bg-[var(--button-primary-background)]'}
            peer-checked:[&>span>span]:opacity-100
            ${focusPeerRing}
          `}
        >
          <span
            className={`
              plate-round inline-flex h-full w-full items-center justify-center
              bg-[var(--field-background)]
              transition-colors [transition-duration:var(--duration-fast)]
            `}
          >
            {/* Checkmark — revealed by peer-checked on the outer span */}
            <span
              className={`${currentSizeStyles.glyph} font-mono leading-none opacity-0 transition-opacity [transition-duration:var(--duration-fast)] ${
                error ? 'text-white' : 'text-[var(--button-primary-text)]'
              }`}
              aria-hidden="true"
            >
              ✓
            </span>
          </span>
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

