import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Center } from "../primitives/Center";

describe("Center", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLElement>();
    render(<Center ref={ref}>content</Center>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("content");
  });

  it("forwards its ref to the element chosen with `as`", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Center as="section" ref={ref}>
        content
      </Center>
    );
    expect(ref.current?.tagName).toBe("SECTION");
  });

  it("spreads native attributes such as id, role and aria-*", () => {
    render(
      <Center id="signin" role="region" aria-label="Sign in" data-testid="center">
        content
      </Center>
    );
    const el = screen.getByTestId("center");
    expect(el).toHaveAttribute("id", "signin");
    expect(screen.getByRole("region", { name: "Sign in" })).toBe(el);
  });

  it("centers a 448px column with left-aligned text by default", () => {
    render(<Center data-testid="center">content</Center>);
    const className = screen.getByTestId("center").className;
    expect(className).toContain("mx-auto");
    expect(className).toContain("w-full");
    expect(className).toContain("max-w-md");
    expect(className).not.toContain("text-center");
    expect(className).not.toContain("min-h-screen");
  });

  it("maps maxWidth to a content width", () => {
    render(
      <Center maxWidth="2xl" data-testid="center">
        content
      </Center>
    );
    const className = screen.getByTestId("center").className;
    expect(className).toContain("max-w-2xl");
    expect(className).not.toContain("max-w-md");
  });

  it("centers the text as well when andText is set", () => {
    render(
      <Center andText data-testid="center">
        content
      </Center>
    );
    expect(screen.getByTestId("center").className).toContain("text-center");
  });

  it("centers vertically in the viewport when fullHeight is set", () => {
    render(
      <Center fullHeight data-testid="center">
        content
      </Center>
    );
    const className = screen.getByTestId("center").className;
    expect(className).toContain("min-h-screen");
    expect(className).toContain("flex-col");
    expect(className).toContain("justify-center");
  });

  it("merges className over the generated classes", () => {
    render(
      <Center maxWidth="md" className="max-w-xs" data-testid="center">
        content
      </Center>
    );
    const className = screen.getByTestId("center").className;
    expect(className).toContain("max-w-xs");
    expect(className).not.toContain("max-w-md");
  });
});
