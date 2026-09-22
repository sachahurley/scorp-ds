/**
 * APP HEADER COMPONENT (top bar)
 *
 * The application's top bar: a `<header>` with three slots, brand on the
 * left, primary navigation in the middle, actions on the right. Below the
 * `md` breakpoint the navigation folds behind a menu toggle (the 1-bit Menu
 * icon) that opens a panel under the bar; the toggle carries
 * `aria-expanded` and `aria-controls` pointing at that panel.
 *
 * STICKY: `sticky` pins the bar to the top of its scroll container on the
 * `z-index.sticky` layer (above content, below dropdowns and modals).
 *
 * NAVIGATION SLOT: pass links (Link, Button href, router links). The slot is
 * wrapped in a `<nav>` named by `navLabel`, once inline for wide screens and
 * once inside the mobile panel (only one is displayed at a time, so only one
 * landmark is exposed).
 *
 * TOKENS USED:
 * - surface.container (bar and panel), border.hairline (bottom edge)
 * - z-index.sticky (sticky layer)
 * - button.ghost.* (menu toggle, via Button), touch.target (toggle size)
 */

import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./Button";
import { TuiIcon } from "./TuiIcon";

export interface AppHeaderProps {
  /** Left slot: logo, product name, or a home link. */
  brand: ReactNode;
  /** Middle slot: primary navigation links. Folds into the mobile menu below `md`. */
  navigation?: ReactNode;
  /** Right slot: actions such as ThemeToggle, search, or an Avatar menu. Always visible. */
  actions?: ReactNode;
  /**
   * Content of the mobile menu panel. Defaults to `navigation`, laid out as
   * a vertical list. Pass this when the phone menu needs different content.
   */
  mobileMenu?: ReactNode;
  /** Pin the bar to the top of its scroll container (z-index.sticky). */
  sticky?: boolean;
  /** Mobile menu open state (controlled). */
  menuOpen?: boolean;
  /** Initial mobile menu state when uncontrolled (default closed). */
  defaultMenuOpen?: boolean;
  /** Fires when the menu toggle opens or closes the mobile panel. */
  onMenuOpenChange?: (open: boolean) => void;
  /** Accessible name of the menu toggle (default "Menu"). */
  menuLabel?: string;
  /** Accessible name of the navigation landmark (default "Main"). */
  navLabel?: string;
  /** Extra classes for the `<header>`. */
  className?: string;
}

/**
 * AppHeader
 *
 * ```tsx
 * <AppHeader
 *   sticky
 *   brand={<Link href="/" variant="quiet">scorp</Link>}
 *   navigation={<><Link href="/docs" variant="quiet">Docs</Link><Link href="/blog" variant="quiet">Blog</Link></>}
 *   actions={<ThemeToggle />}
 * />
 * ```
 */
export function AppHeader({
  brand,
  navigation,
  actions,
  mobileMenu,
  sticky = false,
  menuOpen: menuOpenProp,
  defaultMenuOpen = false,
  onMenuOpenChange,
  menuLabel = "Menu",
  navLabel = "Main",
  className,
}: AppHeaderProps) {
  const panelId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultMenuOpen);
  const open = menuOpenProp ?? uncontrolledOpen;
  const panelContent = mobileMenu ?? navigation;

  const setOpen = (next: boolean) => {
    if (menuOpenProp === undefined) setUncontrolledOpen(next);
    onMenuOpenChange?.(next);
  };

  return (
    <header
      className={cn(
        "w-full border-b border-[var(--border-hairline)] bg-[var(--surface-container)] font-mono text-sm text-[var(--text-primary)]",
        sticky && "sticky top-0 z-[var(--z-index-sticky)]",
        className
      )}
    >
      <div className="flex min-h-control-lg items-center gap-4 px-4 py-1">
        <div className="flex shrink-0 items-center">{brand}</div>
        {navigation && (
          <nav aria-label={navLabel} className="hidden min-w-0 flex-1 md:block">
            <div className="flex flex-wrap items-center gap-4">{navigation}</div>
          </nav>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {actions}
          {panelContent && (
            <Button
              variant="ghost"
              size="lg"
              aria-label={menuLabel}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen(!open)}
              className="min-w-touch md:hidden"
            >
              <TuiIcon name={open ? "X" : "Menu"} size="5" />
            </Button>
          )}
        </div>
      </div>
      {panelContent && open && (
        <div id={panelId} className="border-t border-[var(--border-hairline)] px-4 py-3 md:hidden">
          <nav aria-label={navLabel}>
            <div className="flex flex-col items-start gap-1">{panelContent}</div>
          </nav>
        </div>
      )}
    </header>
  );
}

AppHeader.displayName = "AppHeader";
