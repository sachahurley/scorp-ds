import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Composer } from "../components/Composer";
import { Button } from "../components/Button";

const field = () => screen.getByRole("textbox", { name: "Message" });
const type = (text: string) => fireEvent.change(field(), { target: { value: text } });

describe("Composer", () => {
  afterEach(cleanup);

  it("names the field, links the shortcut hint, and disables send while blank", () => {
    render(<Composer aria-label="Message" onSubmit={() => {}} />);
    const hintId = field().getAttribute("aria-describedby");
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId!)).toHaveTextContent(/send.*new line/);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    type("   ");
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("sends trimmed text on Enter and clears itself when uncontrolled", () => {
    const onSubmit = vi.fn();
    render(<Composer aria-label="Message" onSubmit={onSubmit} />);
    type("  make a settings screen  ");
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledWith("make a settings screen");
    expect(field()).toHaveValue("");
  });

  it("sends from the button too", () => {
    const onSubmit = vi.fn();
    render(<Composer aria-label="Message" onSubmit={onSubmit} />);
    type("hello");
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSubmit).toHaveBeenCalledWith("hello");
  });

  it("does not send on Shift+Enter or during IME composition", () => {
    const onSubmit = vi.fn();
    render(<Composer aria-label="Message" onSubmit={onSubmit} />);
    type("hello");
    fireEvent.keyDown(field(), { key: "Enter", shiftKey: true });
    fireEvent.keyDown(field(), { key: "Enter", isComposing: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("with mod-enter, sends on Ctrl/Cmd+Enter only", () => {
    const onSubmit = vi.fn();
    render(<Composer aria-label="Message" onSubmit={onSubmit} submitKey="mod-enter" />);
    type("hello");
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(field(), { key: "Enter", ctrlKey: true });
    expect(onSubmit).toHaveBeenCalledWith("hello");
  });

  it("leaves a controlled value for the parent to clear", () => {
    const onSubmit = vi.fn();
    const onValueChange = vi.fn();
    render(<Composer aria-label="Message" value="draft" onValueChange={onValueChange} onSubmit={onSubmit} />);
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledWith("draft");
    expect(field()).toHaveValue("draft");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("while busy, swaps send for stop and Enter stops sending", () => {
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(<Composer aria-label="Message" defaultValue="next one" busy onStop={onStop} onSubmit={onSubmit} />);
    expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Stop response" }));
    expect(onStop).toHaveBeenCalled();
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(field()).not.toBeDisabled();
  });

  it("busy without onStop shows a loading send button", () => {
    render(<Composer aria-label="Message" defaultValue="x" busy onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send message" })).toHaveAttribute("aria-busy", "true");
  });

  it("disables the field, the actions and send together", () => {
    render(
      <Composer
        aria-label="Message"
        disabled
        defaultValue="x"
        onSubmit={() => {}}
        actions={<Button variant="ghost" size="sm" aria-label="Attach">+</Button>}
      />
    );
    expect(field()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Attach" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("wires the error message and keeps the hint described", () => {
    render(<Composer aria-label="Message" onSubmit={() => {}} errorMessage="Too long" />);
    expect(field()).toHaveAttribute("aria-invalid", "true");
    const ids = field().getAttribute("aria-describedby")!.split(" ");
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[1])).toHaveTextContent("Too long");
  });

  it("requires an accessible name and accepts each way of giving one (decision 0029)", () => {
    render(
      <>
        {/* @ts-expect-error: one of label, aria-label or aria-labelledby is required */}
        <Composer onSubmit={() => {}} />
        <Composer label="Prompt" onSubmit={() => {}} />
        <p id="pane-title">Chat</p>
        <Composer aria-labelledby="pane-title" onSubmit={() => {}} />
      </>
    );
    expect(screen.getByRole("textbox", { name: "Prompt" })).toBeInTheDocument();
    expect(screen.getByText("Prompt").tagName).toBe("LABEL");
    expect(screen.getByRole("textbox", { name: "Chat" })).toBeInTheDocument();
  });

  it("shows focus as a ring colour change keyed on the field, with no inset ring (decision 0022)", () => {
    const { container } = render(<Composer aria-label="Message" onSubmit={() => {}} errorMessage="Too long" />);
    const ring = container.querySelector("form")!;
    expect(ring.className).toContain("has-[textarea:focus]:!bg-[var(--field-border-focus)]");
    // The buttons keep their own inset ring; the plate draws none.
    expect(ring.className).not.toContain("box-shadow");
    expect(container.querySelector("fieldset")!.className).not.toContain("box-shadow");
  });

  it("hides the hint when hint is false, and forwards the ref to the field", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Composer aria-label="Message" ref={ref} hint={false} onSubmit={() => {}} />);
    expect(field()).not.toHaveAttribute("aria-describedby");
    expect(ref.current).toBe(field());
  });
});
