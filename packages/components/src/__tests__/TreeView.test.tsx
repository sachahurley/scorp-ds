import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TreeView, type TreeNode } from "../components/TreeView";

const nodes: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "components", label: "components", children: [{ id: "button", label: "Button.tsx" }] },
      { id: "index", label: "index.ts" },
    ],
  },
  { id: "package", label: "package.json" },
  { id: "readme", label: "README.md" },
];

const item = (name: string) => screen.getByRole("treeitem", { name: new RegExp(`^${name.replace(".", "\\.")}`) });

describe("TreeView", () => {
  afterEach(cleanup);

  it("exposes tree ARIA: levels, set sizes, expanded and selected", () => {
    render(<TreeView aria-label="Files" nodes={nodes} defaultExpanded={["src"]} defaultSelected="index" />);
    expect(screen.getByRole("tree", { name: "Files" })).toBeInTheDocument();
    const src = item("src");
    expect(src).toHaveAttribute("aria-level", "1");
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(src).toHaveAttribute("aria-setsize", "3");
    expect(src).toHaveAttribute("aria-posinset", "1");
    expect(screen.getAllByRole("group")).toHaveLength(1);

    const index = item("index.ts");
    expect(index).toHaveAttribute("aria-level", "2");
    expect(index).toHaveAttribute("aria-posinset", "2");
    expect(index).not.toHaveAttribute("aria-expanded");
    expect(index).toHaveAttribute("aria-selected", "true");
    expect(item("package.json")).toHaveAttribute("aria-selected", "false");

    expect(item("components")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("treeitem", { name: "Button.tsx" })).toBeNull();
  });

  it("uses a single tab stop on the selected node", () => {
    render(<TreeView aria-label="Files" nodes={nodes} defaultExpanded={["src"]} defaultSelected="index" />);
    const stops = screen.getAllByRole("treeitem").filter((el) => el.tabIndex === 0);
    expect(stops).toHaveLength(1);
    expect(stops[0]).toBe(item("index.ts"));
  });

  it("moves focus with arrows, Home and End", () => {
    render(<TreeView aria-label="Files" nodes={nodes} defaultExpanded={["src"]} />);
    const src = item("src");
    src.focus();
    fireEvent.keyDown(src, { key: "ArrowDown" });
    expect(item("components")).toHaveFocus();
    fireEvent.keyDown(item("components"), { key: "ArrowDown" });
    expect(item("index.ts")).toHaveFocus();
    fireEvent.keyDown(item("index.ts"), { key: "ArrowUp" });
    expect(item("components")).toHaveFocus();
    fireEvent.keyDown(item("components"), { key: "End" });
    expect(item("README.md")).toHaveFocus();
    fireEvent.keyDown(item("README.md"), { key: "Home" });
    expect(item("src")).toHaveFocus();
    expect(item("src").tabIndex).toBe(0);
    expect(item("README.md").tabIndex).toBe(-1);
  });

  it("expands with Right, enters children, collapses with Left and returns to the parent", () => {
    const onExpandedChange = vi.fn();
    render(<TreeView aria-label="Files" nodes={nodes} onExpandedChange={onExpandedChange} />);
    const src = item("src");
    src.focus();
    fireEvent.keyDown(src, { key: "ArrowRight" });
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(onExpandedChange).toHaveBeenLastCalledWith(["src"]);
    expect(src).toHaveFocus();

    fireEvent.keyDown(src, { key: "ArrowRight" });
    expect(item("components")).toHaveFocus();

    fireEvent.keyDown(item("components"), { key: "ArrowLeft" });
    expect(src).toHaveFocus();
    fireEvent.keyDown(src, { key: "ArrowLeft" });
    expect(src).toHaveAttribute("aria-expanded", "false");
    expect(onExpandedChange).toHaveBeenLastCalledWith([]);
  });

  it("selects with Space and activates with Enter", () => {
    const onSelectedChange = vi.fn();
    const onActivate = vi.fn();
    render(
      <TreeView aria-label="Files" nodes={nodes} onSelectedChange={onSelectedChange} onActivate={onActivate} />
    );
    const pkg = item("package.json");
    pkg.focus();
    fireEvent.keyDown(pkg, { key: " " });
    expect(onSelectedChange).toHaveBeenLastCalledWith("package");
    expect(pkg).toHaveAttribute("aria-selected", "true");
    expect(onActivate).not.toHaveBeenCalled();

    fireEvent.keyDown(pkg, { key: "ArrowDown" });
    fireEvent.keyDown(item("README.md"), { key: "Enter" });
    expect(onSelectedChange).toHaveBeenLastCalledWith("readme");
    expect(onActivate).toHaveBeenCalledWith("readme");
  });

  it("respects controlled expanded and selected", () => {
    const onExpandedChange = vi.fn();
    render(
      <TreeView
        aria-label="Files"
        nodes={nodes}
        expanded={[]}
        onExpandedChange={onExpandedChange}
        selected="readme"
      />
    );
    const src = item("src");
    src.focus();
    fireEvent.keyDown(src, { key: "ArrowRight" });
    expect(onExpandedChange).toHaveBeenCalledWith(["src"]);
    expect(src).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(src, { key: " " });
    expect(item("README.md")).toHaveAttribute("aria-selected", "true");
  });

  it("toggles branches and selects on click", () => {
    render(<TreeView aria-label="Files" nodes={nodes} />);
    fireEvent.click(screen.getByText("src"));
    expect(item("src")).toHaveAttribute("aria-expanded", "true");
    expect(item("src")).toHaveAttribute("aria-selected", "true");
  });

  it("type-ahead focuses the next matching node", () => {
    render(<TreeView aria-label="Files" nodes={nodes} />);
    const src = item("src");
    src.focus();
    fireEvent.keyDown(src, { key: "r" });
    expect(item("README.md")).toHaveFocus();
  });
});
