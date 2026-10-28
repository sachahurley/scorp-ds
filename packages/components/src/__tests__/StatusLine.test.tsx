import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { StatusLine, StatusLineSegment } from "../components/StatusLine";

describe("StatusLine", () => {
  afterEach(cleanup);

  it("is a labelled group that does not announce changes by default", () => {
    render(<StatusLine left="NORMAL" />);
    const bar = screen.getByRole("group", { name: "Status" });
    expect(bar).not.toHaveAttribute("aria-live");
  });

  it("becomes a polite live region when live", () => {
    render(<StatusLine live aria-label="Build" right="ok" />);
    expect(screen.getByRole("status", { name: "Build" })).toHaveAttribute("aria-live", "polite");
  });

  it("places left, center and right content in that order", () => {
    render(<StatusLine left="L" center="C" right="R" />);
    const slots = Array.from(screen.getByRole("group").children).map((n) => n.textContent);
    expect(slots).toEqual(["L", "C", "R"]);
  });
});

describe("StatusLineSegment", () => {
  afterEach(cleanup);

  it("defaults to the neutral tone", () => {
    render(<StatusLineSegment>main</StatusLineSegment>);
    expect(screen.getByText("main").parentElement).toHaveAttribute("data-tone", "neutral");
  });

  it("records its tone and keeps the text, so colour is never the only signal", () => {
    render(<StatusLineSegment tone="error">2 errors</StatusLineSegment>);
    expect(screen.getByText("2 errors").parentElement).toHaveAttribute("data-tone", "error");
  });

  it("renders a decorative icon only when one is named", () => {
    const { container, rerender } = render(<StatusLineSegment>plain</StatusLineSegment>);
    expect(container.querySelector("svg")).toBeNull();
    rerender(<StatusLineSegment icon="Check">done</StatusLineSegment>);
    expect(container.querySelector('[aria-hidden="true"] svg')).not.toBeNull();
  });
});
