import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Breadcrumbs } from "../components/Breadcrumbs";

const trail = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Scorp", href: "/projects/scorp" },
  { label: "Components", href: "/projects/scorp/components" },
  { label: "Breadcrumbs" },
];

describe("Breadcrumbs", () => {
  afterEach(cleanup);

  it("renders a named nav with an ordered list and marks the last item current", () => {
    render(<Breadcrumbs items={trail} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelector("ol")).not.toBeNull();
    expect(within(nav).getAllByRole("listitem")).toHaveLength(5);
    const current = screen.getByText("Breadcrumbs");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).toBe("SPAN");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("collapses middle items past maxItems and expands them, moving focus", () => {
    render(<Breadcrumbs items={trail} maxItems={3} />);
    expect(screen.queryByRole("link", { name: "Projects" })).toBeNull();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByText("Breadcrumbs")).toHaveAttribute("aria-current", "page");
    const overflow = screen.getByRole("button", { name: "Show 3 more breadcrumbs" });

    fireEvent.click(overflow);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveFocus();
  });

  it("honors itemsBeforeCollapse / itemsAfterCollapse", () => {
    render(<Breadcrumbs items={trail} maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2} />);
    expect(screen.getByRole("button", { name: "Show 1 more breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Components" })).toBeInTheDocument();
  });

  it("does not collapse when the trail fits", () => {
    render(<Breadcrumbs items={trail.slice(0, 3)} maxItems={3} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders router links through `as`", () => {
    const RouterLink = ({ to, children, ...rest }: { to: string; children?: ReactNode }) => (
      <a data-router="true" href={to} {...rest}>
        {children}
      </a>
    );
    render(<Breadcrumbs items={[{ label: "Home", as: RouterLink, asProps: { to: "/home" } }, { label: "Now" }]} />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("data-router", "true");
    expect(link).toHaveAttribute("href", "/home");
  });
});
