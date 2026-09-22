import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Radio } from "../components/Radio";

describe("Radio messages", () => {
  afterEach(() => cleanup());

  it("wires errorMessage to the input and marks it invalid", () => {
    render(<Radio name="plan" value="pro" label="Pro" errorMessage="Pick a paid plan" />);
    const input = screen.getByRole("radio", { name: /pro/i });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Pick a paid plan")).toBeVisible();
    expect(input.getAttribute("aria-describedby")).toBe(screen.getByText("Pick a paid plan").closest("p")?.id);
  });

  it("shows helperText and hides it while an errorMessage is present", () => {
    const { rerender } = render(
      <Radio name="plan" value="pro" label="Pro" helperText="Billed yearly" />
    );
    expect(screen.getByText("Billed yearly")).toBeVisible();

    rerender(
      <Radio name="plan" value="pro" label="Pro" helperText="Billed yearly" errorMessage="Unavailable" />
    );
    expect(screen.queryByText("Billed yearly")).toBeNull();
    expect(screen.getByText("Unavailable")).toBeVisible();
  });
});

describe("Radio selection", () => {
  afterEach(() => cleanup());

  it("fires onCheckedChange with this radio's checked state", () => {
    const onCheckedChange = vi.fn();
    render(
      <Radio name="plan" value="pro" label="Pro" checked={false} onCheckedChange={onCheckedChange} />
    );
    fireEvent.click(screen.getByText("Pro"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("still calls onChange alongside onCheckedChange", () => {
    const onChange = vi.fn();
    const onCheckedChange = vi.fn();
    render(
      <Radio
        name="plan"
        value="team"
        label="Team"
        checked={false}
        onChange={onChange}
        onCheckedChange={onCheckedChange}
      />
    );
    fireEvent.click(screen.getByRole("radio", { name: /team/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe("Radio error styling", () => {
  afterEach(() => cleanup());

  it("draws the checked dot from a token, not a hardcoded white", () => {
    render(<Radio name="plan" value="pro" label="Pro" error defaultChecked />);
    const visual = screen.getByRole("radio", { name: /pro/i }).nextElementSibling as HTMLElement;
    expect(visual.className).toContain("--field-border-error");
    const dot = visual.querySelector(":scope > span > span") as HTMLElement;
    expect(dot.className).toContain("bg-[var(--button-destructive-text)]");
    expect(dot.className).not.toContain("bg-white");
  });
});
