import { BOX_CHARS, type BoxStyle } from './box.js';
import { fitToWidth, padLine } from './text.js';

export interface FrameBoxOptions {
  /** Body lines (no embedded newlines — split before calling). */
  lines: string[];
  /** Optional title row inside the frame (below the top border). */
  title?: string;
  /**
   * Total outer width in monospace columns (includes side borders).
   * If omitted, width is derived from the longest line + title + 2.
   */
  width?: number;
  /** Border drawing style. Default `light`. */
  style?: BoxStyle;
  /** Suffix when truncating overflow (default Unicode ellipsis U+2026). */
  truncateMarker?: string;
}

function horizontalRule(b: (typeof BOX_CHARS)['light'], innerWidth: number): string {
  return b.tl + b.h.repeat(innerWidth) + b.tr;
}

function horizontalSep(b: (typeof BOX_CHARS)['light'], innerWidth: number): string {
  return b.teeL + b.h.repeat(innerWidth) + b.teeR;
}

/**
 * Builds a bordered monospace frame as individual lines (no trailing newline on last line).
 */
export function frameBoxLines(options: FrameBoxOptions): string[] {
  const style: BoxStyle = options.style ?? 'light';
  const b = BOX_CHARS[style];
  const ellipsis = options.truncateMarker ?? '\u2026';
  const rawLines = options.lines.map((l) => l.replace(/\r\n/g, '\n').split('\n')).flat();
  const body = rawLines.length === 0 ? [''] : rawLines;
  const titleRaw = options.title?.trim() ?? '';

  const maxBodyLen = Math.max(0, ...body.map((l) => l.length));
  const titleLen = titleRaw.length;
  const contentMax = Math.max(maxBodyLen, titleLen, 1);

  const minOuter = contentMax + 2;
  const outer =
    options.width !== undefined ? Math.max(options.width, 4) : Math.max(minOuter, 4);
  const innerW = outer - 2;

  const top = horizontalRule(b, innerW);
  const bottom = b.bl + b.h.repeat(innerW) + b.br;

  const out: string[] = [top];

  if (titleRaw) {
    const t = padLine(fitToWidth(titleRaw, innerW, ellipsis), innerW);
    out.push(b.v + t + b.v);
    out.push(horizontalSep(b, innerW));
  }

  for (const line of body) {
    const inner = padLine(fitToWidth(line, innerW, ellipsis), innerW);
    out.push(b.v + inner + b.v);
  }

  out.push(bottom);
  return out;
}

/** Same as {@link frameBoxLines} joined with `\\n`. */
export function frameBox(options: FrameBoxOptions): string {
  return frameBoxLines(options).join('\n');
}
