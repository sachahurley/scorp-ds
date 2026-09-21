import React from "react";
import { cn } from "../lib/utils";

/**
 * TuiIcon -- Terminal UI Icon component (Tier 2)
 *
 * Every icon is drawn as inline SVG on a 16px grid in the plate language:
 * 2px strokes, square caps, miter joins, filled forms only where filled is
 * the convention (media controls, star). Drawing instead of typing a glyph
 * makes icons identical on every OS: Fragment Mono lacks nearly all symbol
 * glyphs, so typed icons fell back to per-platform system fonts.
 *
 * TUI_ICON_GLYPHS keeps each icon's Unicode form for plain-text contexts
 * (tui-art frames, terminal-style strings); those render consistently via
 * the Scorp Symbols face in --font-family-mono.
 */

/**
 * Unicode text form of each icon name (Lucide-compatible keys), for plain-text
 * contexts. TuiIcon itself renders the drawings in {@link TUI_ICON_DRAWINGS}.
 */
export const TUI_ICON_GLYPHS = {
  AlertCircle: "\u26A0", // ⚠ warning sign
  AlertTriangle: "\u26A0", // ⚠ warning sign
  Archive: "\u2707", // ✇ tape drive
  ArrowLeft: "\u2190", // ← left arrow
  ArrowRight: "\u2192", // → right arrow
  Bell: "\u266A", // ♪ notification bell
  Check: "\u2713", // ✓ check mark
  CheckCircle: "\u2713", // ✓ check mark
  ChevronDown: "\u25BC", // ▼ down triangle
  ChevronRight: "\u25B6", // ▶ right triangle
  ChevronUp: "\u25B2", // ▲ up triangle
  Copy: "\u2398", // ⎘ copy
  Download: "\u2913", // ⤓ downwards arrow to bar
  Edit: "\u270E", // ✎ pencil
  ExternalLink: "\u2197", // ↗ arrow upper right (leaves this context)
  Eye: "\u25C9", // ◉ fisheye
  EyeOff: "\u25CC", // ◌ dotted circle
  FileText: "\u2637", // ☷ file
  Globe: "\u2295", // ⊕ circled plus
  HelpCircle: "?", // ? question mark
  Info: "i", // i info letter
  Lock: "\u2616", // ☖ lock
  LogOut: "\u2192", // → right arrow (exit)
  Mail: "\u2709", // ✉ envelope
  Moon: "\u263E", // ☾ last quarter moon
  MoreVertical: "\u22EE", // ⋮ vertical ellipsis
  Music2: "\u266B", // ♫ beamed eighth notes
  Pause: "\u23F8", // pause bars (media pause)
  Play: "\u25B6", // right triangle (media play)
  Plus: "+", // + plus sign
  Repeat: "\u21BB", // clockwise open circle arrow (repeat)
  Save: "\u2913", // ⤓ downwards arrow to bar
  Search: "\u2315", // ⌕ telephone recorder / search
  Send: "\u27A4", // ➤ arrow
  Settings: "\u2699", // ⚙ gear
  Share2: "\u2197", // ↗ arrow upper right
  Shield: "\u2616", // ☖ shield
  Shuffle: "\u21C4", // rightwards over leftwards arrows (shuffle)
  SkipBack: "\u23EE", // previous track (bar + left triangle)
  SkipForward: "\u23ED", // next track (right triangle + bar)
  Star: "\u2605", // ★ black star
  Sun: "\u2600", // ☀ sun
  Tag: "\u2302", // ⌂ house / label
  Trash2: "\u2717", // ✗ ballot X
  Upload: "\u2912", // ⤒ upwards arrow to bar
  User: "@", // @ at-sign (person)
  Volume2: "\u266B", // ♫ music note
  VolumeX: "\u2716", // ✖ heavy X
  X: "\u2715", // ✕ multiplication X
} as const satisfies Record<string, string>;

/** Keys of {@link TUI_ICON_GLYPHS} — use for typed catalogs or selects. */
export type TuiIconName = keyof typeof TUI_ICON_GLYPHS;

/** Path data for a circle, so icons can mix arcs into single path strings. */
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

/** One icon: `stroke` paths draw at 2px in currentColor, `fill` paths fill solid. */
interface IconDrawing {
  stroke?: string;
  fill?: string;
}

/**
 * The drawn icon set, 16x16 viewBox. Keyed by every {@link TuiIconName}, so
 * adding a glyph name without a drawing is a type error.
 */
