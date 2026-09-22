import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Container } from "../primitives/Container";

describe("Container", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLElement>();
    render(<Container ref={ref}>page</Container>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("page");
  });

  it("forwards its ref to the landmark chosen with `as`", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Container as="main" ref={ref}>
        page
      </Container>
    );
    expect(ref.current?.tagName).toBe("MAIN");
    expect(screen.getByRole("main")).toBe(ref.current);
  });

  it("spreads native attributes such as id, role and aria-*", () => {
    render(
      <Container id="page" role="region" aria-label="Case study" data-testid="container">
        page
      </Container>
    );
    const el = screen.getByTestId("container");
    expect(el).toHaveAttribute("id", "page");
    expect(screen.getByRole("region", { name: "Case study" })).toBe(el);
  });

  it("centers a 1024px column with gutters by default", () => {
    render(<Container data-testid="container">page</Container>);
    const className = screen.getByTestId("container").className;
    expect(className).toContain("mx-auto");
    expect(className).toContain("w-full");
    expect(className).toContain("max-w-screen-lg");
    expect(className).toContain("px-5");
    expect(className).toContain("lg:px-10");
  });

  it("maps size to a breakpoint max width", () => {
    render(
      <Container size="xl" data-testid="container">
        page
      </Container>
    );
    const className = screen.getByTestId("container").className;
    expect(className).toContain("max-w-screen-xl");
    expect(className).not.toContain("max-w-screen-lg");
  });

  it("drops the gutters when gutter is false", () => {
    render(
      <Container gutter={false} data-testid="container">
        page
      </Container>
    );
    const className = screen.getByTestId("container").className;
    expect(className).not.toContain("px-5");
    expect(className).not.toContain("lg:px-10");
  });

  it("merges className over the generated classes", () => {
    render(
      <Container className="px-0" data-testid="container">
        page
      </Container>
    );
    const className = screen.getByTestId("container").className;
    expect(className).toContain("px-0");
    expect(className).not.toContain("px-5");
  });
});
