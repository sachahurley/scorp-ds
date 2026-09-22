import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Pagination, getPaginationRange } from "../components/Pagination";

describe("getPaginationRange", () => {
  it("shows every page when they fit", () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("adds an end ellipsis near the start", () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 20]);
  });

  it("adds both ellipses in the middle", () => {
    expect(getPaginationRange(10, 20)).toEqual([1, "ellipsis-start", 9, 10, 11, "ellipsis-end", 20]);
  });

  it("adds a start ellipsis near the end", () => {
    expect(getPaginationRange(20, 20)).toEqual([1, "ellipsis-start", 16, 17, 18, 19, 20]);
  });

  it("respects sibling and boundary counts", () => {
    expect(getPaginationRange(10, 20, 2, 2)).toEqual([1, 2, "ellipsis-start", 8, 9, 10, 11, 12, "ellipsis-end", 19, 20]);
    expect(getPaginationRange(10, 20, 0, 1)).toEqual([1, "ellipsis-start", 10, "ellipsis-end", 20]);
  });

  it("handles tiny counts", () => {
    expect(getPaginationRange(1, 1)).toEqual([1]);
    expect(getPaginationRange(2, 2)).toEqual([1, 2]);
    expect(getPaginationRange(1, 0)).toEqual([]);
  });
});

describe("Pagination", () => {
  afterEach(cleanup);

  it("marks the current page and calls onPageChange", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Page 4" })).not.toHaveAttribute("aria-current");

    fireEvent.click(screen.getByRole("button", { name: "Page 6" }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    // Clicking the current page is a no-op
    fireEvent.click(screen.getByRole("button", { name: "Page 5" }));
    expect(onPageChange).toHaveBeenCalledTimes(3);
  });

  it("disables prev on the first page and next on the last", () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    rerender(<Pagination page={3} pageCount={3} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("works uncontrolled", () => {
    render(<Pagination defaultPage={2} pageCount={4} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
  });

  it("hides ellipses from assistive tech", () => {
    const { container } = render(<Pagination page={10} pageCount={20} />);
    const hidden = container.querySelectorAll('li[aria-hidden="true"]');
    expect(hidden).toHaveLength(2);
  });

  it("renders nothing without pages", () => {
    const { container } = render(<Pagination pageCount={0} />);
    expect(container).toBeEmptyDOMElement();
  });
});
