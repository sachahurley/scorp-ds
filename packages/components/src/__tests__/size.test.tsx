import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

afterEach(() => cleanup());

it("maps sm | md | lg onto the control-height classes", () => {
  render(
    <>
      <Button size="sm">small</Button>
      <Button>default</Button>
      <Input size="lg" aria-label="large" />
    </>
  );
  expect(screen.getByRole("button", { name: "small" }).className).toContain("h-control-sm");
  expect(screen.getByRole("button", { name: "default" }).className).toContain("h-control-md");
  expect(screen.getByRole("textbox", { name: "large" }).className).toContain("h-control-lg");
});
