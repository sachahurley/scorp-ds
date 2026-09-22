import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { resolveSize } from "../lib/size";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("maps legacy names onto sm | md | lg and passes new names through", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  expect(resolveSize("small", "T1")).toBe("sm");
  expect(resolveSize("medium", "T1")).toBe("md");
  expect(resolveSize("large", "T1")).toBe("lg");
  expect(resolveSize("lg", "T1")).toBe("lg");
  expect(resolveSize(undefined, "T1")).toBe("md");
  // one warning per component, not per call
  expect(warn).toHaveBeenCalledTimes(1);
});

it("legacy and new names render the same control-height classes", () => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  render(
    <>
      <Button size="small">legacy</Button>
      <Button size="sm">new</Button>
      <Input size="large" aria-label="a" />
      <Input size="lg" aria-label="b" />
    </>
  );
  expect(screen.getByRole("button", { name: "legacy" }).className).toContain("h-control-sm");
  expect(screen.getByRole("button", { name: "new" }).className).toContain("h-control-sm");
  expect(screen.getByRole("textbox", { name: "a" }).className).toContain("h-control-lg");
  expect(screen.getByRole("textbox", { name: "b" }).className).toContain("h-control-lg");
});
