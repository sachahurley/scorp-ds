import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AppHeader } from "../components/AppHeader";

describe("AppHeader", () => {
  afterEach(cleanup);

  it("renders a banner with brand, named navigation, and actions", () => {
    render(
      <AppHeader
        brand={<a href="/">scorp</a>}
        navigation={<a href="/docs">Docs</a>}
        actions={<button type="button">Theme</button>}
        navLabel="Site"
      />
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
  });

  it("toggles the mobile menu with aria-expanded and aria-controls", () => {
    const onMenuOpenChange = vi.fn();
    render(
      <AppHeader brand="scorp" navigation={<a href="/docs">Docs</a>} onMenuOpenChange={onMenuOpenChange} />
    );
    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(onMenuOpenChange).toHaveBeenCalledWith(true);
    const panel = document.getElementById(toggle.getAttribute("aria-controls")!);
    expect(panel).not.toBeNull();
    expect(panel).toHaveTextContent("Docs");
  });

  it("omits the menu toggle without navigation and applies the sticky layer", () => {
    render(<AppHeader brand="scorp" sticky />);
    expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
    expect(screen.getByRole("banner").className).toContain("z-[var(--z-index-sticky)]");
  });
});
