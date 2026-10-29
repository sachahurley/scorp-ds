import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "../components/Modal";

describe("Modal", () => {
  afterEach(() => cleanup());

  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal open={false} onOpenChange={() => {}} title="T">
        body
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows title and body when open", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Hello">
        <p>Modal body</p>
      </Modal>
    );
    expect(screen.getByText("Hello")).toBeVisible();
    expect(screen.getByText("Modal body")).toBeVisible();
  });

  it("calls onOpenChange(false) when Escape is pressed", () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Hi">
        x
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when close control is activated", () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Hi">
        x
      </Modal>
    );
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Modal focus trap", () => {
  const realMatchMedia = window.matchMedia;
  afterEach(() => {
    cleanup();
    window.matchMedia = realMatchMedia;
  });

  /** Forces the docked breakpoint on or off for the next render. */
  function setWideViewport(wide: boolean) {
    window.matchMedia = ((query: string) =>
      ({
        matches: wide,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList) as typeof window.matchMedia;
  }

  function Body() {
    return <button type="button">inside last</button>;
  }

  it("wraps Shift+Tab from the first control back to the last", () => {
    render(
      <>
        <button type="button">outside</button>
        <Modal open onOpenChange={() => {}} title="Trapped">
          <Body />
        </Modal>
      </>
    );
    const close = screen.getByRole("button", { name: "Close modal" });
    const last = screen.getByRole("button", { name: "inside last" });
    close.focus();
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
  });

  it("wraps Tab from the last control back to the first", () => {
    render(
      <>
        <button type="button">outside</button>
        <Modal open onOpenChange={() => {}} title="Trapped">
          <Body />
        </Modal>
      </>
    );
    const close = screen.getByRole("button", { name: "Close modal" });
    const last = screen.getByRole("button", { name: "inside last" });
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(close).toHaveFocus();
  });

  it("wraps Shift+Tab from the panel itself (focus on open) to the last control", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Trapped">
        <Body />
      </Modal>
    );
    const panel = screen.getByRole("dialog", { name: "Trapped" });
    const last = screen.getByRole("button", { name: "inside last" });
    expect(panel).toHaveFocus();
    fireEvent.keyDown(panel, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
  });

  it("does not trap in the non-modal docked variant", () => {
    setWideViewport(true);
    render(
      <>
        <button type="button">outside</button>
        <Modal open onOpenChange={() => {}} title="Docked" docked>
          <Body />
        </Modal>
      </>
    );
    // Docked is non-modal on purpose: no aria-modal, and Tab is left alone.
    expect(screen.getByRole("dialog", { name: "Docked" })).not.toHaveAttribute("aria-modal");
    const last = screen.getByRole("button", { name: "inside last" });
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    // No wrap happened; jsdom does not move focus on Tab by itself.
    expect(last).toHaveFocus();
    expect(screen.getByRole("button", { name: "Close modal" })).not.toHaveFocus();
  });

  it("gives the close control a 44px pseudo-element hit area", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Hit area">
        <Body />
      </Modal>
    );
    const wrapper = screen.getByRole("button", { name: "Close modal" }).parentElement as HTMLElement;
    expect(wrapper.className).toContain("before:w-touch");
    expect(wrapper.className).toContain("before:h-touch");
  });

  it("closes when the enlarged hit area around the close button is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Hit area">
        <Body />
      </Modal>
    );
    const wrapper = screen.getByRole("button", { name: "Close modal" }).parentElement as HTMLElement;
    // A click on the pseudo-element is reported with the wrapper as target.
    fireEvent.click(wrapper);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("fires onOpenChange once when the button itself is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Hit area">
        <Body />
      </Modal>
    );
    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("rules header and footer with the hairline token, not 0.5px rules", () => {
    render(
      <Modal open onOpenChange={() => {}} title="T" footerContent={<button>ok</button>}>
        body
      </Modal>
    );
    const rule = "[length:var(--border-width-hairline)]";
    expect(document.body.innerHTML).toContain(`border-b-${rule}`);
    expect(document.body.innerHTML).toContain(`border-t-${rule}`);
    expect(document.body.innerHTML).not.toContain("0.5px");
  });
});

it("honors the size prop and restores focus on close", async () => {
  const { render, screen, fireEvent, waitFor } = await import("@testing-library/react");
  const { Modal } = await import("../components/Modal");
  const { useState } = await import("react");
  function Demo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>launch</button>
        <Modal open={open} onOpenChange={setOpen} title="Small" size="sm">
          hi
        </Modal>
      </>
    );
  }
  render(<Demo />);
  const launch = screen.getByRole("button", { name: "launch" });
  launch.focus();
  fireEvent.click(launch);
  const dialog = await screen.findByRole("dialog", { name: "Small" });
  expect(dialog).toHaveStyle({ width: "360px" });
  expect(dialog).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
  await waitFor(() => expect(launch).toHaveFocus());

});

describe("Modal sizes and uncontrolled use", () => {
  afterEach(() => cleanup());

  it("defaults to the 740px lg panel", () => {
    render(
      <Modal open onOpenChange={() => {}} title="Default">
        x
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Default" })).toHaveStyle({ width: "740px" });
  });

  it.each([
    ["sm", "360px"],
    ["md", "640px"],
    ["lg", "740px"],
    ["full", "100vw"],
  ] as const)("maps size %s to %s", (size, width) => {
    render(
      <Modal open onOpenChange={() => {}} title="Sized" size={size}>
        x
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Sized" }).style.width).toBe(width);
  });

  it("opens from defaultOpen and closes itself", () => {
    const onOpenChange = vi.fn();
    render(
      <Modal defaultOpen onOpenChange={onOpenChange} title="Self">
        x
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Self" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Modal deprecated width", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("still honours width, and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Modal open onOpenChange={() => {}} title="Legacy" width={320}>
        x
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Legacy" })).toHaveStyle({ width: "320px" });
    const messages = warn.mock.calls.map((c) => String(c[0]));
    expect(messages.filter((m) => m.includes("Modal: width is deprecated. Use size."))).toHaveLength(1);
  });

  it("lets size win over width when both are passed", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Modal open onOpenChange={() => {}} title="Sized" size="sm" width={500}>
        x
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Sized" })).toHaveStyle({ width: "360px" });
  });
});
