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
    expect(el.className).toContain("--field-border-error");
    expect(el.className).toContain("--field-background-error");
  });

  it("associates visible label with the control", () => {
    render(<Input label="Username" placeholder="you" />);
    expect(screen.getByLabelText(/username/i)).toBeVisible();
  });
});
