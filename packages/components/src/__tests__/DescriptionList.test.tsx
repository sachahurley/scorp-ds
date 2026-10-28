import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { DescriptionList } from "../components/DescriptionList";

const items = [
  { term: "Status", description: "Online" },
  { term: "Uptime", description: "12d 4h", key: "uptime" },
];

describe("DescriptionList", () => {
  afterEach(cleanup);

  it("renders each item as a term and description pair inside one <dl>", () => {
    const { container } = render(<DescriptionList items={items} />);
    const dl = container.querySelector("dl")!;
    expect(Array.from(dl.querySelectorAll("dt")).map((n) => n.textContent)).toEqual(["Status", "Uptime"]);
    expect(Array.from(dl.querySelectorAll("dd")).map((n) => n.textContent)).toEqual(["Online", "12d 4h"]);
  });

  it("keeps each pair in its own wrapper so a term is followed by its description", () => {
    const { container } = render(<DescriptionList items={items} />);
    for (const pair of container.querySelectorAll("dl > div")) {
      expect(Array.from(pair.children).map((n) => n.tagName)).toEqual(["DT", "DD"]);
    }
  });

  it("defaults to the inline layout", () => {
    const { container } = render(<DescriptionList items={items} />);
    expect(container.querySelector("dl")).toHaveAttribute("data-layout", "inline");
  });

  it("stacks terms over descriptions in the stacked layout", () => {
    const { container } = render(<DescriptionList items={items} layout="stacked" />);
    expect(container.querySelector("dl")).toHaveAttribute("data-layout", "stacked");
    expect(container.querySelector("dl > div")).toHaveClass("flex-col");
  });

  it("draws the dotted leader only when asked, and only inline", () => {
    const withLeader = render(<DescriptionList items={items} leader />);
    expect(withLeader.container.querySelector("dt")!.className).toContain("after:border-dotted");
    cleanup();
    const stacked = render(<DescriptionList items={items} layout="stacked" leader />);
    expect(stacked.container.querySelector("dt")!.className).not.toContain("after:border-dotted");
  });
});
