import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TreeView, type TreeNode } from "../components/TreeView";
import { EmptyState } from "../components/EmptyState";

const nodes: TreeNode[] = [
  { id: "src", label: "src", children: [{ id: "index", label: "index.ts" }] },
  { id: "readme", label: "README.md" },
];

const empty = <EmptyState size="sm" titleAs="p" title="No files yet" primaryAction={{ label: "Add a file" }} />;

describe("TreeView emptyState", () => {
  afterEach(cleanup);

  it("renders the empty state in place of the tree, in a group that keeps the tree's name", () => {
    render(<TreeView aria-label="Files" nodes={[]} emptyState={empty} className="w-72" />);
    // A tree must own treeitems, so an empty one is not exposed as a tree at all.
    expect(screen.queryByRole("tree")).toBeNull();
    expect(screen.queryAllByRole("treeitem")).toHaveLength(0);
    const group = screen.getByRole("group", { name: "Files" });
    expect(group).toHaveTextContent("No files yet");
    expect(group).toHaveClass("w-72");
    // The empty content's own controls stay reachable.
    expect(screen.getByRole("button", { name: "Add a file" })).toBeInTheDocument();
  });

  it("names the empty group from aria-labelledby", () => {
    render(
      <>
        <h2 id="files-heading">Project files</h2>
        <TreeView aria-labelledby="files-heading" nodes={[]} emptyState="Nothing here" />
      </>
    );
    expect(screen.getByRole("group", { name: "Project files" })).toHaveTextContent("Nothing here");
  });

  it("renders nothing when there are no nodes and no emptyState", () => {
    const { container } = render(<TreeView aria-label="Files" nodes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("ignores emptyState while there are nodes", () => {
    render(<TreeView aria-label="Files" nodes={nodes} emptyState={empty} />);
    expect(screen.getByRole("tree", { name: "Files" })).toBeInTheDocument();
    expect(screen.queryByText("No files yet")).toBeNull();
  });
});

describe("TreeView loading", () => {
  afterEach(cleanup);

  it("keeps the named tree, marks it aria-busy and shows three hidden Skeleton rows", () => {
    const { container } = render(<TreeView aria-label="Files" nodes={[]} loading />);
    const tree = screen.getByRole("tree", { name: "Files" });
    expect(tree).toHaveAttribute("aria-busy", "true");
    const rows = container.querySelectorAll("[data-tree-loading-row]");
    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      expect(row).toHaveAttribute("role", "none");
      expect(row.firstElementChild).toHaveAttribute("aria-hidden", "true");
      expect(row.querySelector("[data-skeleton]")).not.toBeNull();
    });
    // Nothing to focus while loading: no treeitem, no tab stop.
    expect(screen.queryAllByRole("treeitem")).toHaveLength(0);
    expect(container.querySelector("[tabindex]")).toBeNull();
  });

  it("wins over the nodes and over emptyState", () => {
    const { rerender } = render(<TreeView aria-label="Files" nodes={nodes} loading />);
    expect(screen.queryByText("README.md")).toBeNull();
    rerender(<TreeView aria-label="Files" nodes={[]} loading emptyState={empty} />);
    expect(screen.queryByText("No files yet")).toBeNull();
    expect(screen.getByRole("tree", { name: "Files" })).toHaveAttribute("aria-busy", "true");
  });

  it("clears aria-busy and renders the nodes when loading ends", () => {
    const { rerender } = render(<TreeView aria-label="Files" nodes={[]} loading />);
    rerender(<TreeView aria-label="Files" nodes={nodes} />);
    const tree = screen.getByRole("tree", { name: "Files" });
    expect(tree).not.toHaveAttribute("aria-busy");
    expect(screen.getAllByRole("treeitem")).toHaveLength(2);
  });

  it("goes from loading to the empty state when the load returns nothing", () => {
    const { rerender } = render(<TreeView aria-label="Files" nodes={[]} loading emptyState={empty} />);
    rerender(<TreeView aria-label="Files" nodes={[]} emptyState={empty} />);
    expect(screen.queryByRole("tree")).toBeNull();
    expect(screen.getByRole("group", { name: "Files" })).toHaveTextContent("No files yet");
  });
});
