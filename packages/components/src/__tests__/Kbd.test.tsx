import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Kbd } from "../components/Kbd";

describe("Kbd", () => {
  afterEach(cleanup);

  it("renders a single key as one <kbd>", () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    const kbds = container.querySelectorAll("kbd");
    expect(kbds).toHaveLength(1);
    expect(kbds[0]).toHaveTextContent("Esc");
  });

  it("renders a combo as nested <kbd> elements with visible separators", () => {
    const { container } = render(<Kbd keys={["Ctrl", "Shift", "K"]} />);
    const outer = container.firstElementChild!;
    expect(outer.tagName).toBe("KBD");
    const inner = outer.querySelectorAll(":scope > kbd");
    expect(Array.from(inner).map((k) => k.textContent)).toEqual(["Ctrl", "Shift", "K"]);
    expect(outer).toHaveTextContent("Ctrl+Shift+K");
  });

  it("supports a custom separator", () => {
    const { container } = render(<Kbd keys={["G", "H"]} separator="then" />);
    expect(container.firstElementChild).toHaveTextContent("GthenH");
  });

  it("treats a one-key array like a single key", () => {
    const { container } = render(<Kbd keys={["Enter"]} size="md" />);
    expect(container.querySelectorAll("kbd")).toHaveLength(1);
    expect(container.firstElementChild).toHaveTextContent("Enter");
  });
});
