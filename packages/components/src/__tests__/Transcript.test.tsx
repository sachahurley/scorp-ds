import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Message } from "../components/Message";
import { Transcript } from "../components/Transcript";

/** jsdom has no layout: fake a 100px viewport over 60px per turn. */
function fakeLayout(el: HTMLElement, turns: () => number) {
  let scrollTop = 0;
  Object.defineProperty(el, "clientHeight", { configurable: true, get: () => 100 });
  Object.defineProperty(el, "scrollHeight", { configurable: true, get: () => turns() * 60 });
  Object.defineProperty(el, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (v: number) => {
      scrollTop = Math.max(0, Math.min(v, turns() * 60 - 100));
    },
  });
}

const turns = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <Message key={i} author={i % 2 ? "assistant" : "user"}>
      {`turn ${i}`}
    </Message>
  ));

describe("Transcript", () => {
  afterEach(cleanup);

  it("is a named, focusable, polite log of articles", () => {
    render(<Transcript aria-label="Conversation">{turns(2)}</Transcript>);
    const log = screen.getByRole("log", { name: "Conversation" });
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveAttribute("aria-relevant", "additions");
    expect(log).toHaveAttribute("tabindex", "0");
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("requires a name, given as aria-label or aria-labelledby (decision 0029)", () => {
    render(
      <>
        {/* @ts-expect-error: one of aria-label or aria-labelledby is required */}
        <Transcript>{turns(1)}</Transcript>
        <h2 id="chat-title">Chat</h2>
        <Transcript aria-labelledby="chat-title">{turns(1)}</Transcript>
      </>
    );
    expect(screen.getByRole("log", { name: "Chat" })).toBeInTheDocument();
  });

  it("shows the empty state with no turns", () => {
    render(<Transcript aria-label="Conversation" emptyState={<p>Ask for a screen</p>} />);
    expect(screen.getByText("Ask for a screen")).toBeInTheDocument();
  });

  it("follows new turns, counts them while paused, and jumps back", () => {
    let n = 2;
    const { rerender } = render(<Transcript aria-label="Conversation">{turns(n)}</Transcript>);
    const log = screen.getByRole("log");
    fakeLayout(log, () => n);

    n = 3;
    rerender(<Transcript aria-label="Conversation">{turns(n)}</Transcript>);
    expect(log.scrollTop).toBe(80);

    log.scrollTop = 0;
    fireEvent.scroll(log);
    n = 5;
    rerender(<Transcript aria-label="Conversation">{turns(n)}</Transcript>);
    expect(log.scrollTop).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Jump to latest (2 new)" }));
    expect(log.scrollTop).toBe(200);
    expect(screen.queryByRole("button", { name: /Jump to latest/ })).toBeNull();
  });

  it("announces the start and end of a reply once each", () => {
    const { rerender } = render(<Transcript aria-label="Conversation">{turns(1)}</Transcript>);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("");
    rerender(<Transcript aria-label="Conversation" busy>{turns(2)}</Transcript>);
    expect(status).toHaveTextContent("Responding");
    rerender(<Transcript aria-label="Conversation">{turns(2)}</Transcript>);
    expect(status).toHaveTextContent("Response complete");
  });
});
