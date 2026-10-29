import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Divider } from "../components/Divider";

describe("Divider", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("is a horizontal separator by default", () => {
    render(<Divider />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "horizontal");
    expect(rule).toHaveClass("border-t", "my-4");
  });

  it("is a vertical separator with side margins when vertical", () => {
    render(<Divider orientation="vertical" spacing="sm" />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "vertical");
    expect(rule).toHaveClass("border-l", "mx-1");
  });

  it("names a labelled divider by its label and hides the box-drawing lines", () => {
    render(<Divider label="Section" />);
    const rule = screen.getByRole("separator", { name: "Section" });
    const lines = rule.querySelectorAll('[aria-hidden="true"]');
    expect(lines).toHaveLength(2);
    for (const line of lines) expect(line.textContent).toMatch(/^─+$/);
  });

  it("puts the labelled form's spacing above and below, like the plain rule", () => {
    render(<Divider label="Section" spacing="sm" />);
    const rule = screen.getByRole("separator", { name: "Section" });
    expect(rule).toHaveClass("my-1");
    expect(rule.className).not.toMatch(/\bmx-/);
  });

  it("ignores the label on a vertical rule", () => {
    render(<Divider orientation="vertical" label="Section" />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "vertical");
    expect(rule).not.toHaveTextContent("Section");
  });

  it("drops the margin with spacing none", () => {
    render(<Divider spacing="none" />);
    expect(screen.getByRole("separator").className).not.toMatch(/\bm[xy]-/);
  });
});
