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
});
