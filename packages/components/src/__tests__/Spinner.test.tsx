import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Spinner } from "../components/Spinner";

const frameOf = (container: HTMLElement) => container.querySelector("[data-spinner-frame] path")?.getAttribute("d");

function mockReducedMotion(matches: boolean) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: matches && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe("Spinner", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("is a status with a visually hidden label (default Loading)", () => {
    const { unmount } = render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    unmount();
    render(<Spinner label="Loading invoices" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading invoices");
    expect(screen.getByText("Loading invoices")).toHaveClass("sr-only");
  });

  it("cycles frames over time", () => {
    vi.useFakeTimers();
    const { container } = render(<Spinner />);
    const first = frameOf(container);
    act(() => void vi.advanceTimersByTime(100));
    expect(frameOf(container)).not.toBe(first);
  });

  it("holds a static frame when the user prefers reduced motion", () => {
    const restore = mockReducedMotion(true);
    try {
      vi.useFakeTimers();
      const { container } = render(<Spinner />);
      const first = frameOf(container);
      act(() => void vi.advanceTimersByTime(1000));
      expect(frameOf(container)).toBe(first);
      expect(container.querySelector("[data-spinner-frame]")).toHaveAttribute("data-spinner-frame", "static");
    } finally {
      restore();
    }
  });
});
