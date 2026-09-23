/**
 * THEME TOGGLE COMPONENT
 * 
 * A sliding toggle switch to switch between light and dark themes
 * Uses the Switch component with small size for consistency with the design system
 * Includes Moon/Sun icons inside the knob to indicate current theme
 *
 * It reads `resolvedTheme`, not `theme`: ThemeProvider runs with
 * `enableSystem`, so `theme` can be "system" while the page actually renders
 * dark. The knob, the visible label and the aria-label all derive from the
 * same resolved value, so what the toggle says is always what is on screen,
 * and pressing it pins the opposite concrete theme.
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "./Switch";
import { TuiIcon } from "./TuiIcon";

/**
 * A switch that flips the app between the light and dark themes.
 *
 * Drop it into a header, a settings row or a toolbar. It needs a `ThemeProvider`
 * above it in the tree, and it renders a neutral placeholder until mounted so the
 * markup matches on hydration.
 *
 * It reads `resolvedTheme`, not `theme`: the provider runs with `enableSystem`, so
 * `theme` can be "system" while the page actually renders dark. The knob, the
 * visible label and the accessible name all derive from that one resolved value,
 * so what the toggle says is always what is on screen, and pressing it pins the
 * opposite concrete theme.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-11 h-6 rounded-none bg-[var(--field-border)]" />
        <span className="text-sm font-mono text-[var(--text-secondary)]">Theme</span>
      </div>
    );
  }

  // resolvedTheme is the theme actually applied to <html>, so "system" on a
  // dark OS resolves to "dark" here and the toggle agrees with the page.
  const isDark = resolvedTheme === "dark";
  // One source of truth for the knob, the label and the aria-label.
  const currentLabel = isDark ? "Dark" : "Light";
  const nextLabel = isDark ? "light" : "dark";
  const toggleTheme = () => {
    setTheme(nextLabel);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Small Switch for Theme Toggle - matches small toggle size exactly */}
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        size="sm"
        icon={isDark ? <TuiIcon name="Moon" size="3" className="text-[var(--border-focus)]" /> : <TuiIcon name="Sun" size="3" className="text-[var(--text-secondary)]" />}
        aria-label={`Switch to ${nextLabel} theme`}
      />

      {/* Label Text: names the current theme, matching the knob glyph */}
      <span className="text-sm font-mono text-[var(--text-primary)]">
        {currentLabel}
      </span>
    </div>
  );
}

