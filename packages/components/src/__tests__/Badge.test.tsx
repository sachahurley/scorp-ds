import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Badge } from "../components/Badge";

describe("Badge", () => {
  afterEach(() => cleanup());

  it("renders its label", () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText("Beta")).toBeVisible();
  });

  it("calls onDismiss when remove control is activated", () => {
    const onDismiss = vi.fn();
    render(
      <Badge onDismiss={onDismiss}>
        removable
      </Badge>
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove removable" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("names the remove button after a plain-text label", () => {
    render(<Badge onDismiss={() => {}}>Archived</Badge>);
    expect(screen.getByRole("button", { name: "Remove Archived" })).toBeVisible();
  });

  it("falls back to the generic name when the label is not a string", () => {
    render(
      <Badge onDismiss={() => {}}>
        <span>Archived</span>
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Remove badge" })).toBeVisible();
  });

  it("uses dismissLabel when the caller supplies one", () => {
    render(
      <Badge onDismiss={() => {}} dismissLabel="Clear the status filter">
        Draft
      </Badge>
    );
    expect(screen.getByRole("button", { name: "Clear the status filter" })).toBeVisible();
  });

  it("gives the remove button a 44px pseudo-element hit area", () => {
    render(<Badge onDismiss={() => {}}>Draft</Badge>);
    const remove = screen.getByRole("button", { name: "Remove Draft" });
    expect(remove.className).toContain("before:w-touch");
    expect(remove.className).toContain("before:h-touch");
  });

  describe("deprecated names (decision 0024)", () => {
    afterEach(() => vi.restoreAllMocks());

    it("still accepts variant, maps default to neutral, and lets tone win", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const cls = (el: React.ReactElement) => {
        const { container, unmount } = render(el);
        const c = (container.firstElementChild as HTMLElement).className;
        unmount();
        return c;
      };
      expect(cls(<Badge variant="default">a</Badge>)).toEqual(cls(<Badge tone="neutral">a</Badge>));
      expect(cls(<Badge variant="bone">a</Badge>)).toEqual(cls(<Badge tone="bone">a</Badge>));
      expect(cls(<Badge tone="success" variant="error">a</Badge>)).toEqual(cls(<Badge tone="success">a</Badge>));
      const messages = warn.mock.calls.map((c) => String(c[0]));
      expect(messages.filter((m) => m.includes("Badge: variant is deprecated. Use tone."))).toHaveLength(1);
    });

    it("still accepts onClose and onCloseLabel, warns, and loses to the new names", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const onClose = vi.fn();
      render(
        <Badge onClose={onClose} onCloseLabel="Clear draft">
          Draft
        </Badge>
      );
      fireEvent.click(screen.getByRole("button", { name: "Clear draft" }));
      expect(onClose).toHaveBeenCalledTimes(1);
      const messages = warn.mock.calls.map((c) => String(c[0]));
      expect(messages.some((m) => m.includes("Badge: onClose is deprecated. Use onDismiss."))).toBe(true);
      expect(messages.some((m) => m.includes("Badge: onCloseLabel is deprecated. Use dismissLabel."))).toBe(true);
      cleanup();
      onClose.mockClear();
      const onDismiss = vi.fn();
      render(
        <Badge onClose={onClose} onDismiss={onDismiss} onCloseLabel="Old name" dismissLabel="New name">
          Draft
        </Badge>
      );
      fireEvent.click(screen.getByRole("button", { name: "New name" }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
