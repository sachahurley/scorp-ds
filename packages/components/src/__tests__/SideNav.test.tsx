import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SideNav, SideNavItem, SideNavSection } from "../components/SideNav";

describe("SideNav", () => {
  afterEach(cleanup);

  it("marks the active item with aria-current", () => {
    render(
      <SideNav aria-label="Primary">
        <SideNavItem icon="Star" label="Home" href="/" active />
        <SideNavItem icon="Search" label="Search" href="/search" />
      </SideNav>
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Search" })).not.toHaveAttribute("aria-current");
  });

  it("renders a section heading that names the group", () => {
    render(
      <SideNav aria-label="Primary">
        <SideNavSection heading="Workspace">
          <SideNavItem label="Docs" href="/docs" />
        </SideNavSection>
      </SideNav>
    );
    expect(screen.getByRole("group", { name: "Workspace" })).toBeInTheDocument();
  });

  it("toggles nested groups with aria-expanded and opens groups holding the active item", () => {
    const onExpandedChange = vi.fn();
    render(
      <SideNav aria-label="Primary">
        <SideNavItem label="Settings" onExpandedChange={onExpandedChange}>
          <SideNavItem label="Profile" href="/profile" />
        </SideNavItem>
        <SideNavItem label="Library">
          <SideNavItem label="Shared" href="/shared" active />
        </SideNavItem>
      </SideNav>
    );
    const settings = screen.getByRole("button", { name: "Settings" });
    expect(settings).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Profile" })).toBeNull();
    fireEvent.click(settings);
    expect(settings).toHaveAttribute("aria-expanded", "true");
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    const profile = screen.getByRole("link", { name: "Profile" });
    expect(settings.getAttribute("aria-controls")).toBe(profile.closest("ul")!.id);

    expect(screen.getByRole("button", { name: "Library" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Shared" })).toHaveAttribute("aria-current", "page");
  });

  it("supports a controlled group", () => {
    const { rerender } = render(
      <SideNav aria-label="Primary">
        <SideNavItem label="Group" expanded={false}>
          <SideNavItem label="Child" href="/c" />
        </SideNavItem>
      </SideNav>
    );
    fireEvent.click(screen.getByRole("button", { name: "Group" }));
    expect(screen.queryByRole("link", { name: "Child" })).toBeNull();
    rerender(
      <SideNav aria-label="Primary">
        <SideNavItem label="Group" expanded>
          <SideNavItem label="Child" href="/c" />
        </SideNavItem>
      </SideNav>
    );
    expect(screen.getByRole("link", { name: "Child" })).toBeInTheDocument();
  });

  it("renders onClick items as buttons", () => {
    const onClick = vi.fn();
    render(
      <SideNav aria-label="Primary">
        <SideNavItem label="Inbox" onClick={onClick} />
      </SideNav>
    );
    fireEvent.click(screen.getByRole("button", { name: "Inbox" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("keeps accessible names in collapsed mode", () => {
    render(
      <SideNav aria-label="Primary" collapsed>
        <SideNavItem icon="Star" label="Home" href="/" active />
      </SideNav>
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("aria-label", "Home");
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
