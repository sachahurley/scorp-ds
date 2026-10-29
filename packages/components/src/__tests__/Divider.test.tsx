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

  describe("deprecated variant and text", () => {
    it("still render the labelled form, with vertical margins, and warn once", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Divider variant="withText" text="Legacy" spacing="sm" />);
      const rule = screen.getByRole("separator", { name: "Legacy" });
      expect(rule).toHaveClass("my-1");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Divider: variant is deprecated"));
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Divider: text is deprecated. Use label"));
    });

    it("still map variant onto orientation", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Divider variant="vertical" />);
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
    });

    it("fall back to a plain horizontal rule when withText has no text", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Divider variant="withText" />);
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("lose to orientation and label when both forms are passed", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Divider variant="vertical" orientation="horizontal" text="Old" label="New" />);
      expect(screen.getByRole("separator", { name: "New" })).toBeInTheDocument();
    });
  });
});
