import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";

afterEach(() => cleanup());

/** Strip whose middle tab is disabled: a -> [b disabled] -> c. */
function MiddleDisabled() {
  return (
    <Tabs defaultValue="a">
      <TabsList aria-label="Sections">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Beta
        </TabsTrigger>
        <TabsTrigger value="c">Gamma</TabsTrigger>
      </TabsList>
      <TabsContent value="a">alpha panel</TabsContent>
      <TabsContent value="b">beta panel</TabsContent>
      <TabsContent value="c">gamma panel</TabsContent>
    </Tabs>
  );
}

/** Strip whose last tab is disabled: a -> b -> [c disabled]. */
function LastDisabled() {
  return (
    <Tabs defaultValue="a">
      <TabsList aria-label="Sections">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Beta</TabsTrigger>
        <TabsTrigger value="c" disabled>
          Gamma
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">alpha panel</TabsContent>
      <TabsContent value="b">beta panel</TabsContent>
      <TabsContent value="c">gamma panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs keyboard navigation skips disabled triggers", () => {
  it("ArrowRight steps over a disabled tab", async () => {
    render(<MiddleDisabled />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const beta = screen.getByRole("tab", { name: "Beta" });
    const gamma = screen.getByRole("tab", { name: "Gamma" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowRight" });
    await waitFor(() => expect(gamma).toHaveFocus());
    expect(gamma).toHaveAttribute("aria-selected", "true");
    expect(beta).toHaveAttribute("aria-selected", "false");
  });

  it("ArrowLeft wraps past a disabled tab", async () => {
    render(<MiddleDisabled />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const gamma = screen.getByRole("tab", { name: "Gamma" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowLeft" });
    await waitFor(() => expect(gamma).toHaveFocus());
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "false");
  });

  it("End lands on the last enabled tab, not a disabled one", async () => {
    render(<LastDisabled />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    const beta = screen.getByRole("tab", { name: "Beta" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "End" });
    await waitFor(() => expect(beta).toHaveFocus());
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("aria-selected", "false");
  });

  it("Home lands on the first enabled tab, not a disabled one", async () => {
    render(
      <Tabs defaultValue="c">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a" disabled>
            Alpha
          </TabsTrigger>
          <TabsTrigger value="b">Beta</TabsTrigger>
          <TabsTrigger value="c">Gamma</TabsTrigger>
        </TabsList>
        <TabsContent value="a">alpha panel</TabsContent>
        <TabsContent value="b">beta panel</TabsContent>
        <TabsContent value="c">gamma panel</TabsContent>
      </Tabs>
    );
    const gamma = screen.getByRole("tab", { name: "Gamma" });
    const beta = screen.getByRole("tab", { name: "Beta" });
    gamma.focus();
    fireEvent.keyDown(gamma, { key: "Home" });
    await waitFor(() => expect(beta).toHaveFocus());
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "false");
  });

  it("stays put when every other tab is disabled", async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">Alpha</TabsTrigger>
          <TabsTrigger value="b" disabled>
            Beta
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">alpha panel</TabsContent>
        <TabsContent value="b">beta panel</TabsContent>
      </Tabs>
    );
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowRight" });
    await waitFor(() => expect(alpha).toHaveFocus());
    expect(alpha).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tabs trigger affordances", () => {
  it("uses the inset token focus ring instead of the browser outline", () => {
    render(<MiddleDisabled />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    expect(alpha.className).toContain("focus:outline-none");
    expect(alpha.className).toContain(
      "focus-visible:[box-shadow:inset_0_0_0_var(--focus-ring-width)_var(--focus-ring-primary)]"
    );
  });

  it("carries a 44px pseudo-element tap target", () => {
    render(<MiddleDisabled />);
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    expect(alpha.className).toContain("before:h-touch");
    expect(alpha.className).toContain("relative");
  });

  it("keeps the roving tabindex on the selected trigger only", () => {
    render(<MiddleDisabled />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("tabindex", "-1");
  });

  it("rules the tab list with the hairline token, not a 0.5px rule", () => {
    render(<MiddleDisabled />);
    const list = screen.getByRole("tablist", { name: "Sections" });
    expect(list.className).toContain("border-b-[length:var(--border-width-hairline)]");
    expect(document.body.innerHTML).not.toContain("0.5px");
  });
});
