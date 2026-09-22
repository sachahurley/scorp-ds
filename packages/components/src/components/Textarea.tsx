/**
 * TEXTAREA COMPONENT
 * 
 * Reusable textarea component with multiple sizes
 * Built entirely from design tokens defined in tokens.json
 * 
 * SIZES: Matching input heights
 * - sm: 32px min-height (matches small input)
 * - md: 40px min-height (matches medium input - default)
 * - lg: 48px min-height (matches large input)
 * 
 * SHAPE: plate ring recipe, identical to Input — wrapper = border color clipped
 * to --plate-round, textarea = fill clipped 1px inset. The ring walks the
 * portfolio ramp: idle hairline → hover mut → focus accent.
 *
 * STATES:
 * - default / hover: ring color ramp (see above)
 * - focused: the system's 2px inset ring (`--focus-ring-width`) drawn inside
 *   the plate, on top of the ring wrapper's accent colour. The error state
 *   keeps its red ring wrapper and draws the inset ring in
 *   `--focus-ring-error`, so focus is visible in every state.
 * - disabled: the whole field (ring wrapper included) drops to 50% opacity;
 *   dimming only the inner fill used to leave a full-strength border.
 * - error: Red ring + tinted fill
 *
 * PLACEHOLDERS: `--field-placeholder` is sepia-700 in light (6.28:1 on the
 * white field) and sepia-500 in dark (9.45:1). Placeholders still must never
 * carry essential information (they vanish on input), so put format hints in
 * `helperText` and the name in `label`.
 */

import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { FieldMessage, useFieldMessage } from "../lib/field";
import { resolveSize, type ControlSizeProp } from "../lib/size";

// Define the props interface for the Textarea component
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum height and padding: sm, md (default), lg, matching Input. Legacy names are deprecated aliases. */
  size?: ControlSizeProp;
  /** Error styling without a message. Prefer `errorMessage` so users learn what to fix. */
  error?: boolean;
  /** Hint shown under the field (length, format). Linked via `aria-describedby`. */
  helperText?: ReactNode;
  /**
   * Validation message shown under the field. Sets the error state and
   * `aria-invalid`, and replaces `helperText` while present.
   */
  errorMessage?: ReactNode;
  /**
   * Optional visible label. When set, renders a `<label>` associated with the textarea via `htmlFor` / `id`.
   */
  label?: ReactNode;
}

/**
 * Textarea Component
 * 
 * @param size - Textarea size matching input heights (default: "md")
 * @param error - Whether textarea has a validation error
 * @param disabled - Whether textarea is disabled
 * @param className - Additional CSS classes to apply
 * @param label - Optional visible label wired to the control with matching `id`
 * @param helperText - Hint under the field
 * @param errorMessage - Validation message under the field (implies `error`)
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { 
      size: sizeProp = "md", 
      error: errorProp = false,
      helperText,
      errorMessage,
      disabled = false,
      className = "", 
      label,
      id: idProp,
      "aria-describedby": ariaDescribedBy,
      ...props 
    },
    ref
  ) => {
    const size = resolveSize(sizeProp, "Textarea");
    const field = useFieldMessage({ error: errorProp, helperText, errorMessage, describedBy: ariaDescribedBy });
    const error = field.invalid;
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
      disabled:cursor-not-allowed
      focus:outline-none
      resize-y
    `;

    // FOCUS: the same 2px inset ring Input, Button and Checkbox use. It is
    // drawn on the textarea (the plate clip swallows outside outlines, and an
    // inset ring on the 1px wrapper would be painted over by the field).
    // The error state gets the ring too, in the error colour.
    const focusRing = error
      ? "focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-error)]"
      : "focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]";

    // SIZE STYLES - All values matching input sizes from tokens.json
    // Min-heights match input component exactly: 32px, 40px, 48px
    // Corners: plate silhouette, matching Input/Select/Button
    const sizeStyles = {
      sm: "min-h-control-sm px-3 py-1.5 plate-round",
      md: "min-h-control-md px-4 py-2.5 plate-round",
      lg: "min-h-control-lg px-5 py-3.5 plate-round",
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

    // DISABLED: the opacity lives on the ring wrapper so the border dims with
    // the fill; applying it to the textarea alone left a full-strength ring.
    const areaEl = (
      <div
        className={`w-full plate-round p-px transition-colors [transition-duration:var(--duration-fast)] ${ringStyles} ${disabled ? "opacity-50" : ""}`}
      >
        <textarea
          ref={ref}
          id={controlId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={field.describedBy}
          className={`${baseStyles} ${focusRing} ${sizeStyles[size]} ${stateStyles} ${className}`}
          {...props}
        />
      </div>
    );

    const hasLabel = label != null && label !== "";
    if (!hasLabel && !field.hasMessage) {
      return areaEl;
    }

    return (
      <div className="w-full space-y-1">
        {hasLabel && (
          <label
            htmlFor={controlId}
            className="block font-mono text-sm text-secondary-800 dark:text-secondary-200"
          >
            {label}
          </label>
        )}
        {areaEl}
        <FieldMessage {...field.message} />
      </div>
    );
  }
);

// Set display name for debugging
Textarea.displayName = "Textarea";

