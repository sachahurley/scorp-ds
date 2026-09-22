import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table";

function renderTable() {
  return render(
    <Table>
      <TableHeader data-testid="thead">
        <TableRow data-testid="tr">
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>alpha</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table chrome tokens", () => {
  afterEach(() => cleanup());

  it("uses a token-backed font weight for column headers", () => {
    renderTable();
    const head = screen.getByRole("columnheader", { name: "Name" });
    expect(head.className).toContain("font-bold");
    // 600 is not in the weight scale (400 / 500 / 700).
    expect(head.className).not.toContain("font-semibold");
  });

  it("uses the hairline rule token instead of 0.5px rules", () => {
    renderTable();
    const rule = "border-b-[length:var(--border-width-hairline)]";
    expect(screen.getByTestId("thead").className).toContain(rule);
    expect(screen.getByTestId("tr").className).toContain(rule);
    expect(document.body.innerHTML).not.toContain("0.5px");
  });

  it("defaults column headers to scope=col", () => {
    renderTable();
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("scope", "col");
  });
});
