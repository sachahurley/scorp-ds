import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { VisuallyHidden } from "../primitives/VisuallyHidden";

describe("VisuallyHidden", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLElement>();
    render(<VisuallyHidden ref={ref}>Close</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.textContent).toBe("Close");
  });

  it("forwards its ref to the element chosen with `as`", () => {
    const ref = createRef<HTMLElement>();
    render(
      <VisuallyHidden as="label" ref={ref} htmlFor="search">
        Search
      </VisuallyHidden>
    );
    expect(ref.current?.tagName).toBe("LABEL");
  });

  it("spreads native attributes such as id and data-*", () => {
    render(
      <VisuallyHidden id="sr-hint" data-testid="vh">
        Loading
      </VisuallyHidden>
    );
    expect(screen.getByTestId("vh")).toHaveAttribute("id", "sr-hint");
  });

  it("applies the clip-rect recipe and never display:none", () => {
    render(<VisuallyHidden data-testid="vh">Close</VisuallyHidden>);
    const el = screen.getByTestId("vh");
    expect(el.className).toContain("sr-only");
    expect(el.className).not.toContain("hidden");
    expect(el).not.toHaveAttribute("hidden");
    expect(el.style.display).not.toBe("none");
    expect(el).not.toHaveAttribute("aria-hidden");
  });

  it("stays in the accessibility tree: it names the control that contains it", () => {
    render(
      <button type="button">
        <span aria-hidden="true">x</span>
        <VisuallyHidden>Close dialog</VisuallyHidden>
      </button>
    );
    // The glyph is hidden from assistive tech, so the only accessible name
    // available comes from the visually hidden text.
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
  });

  it("is still queryable as text, unlike display:none content", () => {
    render(<VisuallyHidden>End of results</VisuallyHidden>);
    expect(screen.getByText("End of results")).toBeVisible();
  });

  it("reveals itself on focus when focusable is set", () => {
    render(
      <VisuallyHidden focusable data-testid="vh">
        <a href="#main">Skip to content</a>
      </VisuallyHidden>
    );
    const className = screen.getByTestId("vh").className;
    expect(className).toContain("sr-only");
    expect(className).toContain("focus:not-sr-only");
    expect(className).toContain("focus-within:not-sr-only");
  });

  it("stays hidden by default with no focus escape hatch", () => {
    render(<VisuallyHidden data-testid="vh">Close</VisuallyHidden>);
    expect(screen.getByTestId("vh").className).not.toContain("not-sr-only");
  });

  it("merges className over the generated classes", () => {
    render(
      <VisuallyHidden className="absolute left-2 top-2" data-testid="vh">
        Skip to content
      </VisuallyHidden>
    );
    const className = screen.getByTestId("vh").className;
    expect(className).toContain("sr-only");
    expect(className).toContain("left-2");
  });
});
