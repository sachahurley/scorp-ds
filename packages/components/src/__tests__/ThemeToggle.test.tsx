import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../theme/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";

const realMatchMedia = window.matchMedia;

/**
 * next-themes resolves "system" by reading `(prefers-color-scheme: dark)`.
 * jsdom has no real media queries, so pin the OS preference per test.
 */
function setOsPrefersDark(prefersDark: boolean) {
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes("dark") ? prefersDark : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "";
  });

  afterEach(() => {
    cleanup();
    window.matchMedia = realMatchMedia;
  });

  it("reports the resolved theme when theme is 'system' on a dark OS", async () => {
    setOsPrefersDark(true);
    render(
      <ThemeProvider defaultTheme="system">
        <ThemeToggle />
      </ThemeProvider>
    );
    // The page renders dark, so the toggle must say Dark and offer light next.
    await waitFor(() => expect(screen.getByText("Dark")).toBeVisible());
    const control = screen.getByRole("switch", { name: "Switch to light theme" });
    expect(control).toHaveAttribute("aria-checked", "true");
  });

  it("reports the resolved theme when theme is 'system' on a light OS", async () => {
    setOsPrefersDark(false);
    render(
      <ThemeProvider defaultTheme="system">
        <ThemeToggle />
      </ThemeProvider>
    );
    await waitFor(() => expect(screen.getByText("Light")).toBeVisible());
    const control = screen.getByRole("switch", { name: "Switch to dark theme" });
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("keeps the visible label and the aria-label in sync with an explicit theme", async () => {
    setOsPrefersDark(true);
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );
    // An explicit light theme wins over the dark OS preference.
    await waitFor(() => expect(screen.getByText("Light")).toBeVisible());
    expect(screen.getByRole("switch", { name: "Switch to dark theme" })).toBeVisible();
    expect(screen.queryByText("Dark")).toBeNull();
  });
});
