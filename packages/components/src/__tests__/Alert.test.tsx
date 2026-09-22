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
