/**
 * SLIDER COMPONENT
 *
 * A styled native range input: the missing control tier between Input and
 * Select for continuous or stepped numeric values (zoom, size, bias).
 * Built entirely from design tokens defined in tokens.json.
 *
 * ANATOMY:
 * - Track: a thin muted bar (surface.muted), sharp corners per the TUI tier
 * - Thumb: a solid accent plate wearing the button silhouette
 *   (--plate-round, the stepped one-bit corners), sized for a 44px-tall
 *   touch target via the input's hit area
 * - Focus: the inset box-shadow ring recipe (outlines get clipped elsewhere
 *   in the system, so focus is consistent ring-style everywhere)
 *
 * Native <input type="range"> underneath: keyboard arrows, min/max/step,
 * form participation, and assistive tech all come free.
 *
 * TOKENS USED:
 * - surface.muted (track), accent (thumb), text.secondary scale (label)
 * - focus.ring (focus-visible), duration.fast (hover)
 */

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /**
   * Optional visible label. When set, renders a <label> associated with the
   * input via htmlFor/id. Prefer this or `aria-label` so the control is
   * announced correctly by screen readers.
   */
  label?: ReactNode;
}

/**
 * Slider Component
 *
 * @param label - Optional visible label wired to the input with matching id
 * All other props (min, max, step, value, onChange, disabled, ...) pass
 * through to the native range input.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, id, className = "", disabled, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <span className={`inline-flex flex-col gap-1.5 font-mono ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm text-secondary-800 dark:text-secondary-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="range"
        disabled={disabled}
        className={`
          appearance-none w-full h-6 bg-transparent rounded-none
          ${disabled ? "cursor-default opacity-50" : "cursor-pointer"}
          focus:outline-none
          focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]
          [&::-webkit-slider-runnable-track]:h-1
          [&::-webkit-slider-runnable-track]:bg-[var(--surface-muted)]
          [&::-webkit-slider-runnable-track]:rounded-none
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:-mt-2
          [&::-webkit-slider-thumb]:bg-[var(--accent)]
          [&::-webkit-slider-thumb]:[clip-path:var(--plate-round)]
          [&::-moz-range-track]:h-1
          [&::-moz-range-track]:bg-[var(--surface-muted)]
          [&::-moz-range-track]:rounded-none
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-3.5
          [&::-moz-range-thumb]:bg-[var(--accent)]
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:[clip-path:var(--plate-round)]
        `}
        {...rest}
      />
    </span>
  );
});

Slider.displayName = "Slider";
