import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Switch } from "../components/Switch";

describe("Switch label and track", () => {
  afterEach(() => cleanup());

  it("toggles when the visible label is clicked", () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Notifications" checked={false} onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText("Notifications"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("keeps the label as the accessible name", () => {
    render(<Switch label="Notifications" checked onCheckedChange={vi.fn()} />);
    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("still lets an explicit aria-label win over the label text", () => {
    render(<Switch label="Theme" aria-label="Switch to light theme" onCheckedChange={vi.fn()} />);
    expect(screen.getByRole("switch", { name: "Switch to light theme" })).toBeVisible();
  });

  it("does not toggle from the label when disabled", () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Locked" disabled checked={false} onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText("Locked"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("renders no visible label text when hideLabel is set", () => {
    render(<Switch label="Notifications" hideLabel onCheckedChange={vi.fn()} />);
    expect(screen.queryByText("Notifications")).toBeNull();
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeVisible();
  });

  it("paints the off track with the control-track token and the on track with the accent", () => {
    const { rerender } = render(<Switch label="Notifications" onCheckedChange={vi.fn()} />);
    const off = document.querySelector('[data-state="off"]') as HTMLElement;
    expect(off.className).toContain("bg-[var(--control-track)]");
    expect(off.className).not.toContain("secondary-300");

    rerender(<Switch label="Notifications" checked onCheckedChange={vi.fn()} />);
    const on = document.querySelector('[data-state="on"]') as HTMLElement;
    expect(on.className).toContain("bg-[var(--accent)]");
  });

  it("holds the knob still under prefers-reduced-motion", () => {
    render(<Switch label="Notifications" onCheckedChange={vi.fn()} />);
    const track = document.querySelector('[data-state="off"]') as HTMLElement;
    const knob = track.firstElementChild as HTMLElement;
    expect(knob.className).toContain("motion-reduce:transition-none");
  });
});
