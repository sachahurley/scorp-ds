import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Stack } from "../primitives/Stack";

describe("Stack", () => {
  afterEach(() => cleanup());

  it("forwards its ref to the underlying element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stack ref={ref}>
        <span>child</span>
      </Stack>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("child");
  });

  it("spreads native attributes such as id, role and aria-*", () => {
    render(
      <Stack id="toolbar" role="group" aria-label="Row actions" data-testid="stack">
        <span>child</span>
      </Stack>
    );
    const el = screen.getByTestId("stack");
    expect(el).toHaveAttribute("id", "toolbar");
    expect(screen.getByRole("group", { name: "Row actions" })).toBe(el);
  });

  it("supports the 20px spacing step", () => {
    render(
      <Stack gap="5" data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toContain("gap-5");
  });

  it("defaults to a vertical 16px stack", () => {
    render(
      <Stack data-testid="stack">
        <span>child</span>
      </Stack>
    );
    const className = screen.getByTestId("stack").className;
    expect(className).toContain("flex-col");
    expect(className).toContain("gap-4");
  });

  it("lays out horizontally on the horizontal axis", () => {
    render(
      <Stack axis="horizontal" data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toContain("flex-row");
  });

  it("keeps the plain-string classes exactly as before", () => {
    const { rerender } = render(
      <Stack data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe("flex flex-col gap-4");
    rerender(
      <Stack axis="horizontal" data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe("flex flex-row flex-wrap items-center gap-4");
  });

  it("emits the plain-string classes for a map with only base", () => {
    render(
      <Stack axis={{ base: "horizontal" }} data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe("flex flex-row flex-wrap items-center gap-4");
  });

  it.each([
    ["sm", "sm:flex-row sm:flex-wrap sm:items-center"],
    ["md", "md:flex-row md:flex-wrap md:items-center"],
    ["lg", "lg:flex-row lg:flex-wrap lg:items-center"],
    ["xl", "xl:flex-row xl:flex-wrap xl:items-center"],
  ] as const)("turns horizontal from %s", (breakpoint, expected) => {
    render(
      <Stack axis={{ base: "vertical", [breakpoint]: "horizontal" }} data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe(`flex flex-col ${expected} gap-4`);
  });

  it.each([
    ["sm", "sm:flex-col sm:flex-nowrap sm:items-stretch"],
    ["md", "md:flex-col md:flex-nowrap md:items-stretch"],
    ["lg", "lg:flex-col lg:flex-nowrap lg:items-stretch"],
    ["xl", "xl:flex-col xl:flex-nowrap xl:items-stretch"],
  ] as const)("turns vertical from %s, undoing the row's wrap and centring", (breakpoint, expected) => {
    render(
      <Stack axis={{ base: "horizontal", [breakpoint]: "vertical" }} data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe(`flex flex-row flex-wrap items-center ${expected} gap-4`);
  });

  it("emits breakpoints mobile first whatever the key order", () => {
    render(
      <Stack axis={{ xl: "vertical", md: "horizontal", base: "vertical" }} data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe(
      "flex flex-col md:flex-row md:flex-wrap md:items-center xl:flex-col xl:flex-nowrap xl:items-stretch gap-4"
    );
  });

  it("lets align replace the axis's own placement at every breakpoint", () => {
    render(
      <Stack axis={{ base: "vertical", md: "horizontal" }} align="stretch" data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe("flex flex-col md:flex-row md:flex-wrap gap-4 items-stretch");
  });

  it("applies align to the plain-string form", () => {
    render(
      <Stack axis="horizontal" align="start" data-testid="stack">
        <span>child</span>
      </Stack>
    );
    expect(screen.getByTestId("stack").className).toBe("flex flex-row flex-wrap gap-4 items-start");
  });
});
