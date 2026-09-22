import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "../components/Dropdown";
import { Button } from "../components/Button";

const open = () => fireEvent.click(screen.getByRole("button", { name: /actions/i }));

describe("Dropdown keyboard navigation", () => {
  afterEach(() => cleanup());

  it("highlights and activates the same row when an item is disabled", () => {
    const first = vi.fn();
    const third = vi.fn();
    render(
      <Dropdown
        items={[
          { label: "First", onClick: first },
          { label: "Second", onClick: vi.fn(), disabled: true },
          { label: "Third", onClick: third },
        ]}
      />
    );

    open();
    // Down twice: First, then skip the disabled Second, landing on Third
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "ArrowDown" });

    // The highlight is the muted surface plus accent text; hover reuses the
    // surface, so the accent class is what marks the keyboard row.
    const highlighted = screen.getByRole("menuitem", { name: "Third" });
    expect(highlighted.className).toContain("bg-[var(--surface-muted)] text-[var(--accent)]");
    expect(screen.getByRole("menuitem", { name: "First" }).className).not.toContain("text-[var(--accent)]");

    fireEvent.keyDown(document, { key: "Enter" });
    expect(third).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  it("wraps past the end and never lands on a disabled item", () => {
    const last = vi.fn();
    render(
      <Dropdown
        items={[
          { label: "First", onClick: vi.fn() },
          { label: "Second", onClick: vi.fn(), disabled: true },
          { label: "Third", onClick: last },
        ]}
      />
    );

    open();
    // Up from nothing wraps to the last item
    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "Third" }).className).toContain("text-[var(--accent)]");
    // Up again skips the disabled Second
    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "First" }).className).toContain("text-[var(--accent)]");
    expect(last).not.toHaveBeenCalled();
  });

  it("closes on Tab so focus never leaves an orphaned menu", () => {
    render(<Dropdown items={[{ label: "First", onClick: vi.fn() }]} />);
    open();
    expect(screen.getByRole("menu")).toBeVisible();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on Escape", () => {
    render(<Dropdown items={[{ label: "First", onClick: vi.fn() }]} />);
    open();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Dropdown inside a form", () => {
  afterEach(() => cleanup());

  it("does not submit the form from the trigger or from an item", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const onClick = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Dropdown items={[{ label: "First", onClick }]} />
      </form>
    );

    const trigger = screen.getByRole("button", { name: /actions/i });
    expect(trigger).toHaveAttribute("type", "button");
    fireEvent.click(trigger);

    const item = screen.getByRole("menuitem", { name: "First" });
    expect(item).toHaveAttribute("type", "button");
    fireEvent.click(item);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("Dropdown trigger", () => {
  afterEach(() => cleanup());

  it("clones a custom element trigger instead of nesting it in another button", () => {
    const onClick = vi.fn();
    render(
      <Dropdown
        trigger={<Button onClick={onClick}>Open menu</Button>}
        items={[{ label: "First", onClick: vi.fn() }]}
      />
    );

    // One control, not a button inside a role="button" wrapper
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.parentElement).not.toHaveAttribute("role", "button");
    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1); // the trigger's own handler still runs
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps the div fallback (with ARIA) for a non-element trigger", () => {
    render(<Dropdown trigger="Open menu" items={[{ label: "First", onClick: vi.fn() }]} />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger.tagName).toBe("DIV");
    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("menu")).toBeVisible();
  });
});

describe("Dropdown tokens", () => {
  afterEach(() => cleanup());

  it("layers the menu with the z-index token, not a raw value", () => {
    render(<Dropdown items={[{ label: "First", onClick: vi.fn() }]} />);
    open();
    const ring = screen.getByRole("menu").parentElement as HTMLElement;
    expect(ring.className).toContain("z-[var(--z-index-dropdown)]");
    expect(ring.className).not.toContain("1051");
  });
});
