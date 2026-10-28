import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CodeBlock } from "../components/CodeBlock";

const source = '<Card title="Danger zone">\n  <Button variant="destructive">Delete</Button>\n</Card>\n';

describe("CodeBlock", () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the code as text in a named, focusable block", () => {
    render(<CodeBlock title="settings-screen.tsx" language="tsx" code={source} />);
    const figure = screen.getByRole("figure", { name: "settings-screen.tsx" });
    expect(figure).toHaveAttribute("data-language", "tsx");
    expect(figure.querySelector("pre")).toHaveAttribute("tabindex", "0");
    expect(figure.querySelector("code")?.textContent).toContain('<Button variant="destructive">Delete</Button>');
    // the trailing newline does not make an empty fourth line
    expect(figure.querySelectorAll("code > span")).toHaveLength(3);
  });

  it("falls back to the language, then 'Code', for the name", () => {
    render(
      <>
        <CodeBlock language="json" code="{}" />
        <CodeBlock code="x" copyable={false} />
      </>
    );
    expect(screen.getByRole("figure", { name: "json" })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "Code" })).toBeInTheDocument();
  });

  it("hides line numbers and markers from assistive tech", () => {
    render(<CodeBlock code={source} showLineNumbers highlightLines={[2]} />);
    const rows = screen.getByRole("figure").querySelectorAll("code > span");
    expect(rows[1]).toHaveAttribute("data-highlighted", "true");
    expect(rows[0]).not.toHaveAttribute("data-highlighted");
    for (const hidden of rows[1].querySelectorAll("[aria-hidden='true']")) {
      expect(hidden).toHaveClass("select-none");
    }
    expect(rows[1]).toHaveTextContent("2");
  });

  it("copies, announces, and resets after two seconds", async () => {
    vi.useFakeTimers();
    const onCopy = vi.fn();
    render(<CodeBlock code={source} onCopy={onCopy} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    });
    expect(writeText).toHaveBeenCalledWith(source);
    expect(onCopy).toHaveBeenCalledWith(source);
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("says so when the copy fails", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<CodeBlock code="x" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    });
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument();
  });

  it("drops the copy button without the Clipboard API", () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    render(<CodeBlock code="x" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
