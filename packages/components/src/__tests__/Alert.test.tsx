import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Alert } from "../components/Alert";

afterEach(() => cleanup());

it("renders a 1-bit severity icon per variant, not a bracket prefix", () => {
  const { container } = render(<Alert variant="error" title="Error" description="Could not save." />);
  expect(container.querySelector("svg")).not.toBeNull();
  expect(container.textContent).not.toMatch(/\[(er|ok|i|!!|x)\]/);
});

it("default and info render different icons", () => {
  const path = (variant: "default" | "info") => {
    const { container, unmount } = render(<Alert variant={variant} title="t" />);
    const d = container.querySelector("svg path")?.getAttribute("d");
    unmount();
    return d;
  };
  expect(path("default")).not.toEqual(path("info"));
});

it("close button is an icon with an accessible name", () => {
  const onClose = vi.fn();
  render(<Alert title="t" onClose={onClose} />);
  const close = screen.getByRole("button", { name: "Close alert" });
  expect(close.querySelector("svg")).not.toBeNull();
  fireEvent.click(close);
  expect(onClose).toHaveBeenCalled();
});

it("close button does not submit a surrounding form", () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const onClose = vi.fn();
  render(
    <form onSubmit={onSubmit}>
      <Alert title="Heads up" onClose={onClose} />
    </form>
  );
  const close = screen.getByRole("button", { name: "Close alert" });
  expect(close).toHaveAttribute("type", "button");
  fireEvent.click(close);
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
});

it("close button carries a 44px hit area and the inset token focus ring", () => {
  render(<Alert title="t" onClose={vi.fn()} />);
  const close = screen.getByRole("button", { name: "Close alert" });
  // Invisible 44px target from a centered pseudo-element (layout unchanged)
  expect(close.className).toContain("before:w-touch");
  expect(close.className).toContain("before:h-touch");
  expect(close.className).toContain("focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]");
  expect(close.className).not.toContain("focus:ring-1");
});

it("uses the error focus ring token on the error variant", () => {
  render(<Alert variant="error" title="t" onClose={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Close alert" }).className).toContain("var(--focus-ring-error)");
});
