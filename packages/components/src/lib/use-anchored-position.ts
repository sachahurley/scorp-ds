/**
 * ANCHORED POSITION HOOK (internal)
 *
 * Wires {@link computePosition} to the DOM: measures the anchor and the
 * floating panel while `open`, and recomputes on scroll (any scroll
 * container, via a capturing listener), window resize, and size changes of
 * either element (ResizeObserver when available).
 *
 * The panel is expected to render with `position: fixed` and apply the
 * returned `top` / `left`. Until the first measurement lands, `position` is
 * null; render the panel hidden (visibility) so it can be measured without
 * flashing at 0,0.
 *
 * Not exported from the package barrel.
 */

import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { computePosition, type FloatingAlign, type FloatingPosition, type FloatingSide } from "./position";

// useLayoutEffect warns during SSR; fall back to useEffect off the browser.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface AnchoredPosition extends FloatingPosition {
  /** Anchor width in px, for panels that match their trigger's width. */
  anchorWidth: number;
}

export function useAnchoredPosition({
  open,
  anchorRef,
  floatingRef,
  side = "bottom",
  align = "start",
  offset = 8,
  padding = 8,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  side?: FloatingSide;
  align?: FloatingAlign;
  offset?: number;
  padding?: number;
}) {
  const [position, setPosition] = useState<AnchoredPosition | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const a = anchor.getBoundingClientRect();
    const f = floating.getBoundingClientRect();
    const next = computePosition({
      anchor: { top: a.top, left: a.left, width: a.width, height: a.height },
      floating: { width: f.width, height: f.height },
      side,
      align,
      offset,
      padding,
    });
    setPosition((prev) =>
      prev &&
      prev.top === next.top &&
      prev.left === next.left &&
      prev.side === next.side &&
      prev.available === next.available &&
      prev.anchorWidth === a.width
        ? prev
        : { ...next, anchorWidth: a.width }
    );
  }, [anchorRef, floatingRef, side, align, offset, padding]);

  useIsoLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    update();

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => update());
      if (anchorRef.current) observer.observe(anchorRef.current);
      if (floatingRef.current) observer.observe(floatingRef.current);
    }

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [open, update]);

  return { position, update };
}
