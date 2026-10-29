import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ProgressBar } from "../components/ProgressBar";

describe("ProgressBar", () => {
  afterEach(() => cleanup());

  it("reports determinate values", () => {
    render(<ProgressBar label="Uploading" value={42} />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "42%");
    // 20 blocks, 42% fills 8 whole blocks
    expect(bar.querySelectorAll("[data-filled]")).toHaveLength(8);
  });

  it("clamps to max and honours a custom max", () => {
    render(<ProgressBar label="Steps" value={9} max={4} />);
    const bar = screen.getByRole("progressbar", { name: "Steps" });
    expect(bar).toHaveAttribute("aria-valuenow", "4");
    expect(bar).toHaveAttribute("aria-valuemax", "4");
    expect(bar).toHaveAttribute("data-state", "complete");
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<ProgressBar label="Connecting" />);
    const bar = screen.getByRole("progressbar", { name: "Connecting" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).not.toHaveAttribute("aria-valuetext");
    expect(bar).toHaveAttribute("data-state", "indeterminate");
  });

  it("keeps an accessible name when the label is hidden", () => {
    render(<ProgressBar label="Sync" value={10} showLabel={false} />);
    expect(screen.getByRole("progressbar", { name: "Sync" })).toBeInTheDocument();
    expect(screen.queryByText("Sync")).toBeNull();
  });

  it("defaults to the primary tone and takes the semantic roles", () => {
    render(<ProgressBar label="Default" value={50} />);
    render(<ProgressBar label="Info" value={50} tone="info" />);
    expect(screen.getByRole("progressbar", { name: "Default" })).toHaveAttribute("data-tone", "primary");
    const info = screen.getByRole("progressbar", { name: "Info" });
    expect(info).toHaveAttribute("data-tone", "info");
    expect(info.querySelector("[data-filled]")?.className).toContain("bg-info-600");
  });

  it("still accepts the deprecated variant, lets tone win, and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<ProgressBar label="Old" value={50} variant="error" />);
    render(<ProgressBar label="Both" value={50} variant="error" tone="success" />);
    const old = screen.getByRole("progressbar", { name: "Old" });
    expect(old).toHaveAttribute("data-tone", "error");
    expect(old.querySelector("[data-filled]")?.className).toContain("bg-error-600");
    expect(screen.getByRole("progressbar", { name: "Both" })).toHaveAttribute("data-tone", "success");
    const messages = warn.mock.calls.map((c) => String(c[0]));
    expect(messages.filter((m) => m.includes("ProgressBar: variant is deprecated. Use tone."))).toHaveLength(1);
    warn.mockRestore();
  });
});
