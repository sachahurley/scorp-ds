import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Combobox, type ComboboxOption } from "../components/Combobox";

const OPTIONS: ComboboxOption[] = [
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile", disabled: true },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
];

const setup = (props: Partial<React.ComponentProps<typeof Combobox>> = {}) => {
  const onValueChange = vi.fn();
  render(<Combobox label="Country" options={OPTIONS} onValueChange={onValueChange} {...props} />);
  return { input: screen.getByRole("combobox", { name: "Country" }), onValueChange };
};

describe("Combobox", () => {
  afterEach(() => cleanup());

  it("exposes the ARIA 1.2 combobox attributes", () => {
    const { input } = setup();
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).not.toHaveAttribute("aria-activedescendant");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    const listbox = screen.getByRole("listbox", { name: "Country" });
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls", listbox.id);
    const first = screen.getByRole("option", { name: "Canada" });
    expect(input).toHaveAttribute("aria-activedescendant", first.id);
    expect(screen.getByRole("option", { name: "Chile" })).toHaveAttribute("aria-disabled", "true");
  });

  it("navigates with arrows, skipping disabled options, and wraps", () => {
    const { input } = setup();
    fireEvent.keyDown(input, { key: "ArrowDown" }); // open on Canada
    fireEvent.keyDown(input, { key: "ArrowDown" }); // skip Chile
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "France" }).id);
    fireEvent.keyDown(input, { key: "End" });
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Germany" }).id);
    fireEvent.keyDown(input, { key: "ArrowDown" }); // wraps
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Canada" }).id);
    fireEvent.keyDown(input, { key: "ArrowUp" }); // wraps back
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Germany" }).id);
    fireEvent.keyDown(input, { key: "Home" });
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Canada" }).id);
  });

  it("selects with Enter and shows the label in the field", () => {
    const { input, onValueChange } = setup();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("fr", OPTIONS[2]);
    expect(input).toHaveValue("France");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("filters as you type and shows the empty state", () => {
    const { input } = setup({ emptyText: "No matches" });
    fireEvent.change(input, { target: { value: "an" } });
    const names = screen.getAllByRole("option").map((o) => o.textContent);
    expect(names).toEqual(["Canada", "France", "Germany"]);
    // First match is highlighted so Enter picks it
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Canada" }).id);

    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.queryByRole("listbox")).toBeNull();
    const empty = screen.getByRole("status");
    expect(empty).toHaveTextContent("No matches");
    // Still expanded, so aria-controls points at the empty-state popup
    expect(input).toHaveAttribute("aria-controls", empty.id);
  });

  it("uses a custom filter", () => {
    const { input } = setup({ filter: (o, q) => o.value.startsWith(q) });
    fireEvent.change(input, { target: { value: "d" } });
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Germany"]);
  });

  it("Escape closes and restores the committed label, then clears", () => {
    const { input, onValueChange } = setup({ defaultValue: "de" });
    expect(input).toHaveValue("Germany");
    fireEvent.change(input, { target: { value: "Fr" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input).toHaveValue("Germany");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenCalledWith(null, null);
  });

  it("selects by click and keeps a controlled value", () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Country" options={OPTIONS} value="ca" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "Country" });
    fireEvent.click(input);
    expect(screen.getByRole("option", { name: "Canada" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("option", { name: "Germany" }));
    expect(onValueChange).toHaveBeenCalledWith("de", OPTIONS[3]);
    // Parent did not update `value`, so the field still shows the controlled label
    expect(input).toHaveValue("Canada");
  });

  it("wires helper and error text through aria-describedby", () => {
    const { input } = setup({ helperText: "Where you live", errorMessage: "Pick a country" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = input.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)).toHaveTextContent("Pick a country");
  });

  it("submits the value through a hidden input when named", () => {
    const { container } = render(<Combobox aria-label="Pick" name="country" options={OPTIONS} defaultValue="fr" />);
    expect(container.querySelector('input[type="hidden"][name="country"]')).toHaveValue("fr");
  });
});
