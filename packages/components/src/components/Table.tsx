/**
 * TABLE — semantic data grid primitives with token-backed chrome.
 * Compose `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`.
 *
 * TOKENS: rules are drawn at `--border-width-hairline` (1px), the system's
 * only rule weight, replacing the ad hoc 0.5px rules that browsers snapped
 * unevenly. Column headers are `font-bold` (`--font-weight-bold`, 700);
 * the weight scale is 400 / 500 / 700, so `font-semibold` (600) was off-token.
 */

import { createContext, forwardRef, useContext, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type TableHTMLAttributes } from "react";
import { cn } from "../lib/utils";

/** Row padding density. `compact` is the default data-grid rhythm; the other
 *  two step up the cell padding on the 4px grid for lower-density reading. */
export type TableDensity = "compact" | "comfortable" | "spacious";

/** Cell padding per density (shared by TableHead + TableCell via context). */
const DENSITY_CELL_PADDING: Record<TableDensity, string> = {
  compact: "px-3 py-2",      // 12 / 8
  comfortable: "px-4 py-3",  // 16 / 12
  spacious: "px-5 py-4",     // 20 / 16
};

const TableDensityContext = createContext<TableDensity>("compact");

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  /** Zebra striping for body rows (even rows use `surface-subtle`). */
  striped?: boolean;
  /** Full outer border around the table. */
  bordered?: boolean;
  /** Row padding rhythm (default `compact`); cells read it via context. */
  density?: TableDensity;
};

/**
 * Root `<table>`. Wrap in a scroll container in product code when needed (`overflow-x-auto`).
 * `bordered` frames the table on the large plate via the ring recipe (outer layer =
 * stroke clipped to the plate, inner layer = fill clipped 1px inset) — clip-path
 * slices real borders, so a border property cannot draw the frame.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, striped, bordered, density = "compact", children, ...props },
  ref
) {
  const table = (
    <TableDensityContext.Provider value={density}>
      <table
        ref={ref}
        className={cn(
          "w-full border-collapse font-mono text-sm text-[var(--text-primary)]",
          striped && "[&_tbody_tr:nth-child(even)]:bg-[var(--surface-subtle)]",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </TableDensityContext.Provider>
  );

  if (!bordered) return table;

  return (
    <div className="plate-round-lg p-px bg-[var(--surface-container-stroke)]">
      <div className="plate-round-lg bg-[var(--surface-card)]">{table}</div>
    </div>
  );
});

Table.displayName = "Table";

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * `<thead>` — sticky header styling is left to the product (optional `className`).
 */
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...props },
  ref
) {
  return (
    <thead
      ref={ref}
      className={cn(
        "border-b-[length:var(--border-width-hairline)] border-solid border-[var(--surface-container-stroke)] bg-[var(--surface-subtle)]",
        className
      )}
      {...props}
    />
  );
});

TableHeader.displayName = "TableHeader";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/** `<tbody>` */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref
) {
  return <tbody ref={ref} className={cn(className)} {...props} />;
});

TableBody.displayName = "TableBody";

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

/** `<tfoot>` — often used for summary rows */
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { className, ...props },
  ref
) {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t-[length:var(--border-width-hairline)] border-solid border-[var(--surface-container-stroke)] bg-[var(--surface-subtle)]",
        className
      )}
      {...props}
    />
  );
});

TableFooter.displayName = "TableFooter";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

/** `<tr>` */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...props },
  ref
) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b-[length:var(--border-width-hairline)] border-solid border-[var(--surface-container-stroke)] transition-colors [transition-duration:var(--duration-normal)]",
        className
      )}
      {...props}
    />
  );
});

TableRow.displayName = "TableRow";

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

/** `<th>` — defaults `scope="col"` for column headers */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, scope = "col", ...props },
  ref
) {
  const density = useContext(TableDensityContext);
  return (
    <th
      ref={ref}
      scope={scope}
      className={cn(
        DENSITY_CELL_PADDING[density],
        "text-left font-bold text-[var(--text-primary)]",
        className
      )}
      {...props}
    />
  );
});

TableHead.displayName = "TableHead";

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

/** `<td>` */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref
) {
  const density = useContext(TableDensityContext);
  return (
    <td
      ref={ref}
      className={cn(
        DENSITY_CELL_PADDING[density],
        "align-middle text-secondary-800 dark:text-secondary-200",
        className
      )}
      {...props}
    />
  );
});

TableCell.displayName = "TableCell";
