import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Popover } from "../components/Popover";
import { computePosition } from "../lib/position";

const rect = (top: number, left: number, width: number, height: number) =>
  ({ top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;

function Basic(props: Partial<React.ComponentProps<typeof Popover>>) {
  return (
    <div>
      <button type="button">Outside</button>
      <Popover trigger={<button type="button">Open filters</button>} aria-label="Filters" {...props}>
        <button type="button">Apply</button>
      </Popover>
    </div>
  );
}

describe("Popover", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("toggles from the trigger and wires ARIA", () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open filters" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);

    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("moves focus into the panel on open and back to the trigger on Escape", () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open filters" });
    trigger.focus();
    fireEvent.click(trigger);
    const apply = screen.getByRole("button", { name: "Apply" });
    expect(apply).toHaveFocus();

    fireEvent.keyDown(apply, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes on outside press without stealing focus back", () => {
    const onOpenChange = vi.fn();
    render(<Basic defaultOpen onOpenChange={onOpenChange} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // A press inside the panel keeps it open
    fireEvent.mouseDown(screen.getByRole("button", { name: "Apply" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const outside = screen.getByRole("button", { name: "Outside" });
    fireEvent.mouseDown(outside);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("button", { name: "Open filters" })).not.toHaveFocus();
  });

  it("supports controlled use", () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <span data-testid="state">{String(open)}</span>
          <Basic open={open} onOpenChange={setOpen} />
        </>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Open filters" }));
    expect(screen.getByTestId("state").textContent).toBe("true");
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.getByTestId("state").textContent).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes when focus tabs out of the panel", () => {
    render(<Basic defaultOpen />);
    const outside = screen.getByRole("button", { name: "Outside" });
    fireEvent.blur(screen.getByRole("button", { name: "Apply" }), { relatedTarget: outside });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("flips above the trigger when there is no room below (mocked rects)", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      // Trigger sits near the bottom of a 1024x768 viewport; panel is 200x150
      if (this.getAttribute("role") === "dialog") return rect(0, 0, 200, 150);
      return rect(700, 100, 120, 40);
    });
    render(<Basic defaultOpen side="bottom" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-side", "top");
    // 700 (anchor top) - 8 (offset) - 150 (panel height)
    expect(dialog.style.top).toBe("542px");
    expect(dialog.style.left).toBe("100px");
  });

  it("repositions on scroll", () => {
    let anchorTop = 100;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute("role") === "dialog") return rect(0, 0, 200, 100);
      return rect(anchorTop, 50, 100, 40);
    });
    render(<Basic defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.style.top).toBe("148px");
    anchorTop = 300;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(dialog.style.top).toBe("348px");
  });
});

describe("computePosition", () => {
  const viewport = { width: 1000, height: 800 };
  const floating = { width: 200, height: 100 };

  it("places on the requested side and alignment", () => {
    const anchor = { top: 100, left: 300, width: 100, height: 40 };
    expect(computePosition({ anchor, floating, viewport, side: "bottom", align: "start" })).toMatchObject({ top: 148, left: 300, side: "bottom" });
    expect(computePosition({ anchor, floating, viewport, side: "bottom", align: "center" })).toMatchObject({ left: 250 });
    expect(computePosition({ anchor, floating, viewport, side: "bottom", align: "end" })).toMatchObject({ left: 200 });
    expect(computePosition({ anchor, floating, viewport, side: "right", align: "start" })).toMatchObject({ top: 100, left: 408, side: "right" });
  });

  it("flips to the opposite side when the preferred side overflows", () => {
    const nearTop = { top: 20, left: 300, width: 100, height: 40 };
    expect(computePosition({ anchor: nearTop, floating, viewport, side: "top" }).side).toBe("bottom");
    const nearRight = { top: 300, left: 900, width: 60, height: 40 };
    expect(computePosition({ anchor: nearRight, floating, viewport, side: "right" }).side).toBe("left");
  });

  it("keeps the preferred side when neither side has more room, and when flip is off", () => {
    const nearTop = { top: 20, left: 300, width: 100, height: 40 };
    expect(computePosition({ anchor: nearTop, floating, viewport, side: "top", flip: false }).side).toBe("top");
  });

  it("shifts along the cross axis to stay inside the viewport", () => {
    const nearLeft = { top: 100, left: 0, width: 40, height: 40 };
    expect(computePosition({ anchor: nearLeft, floating, viewport, side: "bottom", align: "center" }).left).toBe(8);
    const nearRight = { top: 100, left: 980, width: 20, height: 40 };
    expect(computePosition({ anchor: nearRight, floating, viewport, side: "bottom", align: "start" }).left).toBe(792);
  });
});
