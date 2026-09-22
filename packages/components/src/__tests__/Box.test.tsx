import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Box } from "../primitives/Box";

describe("Box", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLElement>();
    render(<Box ref={ref}>content</Box>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("content");
  });

  it("forwards its ref to the element chosen with `as`", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Box as="section" ref={ref}>
        content
      </Box>
    );
    expect(ref.current?.tagName).toBe("SECTION");
  });

  it("spreads native attributes such as id, role and aria-*", () => {
    render(
      <Box id="panel" role="region" aria-label="Filters" data-testid="box">
        content
      </Box>
    );
    const el = screen.getByTestId("box");
    expect(el).toHaveAttribute("id", "panel");
    expect(screen.getByRole("region", { name: "Filters" })).toBe(el);
  });

  it("maps padding props to spacing utilities, with the axis props winning", () => {
    render(
      <Box padding="4" paddingX="6" data-testid="box">
        content
      </Box>
    );
    const className = screen.getByTestId("box").className;
    expect(className).toContain("py-4");
    expect(className).toContain("px-6");
    expect(className).not.toContain("px-4");
  });

  it("maps background to the semantic surface variable", () => {
    render(
      <Box background="card" data-testid="box">
        content
      </Box>
    );
    expect(screen.getByTestId("box").className).toContain("bg-[var(--surface-card)]");
  });

  it("flips the text color on the inverse surface", () => {
    render(
      <Box background="inverse" data-testid="box">
        content
      </Box>
    );
    const className = screen.getByTestId("box").className;
    expect(className).toContain("bg-[var(--surface-inverse)]");
    expect(className).toContain("text-[var(--text-on-inverse)]");
  });

  it("renders no surface or spacing classes by default", () => {
    render(<Box data-testid="box">content</Box>);
    expect(screen.getByTestId("box").className).toBe("");
  });

  it("draws the plate ring as two layers when border is hairline", () => {
    render(
      <Box border="hairline" padding="4" data-testid="box">
        content
      </Box>
    );
    const outer = screen.getByTestId("box");
    expect(outer.className).toContain("plate-round");
    expect(outer.className).toContain("bg-[var(--surface-container-stroke)]");
    expect(outer.className).toContain("p-px");

    const inner = outer.firstElementChild as HTMLElement;
    expect(inner.className).toContain("plate-round");
    // Padding belongs to the fill layer so content clears the stroke.
    expect(inner.className).toContain("p-4");
    // A ringed Box with no background falls back to the card surface.
    expect(inner.className).toContain("bg-[var(--surface-card)]");
    expect(inner.textContent).toBe("content");
  });

  it("keeps the chosen background on the fill layer of a ringed box", () => {
    render(
      <Box border="hairline" background="muted" data-testid="box">
        content
      </Box>
    );
    const inner = screen.getByTestId("box").firstElementChild as HTMLElement;
    expect(inner.className).toContain("bg-[var(--surface-muted)]");
  });

  it("merges className over the generated classes", () => {
    render(
      <Box padding="4" className="p-8" data-testid="box">
        content
      </Box>
    );
    const className = screen.getByTestId("box").className;
    expect(className).toContain("p-8");
    expect(className).not.toContain("p-4");
  });
});