export const TUI_ICON_DRAWINGS: Record<TuiIconName, IconDrawing> = {
  AlertCircle: { stroke: `${circle(8, 8, 6)}M8 5V8.5`, fill: "M7 10.5h2v2H7Z" },
  AlertTriangle: { stroke: "M8 2.5L14 13.5H2Z M8 6.5V9", fill: "M7 10.5h2v1.8H7Z" },
  Archive: { stroke: "M2 3H14V6H2Z M3 6V13H13V6 M6.5 9H9.5" },
  ArrowLeft: { stroke: "M13 8H3.5M7 4L3 8L7 12" },
  ArrowRight: { stroke: "M3 8H12.5M9 4L13 8L9 12" },
  Bell: { stroke: "M3 11.5H13 M4.5 11.5V7.5a3.5 3.5 0 0 1 7 0V11.5 M7 14H9" },
  Check: { stroke: "M3 8.5L6.5 12L13 4.5" },
  CheckCircle: { stroke: `${circle(8, 8, 6)}M5.3 8.2L7.2 10.1L10.8 6.2` },
  ChevronDown: { stroke: "M3.5 6L8 10.5L12.5 6" },
  ChevronRight: { stroke: "M6 3.5L10.5 8L6 12.5" },
  ChevronUp: { stroke: "M3.5 10L8 5.5L12.5 10" },
  Copy: { stroke: "M5 5V2H14V11H11 M2 5H11V14H2Z" },
  Download: { stroke: "M8 2V9.5M4.5 6L8 9.5L11.5 6 M3 13.5H13" },
  Edit: { stroke: "M10.5 2.5L13.5 5.5L5.5 13.5H2.5V10.5Z M9 4L12 7" },
  ExternalLink: { stroke: "M7 3H3V13H13V9 M9.5 3H13V6.5 M12.5 3.5L7.5 8.5" },
  Eye: {
    stroke: "M1.5 8C3.3 4.8 5.5 3.5 8 3.5S12.7 4.8 14.5 8C12.7 11.2 10.5 12.5 8 12.5S3.3 11.2 1.5 8Z",
    fill: circle(8, 8, 2),
  },
  EyeOff: {
    stroke: "M1.5 8C3.3 4.8 5.5 3.5 8 3.5S12.7 4.8 14.5 8C12.7 11.2 10.5 12.5 8 12.5S3.3 11.2 1.5 8Z M2.5 13.5L13.5 2.5",
  },
  FileText: { stroke: "M3 2H10L13 5V14H3Z M6 8H10M6 11H10" },
  Globe: { stroke: `${circle(8, 8, 6)}M2 8H14 M8 2C5.8 4.5 5.8 11.5 8 14C10.2 11.5 10.2 4.5 8 2Z` },
  HelpCircle: {
    stroke: `${circle(8, 8, 6)}M6.2 6.3C6.2 5.2 7 4.6 8 4.6S9.8 5.2 9.8 6.2C9.8 7.5 8 7.6 8 9`,
    fill: "M7 10.5h2v1.8H7Z",
  },
  Info: { stroke: `${circle(8, 8, 6)}M8 7.5V11.5`, fill: "M7 4.2h2v1.8H7Z" },
  Lock: { stroke: "M5 7V5a3 3 0 0 1 6 0V7 M3 7H13V14H3Z" },
  LogOut: { stroke: "M6 3H3V13H6 M7 8H13.5M10.5 5L13.5 8L10.5 11" },
  Mail: { stroke: "M2 3.5H14V12.5H2Z M2.5 4L8 8.5L13.5 4" },
  Moon: { stroke: "M8 2a4 4 0 0 0 6 6a6 6 0 1 1-6-6Z" },
  MoreVertical: { fill: "M7 2h2v2H7Z M7 7h2v2H7Z M7 12h2v2H7Z" },
  Music2: { stroke: "M6 12V3.5L13 2V10.5", fill: `${circle(4.5, 12, 1.8)}${circle(11.5, 10.5, 1.8)}` },
  Pause: { fill: "M4 3h3v10H4Z M9 3h3v10H9Z" },
  Play: { fill: "M4.5 2.5L13 8L4.5 13.5Z" },
  Plus: { stroke: "M8 3V13M3 8H13" },
  Repeat: { stroke: "M2.5 9V5H11 M9 3L11 5L9 7 M13.5 7V11H5 M7 9L5 11L7 13" },
  Save: { stroke: "M2 2H11L14 5V14H2Z M5 2V5.5H10V2 M5 14V9.5H11V14" },
  Search: { stroke: `${circle(7, 7, 4.5)}M10.5 10.5L13.5 13.5` },
  Send: { stroke: "M14 2L2 7L7 9L9 14Z M14 2L7 9" },
  Settings: {
    stroke: `${circle(8, 8, 3.5)}M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.4 3.4L4.5 4.5M11.5 11.5L12.6 12.6M12.6 3.4L11.5 4.5M3.4 12.6L4.5 11.5`,
    fill: circle(8, 8, 1.2),
  },
  Share2: {
    stroke: "M5.5 7L10.5 4.5 M5.5 9L10.5 11.5",
    fill: `${circle(12, 3.8, 2)}${circle(4, 8, 2)}${circle(12, 12.2, 2)}`,
  },
  Shield: { stroke: "M8 1.8L13.5 3.8V8C13.5 11 11.3 13.2 8 14.3C4.7 13.2 2.5 11 2.5 8V3.8Z" },
  Shuffle: { stroke: "M2 4.5H4.5L9.5 11.5H13 M2 11.5H4.5L9.5 4.5H13 M11 2.5L13 4.5L11 6.5 M11 9.5L13 11.5L11 13.5" },
  SkipBack: { fill: "M3 3h2v10H3Z M13 3V13L6 8Z" },
  SkipForward: { fill: "M3 3V13L10 8Z M11 3h2v10h-2Z" },
  Star: { fill: "M8 1.5L9.9 5.8L14.5 6.2L11 9.3L12 13.9L8 11.5L4 13.9L5 9.3L1.5 6.2L6.1 5.8Z" },
  Sun: {
    stroke: "M8 1.5V2.5M8 13.5V14.5M1.5 8H2.5M13.5 8H14.5M3.4 3.4L4.1 4.1M11.9 11.9L12.6 12.6M12.6 3.4L11.9 4.1M3.4 12.6L4.1 11.9",
    fill: circle(8, 8, 3.2),
  },
  Tag: { stroke: "M2 2H8L14 8L8 14L2 8Z", fill: "M4.5 4.5h2v2h-2Z" },
  Trash2: { stroke: "M2 4H14 M6 4V2H10V4 M3.5 4L4.5 14H11.5L12.5 4 M6.5 7V11 M9.5 7V11" },
  Upload: { stroke: "M8 11V3.5M4.5 7L8 3.5L11.5 7 M3 13.5H13" },
  User: { stroke: `${circle(8, 5, 2.8)}M2.5 14.5C2.5 11.2 4.8 9.5 8 9.5S13.5 11.2 13.5 14.5` },
  Volume2: { stroke: "M2 6H5L9 3V13L5 10H2Z M11.5 5.5A3.5 3.5 0 0 1 11.5 10.5 M13.2 3.5A6.3 6.3 0 0 1 13.2 12.5" },
  VolumeX: { stroke: "M1.5 6H4L8 3V13L4 10H1.5Z M10.5 6L14 10M14 6L10.5 10" },
  X: { stroke: "M3 3L13 13M13 3L3 13" },
};

