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
    fireEvent.click(screen.getByRole("button", { name: /pick color/i }));
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("option", { name: /beta/i })).toBeVisible();
  });

  it("applies error trigger styles using semantic field tokens", () => {
    render(
      <Select name="x" error aria-label="Broken field" defaultValue="a" onChange={vi.fn()}>
        <option value="a">A</option>
      </Select>
    );
    const trigger = screen.getByRole("button", { name: /broken field/i });
    expect(trigger.className).toContain("--field-border-error");
  });
});
