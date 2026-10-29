import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Select } from "../components/Select";

describe("Select", () => {
  afterEach(() => cleanup());

  it("opens listbox and exposes options", () => {
    render(
      <Select name="color" defaultValue="a" aria-label="Pick color" onChange={vi.fn()}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>
    );
    fireEvent.click(screen.getByRole("combobox", { name: /pick color/i }));
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("option", { name: /beta/i })).toBeVisible();
  });

  it("applies error trigger styles using semantic field tokens", () => {
    render(
      <Select name="x" error aria-label="Broken field" defaultValue="a" onChange={vi.fn()}>
        <option value="a">A</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: /broken field/i });
    // Plate ring recipe: the error border color lives on the ring wrapper.
    expect(trigger.parentElement?.className).toContain("--field-border-error");
    expect(trigger.className).toContain("--field-background-error");
  });
});

describe("Select combobox pattern (APG select-only)", () => {
  afterEach(() => cleanup());

  it("exposes the trigger as a collapsed combobox that pops up a listbox", () => {
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" onChange={vi.fn()}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    // The hidden native select is aria-hidden, so the trigger is the only combobox.
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-activedescendant");
    expect(trigger).toHaveTextContent("Alpha");
  });

  it("marks itself expanded and points aria-controls at the open listbox", () => {
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" onChange={vi.fn()}>
        <option value="a">Alpha</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", screen.getByRole("listbox", { name: /pick one/i }).id);
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("puts aria-invalid on the combobox, where ARIA supports it", () => {
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" errorMessage="Pick a real one" onChange={vi.fn()}>
        <option value="a">Alpha</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription(/pick a real one/i);
  });

  it("takes its name from a visible label", () => {
    render(
      <Select name="s" defaultValue="a" label="Region" onChange={vi.fn()}>
        <option value="a">Alpha</option>
      </Select>
    );
    expect(screen.getByRole("combobox", { name: "Region" })).toHaveTextContent("Alpha");
  });

  it("opens from the keyboard with Space and selects with Enter", () => {
    const onChange = vi.fn();
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" onChange={onChange}>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    fireEvent.keyDown(trigger, { key: " " });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange.mock.calls[0][0].target.value).toBe("b");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Beta");
  });
});

describe("Select keyboard highlight", () => {
  afterEach(() => cleanup());

  it("announces the highlighted option with aria-activedescendant and skips disabled ones", () => {
    const onChange = vi.fn();
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" onChange={onChange}>
        <option value="a">Alpha</option>
        <option value="b" disabled>Beta</option>
        <option value="c">Gamma</option>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    // ArrowDown opens and highlights the selected option
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
    const active = () => document.getElementById(trigger.getAttribute("aria-activedescendant") ?? "");
    expect(active()).toHaveTextContent("Alpha");

    // Next moves past the disabled Beta straight to Gamma
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(active()).toHaveTextContent("Gamma");
    expect(active()?.className).toContain("bg-[var(--surface-muted)] text-[var(--accent)]");

    // Enter selects the very option that was announced
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe("c");
  });

  it("closes the listbox on Tab", () => {
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" onChange={vi.fn()}>
        <option value="a">Alpha</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeVisible();
    fireEvent.keyDown(trigger, { key: "Tab" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger).not.toHaveAttribute("aria-activedescendant");
  });
});

describe("Select option parsing", () => {
  afterEach(() => cleanup());

  it("reads optgroup children and renders a labelled group", () => {
    render(
      <Select name="s" defaultValue="mx" aria-label="Pick one" onChange={vi.fn()}>
        <option value="none">None</option>
        <optgroup label="North">
          <option value="mx">Mexico</option>
          <option value="ca">Canada</option>
        </optgroup>
        <optgroup label="South" disabled>
          <option value="br">Brazil</option>
        </optgroup>
      </Select>
    );

    fireEvent.click(screen.getByRole("combobox", { name: /pick one/i }));
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("group", { name: "North" })).toBeVisible();
    expect(screen.getByRole("option", { name: /mexico/i })).toBeVisible();
    // A disabled optgroup disables its options, as a native select does
    expect(screen.getByRole("option", { name: /brazil/i })).toBeDisabled();
  });

  it("flattens fragments and arrays mixed with static options", () => {
    const mapped = ["b", "c"].map((v) => <option key={v} value={v}>{v.toUpperCase()}</option>);
    render(
      <Select name="s" defaultValue="a" aria-label="Pick one" onChange={vi.fn()}>
        <option value="a">A</option>
        {mapped}
        <>
          <option value="d">D</option>
        </>
      </Select>
    );

    fireEvent.click(screen.getByRole("combobox", { name: /pick one/i }));
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["A", "B", "C", "D"]);
  });

  it("falls back to the option text when no value is set, like a native select", () => {
    render(
      <Select name="s" aria-label="Pick one" onChange={vi.fn()}>
        <option>Alpha</option>
      </Select>
    );
    expect(screen.getByRole("combobox", { name: /pick one/i })).toHaveTextContent("Alpha");
  });
});

describe("Select inside a form", () => {
  afterEach(() => cleanup());

  it("neither the trigger nor an option submits the form", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Select name="s" defaultValue="a" aria-label="Pick one" onChange={vi.fn()}>
          <option value="a">Alpha</option>
          <option value="b">Beta</option>
        </Select>
      </form>
    );

    const trigger = screen.getByRole("combobox", { name: /pick one/i });
    expect(trigger).toHaveAttribute("type", "button");
    fireEvent.click(trigger);
    const option = screen.getByRole("option", { name: /beta/i });
    expect(option).toHaveAttribute("type", "button");
    fireEvent.click(option);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
