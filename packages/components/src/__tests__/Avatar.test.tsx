import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "../components/Avatar";

describe("Avatar", () => {
  afterEach(cleanup);

  it("shows the image with its alt text when src is given", () => {
    render(<Avatar src="/me.png" alt="Sacha" initials="SH" />);
    expect(screen.getByRole("img", { name: "Sacha" })).toHaveAttribute("src", "/me.png");
    expect(screen.queryByText("SH")).toBeNull();
  });

  it("falls back to initials when the image fails, and reports the error", () => {
    const onError = vi.fn();
    render(<Avatar src="/missing.png" alt="Sacha" initials="SH" onError={onError} />);
    fireEvent.error(screen.getByRole("img", { name: "Sacha" }));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("img", { name: "Sacha" })).toBeNull();
    expect(screen.getByText("SH")).toBeInTheDocument();
  });

  it("prefers initials over a custom icon", () => {
    render(<Avatar initials="SH" icon={<span>custom</span>} />);
    expect(screen.getByText("SH")).toBeInTheDocument();
    expect(screen.queryByText("custom")).toBeNull();
  });

  it("shows a custom icon when there are no initials", () => {
    render(<Avatar icon={<span>custom</span>} />);
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("falls back to a decorative @ glyph with nothing else to show", () => {
    render(<Avatar />);
    expect(screen.getByText("@")).toHaveAttribute("aria-hidden", "true");
  });

  it("names the status in text, not only by colour", () => {
    render(<Avatar initials="SH" status="away" />);
    expect(screen.getByRole("img", { name: "Status: away" })).toBeInTheDocument();
  });

  it.each([
    ["sm", "w-6"],
    ["md", "w-10"],
    ["lg", "w-16"],
    ["xl", "w-24"],
  ] as const)("sizes the box for %s", (size, width) => {
    const { container } = render(<Avatar initials="SH" size={size} />);
    expect(container.firstElementChild).toHaveClass(width);
  });
});
