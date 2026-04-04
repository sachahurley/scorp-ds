/**
 * TABLE — semantic data grid primitives with token-backed chrome.
 * Compose `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`.
 */

import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type TableHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  /** Zebra striping for body rows (even rows use `surface-subtle`). */
  striped?: boolean;
  /** Full outer border around the table. */
  bordered?: boolean;
};

/**
 * Root `<table>`. Wrap in a scroll container in product code when needed (`overflow-x-auto`).
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, striped, bordered, children, ...props },
  ref
) {
  return (
    <table
      ref={ref}
      className={cn(
        "w-full border-collapse font-mono text-sm text-[var(--text-primary)]",
        bordered &&
          "border-[0.5px] border-solid border-[var(--surface-container-stroke)]",
        striped && "[&_tbody_tr:nth-child(even)]:bg-[var(--surface-subtle)]",
        className
      )}
      {...props}
    >
      {children}
    </table>
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
        "border-b-[0.5px] border-solid border-[var(--surface-container-stroke)] bg-[var(--surface-subtle)]",
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
        "border-t-[0.5px] border-solid border-[var(--surface-container-stroke)] bg-[var(--surface-subtle)]",
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
        "border-b-[0.5px] border-solid border-[var(--surface-container-stroke)] transition-colors [transition-duration:var(--duration-normal)]",
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
  return (
    <th
      ref={ref}
      scope={scope}
      className={cn(
        "px-3 py-2 text-left font-semibold text-[var(--text-primary)]",
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
  return (
    <td
      ref={ref}
      className={cn(
        "px-3 py-2 align-middle text-secondary-800 dark:text-secondary-200",
        className
      )}
      {...props}
    />
  );
});

TableCell.displayName = "TableCell";
