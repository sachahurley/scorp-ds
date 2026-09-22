import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { BottomSheet } from "../components/BottomSheet";

afterEach(() => cleanup());

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>open sheet</button>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)} ariaLabel="Queue">
        <p>tracks</p>
      </BottomSheet>
    </>
  );
}

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
