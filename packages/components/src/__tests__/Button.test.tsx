import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/Button";

describe("Button", () => {
  it("renders visible label", () => {
    render(<Button>Save draft</Button>);
    expect(screen.getByRole("button", { name: /save draft/i })).toBeVisible();
  });
});

it("renders an anchor with the same plate styling when href is set", async () => {
  const { render, screen } = await import("@testing-library/react");
  const { Button } = await import("../components/Button");
  render(
    <Button variant="secondary" size="sm" href="https://example.com" target="_blank" rel="noopener noreferrer">
      view project
    </Button>
  );
  const link = screen.getByRole("link", { name: /view project/i });
  expect(link).toHaveAttribute("href", "https://example.com");
  expect(link.className).toContain("plate-round");
  expect(link.className).toContain("--button-secondary-background");
});

it("accepts target and rel only alongside href (checked by type-check)", async () => {
  const { render, screen, cleanup } = await import("@testing-library/react");
  const { Button } = await import("../components/Button");
  const maybeHref: string | undefined = undefined;
  render(
    <>
      {/* @ts-expect-error target means nothing on a <button> */}
      <Button target="_blank">no href target</Button>
      {/* @ts-expect-error rel means nothing on a <button> */}
      <Button rel="noopener">no href rel</Button>
      <Button href={maybeHref}>optional href</Button>
    </>
  );
  // At runtime a <button> never gets the stray target.
  expect(screen.getByRole("button", { name: "no href target" })).not.toHaveAttribute("target");
  expect(screen.getByRole("button", { name: "optional href" })).toBeVisible();
  cleanup();
});
