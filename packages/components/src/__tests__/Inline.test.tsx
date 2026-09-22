import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Inline } from "../primitives/Inline";

describe("Inline", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Inline ref={ref}>
        <span>child</span>
      </Inline>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("child");
  });

  it("spreads native attributes such as id, role and aria-*", () => {
    render(
      <Inline id="actions" role="toolbar" aria-label="Row actions" data-testid="inline">
        <span>child</span>
      </Inline>
    );
    const el = screen.getByTestId("inline");
    expect(el).toHaveAttribute("id", "actions");
    expect(screen.getByRole("toolbar", { name: "Row actions" })).toBe(el);
  });

  it("wraps and centers an 8px row by default", () => {
    render(
      <Inline data-testid="inline">
        <span>child</span>
      </Inline>
    );
    const className = screen.getByTestId("inline").className;
    expect(className).toContain("flex-row");
    expect(className).toContain("flex-wrap");
    expect(className).toContain("gap-2");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-start");
  });

  it("maps gap to the spacing scale", () => {
    render(
      <Inline gap="5" data-testid="inline">
        <span>child</span>
      </Inline>
    );
    expect(screen.getByTestId("inline").className).toContain("gap-5");
  });

  it("maps align and justify to flex utilities", () => {
    render(
      <Inline align="baseline" justify="between" data-testid="inline">
        <span>child</span>
      </Inline>
    );
    const className = screen.getByTestId("inline").className;
    expect(className).toContain("items-baseline");
    expect(className).toContain("justify-between");
  });

  it("stops wrapping when wrap is false", () => {
    render(
      <Inline wrap={false} data-testid="inline">
        <span>child</span>
      </Inline>
    );
    const className = screen.getByTestId("inline").className;
    expect(className).toContain("flex-nowrap");
    expect(className).not.toContain("flex-wrap");
  });

  it("merges className over the generated classes", () => {
    render(
      <Inline gap="2" className="gap-8" data-testid="inline">
        <span>child</span>
      </Inline>
    );
    const className = screen.getByTestId("inline").className;
    expect(className).toContain("gap-8");
    expect(className).not.toContain("gap-2");
  });
});
