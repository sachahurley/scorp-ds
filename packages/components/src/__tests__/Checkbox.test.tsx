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
