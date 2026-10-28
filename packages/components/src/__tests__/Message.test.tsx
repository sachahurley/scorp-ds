import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Message } from "../components/Message";

describe("Message", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    document.documentElement.style.removeProperty("--duration-slower");
  });

  it("is an article named by its role label", () => {
    render(<Message author="user" meta="12:04">Make a settings screen</Message>);
    const turn = screen.getByRole("article", { name: "You" });
    expect(turn).toHaveAttribute("data-author", "user");
    expect(turn).toHaveTextContent("12:04");
    expect(turn).toHaveTextContent("Make a settings screen");
  });

  it("uses the default labels and accepts a custom one", () => {
    render(
      <>
        <Message author="assistant">out</Message>
        <Message author="assistant" label="Claude">out</Message>
        <Message author="system">Replaying a recorded session</Message>
      </>
    );
    expect(screen.getByRole("article", { name: "Scorp" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Claude" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "System" })).toHaveTextContent("Replaying a recorded session");
  });

  it("marks a streaming turn busy and draws a hidden cursor", () => {
    render(<Message author="assistant" status="streaming">Here is</Message>);
    const turn = screen.getByRole("article");
    expect(turn).toHaveAttribute("aria-busy", "true");
    const cursor = turn.querySelector("[data-cursor]");
    expect(cursor).toHaveAttribute("aria-hidden", "true");
  });

  it("blinks the cursor on the --duration-slower beat", () => {
    vi.useFakeTimers();
    document.documentElement.style.setProperty("--duration-slower", "500ms");
    render(<Message author="assistant" status="streaming">Here is</Message>);
    const cursor = screen.getByRole("article").querySelector("[data-cursor]")!;
    expect(cursor).not.toHaveClass("invisible");
    act(() => vi.advanceTimersByTime(500));
    expect(cursor).toHaveClass("invisible");
    act(() => vi.advanceTimersByTime(500));
    expect(cursor).not.toHaveClass("invisible");
  });

  it("holds the cursor still under reduced motion", () => {
    vi.useFakeTimers();
    document.documentElement.style.setProperty("--duration-slower", "500ms");
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation(
      (query) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList
    );
    render(<Message author="assistant" status="streaming">Here is</Message>);
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole("article").querySelector("[data-cursor]")).not.toHaveClass("invisible");
    matchMedia.mockRestore();
  });

  it("shows stopped and error footers, with retry", () => {
    const onRetry = vi.fn();
    render(
      <>
        <Message author="assistant" status="stopped">partial</Message>
        <Message author="assistant" status="error" errorMessage="The replay file is missing." onRetry={onRetry}>
          partial
        </Message>
      </>
    );
    expect(screen.getByText("Stopped")).toBeInTheDocument();
    expect(screen.getByText("The replay file is missing.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders header actions in the DOM, not only on hover", () => {
    render(
      <Message author="assistant" actions={<button aria-label="Copy message">c</button>}>
        out
      </Message>
    );
    expect(screen.getByRole("button", { name: "Copy message" })).toBeVisible();
  });
});
