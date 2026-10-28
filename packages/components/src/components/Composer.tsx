/**
 * COMPOSER COMPONENT
 *
 * The prompt box of a chat surface: a multi-line field that grows with its
 * content from `minRows` to `maxRows`, sends on Enter (Shift+Enter breaks
 * the line), and turns its send button into a stop button while a reply is
 * streaming. Field and actions share one plate, so it reads as a command
 * line rather than a form with a button parked beside it.
 *
 * SHAPE: Textarea's plate ring recipe on the large plate. The ring wrapper
 * is the border color clipped to --plate-round-lg; the fill layer is
 * clipped 1px inset and holds the context row, the field and the action
 * row. The ring walks the same ramp: idle hairline, hover, focus accent.
 *
 * FOCUS: the system's 2px inset ring is drawn on the whole fill layer while
 * the textarea has focus, so the focus box includes the controls it governs
 * and stays visible while the cursor sits in the field.
 *
 * KEYBOARD: `submitKey="enter"` (default) sends on Enter and breaks the line
 * on Shift+Enter; `"mod-enter"` sends on Cmd/Ctrl+Enter and leaves Enter
 * alone. Enter never sends during IME composition. While `busy`, Enter does
 * not send; the field stays editable so the next message can be drafted.
 *
 * TOKENS USED:
 * - field.background / field.background-error (fill)
 * - field.border / -hover / -focus / -error (ring)
 * - field.placeholder, text.primary, text.secondary (hint)
 * - plate.round-lg, focus-ring.primary / focus-ring.error, focus-ring.width
 * - duration.fast (ring transition)
 */

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { FieldMessage, useFieldMessage } from "../lib/field";
import { useAutosize } from "../lib/use-autosize";
import { useControllableState } from "../lib/use-controllable-state";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import { Kbd } from "./Kbd";
import { TuiIcon } from "./TuiIcon";

/** Which key combination sends. */
export type ComposerSubmitKey = "enter" | "mod-enter";

