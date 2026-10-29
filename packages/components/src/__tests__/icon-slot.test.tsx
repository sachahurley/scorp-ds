import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { TuiIcon } from "../components/TuiIcon";
import { isTuiIconName, renderIconSlot } from "../lib/icon-slot";

afterEach(cleanup);

describe("IconSlot (decision 0024)", () => {
  it("recognises TuiIcon names and nothing else", () => {
    expect(isTuiIconName("Check")).toBe(true);
    expect(isTuiIconName("→")).toBe(false);
    expect(isTuiIconName("toString")).toBe(false);
    expect(isTuiIconName(undefined)).toBe(false);
  });

  it("renders a name as the icon and leaves anything else unchanged", () => {
    const { container } = render(<>{renderIconSlot("Check")}</>);
    expect(container.querySelector("svg")).not.toBeNull();
    const el = <span data-testid="mine" />;
    expect(renderIconSlot(el)).toBe(el);
    expect(renderIconSlot("→")).toBe("→");
  });

  it("takes a name on a ReactNode icon prop (Button, Badge)", () => {
    render(
      <>
        <Button iconLeft="Check">Save</Button>
        <Badge iconLeft="Star">new</Badge>
      </>
    );
    expect(screen.getByRole("button", { name: "Save" }).querySelector("svg")).not.toBeNull();
    expect(screen.getByText("new").parentElement?.querySelector("svg")).not.toBeNull();
  });

  it("takes an element on a prop that used to take only names (EmptyState)", () => {
    render(<EmptyState title="Nothing yet" icon={<TuiIcon name="Archive" size="8" />} />);
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });

  it("keeps rendering a legacy text glyph as text", () => {
    render(<Button iconRight="→">Next</Button>);
    expect(screen.getByRole("button", { name: /Next/ }).textContent).toContain("→");
  });
});
