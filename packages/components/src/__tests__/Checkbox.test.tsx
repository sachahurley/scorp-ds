import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from "../components/Checkbox";

describe("Checkbox", () => {
  afterEach(() => cleanup());

  it("toggles via onCheckedChange when the custom control is clicked", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="Accept" checked={false} onCheckedChange={onCheckedChange} />
    );
    const control = screen.getAllByRole("checkbox").find((el) => el.tagName === "DIV");
    expect(control).toBeTruthy();
    fireEvent.click(control!);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("applies error state using semantic field tokens on the control", () => {
    render(<Checkbox label="E" error checked={false} />);
    const control = screen.getAllByRole("checkbox").find((el) => el.tagName === "DIV");
    expect(control).toBeTruthy();
    expect(control!.className).toContain("--field-border-error");
  });
});
