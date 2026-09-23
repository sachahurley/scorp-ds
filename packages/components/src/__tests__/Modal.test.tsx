import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "../components/Modal";

describe("Modal", () => {
  afterEach(() => cleanup());

  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="T">
        body
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows title and body when open", () => {
    render(
      <Modal isOpen onClose={() => {}} title="Hello">
        <p>Modal body</p>
      </Modal>
    );
    expect(screen.getByText("Hello")).toBeVisible();
    expect(screen.getByText("Modal body")).toBeVisible();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Hi">
        x
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close control is activated", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Hi">
        x
      </Modal>
    );
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
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
        <Modal isOpen onClose={() => {}} title="Trapped">
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
        <Modal isOpen onClose={() => {}} title="Trapped">
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
      <Modal isOpen onClose={() => {}} title="Trapped">
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
        <Modal isOpen onClose={() => {}} title="Docked" docked>
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
      <Modal isOpen onClose={() => {}} title="Hit area">
        <Body />
      </Modal>
    );
    const wrapper = screen.getByRole("button", { name: "Close modal" }).parentElement as HTMLElement;
    expect(wrapper.className).toContain("before:w-touch");
    expect(wrapper.className).toContain("before:h-touch");
  });

  it("closes when the enlarged hit area around the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Hit area">
        <Body />
      </Modal>
    );
    const wrapper = screen.getByRole("button", { name: "Close modal" }).parentElement as HTMLElement;
    // A click on the pseudo-element is reported with the wrapper as target.
    fireEvent.click(wrapper);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onClose once when the button itself is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Hit area">
        <Body />
      </Modal>
    );
    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("rules header and footer with the hairline token, not 0.5px rules", () => {
    render(
      <Modal isOpen onClose={() => {}} title="T" footerContent={<button>ok</button>}>
        body
      </Modal>
    );
    const rule = "[length:var(--border-width-hairline)]";
    expect(document.body.innerHTML).toContain(`border-b-${rule}`);
    expect(document.body.innerHTML).toContain(`border-t-${rule}`);
    expect(document.body.innerHTML).not.toContain("0.5px");
  });
});

it("honors the width prop and restores focus on close", async () => {
  const { render, screen, fireEvent, waitFor } = await import("@testing-library/react");
  const { Modal } = await import("../components/Modal");
  const { useState } = await import("react");
  function Demo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>launch</button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Small" width={320}>
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
  expect(dialog).toHaveStyle({ width: "320px" });
  expect(dialog).toHaveFocus();
  fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
  await waitFor(() => expect(launch).toHaveFocus());

});
