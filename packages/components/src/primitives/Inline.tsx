import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import type { StackGap } from "./Stack";

/** Space between inline items. Same keys as `StackGap`, so rows and stacks share one scale. */
export type InlineGap = StackGap;

const gapClass: Record<InlineGap, string> = {
  none: "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
};

/** Cross-axis placement of items within a row. */
export type InlineAlign = "start" | "center" | "end" | "baseline";

const alignClass: Record<InlineAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
};

/** Main-axis distribution of items across the row. */
export type InlineJustify = "start" | "center" | "end" | "between";

const justifyClass: Record<InlineJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export interface InlineProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Items to place side by side; they keep their own width and wrap as a unit. */
  children: ReactNode;
  /**
   * Space between items, used for both the row gap and the wrap gap, from the
   * spacing scale: `none` 0, `1` 4px, `2` 8px (default), `3` 12px, `4` 16px,
   * `5` 20px, `6` 24px, `8` 32px.
   */
  gap?: InlineGap;
  /**
   * How items line up across the row. `center` (default) suits controls of
   * mixed height; `baseline` lines up the text in a label plus value meta row.
   */
  align?: InlineAlign;
  /**
   * How leftover horizontal space is distributed. `start` (default) keeps the
   * cluster tight; `between` pushes the first and last item to the edges of a
   * full-width row such as a toolbar.
   */
  justify?: InlineJustify;
  /**
   * Whether items flow onto a new line when the row runs out of width.
   * Leave it on (default) so button rows and tag lists survive narrow
   * viewports; turn it off only when overflow is handled another way.
   */
  wrap?: boolean;
  /** Extra classes (width, padding, self-alignment), merged with `cn()` so they win. */
  className?: string;
}

/**
 * Inline is the horizontal cluster that wraps: button rows, tag lists, meta rows,
 * icon plus label pairs.
 *
 * Use it wherever a row of items must stay readable at any width. Inline owns
 * only the gaps and the alignment, never padding or a surface, so put it inside
 * a Box or a Card when the row needs one. For a one-dimensional column use
 * Stack; for aligned rows and columns use Grid.
 *
 * Forwards its ref to the underlying `<div>` and spreads native attributes
 * (`id`, `role`, `aria-*`, `data-*`), so a row can be a labelled `group` or
 * `toolbar` without a wrapper element.
 */
export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline(
  { children, gap = "2", align = "center", justify = "start", wrap = true, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row",
        wrap ? "flex-wrap" : "flex-nowrap",
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

Inline.displayName = "Inline";
