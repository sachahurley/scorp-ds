import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Divider } from "../components/Divider";

describe("Divider", () => {
  afterEach(cleanup);

  it("is a horizontal separator by default", () => {
    render(<Divider />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "horizontal");
    expect(rule).toHaveClass("border-t", "my-4");
  });

  it("is a vertical separator with side margins when vertical", () => {
    render(<Divider variant="vertical" spacing="sm" />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "vertical");
    expect(rule).toHaveClass("border-l", "mx-1");
  });

  it("names a text divider by its label and hides the box-drawing lines", () => {
    render(<Divider variant="withText" text="Section" />);
    const rule = screen.getByRole("separator", { name: "Section" });
    const lines = rule.querySelectorAll('[aria-hidden="true"]');
    expect(lines).toHaveLength(2);
    for (const line of lines) expect(line.textContent).toMatch(/^─+$/);
  });

  it("falls back to a plain horizontal rule when withText has no text", () => {
    render(<Divider variant="withText" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("drops the margin with spacing none", () => {
    render(<Divider spacing="none" />);
    expect(screen.getByRole("separator").className).not.toMatch(/\bm[xy]-/);
  });
});
