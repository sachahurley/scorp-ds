import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useFollowScroll } from "../lib/use-follow-scroll";

/** jsdom has no layout: fake a 100px viewport over `height()` px of content. */
function fakeLayout(el: HTMLElement, height: () => number) {
  let scrollTop = 0;
  Object.defineProperty(el, "clientHeight", { configurable: true, get: () => 100 });
  Object.defineProperty(el, "scrollHeight", { configurable: true, get: () => height() });
  Object.defineProperty(el, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (v: number) => {
      scrollTop = Math.max(0, Math.min(v, height() - 100));
    },
  });
}

/** ResizeObserver stand-in that lets a test fire the callback. */
const observers: Array<() => void> = [];
class FakeResizeObserver {
  constructor(private cb: () => void) {}
  observe() {
    observers.push(this.cb);
  }
  disconnect() {
    observers.splice(observers.indexOf(this.cb), 1);
  }
}

function Region({ items, grow }: { items: string[]; grow?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollRef, onScroll, following, unseen, resume } = useFollowScroll({
    content: items,
    count: items.length,
    contentRef: grow ? contentRef : undefined,
  });
  return (
    <>
      <div ref={scrollRef} onScroll={onScroll} data-testid="region">
        <div ref={contentRef}>
          {items.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </div>
      <output>{following ? "following" : `paused ${unseen}`}</output>
      <button onClick={resume}>resume</button>
    </>
  );
}

describe("useFollowScroll", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("follows new items, counts them while paused, and resumes", () => {
    let items = ["a", "b"];
    const height = () => items.length * 60;
    const { rerender } = render(<Region items={items} />);
    const region = screen.getByTestId("region");
    fakeLayout(region, height);

    items = [...items, "c"];
    rerender(<Region items={items} />);
    expect(region.scrollTop).toBe(80);

    region.scrollTop = 0;
    fireEvent.scroll(region);
    items = [...items, "d", "e"];
    rerender(<Region items={items} />);
    expect(region.scrollTop).toBe(0);
    expect(screen.getByRole("status")).toHaveTextContent("paused 2");

    fireEvent.click(screen.getByRole("button", { name: "resume" }));
    expect(screen.getByRole("status")).toHaveTextContent("following");
    expect(region.scrollTop).toBe(200);
  });

  it("follows content that grows in place while pinned, and not while paused", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    let height = 200;
    render(<Region items={["a"]} grow />);
    const region = screen.getByTestId("region");
    fakeLayout(region, () => height);
    region.scrollTop = 100;
    fireEvent.scroll(region);

    height = 260;
    act(() => observers.forEach((cb) => cb()));
    expect(region.scrollTop).toBe(160);

    region.scrollTop = 0;
    fireEvent.scroll(region);
    height = 400;
    act(() => observers.forEach((cb) => cb()));
    expect(region.scrollTop).toBe(0);
  });
});
