import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { TUI_ICON_BITMAPS, TUI_ICON_GLYPHS, TuiIcon, type TuiIconName } from "../components/TuiIcon";

const names = Object.keys(TUI_ICON_GLYPHS) as TuiIconName[];

describe("TuiIcon bitmaps", () => {
  it("has a bitmap for every named icon, and no bitmap without a name", () => {
    expect(Object.keys(TUI_ICON_BITMAPS).sort()).toEqual([...names].sort());
  });

  it.each(names)("draws %s on a 7x7 grid of on and off pixels", (name) => {
    const rows = TUI_ICON_BITMAPS[name];
    expect(rows).toHaveLength(7);
    for (const row of rows) expect(row).toMatch(/^[.#]{7}$/);
    expect(rows.join("")).toContain("#");
  });
});

describe("TuiIcon", () => {
  afterEach(cleanup);

  it("is hidden from assistive tech, so the control around it carries the label", () => {
    const { container } = render(<TuiIcon name="Check" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("draws in currentColor so it inherits the text colour", () => {
    const { container } = render(<TuiIcon name="Check" />);
    expect(container.querySelector("svg")).toHaveAttribute("fill", "currentColor");
  });

  it.each([
    ["3", "w-3", 10.5],
    ["4", "w-4", 14],
    ["5", "w-5", 14],
    ["6", "w-6", 21],
    ["8", "w-8", 28],
  ] as const)("at size %s uses a %s box and a %dpx drawing", (size, box, px) => {
    const { container } = render(<TuiIcon name="Star" size={size} />);
    expect(container.firstElementChild).toHaveClass(box);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", String(px));
    expect(svg).toHaveAttribute("height", String(px));
  });

  it("shows a ? for a name it does not know", () => {
    const { container } = render(<TuiIcon name="NotAnIcon" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.firstElementChild).toHaveTextContent("?");
  });
});
