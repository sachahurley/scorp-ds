/**
 * Focus trap for modal surfaces (Modal, BottomSheet).
 *
 * A dialog with `aria-modal="true"` promises that nothing behind it is
 * reachable, so Tab and Shift+Tab have to cycle inside the panel. This hook
 * implements that promise without a runtime dependency: it listens for Tab on
 * the capture phase while the trap is active and, when focus would step past
 * either end of the container, sends it to the other end instead.
 *
 * It deliberately does NOT move focus on mount or restore it on unmount, so it
 * composes with the focus-on-open / focus-return-on-close effects the dialogs
 * already run. Pass `active: false` for non-modal surfaces (Modal's `docked`
 * variant) so they keep letting focus flow to the page behind them.
 */

import { useEffect, type RefObject } from "react";

/**
 * Elements that can receive keyboard focus via Tab. `[tabindex="-1"]` is
 * excluded on purpose: the dialog container itself carries it, so it is a
 * programmatic focus target but never a Tab stop.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "summary",
  "[contenteditable='true']",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Tab stops inside `container`, in DOM order, skipping hidden subtrees. */
export function getTabbableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("hidden") && el.closest("[hidden]") == null && el.getAttribute("aria-hidden") !== "true"
  );
}

/**
 * Cycles Tab and Shift+Tab within `containerRef` while `active` is true.
 *
 * @param containerRef - The dialog panel; it should carry `tabIndex={-1}` so it
 *   can hold focus before the user Tabs anywhere.
 * @param active - Whether the trap runs. False for non-modal surfaces.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.defaultPrevented) return;
      const container = containerRef.current;
      if (!container) return;

      const tabbable = getTabbableElements(container);
      const active_ = document.activeElement as HTMLElement | null;

      // Nothing to Tab to: park focus on the panel so it cannot escape.
      if (tabbable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];

      // Focus drifted outside (a stray programmatic focus, or the browser
      // handed it to the address bar and back): pull it back to the edge the
      // user was heading for.
      if (!active_ || !container.contains(active_)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      // The container itself holds focus right after open. Tab falls through to
      // the first child naturally; Shift+Tab has to wrap to the last one.
      if (event.shiftKey && (active_ === first || active_ === container)) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active_ === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [containerRef, active]);
}
