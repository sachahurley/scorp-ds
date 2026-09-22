import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import type { StackGap } from "./Stack";

/** Space between tracks. Same keys as `StackGap`, so grids and stacks share one scale. */
export type GridGap = StackGap;

const gapClass: Record<GridGap, string> = {
  none: "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
};

const rowGapClass: Record<GridGap, string> = {
  none: "gap-y-0",
  "1": "gap-y-1",
  "2": "gap-y-2",
  "3": "gap-y-3",
  "4": "gap-y-4",
  "5": "gap-y-5",
  "6": "gap-y-6",
  "8": "gap-y-8",
};

const columnGapClass: Record<GridGap, string> = {
  none: "gap-x-0",
  "1": "gap-x-1",
  "2": "gap-x-2",
  "3": "gap-x-3",
  "4": "gap-x-4",
  "5": "gap-x-5",
  "6": "gap-x-6",
  "8": "gap-x-8",
};

/** Track counts the grid supports. Counts that do not divide 12 evenly are left out. */
export type GridColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;

/** Breakpoint names, matching the breakpoint tokens wired into the Tailwind `screens` scale. */
export type GridBreakpoint = "base" | "sm" | "md" | "lg" | "xl";

/**
 * A fixed track count, or a map from breakpoint to track count. `base` applies
 * below `sm` (640px); `sm` 640px and up, `md` 768px, `lg` 1024px, `xl` 1280px.
 */
export type GridColumns = GridColumnCount | Partial<Record<GridBreakpoint, GridColumnCount>>;

const columnsClass: Record<GridBreakpoint, Record<GridColumnCount, string>> = {
  base: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    8: "grid-cols-8",
    12: "grid-cols-12",
  },
  sm: {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    8: "sm:grid-cols-8",
    12: "sm:grid-cols-12",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    8: "md:grid-cols-8",
    12: "md:grid-cols-12",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    8: "lg:grid-cols-8",
    12: "lg:grid-cols-12",
  },
  xl: {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
    8: "xl:grid-cols-8",
    12: "xl:grid-cols-12",
  },
};

/** Breakpoint order, so a responsive map always emits mobile-first classes. */
const BREAKPOINT_ORDER: GridBreakpoint[] = ["base", "sm", "md", "lg", "xl"];

/** Vertical placement of items inside their row. */
export type GridAlign = "start" | "center" | "end" | "stretch";

const alignClass: Record<GridAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/** Turns a `columns` value into the mobile-first `grid-cols-*` class list. */
function resolveColumns(columns: GridColumns): string[] {
  if (typeof columns === "number") return [columnsClass.base[columns]];
  return BREAKPOINT_ORDER.flatMap((breakpoint) => {
    const count = columns[breakpoint];
    return count === undefined ? [] : [columnsClass[breakpoint][count]];
  });
}

export interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Cells to place in the tracks; each child fills one cell in source order. */
  children: ReactNode;
  /**
   * Track count. Pass a number for a fixed grid, or a map such as
   * `{ base: 1, md: 2, lg: 3 }` to change the count at a breakpoint. A map
   * without `base` starts at one column.
   */
  columns?: GridColumns;
  /**
   * Space between all tracks, from the spacing scale: `none` 0, `1` 4px,
   * `2` 8px, `3` 12px, `4` 16px (default), `5` 20px, `6` 24px, `8` 32px.
   */
  gap?: GridGap;
  /** Space between rows when it differs from `gap`, for example a tight grid with airy rows. */
  rowGap?: GridGap;
  /** Space between columns when it differs from `gap`. */
  columnGap?: GridGap;
  /**
   * How cells sit vertically in their row. `stretch` (default) gives every
   * card in a row the height of the tallest one; `start` lets them keep their
   * own height.
   */
  align?: GridAlign;
  /** Extra classes (width, padding, explicit row definitions), merged with `cn()` so they win. */
  className?: string;
}

/**
 * Grid is two-dimensional layout with a token-backed gap and a responsive
 * column count.
 *
 * Use it for card galleries, token swatch walls and any layout where items
 * must line up across rows as well as along them. Grid owns only the tracks
 * and the gaps, never padding or a surface, so wrap it in a Box or a Container
 * when it needs either. For a single row that wraps use Inline; for a single
 * column use Stack.
 *
 * Forwards its ref to the underlying `<div>` and spreads native attributes
 * (`id`, `role`, `aria-*`, `data-*`), so a grid can be a labelled `list` or
 * `region` without a wrapper element.
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { children, columns = 1, gap = "4", rowGap, columnGap, align = "stretch", className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "grid",
        resolveColumns(columns),
        gapClass[gap],
        rowGap !== undefined && rowGapClass[rowGap],
        columnGap !== undefined && columnGapClass[columnGap],
        alignClass[align],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

Grid.displayName = "Grid";
