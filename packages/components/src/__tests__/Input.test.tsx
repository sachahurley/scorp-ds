import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Input } from "../components/Input";

describe("Input", () => {
  afterEach(() => cleanup());
  it("renders with accessible textbox", () => {
    render(<Input placeholder="Email" aria-label="Email" />);
    expect(screen.getByRole("textbox", { name: /email/i })).toBeVisible();
  });

  it("applies error state classes using semantic field tokens", () => {
    render(<Input error aria-label="Error field" />);
    const el = screen.getByRole("textbox", { name: /error field/i });
    // Plate ring recipe: the error border color lives on the ring wrapper,
    // the error fill on the input itself.
    expect(el.parentElement?.className).toContain("--field-border-error");
    expect(el.className).toContain("--field-background-error");
  });

  it("associates visible label with the control", () => {
    render(<Input label="Username" placeholder="you" />);
    expect(screen.getByLabelText(/username/i)).toBeVisible();
  });
});

it("quiet variant renders the underline recipe without the plate wrapper", async () => {
  const { render, screen } = await import("@testing-library/react");
  const { Input } = await import("../components/Input");
  render(<Input variant="quiet" aria-label="Passphrase" />);
  const el = screen.getByRole("textbox", { name: /passphrase/i });
  expect(el.className).toContain("border-b");
  expect(el.className).toContain("bg-transparent");
  expect(el.className).not.toContain("plate-round");
  expect(el.parentElement?.className ?? "").not.toContain("plate-round");
});
