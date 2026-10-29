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
    expect(rule).toHaveClass("border-t-[length:var(--border-width-hairline)]", "w-full", "my-4");
  });

  it("is a vertical separator with side margins when vertical", () => {
    render(<Divider orientation="vertical" spacing="sm" />);
    const rule = screen.getByRole("separator");
    expect(rule).toHaveAttribute("aria-orientation", "vertical");
    expect(rule).toHaveClass("border-l-[length:var(--border-width-hairline)]", "mx-1");
  });

  it("names a labelled divider by its label and hides the two side rules", () => {
    render(<Divider label="Section" />);
    const rule = screen.getByRole("separator", { name: "Section" });
    const lines = rule.querySelectorAll('[aria-hidden="true"]');
    expect(lines).toHaveLength(2);
    for (const line of lines) expect(line.textContent).toBe("");
  });

  it("draws the labelled sides as hairlines that fill the free width and can shrink", () => {
    render(<Divider label="Section" />);
    const rule = screen.getByRole("separator", { name: "Section" });
    expect(rule).toHaveClass("flex", "items-center", "min-w-0");
    const sides = rule.querySelectorAll('[aria-hidden="true"]');
    for (const side of sides) {
      // flex-1 has a zero basis: a side has no intrinsic width to push the parent wider.
      expect(side).toHaveClass("flex-1", "min-w-4", "border-t-[length:var(--border-width-hairline)]", "border-term-dim");
    }
    // No fixed run of box-drawing glyphs, which had a fixed text width.
    expect(rule.textContent).toBe("Section");
  });

  it("truncates a long label with an ellipsis instead of pushing the rule out", () => {
    const long = "This sitting has run its course, the cards are back in the deck";
    render(<Divider label={long} />);
    const rule = screen.getByRole("separator", { name: long });
    const text = screen.getByText(long);
    expect(text).toHaveClass("truncate", "min-w-0");
    expect(text.parentElement).toBe(rule);
  });

  it("lets className override the default width", () => {
    render(<Divider label="Section" className="w-48" />);
    const rule = screen.getByRole("separator", { name: "Section" });
    expect(rule).toHaveClass("w-48");
    expect(rule).not.toHaveClass("w-full");
  });

  it("draws the plain rules at the hairline weight (decision 0010)", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toHaveClass("border-t-[length:var(--border-width-hairline)]");
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
