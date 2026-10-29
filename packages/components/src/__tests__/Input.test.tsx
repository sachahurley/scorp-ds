import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

describe("Input trailingAction", () => {
  afterEach(() => cleanup());

  it("renders a real button named by its label", () => {
    render(
      <Input
        label="Password"
        type="password"
        trailingAction={{ icon: "Eye", label: "Show password", onClick: () => {} }}
      />
    );
    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("type", "button");
    // A one-shot action carries no toggle state
    expect(button).not.toHaveAttribute("aria-pressed");
    // The icon is decorative: the label is the whole name
    expect(button).toHaveAccessibleName("Show password");
    expect(button.querySelector("svg")).not.toBeNull();
  });

  it("toggles aria-pressed with `pressed` while the label stays fixed", () => {
    function Reveal() {
      const [visible, setVisible] = useState(false);
      return (
        <Input
          label="Password"
          type={visible ? "text" : "password"}
          trailingAction={{
            icon: visible ? "EyeOff" : "Eye",
            label: "Show password",
            pressed: visible,
            onClick: () => setVisible((v) => !v),
          }}
        />
      );
    }
    render(<Reveal />);
    const button = screen.getByRole("button", { name: "Show password" });
    const input = screen.getByLabelText("Password");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(input).toHaveAttribute("type", "password");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(input).toHaveAttribute("type", "text");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onClick when the action is clicked", () => {
    const onClick = vi.fn();
    render(<Input aria-label="Search" trailingAction={{ icon: "X", label: "Clear search", onClick }} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled disables the action too", () => {
    const onClick = vi.fn();
    render(
      <Input aria-label="Search" disabled trailingAction={{ icon: "X", label: "Clear search", onClick }} />
    );
    const button = screen.getByRole("button", { name: "Clear search" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("puts the action after the input in the tab order", () => {
    render(
      <Input aria-label="Search" trailingAction={{ icon: "X", label: "Clear search", onClick: () => {} }} />
    );
    const input = screen.getByRole("textbox", { name: "Search" });
    const button = screen.getByRole("button", { name: "Clear search" });
    // Neither sets a tabindex, so the tab order is document order: input, then action
    expect(input.tabIndex).toBe(0);
    expect(button.tabIndex).toBe(0);
    expect(input.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("pads the input by the action's width at every size and on quiet", () => {
    const action = { icon: "X" as const, label: "Clear", onClick: () => {} };
    const { rerender } = render(<Input aria-label="F" size="sm" trailingAction={action} />);
    expect(screen.getByRole("textbox").className).toContain("pr-8");
    rerender(<Input aria-label="F" size="md" trailingAction={action} />);
    expect(screen.getByRole("textbox").className).toContain("pr-10");
    rerender(<Input aria-label="F" size="lg" trailingAction={action} />);
    expect(screen.getByRole("textbox").className).toContain("pr-12");
    rerender(<Input aria-label="F" variant="quiet" trailingAction={action} />);
    expect(screen.getByRole("textbox").className).toContain("!pr-10");
  });

  it("renders no button and no extra wrapper without trailingAction", () => {
    render(<Input aria-label="Plain" />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("textbox").parentElement?.className).toContain("plate-round");
  });
});
