import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";

const INSET_RING = "focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]";
const INSET_RING_ERROR = "focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-error)]";

describe("Input and Textarea focus and disabled states", () => {
  afterEach(() => cleanup());

  it("Input draws the system's 2px inset focus ring", () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByRole("textbox").className).toContain(INSET_RING);
  });

  it("Input keeps a visible focus ring in the error state", () => {
    render(<Input aria-label="Email" error />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain(INSET_RING_ERROR);
    expect(el.parentElement?.className).toContain("--field-border-error");
  });

  it("Textarea draws the same inset ring, error included", () => {
    const { rerender } = render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole("textbox").className).toContain(INSET_RING);
    rerender(<Textarea aria-label="Notes" error />);
    expect(screen.getByRole("textbox").className).toContain(INSET_RING_ERROR);
  });

  it("Input dims the ring wrapper when disabled, not just the fill", () => {
    render(<Input aria-label="Email" disabled />);
    const el = screen.getByRole("textbox");
    expect(el.parentElement?.className).toContain("opacity-50");
    expect(el.className).not.toContain("disabled:opacity-50");
  });

  it("Textarea dims the ring wrapper when disabled, not just the fill", () => {
    render(<Textarea aria-label="Notes" disabled />);
    const el = screen.getByRole("textbox");
    expect(el.parentElement?.className).toContain("opacity-50");
    expect(el.className).not.toContain("disabled:opacity-50");
  });

  it("the quiet Input thickens its underline on focus instead of the plate ring", () => {
    render(<Input variant="quiet" aria-label="Passphrase" />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain("focus-visible:[box-shadow:inset_0_calc(-1*var(--focus-ring-width))_0_0_var(--focus-ring-primary)]");
  });
});
