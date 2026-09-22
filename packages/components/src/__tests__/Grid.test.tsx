import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Grid } from "../primitives/Grid";

describe("Grid", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Grid ref={ref}>
        <span>cell</span>
      </Grid>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("cell");
  });

  it("spreads native attributes such as id, role and aria-*", () => {
    render(
      <Grid id="gallery" role="list" aria-label="Case studies" data-testid="grid">
        <span role="listitem">cell</span>
      </Grid>
    );
    const el = screen.getByTestId("grid");
    expect(el).toHaveAttribute("id", "gallery");
    expect(screen.getByRole("list", { name: "Case studies" })).toBe(el);
  });

  it("defaults to a single 16px-gap column that stretches its cells", () => {
    render(
      <Grid data-testid="grid">
        <span>cell</span>
      </Grid>
    );
    const className = screen.getByTestId("grid").className;
    expect(className).toContain("grid");
    expect(className).toContain("grid-cols-1");
    expect(className).toContain("gap-4");
    expect(className).toContain("items-stretch");
  });

  it("maps a numeric column count to a single class", () => {
    render(
      <Grid columns={3} data-testid="grid">
        <span>cell</span>
      </Grid>
    );
    const className = screen.getByTestId("grid").className;
    expect(className).toContain("grid-cols-3");
    expect(className).not.toContain("md:grid-cols");
  });

  it("emits mobile-first classes for a responsive column map", () => {
    render(
      <Grid columns={{ base: 1, md: 2, xl: 4 }} data-testid="grid">
        <span>cell</span>
      </Grid>
    );
    const className = screen.getByTestId("grid").className;
    expect(className).toContain("grid-cols-1");
    expect(className).toContain("md:grid-cols-2");
    expect(className).toContain("xl:grid-cols-4");
    expect(className).not.toContain("sm:grid-cols");
    expect(className.indexOf("md:grid-cols-2")).toBeLessThan(className.indexOf("xl:grid-cols-4"));
  });

  it("maps rowGap and columnGap to axis gap utilities", () => {
    render(
      <Grid gap="2" rowGap="6" columnGap="8" data-testid="grid">
        <span>cell</span>
      </Grid>
    );
    const className = screen.getByTestId("grid").className;
    expect(className).toContain("gap-y-6");
    expect(className).toContain("gap-x-8");
  });

  it("maps align to an items utility", () => {
    render(
      <Grid align="start" data-testid="grid">
        <span>cell</span>
      </Grid>
    );
    expect(screen.getByTestId("grid").className).toContain("items-start");
  });

  it("merges className over the generated classes", () => {
    render(
      <Grid columns={2} className="grid-cols-6" data-testid="grid">
        <span>cell</span>
      </Grid>
    );
    const className = screen.getByTestId("grid").className;
    expect(className).toContain("grid-cols-6");
    expect(className).not.toContain("grid-cols-2");
  });
});
