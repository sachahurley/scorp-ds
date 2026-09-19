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
 * SHAPE: plate ring recipe, identical to Input — wrapper = border color clipped
 * to --plate-round, textarea = fill clipped 1px inset. The ring walks the
 * portfolio ramp: idle hairline → hover mut → focus accent.
 *
 * STATES:
 * - default / hover / focused: ring color ramp (see above)
 * - disabled: Reduced opacity, not interactive
 * - error: Red ring + tinted fill
 */

import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from "react";

// Define the props interface for the Textarea component
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: "small" | "medium" | "large";
  error?: boolean;
  /**
   * Optional visible label. When set, renders a `<label>` associated with the textarea via `htmlFor` / `id`.
   */
  label?: ReactNode;
}

/**
 * Textarea Component
 * 
 * @param size - Textarea size matching input heights (default: "medium")
 * @param error - Whether textarea has a validation error
 * @param disabled - Whether textarea is disabled
 * @param className - Additional CSS classes to apply
 * @param label - Optional visible label wired to the control with matching `id`
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    // BASE STYLES - Applied to all textareas
    // Uses tokens: font.size.sm (14px)
    // Border width: 1px for all states
    // Border radius is size-specific (see sizeStyles)
    const baseStyles = `
      w-full
      font-mono text-sm
      transition-colors [transition-duration:var(--duration-fast)]
      placeholder:text-[var(--field-placeholder)]
      disabled:cursor-not-allowed disabled:opacity-50
      focus:outline-none
      resize-y
    `;

    // SIZE STYLES - All values matching input sizes from tokens.json
    // Min-heights match input component exactly: 32px, 40px, 48px
    // Corners: plate silhouette, matching Input/Select/Button
    const sizeStyles = {
      small: "min-h-8 px-3 py-1.5 plate-round",
      medium: "min-h-10 px-4 py-2.5 plate-round",
      large: "min-h-12 px-5 py-3.5 plate-round",
    };

    // STATE STYLES - Priority: error > disabled > default
    const stateStyles = error
      ? `bg-[var(--field-background-error)] text-[var(--text-primary)]`
      : `bg-[var(--field-background)] text-[var(--text-primary)]`;

    // PLATE RING RECIPE — identical to Input: the wrapper is the border color
    // clipped to the plate; the textarea is the fill clipped 1px inset. The ring
    // walks the portfolio ramp: idle hairline → hover mut → focus accent.
    const ringStyles = error
      ? "bg-[var(--field-border-error)]"
      : "bg-[var(--field-border)] hover:bg-[var(--field-border-hover)] focus-within:!bg-[var(--field-border-focus)]";

    const areaEl = (
      <div
        className={`w-full plate-round p-px transition-colors [transition-duration:var(--duration-fast)] ${ringStyles}`}
      >
        <textarea
          ref={ref}
          id={controlId}
          disabled={disabled}
          className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${className}`}
          {...props}
        />
      </div>
    );

    if (label == null || label === "") {
      return areaEl;
    }

    return (
      <div className="w-full space-y-1">
        <label
          htmlFor={controlId}
          className="block font-mono text-sm text-secondary-800 dark:text-secondary-200"
        >
          {label}
        </label>
        {areaEl}
      </div>
    );
  }
);

// Set display name for debugging
Textarea.displayName = "Textarea";

