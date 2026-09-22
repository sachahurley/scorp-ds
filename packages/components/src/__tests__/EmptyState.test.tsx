import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EmptyState } from "../components/EmptyState";
import { Skeleton } from "../components/Skeleton";

describe("EmptyState", () => {
  afterEach(() => cleanup());

  it("renders title, description and both actions", () => {
    const create = vi.fn();
    const clear = vi.fn();
    render(
      <EmptyState
        icon="Search"
        title="No results"
        description="Try a shorter search."
        primaryAction={{ label: "Create project", onClick: create }}
        secondaryAction={{ label: "Clear filters", onClick: clear }}
      />
    );
    expect(screen.getByRole("heading", { level: 2, name: "No results" })).toBeInTheDocument();
    expect(screen.getByText("Try a shorter search.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Create project" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(create).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it("omits the action row when no actions are passed and honours titleAs", () => {
    render(<EmptyState title="Inbox zero" titleAs="h3" size="sm" />);
    expect(screen.getByRole("heading", { level: 3, name: "Inbox zero" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders link actions", () => {
    render(<EmptyState title="Nothing here" primaryAction={{ label: "Read the docs", href: "/docs" }} />);
    expect(screen.getByRole("link", { name: "Read the docs" })).toHaveAttribute("href", "/docs");
  });
});

describe("Skeleton", () => {
  afterEach(() => cleanup());

  it("renders hidden text lines with a shorter last line", () => {
    const { container } = render(<Skeleton lines={3} />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("aria-hidden", "true");
    const lines = root.querySelectorAll("span");
    expect(lines).toHaveLength(3);
    expect(lines[2].className).toContain("w-3/5");
  });

  it("renders avatar and rect shapes on plates", () => {
    const { container } = render(
      <>
        <Skeleton variant="avatar" size="lg" />
        <Skeleton variant="rect" className="h-40" animated={false} />
      </>
    );
    const [avatar, block] = Array.from(container.querySelectorAll("[data-skeleton]"));
    expect(avatar.className).toContain("size-control-lg");
    expect(avatar.className).toContain("plate-round");
    expect(block.className).toContain("h-40");
    expect(block.className).not.toContain("animate-pulse");
  });
});
