import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { BottomSheet } from "../components/BottomSheet";

afterEach(() => cleanup());

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>open sheet</button>
      <BottomSheet open={open} onOpenChange={setOpen} aria-label="Queue">
        <p>tracks</p>
      </BottomSheet>
    </>
  );
}

it("renders a labelled close button that dismisses the sheet", () => {
  const onOpenChange = vi.fn();
  render(
    <BottomSheet open onOpenChange={onOpenChange} aria-label="Queue">
      <p>tracks</p>
    </BottomSheet>
  );
  const close = screen.getByRole("button", { name: "Close" });
  // 44px target comes from the button box itself (w-touch / h-touch).
  expect(close.className).toContain("w-touch");
  expect(close.className).toContain("h-touch");
  fireEvent.click(close);
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it("accepts a custom close button label", () => {
  render(
    <BottomSheet open onOpenChange={() => {}} aria-label="Queue" closeLabel="Close queue">
      <p>tracks</p>
    </BottomSheet>
  );
  expect(screen.getByRole("button", { name: "Close queue" })).toBeVisible();
});

it("traps Tab and Shift+Tab inside the sheet", () => {
  render(
    <>
      <button type="button">outside</button>
      <BottomSheet open onOpenChange={() => {}} aria-label="Queue">
        <button type="button">inside last</button>
      </BottomSheet>
    </>
  );
  const close = screen.getByRole("button", { name: "Close" });
  const last = screen.getByRole("button", { name: "inside last" });

  last.focus();
  fireEvent.keyDown(last, { key: "Tab" });
  expect(close).toHaveFocus();

  fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
  expect(last).toHaveFocus();
});

it("moves focus onto the sheet on open and back to the invoker on close", async () => {
  render(<Demo />);
  const launch = screen.getByRole("button", { name: "open sheet" });
  launch.focus();
  fireEvent.click(launch);
  const sheet = await screen.findByRole("dialog", { name: "Queue" });
  expect(sheet).toHaveFocus();
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() => expect(launch).toHaveFocus());
});

it("opens from defaultOpen and closes itself", () => {
  const onOpenChange = vi.fn();
  render(
    <BottomSheet defaultOpen onOpenChange={onOpenChange} aria-label="Queue">
      <p>tracks</p>
    </BottomSheet>
  );
  expect(screen.getByRole("dialog", { name: "Queue" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
});
