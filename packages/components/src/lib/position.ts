/**
 * FLOATING POSITION (internal)
 *
 * Pure placement math for anchored floating panels (Popover, Combobox, and
 * any future menu). No runtime dependency: given the anchor's viewport rect
 * and the panel's size, it returns fixed-position coordinates.
 *
 * Steps:
 * 1. Place the panel on the requested `side` of the anchor, `offset` px away,
 *    aligned to the anchor's start, center, or end on the cross axis.
 * 2. FLIP: if the panel overflows the viewport on its main axis and the
 *    opposite side has more room, move it to the opposite side.
 * 3. SHIFT: clamp the cross axis so the panel stays `padding` px inside the
 *    viewport (it slides along the anchor instead of running off screen).
 *
 * The result also reports the space available on the chosen side, so lists
 * can cap their height instead of overflowing.
 *
 * Not exported from the package barrel: this is plumbing, not a component.
 */

export type FloatingSide = "top" | "bottom" | "left" | "right";
export type FloatingAlign = "start" | "center" | "end";

/** The subset of DOMRect the math needs (viewport coordinates). */
export interface AnchorRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  /** Anchor rect in viewport coordinates (getBoundingClientRect). */
  anchor: AnchorRect;
  /** Measured panel size. */
  floating: { width: number; height: number };
  /** Preferred side (default "bottom"). */
  side?: FloatingSide;
  /** Cross-axis alignment (default "start"). */
  align?: FloatingAlign;
  /** Gap between anchor and panel in px (default 8). */
  offset?: number;
  /** Minimum distance kept from the viewport edge in px (default 8). */
  padding?: number;
  /** Viewport size; defaults to window.innerWidth / innerHeight. */
  viewport?: { width: number; height: number };
  /** Disable the flip step (default true = flip allowed). */
  flip?: boolean;
}

export interface FloatingPosition {
  /** Fixed-position top in px. */
  top: number;
  /** Fixed-position left in px. */
  left: number;
  /** Side actually used after flipping. */
  side: FloatingSide;
  /** Alignment requested (shifting may nudge the panel off it). */
  align: FloatingAlign;
  /** Room on the chosen side's main axis, minus offset and padding. */
  available: number;
}

const OPPOSITE: Record<FloatingSide, FloatingSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const isVertical = (side: FloatingSide) => side === "top" || side === "bottom";

/** Space between the anchor and the viewport edge on each side. */
function spaceOn(side: FloatingSide, a: AnchorRect, vw: number, vh: number, offset: number, padding: number) {
  switch (side) {
    case "top":
      return a.top - offset - padding;
    case "bottom":
      return vh - (a.top + a.height) - offset - padding;
    case "left":
      return a.left - offset - padding;
    case "right":
      return vw - (a.left + a.width) - offset - padding;
  }
}

/** Main-axis coordinate for a side, before shifting. */
function mainAxis(side: FloatingSide, a: AnchorRect, w: number, h: number, offset: number) {
  switch (side) {
    case "top":
      return a.top - offset - h;
    case "bottom":
      return a.top + a.height + offset;
    case "left":
      return a.left - offset - w;
    case "right":
      return a.left + a.width + offset;
  }
}

/** Cross-axis coordinate for an alignment, before shifting. */
function crossAxis(side: FloatingSide, align: FloatingAlign, a: AnchorRect, w: number, h: number) {
  if (isVertical(side)) {
    if (align === "start") return a.left;
    if (align === "end") return a.left + a.width - w;
    return a.left + a.width / 2 - w / 2;
  }
  if (align === "start") return a.top;
  if (align === "end") return a.top + a.height - h;
  return a.top + a.height / 2 - h / 2;
}

const clamp = (value: number, min: number, max: number) => (max < min ? min : Math.min(Math.max(value, min), max));

/**
 * Computes fixed-position coordinates for a floating panel next to an anchor,
 * flipping to the opposite side and shifting along the cross axis so the panel
 * stays inside the viewport.
 */
export function computePosition({
  anchor,
  floating,
  side: preferred = "bottom",
  align = "start",
  offset = 8,
  padding = 8,
  viewport,
  flip = true,
}: ComputePositionOptions): FloatingPosition {
  const vw = viewport?.width ?? (typeof window !== "undefined" ? window.innerWidth : 0);
  const vh = viewport?.height ?? (typeof window !== "undefined" ? window.innerHeight : 0);
  const { width: w, height: h } = floating;

  // FLIP: keep the preferred side when the panel fits there; otherwise take
  // the opposite side if it has more room.
  let side = preferred;
  const need = isVertical(preferred) ? h : w;
  const preferredSpace = spaceOn(preferred, anchor, vw, vh, offset, padding);
  if (flip && preferredSpace < need) {
    const opposite = OPPOSITE[preferred];
    if (spaceOn(opposite, anchor, vw, vh, offset, padding) > preferredSpace) side = opposite;
  }

  const main = mainAxis(side, anchor, w, h, offset);
  const cross = crossAxis(side, align, anchor, w, h);

  // SHIFT: slide along the cross axis to stay `padding` inside the viewport.
  const top = isVertical(side) ? main : clamp(cross, padding, vh - h - padding);
  const left = isVertical(side) ? clamp(cross, padding, vw - w - padding) : main;

  return {
    top,
    left,
    side,
    align,
    available: Math.max(0, spaceOn(side, anchor, vw, vh, offset, padding)),
  };
}
