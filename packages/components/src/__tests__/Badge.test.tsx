import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Badge } from "../components/Badge";

describe("Badge", () => {
  afterEach(() => cleanup());

  it("renders its label", () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText("Beta")).toBeVisible();
  });

  it("calls onClose when remove control is activated", () => {
    const onClose = vi.fn();
    render(
      <Badge onClose={onClose}>
        removable
      </Badge>
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove removable" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("names the remove button after a plain-text label", () => {
    render(<Badge onClose={() => {}}>Archived</Badge>);
    expect(screen.getByRole("button", { name: "Remove Archived" })).toBeVisible();
  });

  it("falls back to the generic name when the label is not a string", () => {
    render(
      <Badge onClose={() => {}}>
        <span>Archived</span>
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Remove badge" })).toBeVisible();
  });

  it("uses onCloseLabel when the caller supplies one", () => {
    render(
      <Badge onClose={() => {}} onCloseLabel="Clear the status filter">
        Draft
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Clear the status filter" })).toBeVisible();
  });

  it("gives the remove button a 44px pseudo-element hit area", () => {
    render(<Badge onClose={() => {}}>Draft</Badge>);
    const remove = screen.getByRole("button", { name: "Remove Draft" });
    expect(remove.className).toContain("before:w-touch");
    expect(remove.className).toContain("before:h-touch");
  });
});
