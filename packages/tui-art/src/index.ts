/**
 * @scorp-ds/tui-art
 *
 * String-only helpers for TUI-style frames and table rows (monospace).
 * No React — safe for CLI, Storybook demos, and server logs.
 */

export { BOX_CHARS, type BoxChars, type BoxStyle } from './box.js';
export { frameBox, frameBoxLines, type FrameBoxOptions } from './frame.js';
export { formatTableRow, type FormatTableRowOptions } from './row.js';
export { fitToWidth, padLine } from './text.js';
export { TUI_ART_UNICODE_BLOCKS } from './ranges.js';
