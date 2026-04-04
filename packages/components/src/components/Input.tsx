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

import { forwardRef, type InputHTMLAttributes } from "react";

// Define the props interface for the Input component
// Omit the native HTML 'size' attribute to avoid conflict with our custom size prop
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: "small" | "medium" | "large";
  error?: boolean;
}

/**
 * Input Component
 * 
 * @param size - Input size matching button heights (default: "medium")
 * @param error - Whether input has a validation error
 * @param disabled - Whether input is disabled
 * @param className - Additional CSS classes to apply
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      size = "medium", 
      error = false,
      disabled = false,
      className = "", 
      ...props 
    },
    ref
  ) => {
    // BASE STYLES - Applied to all inputs
    // Uses tokens: font.size.sm (14px)
    // Border width: 1px for all states
    // Border radius is size-specific (see sizeStyles)
    const baseStyles = `
      w-full
      font-mono text-sm
      border
      transition-all duration-200
      placeholder:text-sepia-400 dark:placeholder:text-sepia-600
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
        border-error-600 dark:border-error-500
        bg-error-50 dark:bg-error-950/20
        text-sepia-900 dark:text-sepia-50
        focus:ring-2 focus:ring-error-600 dark:focus:ring-error-500 
        focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
        focus:border-error-600 dark:focus:border-error-500
      `
      : `
        border-sepia-300 dark:border-sepia-700
        hover:border-sepia-400 dark:hover:border-sepia-600
        bg-white dark:bg-sepia-975
        text-sepia-900 dark:text-sepia-50
        focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-400
        focus:ring-offset-2 focus:ring-offset-sepia-50 dark:focus:ring-offset-sepia-1000
      `;

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${className}`}
        {...props}
      />
    );
  }
);

// Set display name for debugging
Input.displayName = "Input";

