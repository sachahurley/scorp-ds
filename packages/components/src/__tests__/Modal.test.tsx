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
