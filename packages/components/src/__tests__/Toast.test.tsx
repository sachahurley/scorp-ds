import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Toast, Toaster, toast } from "../components/Toast";

describe("toast() + <Toaster />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    act(() => toast.dismiss());
    cleanup();
    vi.useRealTimers();
  });

  it("queues toasts in order and picks the role from the tone", () => {
    render(<Toaster />);
    act(() => {
      toast("Link copied");
      toast.success("Saved");
      toast.error("Upload failed");
    });
    const statuses = screen.getAllByRole("status");
    expect(statuses.map((s) => s.textContent)).toEqual(["Link copied", "Saved"]);
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed");
  });

  it("auto-dismisses after the default duration", () => {
    render(<Toaster />);
    act(() => void toast("Bye soon"));
    act(() => void vi.advanceTimersByTime(4900));
    expect(screen.getByText("Bye soon")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(200));
    expect(screen.queryByText("Bye soon")).toBeNull();
  });

  it("pauses the timer while hovered and resumes with the remaining time", () => {
    render(<Toaster />);
    act(() => void toast("Hover me", { duration: 1000 }));
    const plate = screen.getByRole("status");
    act(() => void vi.advanceTimersByTime(600));
    fireEvent.mouseEnter(plate);
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.getByText("Hover me")).toBeInTheDocument();
    fireEvent.mouseLeave(plate);
    act(() => void vi.advanceTimersByTime(300));
    expect(screen.getByText("Hover me")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(200));
    expect(screen.queryByText("Hover me")).toBeNull();
  });

  it("persists with duration Infinity and offers a dismiss button", () => {
    render(<Toaster />);
    act(() => void toast.info("Syncing", { duration: Infinity }));
    act(() => void vi.advanceTimersByTime(60_000));
    expect(screen.getByText("Syncing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Syncing")).toBeNull();
  });

  it("fires the action and then dismisses", () => {
    const undo = vi.fn();
    render(<Toaster />);
    act(() => void toast("Item deleted", { action: { label: "Undo", onClick: undo } }));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Item deleted")).toBeNull();
  });

  it("replaces a toast in place when an id is reused", () => {
    render(<Toaster />);
    act(() => void toast("Saving", { id: "save" }));
    act(() => void toast.success("Saved", { id: "save" }));
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });
});

describe("controlled <Toaster toasts>", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("keeps the original API: no auto-dismiss unless an item sets duration", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Toaster
        toasts={[
          { id: 1, message: "Stays" },
          { id: 2, message: "Goes", duration: 1000 },
        ]}
        onDismiss={onDismiss}
      />
    );
    act(() => void vi.advanceTimersByTime(10_000));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByText("Stays"));
    expect(onDismiss).toHaveBeenLastCalledWith(1);
  });

  it("takes tone on items: error is announced as an alert", () => {
    render(<Toaster toasts={[{ id: 1, message: "Failed", tone: "error" }]} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });
});

describe("deprecated variant (decision 0024)", () => {
  afterEach(() => {
    act(() => toast.dismiss());
    cleanup();
    vi.restoreAllMocks();
  });

  const look = (el: React.ReactElement) => {
    const { container, unmount } = render(el);
    const plate = container.firstElementChild as HTMLElement;
    const out = { role: plate.getAttribute("role"), ring: plate.className, icon: plate.querySelector("svg path")?.getAttribute("d") };
    unmount();
    return out;
  };

  it("Toast still accepts variant, maps default to neutral, lets tone win, and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(look(<Toast variant="default">m</Toast>)).toEqual(look(<Toast tone="neutral">m</Toast>));
    expect(look(<Toast variant="error">m</Toast>)).toEqual(look(<Toast tone="error">m</Toast>));
    expect(look(<Toast tone="info" variant="error">m</Toast>)).toEqual(look(<Toast tone="info">m</Toast>));
    const messages = warn.mock.calls.map((c) => String(c[0]));
    expect(messages.filter((m) => m.includes("Toast: variant is deprecated. Use tone."))).toHaveLength(1);
  });

  it("toast() still accepts variant and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Toaster />);
    act(() => void toast("Old call", { variant: "error" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Old call");
    expect(warn.mock.calls.some((c) => String(c[0]).includes("toast(): variant is deprecated. Use tone."))).toBe(true);
  });
});