export interface ComposerProps {
  /** Controlled text. Pair with `onValueChange`; the parent clears it after a send. */
  value?: string;
  /** Uncontrolled starting text (default ""). Uncontrolled Composers clear themselves after a send. */
  defaultValue?: string;
  /** Fires on every edit. */
  onValueChange?: (value: string) => void;
  /**
   * Fires with the trimmed text on Enter (per `submitKey`) or the send
   * button, only when the text is not blank and the Composer is not `busy`.
   */
  onSubmit: (value: string) => void;
  /** A reply is streaming: the send button becomes stop and Enter stops sending. */
  busy?: boolean;
  /** Called by the stop button. Without it, a busy Composer shows a loading send button. */
  onStop?: () => void;
  /** `enter` (default): Enter sends, Shift+Enter breaks the line. `mod-enter`: Cmd/Ctrl+Enter sends. */
  submitKey?: ComposerSubmitKey;
  /** Rows shown when empty (default 1). */
  minRows?: number;
  /** Rows before the field scrolls instead of growing (default 8). */
  maxRows?: number;
  /** Type size, padding and send button size: md (default) or lg. */
  size?: "md" | "lg";
  /** Row of chips above the field: attachments, referenced components. */
  context?: ReactNode;
  /** Leading actions in the action row. Use ghost icon Buttons with aria-labels. */
  actions?: ReactNode;
  /** Text before the send button. Defaults to the shortcut for `submitKey`; `false` hides it. Hidden below `sm`. */
  hint?: ReactNode | false;
  /** Placeholder (default "Message"). Never the only description of the field. */
  placeholder?: string;
  /** Accessible name of the field when there is no visible label (default "Message"). */
  "aria-label"?: string;
  /** Id of a visible label for the field; takes precedence over `aria-label`. */
  "aria-labelledby"?: string;
  /** Hint under the plate, linked via `aria-describedby`. Hidden while `errorMessage` is set. */
  helperText?: ReactNode;
  /** Error under the plate. Sets the error ring and `aria-invalid`, replaces `helperText`. */
  errorMessage?: ReactNode;
  /** Disables the field, the actions and the send button (one disabled fieldset); the plate dims to 50%. */
  disabled?: boolean;
  /** Native character limit on the field. State it in `helperText`. */
  maxLength?: number;
  /** Accessible name of the send button (default "Send message"). */
  sendLabel?: string;
  /** Accessible name of the stop button (default "Stop response"). */
  stopLabel?: string;
  /** Focus the field on mount. */
  autoFocus?: boolean;
  /** Field `name`, for native form handling. */
  name?: string;
  /** Extra classes for the ring wrapper. Width comes from the parent. */
  className?: string;
}

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Composer
 *
 * ```tsx
 * <Composer onSubmit={send} busy={streaming} onStop={stop} />
 * ```
 */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      onSubmit,
      busy = false,
      onStop,
      submitKey = "enter",
      minRows = 1,
      maxRows = 8,
      size = "md",
      context,
      actions,
      hint,
      placeholder = "Message",
      "aria-label": ariaLabel = "Message",
      "aria-labelledby": ariaLabelledBy,
      helperText,
      errorMessage,
      disabled = false,
      maxLength,
      sendLabel = "Send message",
      stopLabel = "Stop response",
      autoFocus,
      name,
      className,
    },
    forwardedRef
  ) => {
    const [text, setText] = useControllableState({ value, defaultValue, onChange: onValueChange });
    const controlled = value !== undefined;
    const fieldRef = useRef<HTMLTextAreaElement | null>(null);
    useAutosize(fieldRef, { value: text, minRows, maxRows });

    const setRefs = useCallback(
      (el: HTMLTextAreaElement | null) => {
        fieldRef.current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      },
      [forwardedRef]
    );

    const field = useFieldMessage({ helperText, errorMessage });
    const error = field.invalid;
    const hintId = useId();
    const [mod] = useState(() => (isMac() ? "Cmd" : "Ctrl"));
    const blank = text.trim() === "";

    const submit = () => {
      if (blank || busy || disabled) return;
      onSubmit(text.trim());
      if (!controlled) setText("");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
      const withMod = e.metaKey || e.ctrlKey;
      const sends = submitKey === "enter" ? !e.shiftKey : withMod;
      if (!sends) return;
      e.preventDefault();
      submit();
    };

    const defaultHint =
      submitKey === "enter" ? (
        <>
          <Kbd keys={["Enter"]} /> send <Kbd keys={["Shift", "Enter"]} /> new line
        </>
      ) : (
        <>
          <Kbd keys={[mod, "Enter"]} /> send
        </>
      );
    const hintContent = hint === false ? null : (hint ?? defaultHint);

    const describedBy = [hintContent != null ? hintId : null, field.describedBy].filter(Boolean).join(" ") || undefined;

    const ringStyles = error
      ? "bg-[var(--field-border-error)]"
      : "bg-[var(--field-border)] hover:bg-[var(--field-border-hover)] focus-within:!bg-[var(--field-border-focus)]";

    const focusRing = error
      ? "has-[textarea:focus-visible]:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-error)]"
      : "has-[textarea:focus-visible]:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]";

    const sizes = {
      md: { text: "text-sm", field: "px-4 pt-3", row: "p-2", context: "px-4 pt-3" },
      lg: { text: "text-base", field: "px-5 pt-4", row: "p-3", context: "px-5 pt-4" },
    }[size];

    // 44px hit area at md (the 40px plate plus a centered pseudo-element), as Alert's close button.
    const hitArea =
      "relative before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-touch before:h-touch";

    const sendButton =
      busy && onStop ? (
        <Button type="button" variant="secondary" size={size} aria-label={stopLabel} onClick={onStop} className={hitArea}>
          <TuiIcon name="Stop" size="4" />
        </Button>
      ) : (
        <Button
          type="submit"
          variant="primary"
          size={size}
          aria-label={sendLabel}
          disabled={disabled || (!busy && blank)}
          loading={busy}
          className={hitArea}
        >
          <TuiIcon name="Send" size="4" />
        </Button>
      );

    return (
      <div className="w-full space-y-1">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "plate-round-lg w-full p-px transition-colors [transition-duration:var(--duration-fast)]",
            ringStyles,
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          {/* A fieldset, so `disabled` reaches every control inside, actions included. */}
          <fieldset
            disabled={disabled}
            data-error={error || undefined}
            className={cn(
              "plate-round-lg flex min-w-0 flex-col font-mono transition-shadow [transition-duration:var(--duration-fast)]",
              error ? "bg-[var(--field-background-error)]" : "bg-[var(--field-background)]",
              focusRing
            )}
          >
            {context && <div className={cn("flex flex-wrap gap-1.5", sizes.context)}>{context}</div>}
            <textarea
              ref={setRefs}
              name={name}
              rows={minRows}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label={ariaLabelledBy ? undefined : ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={describedBy}
              aria-invalid={error || undefined}
              disabled={disabled}
              maxLength={maxLength}
              autoFocus={autoFocus}
              className={cn(
                "w-full resize-none bg-transparent text-[var(--text-primary)] focus:outline-none",
                "placeholder:text-[var(--field-placeholder)] disabled:cursor-not-allowed",
                sizes.text,
                sizes.field
              )}
            />
            <div className={cn("flex items-center gap-2", sizes.row)}>
              {actions && <div className="flex items-center gap-1">{actions}</div>}
              <div className="ml-auto flex items-center gap-3">
                {hintContent != null && (
                  <span
                    id={hintId}
                    className="hidden items-center gap-1.5 text-xs text-[var(--text-secondary)] sm:flex"
                  >
                    {hintContent}
                  </span>
                )}
                {sendButton}
              </div>
            </div>
          </fieldset>
        </form>
        <FieldMessage {...field.message} />
      </div>
    );
  }
);

Composer.displayName = "Composer";
