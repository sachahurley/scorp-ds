import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";

// Field focus is a colour change on the 1px ring only (docs/decisions/0022).
// No inset ring, so the field does not read as thicker when focused.
const FOCUS_RING = "focus-within:!bg-[var(--field-border-focus)]";

describe("Input and Textarea focus and disabled states", () => {
  afterEach(() => cleanup());

  it("Input shows focus as a ring colour change, with no inset ring", () => {
    render(<Input aria-label="Email" />);
    const el = screen.getByRole("textbox");
    expect(el.parentElement?.className).toContain(FOCUS_RING);
    expect(el.className).not.toContain("box-shadow");
  });

  it("Input still shows focus in the error state: focus wins over error", () => {
    render(<Input aria-label="Email" error />);
    const el = screen.getByRole("textbox");
    expect(el.parentElement?.className).toContain("--field-border-error");
    expect(el.parentElement?.className).toContain(FOCUS_RING);
    expect(el.className).not.toContain("box-shadow");
  });

  it("Textarea uses the same colour-only focus, error included", () => {
    const { rerender } = render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole("textbox").parentElement?.className).toContain(FOCUS_RING);
    expect(screen.getByRole("textbox").className).not.toContain("box-shadow");
    rerender(<Textarea aria-label="Notes" error />);
    expect(screen.getByRole("textbox").parentElement?.className).toContain(FOCUS_RING);
    expect(screen.getByRole("textbox").className).not.toContain("box-shadow");
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

  it("the quiet Input recolours its underline on focus without thickening it", () => {
    const { rerender } = render(<Input variant="quiet" aria-label="Passphrase" />);
    expect(screen.getByRole("textbox").className).toContain("focus:!border-[var(--field-border-focus)]");
    expect(screen.getByRole("textbox").className).not.toContain("box-shadow");
    rerender(<Input variant="quiet" aria-label="Passphrase" error />);
    expect(screen.getByRole("textbox").className).toContain("focus:!border-[var(--field-border-focus)]");
  });
});
