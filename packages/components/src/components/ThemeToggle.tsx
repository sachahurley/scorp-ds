/**
 * THEME TOGGLE COMPONENT
 * 
 * A sliding toggle switch to switch between light and dark themes
 * Uses the Switch component with small size for consistency with the design system
 * Includes Moon/Sun icons inside the knob to indicate current theme
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "./Switch";
import { TuiIcon } from "./TuiIcon";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
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

  const isDark = theme === "dark";
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-3">
      {/* Small Switch for Theme Toggle - matches small toggle size exactly */}
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        size="small"
        icon={isDark ? <TuiIcon name="Moon" size="3" className="text-[var(--border-focus)]" /> : <TuiIcon name="Sun" size="3" className="text-[var(--text-secondary)]" />}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      />

      {/* Label Text */}
      <span className="text-sm font-mono text-[var(--text-primary)]">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </div>
  );
}

