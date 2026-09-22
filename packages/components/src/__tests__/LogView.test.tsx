import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LogView, type LogLine } from "../components/LogView";

const makeLines = (n: number, offset = 0): LogLine[] =>
  Array.from({ length: n }, (_, i) => ({ id: offset + i, text: `line ${offset + i}`, level: "info" as const }));

/** jsdom has no layout: fake a 100px viewport over 20px-per-line content. */
function fakeLayout(el: HTMLElement, lineCount: () => number) {
  let scrollTop = 0;
  Object.defineProperty(el, "clientHeight", { configurable: true, get: () => 100 });
  Object.defineProperty(el, "scrollHeight", { configurable: true, get: () => lineCount() * 20 });
  Object.defineProperty(el, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (v: number) => {
      scrollTop = Math.max(0, Math.min(v, lineCount() * 20 - 100));
    },
  });
}

describe("LogView", () => {
  afterEach(cleanup);

  it("renders a polite log with level icons plus text tags", () => {
    render(
      <LogView
        aria-label="Build output"
        showLineNumbers
        lines={[
          { id: 1, text: "started", level: "info", timestamp: "12:00:01" },
          { id: 2, text: "slow query", level: "warn" },
          { id: 3, text: "crashed", level: "error" },
          { id: 4, text: "state dump", level: "debug" },
        ]}
      />
    );
    const log = screen.getByRole("log", { name: "Build output" });
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveAttribute("tabindex", "0");
    for (const tag of ["INFO", "WARN", "ERROR", "DEBUG"]) expect(screen.getByText(tag)).toBeInTheDocument();
    expect(screen.getByText("12:00:01")).toBeInTheDocument();
    expect(screen.getByText("4")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows the empty state", () => {
    render(<LogView lines={[]} />);
    expect(screen.getByText("No output yet.")).toBeInTheDocument();
  });

  it("follows new lines, pauses when scrolled up, and resumes from the jump button", () => {
    const onFollowChange = vi.fn();
    let lines = makeLines(10);
    const { rerender } = render(<LogView lines={lines} onFollowChange={onFollowChange} />);
    const log = screen.getByRole("log");
    fakeLayout(log, () => lines.length);

    // Following: appending scrolls to the bottom.
    lines = [...lines, ...makeLines(5, 10)];
    rerender(<LogView lines={lines} onFollowChange={onFollowChange} />);
    expect(log.scrollTop).toBe(15 * 20 - 100);

    // User scrolls up: following pauses.
    log.scrollTop = 0;
    fireEvent.scroll(log);
    expect(onFollowChange).toHaveBeenLastCalledWith(false);

    // New lines no longer move the view; the jump button counts them.
    lines = [...lines, ...makeLines(3, 15)];
    rerender(<LogView lines={lines} onFollowChange={onFollowChange} />);
    expect(log.scrollTop).toBe(0);
    const jump = screen.getByRole("button", { name: /Jump to latest \(3 new\)/ });

    fireEvent.click(jump);
    expect(onFollowChange).toHaveBeenLastCalledWith(true);
    expect(log.scrollTop).toBe(18 * 20 - 100);
    expect(screen.queryByRole("button", { name: /Jump to latest/ })).toBeNull();
  });

  it("resumes following when the user scrolls back to the bottom", () => {
    let lines = makeLines(20);
    const { rerender } = render(<LogView lines={lines} />);
    const log = screen.getByRole("log");
    fakeLayout(log, () => lines.length);
    log.scrollTop = 0;
    fireEvent.scroll(log);
    expect(screen.getByRole("button", { name: /Jump to latest/ })).toBeInTheDocument();

    log.scrollTop = 10_000;
    fireEvent.scroll(log);
    expect(screen.queryByRole("button", { name: /Jump to latest/ })).toBeNull();

    lines = [...lines, ...makeLines(2, 20)];
    rerender(<LogView lines={lines} />);
    expect(log.scrollTop).toBe(22 * 20 - 100);
  });

  it("does not scroll when autoScroll is off", () => {
    let lines = makeLines(10);
    const { rerender } = render(<LogView lines={lines} autoScroll={false} />);
    const log = screen.getByRole("log");
    fakeLayout(log, () => lines.length);
    lines = [...lines, ...makeLines(5, 10)];
    rerender(<LogView lines={lines} autoScroll={false} />);
    expect(log.scrollTop).toBe(0);
  });
});
