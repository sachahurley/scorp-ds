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

  it("wires errorMessage to the input", () => {
    render(<Checkbox label="Accept terms" errorMessage="Required to continue" />);
    const input = screen.getByRole("checkbox", { name: /accept terms/i });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required to continue");
  });
});
