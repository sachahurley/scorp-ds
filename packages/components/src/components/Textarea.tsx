/**
 * TEXTAREA COMPONENT
 * 
 * Reusable textarea component with multiple sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * SIZES: Matching input heights
 * - small: 32px min-height (matches small input)
 * - medium: 40px min-height (matches medium input - default)
 * - large: 48px min-height (matches large input)
 * 
 * STATES:
 * - default: Standard textarea appearance
 * - hover: Subtle border change on mouse over
 * - focused: Primary color focus ring (keyboard accessible)
 * - disabled: Reduced opacity, not interactive
 * - error: Red border to indicate validation issues
 */

import { forwardRef, type TextareaHTMLAttributes } from "react";

// Define the props interface for the Textarea component
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: "small" | "medium" | "large";
  error?: boolean;
}

/**
 * Textarea Component
 * 
 * @param size - Textarea size matching input heights (default: "medium")
 * @param error - Whether textarea has a validation error
 * @param disabled - Whether textarea is disabled
 * @param className - Additional CSS classes to apply
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    // BASE STYLES - Applied to all textareas
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
      resize-y
    `;

    // SIZE STYLES - All values matching input sizes from tokens.json
    // Min-heights match input component exactly: 32px, 40px, 48px
    // Horizontal padding slightly less than inputs for better text alignment
    // Corner radius matches input sizes: 6px (small), 8px (medium), 12px (large)
    // Vertical padding provides comfortable spacing for multi-line text
    const sizeStyles = {
      small: "min-h-8 px-3 py-1.5 rounded-none",       // TUI: sharp corners
      medium: "min-h-10 px-4 py-2.5 rounded-none",      // TUI: sharp corners
      large: "min-h-12 px-5 py-3.5 rounded-none",       // TUI: sharp corners
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

    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${className}`}
        {...props}
      />
    );
  }
);

// Set display name for debugging
Textarea.displayName = "Textarea";

