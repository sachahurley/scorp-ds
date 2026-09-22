import { forwardRef, type AnchorHTMLAttributes } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ListRow } from "../components/ListRow";
import { Link } from "../components/Link";

/** Stand-in for a router link: forwards every prop to a real anchor. */
const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }>(
  function RouterLink({ to, ...rest }, ref) {
    return <a ref={ref} href={to} {...rest} />;
  }
);

describe("ListRow attribute forwarding", () => {
  afterEach(() => cleanup());

  it("forwards native attributes on display rows", () => {
    render(<ListRow title="Read only" id="row-1" aria-label="Read only row" data-testid="row" />);
    const row = screen.getByTestId("row");
    expect(row).toHaveAttribute("id", "row-1");
    expect(row).toHaveAttribute("aria-label", "Read only row");
  });

  it("forwards native attributes on `as` rows, with asProps winning", () => {
    render(
      <ListRow
        as={RouterLink}
        asProps={{ to: "/projects/x" }}
        title="Router row"
        aria-current="page"
        data-testid="row"
      />
    );
    const row = screen.getByTestId("row");
    expect(row).toHaveAttribute("aria-current", "page");
    expect(row).toHaveAttribute("href", "/projects/x");
  });

  it("truncates long titles instead of wrapping", () => {
    render(<ListRow title="A title long enough to run past the row" data-testid="row" />);
    const title = screen.getByText("A title long enough to run past the row");
    expect(title.className).toContain("truncate");
  });

  it("renders meta in the AA-passing secondary pair, not text.tertiary", () => {
    render(<ListRow meta="2026" title="Case study" />);
    const meta = screen.getByText("2026");
    expect(meta.className).toContain("text-secondary-700");
    expect(meta.className).toContain("dark:text-secondary-600");
  });
});

describe("Link external behaviour", () => {
  afterEach(() => cleanup());

  it("sets target and rel on a plain anchor", () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>
    );
    const link = screen.getByRole("link", { name: /example/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sets target and rel in the `as` form too", () => {
    render(
      <Link as={RouterLink} asProps={{ to: "https://example.com" }} external>
        Example
      </Link>
    );
    const link = screen.getByRole("link", { name: /example/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lets asProps override the external defaults", () => {
    render(
      <Link as={RouterLink} asProps={{ to: "https://example.com", target: "_self" }} external>
        Example
      </Link>
    );
    expect(screen.getByRole("link", { name: /example/i })).toHaveAttribute("target", "_self");
  });

  it("leaves target and rel alone without `external`", () => {
    render(
      <Link as={RouterLink} asProps={{ to: "/about" }}>
        About
      </Link>
    );
    const link = screen.getByRole("link", { name: /about/i });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });
});
