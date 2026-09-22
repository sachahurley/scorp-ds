/**
 * FIELD MESSAGES (internal)
 *
 * Shared helper/error text for form controls (Input, Textarea, Select,
 * Checkbox). One place owns the ids, `aria-describedby` and `aria-invalid`
 * wiring so every control announces its message the same way.
 *
 * An error message replaces the helper text while it is present (the Carbon /
 * Polaris convention), so the field never shows two lines of small print.
 * The error line leads with the 1-bit AlertCircle icon, the same severity
 * icon as Alert's error variant, so meaning never rides on color alone.
 *
 * Not exported from the package barrel: this is plumbing, not a component.
 */

import { useId, type ReactNode } from "react";
import { TuiIcon } from "../components/TuiIcon";

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
      className={`flex items-start gap-1.5 font-mono text-xs ${
        tone === "error" ? "text-error-700 dark:text-error-400" : "text-[var(--text-secondary)]"
      } ${className}`}
    >
      {/* Icon box is exactly one line tall (1lh) and centers the glyph in
          it, so it sits level with the first line even when the text wraps */}
      {tone === "error" && (
        <span className="flex h-[1lh] shrink-0 items-center">
          <TuiIcon name="AlertCircle" size="3" />
        </span>
      )}
      <span>{children}</span>
    </p>
  );
}
