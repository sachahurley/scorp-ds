import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "../components/Button";

describe("Button loading", () => {
  afterEach(() => cleanup());

  it("sets aria-busy, stays focusable, and blocks clicks", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not submit its form while loading", () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Send
        </Button>
      </form>
    );
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps an icon-only button's name and clicks again once loading ends", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button variant="icon" aria-label="Refresh" loading onClick={onClick}>
        <span>R</span>
      </Button>
    );
    const button = screen.getByRole("button", { name: "Refresh" });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <Button variant="icon" aria-label="Refresh" onClick={onClick}>
        <span>R</span>
      </Button>
    );
    expect(button).not.toHaveAttribute("aria-busy");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
