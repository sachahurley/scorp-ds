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
    expect(openTooltip({ side: "top" })).toHaveAttribute("data-placement", "top");
  });

  it("flips top to bottom when the trigger hugs the top edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 10, left: 400, width: 80, height: 32 });
    const tip = openTooltip({ side: "top" });
    expect(tip).toHaveAttribute("data-placement", "bottom");
    expect(tip.className).toContain("top-full");
  });

  it("flips right to left near the right edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 960, width: 50, height: 32 });
    expect(openTooltip({ side: "right" })).toHaveAttribute("data-placement", "left");
  });

  it("clamps a top tooltip horizontally near the left edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 0, width: 40, height: 32 });
    const tip = openTooltip({ side: "top" });
    // Centered left edge would be 20 - 60 = -40; the edge margin is 8px
    expect(tip).toHaveAttribute("data-placement", "top");
    expect(tip.style.marginLeft).toBe("48px");
  });

  it("keeps a11y wiring intact after flipping", () => {
    vi.useFakeTimers();
    mockLayout({ top: 10, left: 400, width: 80, height: 32 });
    openTooltip({ side: "top" });
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Hint");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

/** The caret is the only div the balloon hides from assistive tech (the bridge is a span). */
const caretOf = (tip: HTMLElement) => tip.querySelector<HTMLElement>('div[aria-hidden="true"]')!;

describe("Tooltip align", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("centers by default, with the caret left alone", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    const tip = openTooltip({ side: "top" });
    expect(tip).toHaveAttribute("data-align", "center");
    expect(tip.className).toContain("-translate-x-1/2");
    expect(caretOf(tip).style.marginLeft).toBe("");
  });

  it("start lines the balloon up with the trigger's leading edge and moves the caret to the trigger center", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    const tip = openTooltip({ side: "top", align: "start" });
    expect(tip.className).toContain("left-0");
    expect(tip.className).not.toContain("-translate-x-1/2");
    // Balloon spans 400..520 (center 460); the trigger center is 440
    expect(caretOf(tip).style.marginLeft).toBe("-20px");
  });

  it("end lines the balloon up with the trigger's trailing edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    const tip = openTooltip({ side: "bottom", align: "end" });
    expect(tip.className).toContain("right-0");
    // Balloon spans 360..480 (center 420); the trigger center is 440
    expect(caretOf(tip).style.marginLeft).toBe("20px");
  });

  it("aligns left/right balloons vertically, nudging the caret with margin-top", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    const tip = openTooltip({ side: "right", align: "start" });
    expect(tip.className).toContain("top-0");
    expect(tip.className).not.toContain("-translate-y-1/2");
    // Balloon spans 300..340 (center 320); the trigger center is 316
    expect(caretOf(tip).style.marginTop).toBe("-4px");
  });

  it("still clamps a start-aligned balloon near the right edge", () => {
    vi.useFakeTimers();
    mockLayout({ top: 300, left: 960, width: 40, height: 32 });
    const tip = openTooltip({ side: "top", align: "start" });
    // 960..1080 overflows the 1024 viewport; keep 8px of edge: 1016 - 1080
    expect(tip.style.marginLeft).toBe("-64px");
    // Balloon now spans 896..1016 (center 956); the trigger center is 980
    expect(caretOf(tip).style.marginLeft).toBe("24px");
  });
});

describe("Tooltip deprecated position", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("still honours position and warns once", () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    expect(openTooltip({ position: "bottom" })).toHaveAttribute("data-placement", "bottom");
    const messages = warn.mock.calls.map((c) => String(c[0]));
    expect(messages.filter((m) => m.includes("Tooltip: position is deprecated. Use side."))).toHaveLength(1);
  });

  it("lets side win over position", () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mockLayout({ top: 300, left: 400, width: 80, height: 32 });
    expect(openTooltip({ side: "left", position: "right" })).toHaveAttribute("data-placement", "left");
  });
});
