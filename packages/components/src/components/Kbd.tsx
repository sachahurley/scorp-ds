/**
 * KBD COMPONENT
 *
 * Inline keyboard key: shortcut hints in menus, help text, and command
 * palettes. Renders `<kbd>`; a combo (`keys={["Ctrl", "K"]}`) renders the
 * HTML-recommended nested form, an outer `<kbd>` holding one `<kbd>` per
 * key, with a visible "+" separator that screen readers also read.
 *
 * SHAPE: each key is a small plate using the ring recipe (stroke layer +
 * fill inset 1px), with a 2px bottom lip so it reads as a keycap.
 *
 * SIZES: sm (20px keys, text-xs, default) for inline text and menus; md
 * (24px keys, text-sm) for standalone hints.
 *
 * TOKENS USED:
 * - surface.container-stroke (ring and lip), surface.muted (key fill)
 * - text.primary (key text), text.secondary (separator)
 * - plate.round
 */

import { Fragment, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { resolveSize, type ControlSizeProp } from "../lib/size";

export interface KbdProps {
  /**
   * Keys of a combo, in press order (`["Ctrl", "Shift", "P"]`). Takes
   * precedence over `children`.
   */
  keys?: string[];
  /** A single key label when `keys` is not used. */
  children?: ReactNode;
  /** Key size: sm 20px (default) or md 24px. */
  size?: Extract<ControlSizeProp, "sm" | "md" | "small" | "medium">;
  /** Visible separator between combo keys (default "+"). */
  separator?: ReactNode;
  /** Extra classes for the outer `<kbd>`. */
  className?: string;
}

const KEY_SIZE = {
  sm: "h-5 min-w-5 px-1.5 text-xs",
  md: "h-6 min-w-6 px-2 text-sm",
} as const;

function Key({ size, children, className }: { size: "sm" | "md"; children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "plate-round inline-flex bg-[var(--surface-container-stroke)] px-px pb-0.5 pt-px align-middle font-mono",
        className
      )}
    >
      <span
        className={cn(
          "plate-round inline-flex items-center justify-center bg-[var(--surface-muted)] leading-none text-[var(--text-primary)]",
          KEY_SIZE[size]
        )}
      >
        {children}
      </span>
    </kbd>
  );
}

/**
 * Kbd
 *
 * ```tsx
 * <p>Open the palette with <Kbd keys={["Ctrl", "K"]} />.</p>
 * <Kbd>Esc</Kbd>
 * ```
 */
export function Kbd({ keys, children, size: sizeProp = "sm", separator = "+", className }: KbdProps) {
  const size = resolveSize<"sm" | "md">(sizeProp, "Kbd", "sm");

  if (!keys || keys.length <= 1) {
    return (
      <Key size={size} className={className}>
        {keys?.[0] ?? children}
      </Key>
    );
  }

  return (
    <kbd className={cn("inline-flex items-center gap-1 align-middle font-mono", className)}>
      {keys.map((key, i) => (
        <Fragment key={`${key}-${i}`}>
          {i > 0 && (
            <span className={cn("text-[var(--text-secondary)]", size === "sm" ? "text-xs" : "text-sm")}>
              {separator}
            </span>
          )}
          <Key size={size}>{key}</Key>
        </Fragment>
      ))}
    </kbd>
  );
}

Kbd.displayName = "Kbd";
