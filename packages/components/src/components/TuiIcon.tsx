import React from "react";
import { cn } from "../../lib/utils";

/**
 * TuiIcon -- Terminal UI Icon component (Tier 2)
 *
 * Replaces Lucide SVG icons with Unicode characters for a true
 * terminal aesthetic. Each icon name maps to a single Unicode glyph
 * rendered in a monospace font at the same sizes Lucide used
 * (w-4 h-4, w-5 h-5, w-6 h-6).
 */

/* ─── Unicode icon mapping (all 41 Lucide icons used in this project) ─── */
const ICON_MAP: Record<string, string> = {
  AlertCircle: "\u26A0",   // ⚠ warning sign
  AlertTriangle: "\u26A0", // ⚠ warning sign
  Archive: "\u2707",       // ✇ tape drive
  ArrowLeft: "\u2190",     // ← left arrow
  ArrowRight: "\u2192",    // → right arrow
  Bell: "\u266A",          // ♪ notification bell
  Check: "\u2713",         // ✓ check mark
  CheckCircle: "\u2713",   // ✓ check mark
  ChevronDown: "\u25BC",   // ▼ down triangle
  ChevronRight: "\u25B6",  // ▶ right triangle
  Copy: "\u2398",          // ⎘ copy
  Download: "\u2913",      // ⤓ downwards arrow to bar
  Edit: "\u270E",          // ✎ pencil
  Eye: "\u25C9",           // ◉ fisheye
  EyeOff: "\u25CC",        // ◌ dotted circle
  FileText: "\u2637",      // ☷ file
  Globe: "\u2295",         // ⊕ circled plus
  HelpCircle: "?",         // ? question mark
  Info: "i",               // i info letter
  Lock: "\u2616",          // ☖ lock
  LogOut: "\u2192",        // → right arrow (exit)
  Mail: "\u2709",          // ✉ envelope
  Moon: "\u263E",          // ☾ last quarter moon
  MoreVertical: "\u22EE",  // ⋮ vertical ellipsis
  Music2: "\u266B",        // ♫ beamed eighth notes
  Plus: "+",               // + plus sign
  Save: "\u2913",          // ⤓ downwards arrow to bar
  Search: "\u2315",        // ⌕ telephone recorder / search
  Send: "\u27A4",          // ➤ arrow
  Settings: "\u2699",      // ⚙ gear
  Share2: "\u2197",        // ↗ arrow upper right
  Shield: "\u2616",        // ☖ shield
  Star: "\u2605",          // ★ black star
  Sun: "\u2600",           // ☀ sun
  Tag: "\u2302",           // ⌂ house / label
  Trash2: "\u2717",        // ✗ ballot X
  Upload: "\u2912",        // ⤒ upwards arrow to bar
  User: "@",               // @ at-sign (person)
  Volume2: "\u266B",       // ♫ music note
  VolumeX: "\u2716",       // ✖ heavy X
  X: "\u2717",             // ✗ ballot X
} as const;

/* ─── Size presets matching Lucide conventions ───
 * Font sizes match or exceed the container so Unicode glyphs
 * appear at a similar visual weight to the SVG icons they replaced.
 *
 *   Container   Font size
 *   w-3  12px → 14px
 *   w-4  16px → 20px
 *   w-5  20px → 24px
 *   w-6  24px → 28px
 *   w-8  32px → 36px
 */
const SIZE_MAP: Record<string, string> = {
  "3": "w-3 h-3 text-[14px]",
  "4": "w-4 h-4 text-[20px]",
  "5": "w-5 h-5 text-[24px]",
  "6": "w-6 h-6 text-[28px]",
  "8": "w-8 h-8 text-[36px]",
};

export interface TuiIconProps {
  /** Icon name -- must match a key in ICON_MAP (same as the Lucide component name) */
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
  const glyph = ICON_MAP[name] ?? "?";
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
      {glyph}
    </span>
  );
};

export default TuiIcon;
