/**
 * INPUT COMPONENT
 * 
 * Reusable text input component with multiple sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * SIZES: Matching button heights
 * - small: 32px height
 * - medium: 40px height (default)
 * - large: 48px height
 * 
 * STATES:
 * - default: Standard input appearance
 * - hover: Subtle border change on mouse over
 * - focused: Primary color focus ring (keyboard accessible)
 * - disabled: Reduced opacity, not interactive
 * - error: Red border to indicate validation issues
 */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

// Define the props interface for the Input component
// Omit the native HTML 'size' attribute to avoid conflict with our custom size prop
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: "small" | "medium" | "large";
  error?: boolean;
  /**
   * Optional visible label. When set, renders a `<label>` associated with the input via `htmlFor` / `id`.
   * Prefer this or `aria-label` so the field is announced correctly by screen readers.
   */
  label?: ReactNode;
}

/**
 * Input Component
 * 
 * @param size - Input size matching button heights (default: "medium")
 * @param error - Whether input has a validation error
 * @param disabled - Whether input is disabled
 * @param className - Additional CSS classes to apply
 * @param label - Optional visible label wired to the input with matching `id`
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      size = "medium", 
      error = false,
      disabled = false,
      className = "", 
      label,
      id: idProp,
      ...props 
    },
    ref
  ) => {
    const generatedId = useId();
    const controlId =
      idProp ?? (label != null && label !== "" ? generatedId : undefined);
    // BASE STYLES - Applied to all inputs
    // Uses tokens: font.size.sm (14px)
    // Border width: 1px for all states
    // Border radius is size-specific (see sizeStyles)
    const baseStyles = `
      w-full
      font-mono text-sm
      border
      transition-all [transition-duration:var(--duration-normal)]
      placeholder:text-[var(--field-placeholder)]
      disabled:cursor-not-allowed disabled:opacity-50
      focus:outline-none
    `;

    // SIZE STYLES - All values matching button sizes from tokens.json
    // Heights match button component exactly: 32px, 40px, 48px
    // Horizontal padding slightly less than buttons for better text alignment
    // Corner radius matches button sizes: 6px (small), 8px (medium), 12px (large)
    const sizeStyles = {
      small: "h-8 px-3 py-1.5 rounded-none",       // TUI: sharp corners
      medium: "h-10 px-4 py-2.5 rounded-none",    // TUI: sharp corners
      large: "h-12 px-5 py-3.5 rounded-none",     // TUI: sharp corners
    };

    // STATE STYLES - Color combinations for different states using SEMANTIC TOKENS
    // Priority: error > disabled > default
    // Error state overrides all other visual states
    const stateStyles = error
      ? `
        border-[var(--field-border-error)]
        bg-[var(--field-background-error)]
        text-[var(--text-primary)]
        focus:ring-2 focus:ring-[var(--focus-ring-error)]
        focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
        focus:border-[var(--field-border-error)]
      `
      : `
        border-[var(--field-border)] hover:border-[var(--field-border-hover)]
        bg-[var(--field-background)] text-[var(--text-primary)]
        focus:ring-2 focus:ring-[var(--focus-ring-primary)]
        focus:ring-offset-2 focus:ring-offset-[var(--focus-offset-color)]
      `;

    const inputEl = (
      <input
        ref={ref}
        id={controlId}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${className}`}
        {...props}
      />
    );

    if (label == null || label === "") {
      return inputEl;
    }

    return (
      <div className="w-full space-y-1">
        <label
          htmlFor={controlId}
          className="block font-mono text-sm text-secondary-800 dark:text-secondary-200"
        >
          {label}
        </label>
        {inputEl}
      </div>
    );
  }
);

// Set display name for debugging
Input.displayName = "Input";

