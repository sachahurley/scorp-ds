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

describe("Input field messages", () => {
  afterEach(() => cleanup());

  it("describes the control with helperText", () => {
    render(<Input label="Handle" helperText="Lowercase letters only" />);
    const el = screen.getByLabelText(/handle/i);
    expect(el).toHaveAccessibleDescription("Lowercase letters only");
    expect(el).not.toHaveAttribute("aria-invalid");
  });

  it("errorMessage sets aria-invalid, replaces the helper, and keeps consumer describedby", () => {
    render(
      <>
        <span id="extra">Extra</span>
        <Input
          aria-label="Email"
          aria-describedby="extra"
          helperText="We never share it"
          errorMessage="Enter a valid email"
        />
      </>
    );
    const el = screen.getByRole("textbox", { name: /email/i });
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveAccessibleDescription("Extra Enter a valid email");
    expect(screen.queryByText("We never share it")).toBeNull();
    expect(el.parentElement?.className).toContain("--field-border-error");
  });
});

it("error message leads with the 1-bit AlertCircle icon instead of a text prefix", async () => {
  const { render, screen } = await import("@testing-library/react");
  const { Input } = await import("../components/Input");
  render(<Input aria-label="Code" errorMessage="Too short" />);
  const el = screen.getByRole("textbox", { name: /code/i });
  const message = document.getElementById(el.getAttribute("aria-describedby")!)!;
  expect(message.querySelector("svg")).not.toBeNull();
  expect(message.textContent).toBe("Too short");
  expect(el).toHaveAccessibleDescription("Too short");
});
