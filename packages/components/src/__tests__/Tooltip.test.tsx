import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "../components/Tooltip";

describe("Tooltip", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const open = () => act(() => void vi.advanceTimersByTime(300));

  it("opens on keyboard focus and describes the trigger", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Copies the link">
        <button type="button">Share</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    fireEvent.focus(trigger);
    open();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Copies the link");
    expect(trigger).toHaveAccessibleDescription("Copies the link");
  });

  it("closes on Escape and on blur", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button");
    fireEvent.focus(trigger);
    open();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(trigger).not.toHaveAttribute("aria-describedby");

    fireEvent.focus(trigger);
    open();
    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("stays open while the pointer moves onto the tooltip", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hoverable">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    open();
    const tip = screen.getByRole("tooltip");
    expect(tip.className).not.toContain("pointer-events-none");
  });
});
