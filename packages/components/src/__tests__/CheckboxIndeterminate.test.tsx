import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox } from "../components/Checkbox";

describe("Checkbox indeterminate", () => {
  afterEach(() => cleanup());

  it("sets the native indeterminate property and still forwards the ref", () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox label="Select all" indeterminate ref={ref} />);
    const input = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(ref.current).toBe(input);
    rerender(<Checkbox label="Select all" indeterminate={false} ref={ref} />);
    expect(input.indeterminate).toBe(false);
  });

  it("supports callback refs", () => {
    let node: HTMLInputElement | null = null;
    render(<Checkbox aria-label="Row" indeterminate ref={(n) => (node = n)} />);
    expect(node).toBe(screen.getByRole("checkbox"));
  });

  it("re-asserts the mixed state after a click while the prop stays true", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Select all" indeterminate checked={false} onCheckedChange={onCheckedChange} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    fireEvent.click(input);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(input.indeterminate).toBe(true);
  });
});
