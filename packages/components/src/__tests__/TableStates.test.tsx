import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table";
import { EmptyState } from "../components/EmptyState";

const COLUMNS = ["Job", "Branch", "Status", "Duration"];

function Header() {
  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map((c) => (
          <TableHead key={c}>{c}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

describe("TableBody loading", () => {
  afterEach(() => cleanup());

  it("marks the table aria-busy and clears it when loading ends", () => {
    const { rerender } = render(
      <Table aria-label="Builds">
        <Header />
        <TableBody loading />
      </Table>
    );
    expect(screen.getByRole("table", { name: "Builds" })).toHaveAttribute("aria-busy", "true");

    rerender(
      <Table aria-label="Builds">
        <Header />
        <TableBody>
          <TableRow>
            <TableCell>build</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("table", { name: "Builds" })).not.toHaveAttribute("aria-busy");
  });

  it("renders three Skeleton rows by default, one placeholder per header column", () => {
    const { container } = render(
      <Table>
        <Header />
        <TableBody loading />
      </Table>
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      expect(row).toHaveAttribute("aria-hidden", "true");
      expect(row.querySelectorAll("td")).toHaveLength(COLUMNS.length);
      expect(row.querySelectorAll("[data-skeleton]")).toHaveLength(COLUMNS.length);
    });
  });

  it("honours loadingRows and replaces the children while loading", () => {
    const { container } = render(
      <Table>
        <Header />
        <TableBody loading loadingRows={5}>
          <TableRow>
            <TableCell>real row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.queryByText("real row")).toBeNull();
  });

  it("lets an explicit aria-busy on Table win", () => {
    render(
      <Table aria-label="Builds" aria-busy={false}>
        <Header />
        <TableBody loading />
      </Table>
    );
    expect(screen.getByRole("table", { name: "Builds" })).toHaveAttribute("aria-busy", "false");
  });
});

describe("TableBody emptyState", () => {
  afterEach(() => cleanup());

  it("renders the empty state in one cell spanning every header column", () => {
    render(
      <Table>
        <Header />
        <TableBody emptyState={<EmptyState size="sm" titleAs="p" title="No builds yet" />}>{[]}</TableBody>
      </Table>
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", String(COLUMNS.length));
    expect(cell).toHaveTextContent("No builds yet");
  });

  it("sums header colSpans, and an explicit colSpan wins", () => {
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>Name</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody emptyState="Nothing here" />
      </Table>
    );
    expect(screen.getByRole("cell")).toHaveAttribute("colspan", "3");

    rerender(
      <Table>
        <TableBody colSpan={6} emptyState="Nothing here" />
      </Table>
    );
    expect(screen.getByRole("cell", { name: "Nothing here" })).toHaveAttribute("colspan", "6");
  });

  it("renders the rows, not the empty state, when there are rows", () => {
    render(
      <Table>
        <Header />
        <TableBody emptyState="Nothing here">
          <TableRow>
            <TableCell>build</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.queryByText("Nothing here")).toBeNull();
    expect(screen.getByRole("cell", { name: "build" })).toBeInTheDocument();
  });

  it("shows the loading rows, not the empty state, while loading", () => {
    render(
      <Table>
        <Header />
        <TableBody loading emptyState="Nothing here" />
      </Table>
    );
    expect(screen.queryByText("Nothing here")).toBeNull();
  });
});