/* Size presets: the SVG fills a square box matching Lucide's w-3..w-8.
 * The text size only applies to the "?" shown for an unknown name. */
const SIZE_MAP: Record<string, string> = {
  "3": "w-3 h-3 text-xs",
  "4": "w-4 h-4 text-sm",
  "5": "w-5 h-5 text-base",
  "6": "w-6 h-6 text-lg",
  "8": "w-8 h-8 text-2xl",
};

export interface TuiIconProps {
  /** Icon name -- must match a key in {@link TUI_ICON_GLYPHS} (same as the Lucide component name). */
  name: string;
  /** Tailwind size number: "3" | "4" | "5" | "6" | "8". Defaults to "4". */
  size?: string;
  /** Additional CSS classes (color, margin, etc.) */
  className?: string;
}

export const TuiIcon: React.FC<TuiIconProps> = ({
  name,
  size = "4",
  className,
}) => {
  const drawing = TUI_ICON_DRAWINGS[name as TuiIconName];
  const sizeClasses = SIZE_MAP[size] ?? SIZE_MAP["4"];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono leading-none select-none",
        sizeClasses,
        className
      )}
      aria-hidden="true"
    >
      {drawing ? (
        <svg
          viewBox="0 0 16 16"
          className="h-full w-full"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {drawing.stroke && <path d={drawing.stroke} />}
          {drawing.fill && <path d={drawing.fill} fill="currentColor" stroke="none" />}
        </svg>
      ) : (
        "?"
      )}
    </span>
  );
};

export default TuiIcon;
