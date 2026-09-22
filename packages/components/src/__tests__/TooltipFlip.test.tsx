import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "../components/Tooltip";

type Box = { top: number; left: number; width: number; height: number };

const rect = ({ top, left, width, height }: Box) =>
  ({ top, left, width, height, bottom: top + height, right: left + width, x: left, y: top, toJSON: () => ({}) }) as DOMRect;

/** Trigger (the tooltip wrapper) at `trigger`; the balloon is 120 x 40. */
function mockLayout(trigger: Box) {
  return vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (this.getAttribute("role") === "tooltip") return rect({ top: 0, left: 0, width: 120, height: 40 });
    return rect(trigger);
  });
}

// jsdom viewport: 1024 x 768
const openTooltip = (props: Partial<Parameters<typeof Tooltip>[0]> = {}) => {
  render(
    <Tooltip content="Hint" {...props}>
      <button type="button">Trigger</button>
    </Tooltip>
  );
  fireEvent.focus(screen.getByRole("button"));
  act(() => void vi.advanceTimersByTime(300));
  return screen.getByRole("tooltip");
};

describe("Tooltip viewport flip", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("stays on the preferred side when it fits", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    expect(openTooltip({ position: "top" })).toHaveAttribute("data-placement", "top");
  });

  it("flips top to bottom when the trigger hugs the top edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 10, left: 400, width: 80, height: 32 });
    const tip = openTooltip({ position: "top" });
    expect(tip).toHaveAttribute("data-placement", "bottom");
    expect(tip.className).toContain("top-full");
  });

  it("flips right to left near the right edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 960, width: 50, height: 32 });
    expect(openTooltip({ position: "right" })).toHaveAttribute("data-placement", "left");
  });

  it("clamps a top tooltip horizontally near the left edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 0, width: 40, height: 32 });
    const tip = openTooltip({ position: "top" });
    // Centered left edge would be 20 - 60 = -40; the edge margin is 8px
    expect(tip).toHaveAttribute("data-placement", "top");
    expect(tip.style.marginLeft).toBe("48px");
  });

  it("keeps a11y wiring intact after flipping", () => {
    vi.useFakeTimers();
    mockLayout({ top: 10, left: 400, width: 80, height: 32 });
    openTooltip({ position: "top" });
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Hint");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
