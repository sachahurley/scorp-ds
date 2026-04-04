import { BOX_CHARS, type BoxStyle } from './box.js';
import { fitToWidth, padLine } from './text.js';

export interface FormatTableRowOptions {
  style?: BoxStyle;
  /** When true, omit leading/trailing space inside each cell (denser `|x|y|` look for ascii). */
  dense?: boolean;
}

/**
 * One monospace table row: verticals between padded cells.
 * Column widths are **content** widths (between the border characters).
 */
export function formatTableRow(
  cells: string[],
  columnWidths: number[],
  options?: FormatTableRowOptions
): string {
  const style: BoxStyle = options?.style ?? 'light';
  const dense = options?.dense ?? false;
  const b = BOX_CHARS[style];
  const ellipsis = '\u2026';

  if (cells.length === 0) {
    return b.v + b.v;
  }

  const widths =
    columnWidths.length >= cells.length
      ? columnWidths
      : [...columnWidths, ...Array(cells.length - columnWidths.length).fill(1)];

  const padded = cells.map((cell, i) => {
    const w = Math.max(1, widths[i] ?? 1);
    return padLine(fitToWidth(cell, w, ellipsis), w);
  });

  const gap = dense ? '' : ' ';
  const inner = padded.join(gap + b.v + gap);
  const line = dense ? b.v + inner + b.v : b.v + gap + inner + gap + b.v;
  return line;
}
