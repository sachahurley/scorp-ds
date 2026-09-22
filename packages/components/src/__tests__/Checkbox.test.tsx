import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from "../components/Checkbox";

describe("Checkbox", () => {
  afterEach(() => cleanup());

  it("toggles via onCheckedChange when the label is clicked (native checkbox only in a11y tree)", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="Accept" checked={false} onCheckedChange={onCheckedChange} />
    );
    fireEvent.click(screen.getByText("Accept"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("applies error state using semantic field tokens on the visual control", () => {
    render(<Checkbox label="E" error checked={false} />);
    const input = screen.getByRole("checkbox");
    const visual = input.nextElementSibling as HTMLElement;
    expect(visual).toBeTruthy();
    expect(visual.className).toContain("--field-border-error");
  });
});

describe("Checkbox hit area and messages", () => {
  afterEach(() => cleanup());

  it("toggles from a click on the visual box when there is no visible label", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Select row" checked={false} onCheckedChange={onCheckedChange} />);
    const visual = screen.getByRole("checkbox").nextElementSibling as HTMLElement;
    fireEvent.click(visual);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("dims the disabled control exactly once, on the label", () => {
    render(<Checkbox label="Locked" disabled />);
    const input = screen.getByRole("checkbox");
    const visual = input.nextElementSibling as HTMLElement;
    const label = input.closest("label") as HTMLElement;

    expect(label.className).toContain("opacity-50");
    // Stacking a second opacity-50 on the box rendered it at about 25%.
    expect(visual.className).not.toContain("opacity-50");
    expect(visual.className).toContain("cursor-not-allowed");
  });

  it("tokenizes the error check mark instead of hardcoding white", () => {
    render(<Checkbox label="E" error checked readOnly />);
    const visual = screen.getByRole("checkbox").nextElementSibling as HTMLElement;
    const mark = visual.querySelector('[data-mark="check"]') as HTMLElement;
    expect(mark.className).toContain("text-[var(--button-destructive-text)]");
    expect(mark.className).not.toContain("text-white");
  });

  it("wires errorMessage to the input", () => {
    render(<Checkbox label="Accept terms" errorMessage="Required to continue" />);
    const input = screen.getByRole("checkbox", { name: /accept terms/i });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required to continue");
  });
});
