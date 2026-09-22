import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Slider } from "../components/Slider";

function rail(container: HTMLElement) {
  return container.querySelector('[data-slot="rail"]') as HTMLElement;
}

function fill(container: HTMLElement) {
  return container.querySelector('[data-slot="fill"]') as HTMLElement;
}

describe("Slider", () => {
  afterEach(() => cleanup());

  it("wires the visible label to the range input", () => {
    render(<Slider label="Zoom" min={0} max={10} defaultValue={5} />);
    const input = screen.getByLabelText("Zoom");
    expect(input).toHaveAttribute("type", "range");
  });

  it("gives the control a 44px touch target", () => {
    const { container } = render(<Slider aria-label="Zoom" />);
    const input = screen.getByRole("slider");
    expect(input.className).toContain("h-touch");
    // The whole row is the target, not just the 4px rail.
    expect(rail(container).parentElement?.className).toContain("h-touch");
  });

  it("draws the rail on the control-track token, not surface-muted", () => {
    const { container } = render(<Slider aria-label="Zoom" />);
    expect(rail(container).className).toContain("bg-[var(--control-track)]");
    expect(rail(container).className).not.toContain("surface-muted");
  });

  it("fills the portion before the thumb from the current value", () => {
    const { container } = render(<Slider aria-label="Zoom" min={0} max={200} value={50} onChange={() => {}} />);
    expect(fill(container)).toHaveStyle({ width: "25%" });
  });

  it("clamps the fill to the range", () => {
    const { container } = render(<Slider aria-label="Zoom" min={10} max={20} value={99} onChange={() => {}} />);
    expect(fill(container)).toHaveStyle({ width: "100%" });
  });

  it("tracks the fill for uncontrolled sliders and still calls onChange", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider aria-label="Zoom" min={0} max={100} defaultValue={0} onChange={onChange} />
    );
    expect(fill(container)).toHaveStyle({ width: "0%" });
    fireEvent.change(screen.getByRole("slider"), { target: { value: "60" } });
    expect(fill(container)).toHaveStyle({ width: "60%" });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("fills to full width and lets the container set the size", () => {
    const { container } = render(<Slider aria-label="Zoom" className="max-w-xs" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("w-full");
    expect(root.className).not.toContain("inline-flex");
    expect(root.className).toContain("max-w-xs");
  });

  it("marks the row as disabled without blocking the label", () => {
    render(<Slider label="Ink bias" disabled defaultValue={40} />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });
});
