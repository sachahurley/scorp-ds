/**
 * Monospace line fitting: uses JavaScript string length (code units), not terminal display width.
 * Sufficient for Latin, box drawing, and most symbols used in Scorp DS TUI chrome.
 */

export function fitToWidth(line: string, maxLen: number, ellipsis = '\u2026'): string {
  if (maxLen <= 0) return '';
  if (line.length <= maxLen) return line;
  if (maxLen <= ellipsis.length) return ellipsis.slice(0, maxLen);
  return line.slice(0, maxLen - ellipsis.length) + ellipsis;
}

export function padLine(line: string, width: number): string {
  if (line.length >= width) return line;
  return line + ' '.repeat(width - line.length);
}
