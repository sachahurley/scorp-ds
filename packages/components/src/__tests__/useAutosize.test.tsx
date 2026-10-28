import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useAutosize, type AutosizeOptions } from "../lib/use-autosize";

/**
 * jsdom has no layout: report content as `lines` rows of 20px plus 8px of
 * padding. The field has a 1px border, which scrollHeight leaves out and the
 * border-box height must add back, so every expected height is content + 2px.
 */
let lines = 1;
function fakeScrollHeight(el: HTMLElement) {
  Object.defineProperty(el, "scrollHeight", { configurable: true, get: () => lines * 20 + 8 });
}

function Field(props: Omit<AutosizeOptions, "value"> & { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutosize(ref, props);
  return (
    <textarea
      ref={(el) => {
        if (el) fakeScrollHeight(el);
        ref.current = el;
      }}
      aria-label="Message"
      value={props.value}
      readOnly
      style={{ lineHeight: "20px", paddingTop: "4px", paddingBottom: "4px", border: "1px solid" }}
    />
  );
}

describe("useAutosize", () => {
  afterEach(() => {
    cleanup();
    lines = 1;
  });

  it("sizes to the content", () => {
    lines = 3;
    render(<Field value="a\nb\nc" />);
    const field = screen.getByRole("textbox");
    expect(field.style.height).toBe("70px");
    expect(field.style.overflowY).toBe("hidden");
  });

  it("never drops below minRows", () => {
    render(<Field value="" minRows={2} />);
    expect(screen.getByRole("textbox").style.height).toBe("50px");
  });

  it("stops at maxRows and scrolls", () => {
    lines = 12;
    render(<Field value="long" maxRows={4} />);
    const field = screen.getByRole("textbox");
    expect(field.style.height).toBe("90px");
    expect(field.style.overflowY).toBe("auto");
  });

  it("re-measures when the value changes", () => {
    const { rerender } = render(<Field value="a" />);
    const field = screen.getByRole("textbox");
    expect(field.style.height).toBe("30px");
    lines = 2;
    rerender(<Field value={"a\nb"} />);
    expect(field.style.height).toBe("50px");
  });

  it("leaves the height alone when disabled", () => {
    lines = 5;
    render(<Field value="a" enabled={false} />);
    expect(screen.getByRole("textbox").style.height).toBe("");
  });
});
