/**
 * FIELD MESSAGES (internal)
 *
 * Shared helper/error text for form controls (Input, Textarea, Select,
 * Checkbox). One place owns the ids, `aria-describedby` and `aria-invalid`
 * wiring so every control announces its message the same way.
 *
 * An error message replaces the helper text while it is present (the Carbon /
 * Polaris convention), so the field never shows two lines of small print.
 * The error line carries a `[er]` prefix, the same severity glyph as Alert,
 * so meaning never rides on color alone.
 *
 * Not exported from the package barrel: this is plumbing, not a component.
 */

import { useId, type ReactNode } from "react";

const hasContent = (node: ReactNode) => node != null && node !== false && node !== "";

export interface FieldMessageOptions {
  /** Boolean error flag from the control's props. */
  error?: boolean;
  /** Hint shown under the control. */
  helperText?: ReactNode;
  /** Validation message; implies the error state when set. */
  errorMessage?: ReactNode;
  /** Consumer-supplied `aria-describedby`, merged in front of ours. */
  describedBy?: string;
}

/**
 * Resolves the field's invalid state and the ids that tie its message to the
 * control. Spread `aria-describedby` / `aria-invalid` onto the focusable
 * element and render `<FieldMessage {...message} />` under it.
 */
export function useFieldMessage({ error, helperText, errorMessage, describedBy }: FieldMessageOptions) {
  const baseId = useId();
  const showError = hasContent(errorMessage);
  const showHelper = !showError && hasContent(helperText);
  const messageId = showError || showHelper ? `${baseId}-message` : undefined;
  const invalid = error || showError;

  return {
    invalid,
    hasMessage: messageId != null,
    describedBy: [describedBy, messageId].filter(Boolean).join(" ") || undefined,
    message: {
      id: messageId,
      tone: showError ? ("error" as const) : ("helper" as const),
      children: showError ? errorMessage : helperText,
    },
  };
}

/** The small print under a field. Renders nothing when there is no message. */
export function FieldMessage({
  id,
  tone,
  children,
  className = "",
}: {
  id?: string;
  tone: "helper" | "error";
  children?: ReactNode;
  className?: string;
}) {
  if (id == null) return null;
  return (
    <p
      id={id}
      className={`font-mono text-xs ${
        // Helper uses explicit steps, not --text-secondary: that token is
        // secondary-600 in light, 3.3:1 on the page, below AA for 12px text.
        tone === "error" ? "text-error-700 dark:text-error-400" : "text-secondary-700 dark:text-secondary-500"
      } ${className}`}
    >
      {tone === "error" && <span aria-hidden="true">[er] </span>}
      {children}
    </p>
  );
}
