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
 * Every size gets an invisible 44×44px hit area centered on the circle (a
 * pseudo-element, so layout is unchanged) to meet the touch-target rule.
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
 * @param checked - Controlled checked state; omit it to use the native
 *                  uncontrolled behavior (`defaultChecked` + radio-group name)
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
    // Selection is rendered from the NATIVE input via peer-checked, so both
    // controlled (`checked`) and uncontrolled (`defaultChecked` + group name)
    // radios show state — a JS-only visual misses native group deselection.
    const radioStyles = error
      ? `
        border-[var(--field-border-error)]
        bg-[var(--field-background)] hover:bg-[var(--field-background-error)]
        peer-checked:bg-[var(--field-border-error)]
        transition-colors [transition-duration:var(--duration-fast)]
      `
      : `
        border-[var(--field-border)] hover:border-[var(--field-border-hover)]
        bg-[var(--field-background)]
        peer-checked:border-[var(--button-primary-background)]
        peer-checked:bg-[var(--button-primary-background)]
        peer-checked:hover:bg-[var(--button-primary-background-hover)]
        transition-colors [transition-duration:var(--duration-fast)]
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

    // HIT AREA: the wrapper carries a 44×44px pseudo-element centered on the
    // circle. It sits inside the <label>, so a tap anywhere in it selects.
    const control = (
      <span className="relative inline-flex shrink-0 before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-11 before:h-11">
        <input
          ref={ref}
          type="radio"
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
            relative inline-flex shrink-0 items-center justify-center
            ${currentSizeStyles.radio}
            rounded-full
            border-2
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${radioStyles}
            ${focusPeerRing}
            peer-checked:[&>span]:opacity-100
          `}
        >
          {/* Inner dot — revealed by peer-checked on the outer span */}
          <span
            className={`
              ${currentSizeStyles.dot}
              rounded-full opacity-0
              transition-opacity [transition-duration:var(--duration-fast)]
              ${error ? 'bg-white' : 'bg-[var(--button-primary-text)]'}
            `}
          />
        </span>
      </span>
    );

    // Always a <label>: the native input is sr-only, so without one a click
    // on the visible circle would never reach it.
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <label
          className={`inline-flex items-center gap-2 font-mono ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          {control}
          {hasLabel && (
            <span className={`${currentSizeStyles.label} text-[var(--text-primary)]`}>{label}</span>
          )}
        </label>
      </div>
    );
  }
);

Radio.displayName = "Radio";

