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
    const { container } = render(<Avatar src="/missing.png" alt="Sacha" initials="SH" onError={onError} />);
    fireEvent.error(screen.getByRole("img", { name: "Sacha" }));
    expect(onError).toHaveBeenCalledTimes(1);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("SH")).toBeInTheDocument();
  });

  it("keeps the name on the fallback after a broken image", () => {
    render(<Avatar src="/missing.png" alt="Sacha" initials="SH" />);
    fireEvent.error(screen.getByRole("img", { name: "Sacha" }));
    const box = screen.getByRole("img", { name: "Sacha" });
    expect(box.tagName).toBe("DIV");
    expect(box).toHaveTextContent("SH");
  });

  it("names initials with alt, so they are not read as stray letters", () => {
    render(<Avatar alt="Sacha Hurley" initials="SH" />);
    expect(screen.getByRole("img", { name: "Sacha Hurley" })).toHaveTextContent("SH");
  });

  it("names an icon avatar with alt", () => {
    render(<Avatar alt="Build bot" icon={<span>custom</span>} />);
    expect(screen.getByRole("img", { name: "Build bot" })).toHaveTextContent("custom");
  });

  it("hides a decorative avatar (alt=\"\") from assistive tech", () => {
    const { container } = render(<Avatar alt="" initials="SH" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("SH");
  });

  it("gives a decorative image an empty alt", () => {
    const { container } = render(<Avatar alt="" src="/me.png" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("requires a name at the type level", () => {
    // @ts-expect-error: `alt` is required
    render(<Avatar initials="SH" />);
    expect(screen.getByText("SH")).toBeInTheDocument();
  });

  it("prefers initials over a custom icon", () => {
    render(<Avatar alt="Sacha" initials="SH" icon={<span>custom</span>} />);
    expect(screen.getByText("SH")).toBeInTheDocument();
    expect(screen.queryByText("custom")).toBeNull();
  });

  it("shows a custom icon when there are no initials", () => {
    render(<Avatar alt="Sacha" icon={<span>custom</span>} />);
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("falls back to a decorative @ glyph with nothing else to show", () => {
    render(<Avatar alt="Sacha" />);
    expect(screen.getByText("@")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: "Sacha" })).toBeInTheDocument();
  });

  it("names the status in text, not only by colour", () => {
    render(<Avatar alt="Sacha" initials="SH" status="away" />);
    expect(screen.getByRole("img", { name: "Status: away" })).toBeInTheDocument();
  });

  it.each([
    ["sm", "w-6"],
    ["md", "w-10"],
    ["lg", "w-16"],
    ["xl", "w-24"],
  ] as const)("sizes the box for %s", (size, width) => {
    const { container } = render(<Avatar alt="Sacha" initials="SH" size={size} />);
    expect(container.firstElementChild).toHaveClass(width);
  });
});
