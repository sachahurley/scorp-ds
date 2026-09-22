import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Card } from "../components/Card";

/**
 * `min-h-0` is only emitted by the flex-column recipe (inner plate + content
 * section), so it is the cleanest signal that the layout switched.
 */
function isFlexLayout(container: HTMLElement) {
  return container.innerHTML.includes("min-h-0");
}

function renderCard(props: Partial<React.ComponentProps<typeof Card>> = {}) {
  return render(
    <Card {...props}>
      <span data-testid="body">body</span>
    </Card>
  );
}

describe("Card layout", () => {
  afterEach(() => cleanup());

  it("is a block card by default", () => {
    const { container } = renderCard();
    expect(isFlexLayout(container)).toBe(false);
  });

  it('switches to a flex column with layout="flex"', () => {
    const { container } = renderCard({ layout: "flex" });
    expect(isFlexLayout(container)).toBe(true);
  });

  it('stays a block card with layout="block" even when className says flex', () => {
    const { container } = renderCard({ layout: "block", className: "flex flex-col" });
    expect(isFlexLayout(container)).toBe(false);
    // The consumer's own classes are still applied.
    expect((container.firstElementChild as HTMLElement).className).toContain("flex-col");
  });

  it("keeps the legacy standalone `flex` className working", () => {
    const { container } = renderCard({ className: "h-72 flex flex-col" });
    expect(isFlexLayout(container)).toBe(true);
  });

  it.each(["inline-flex", "flex-1", "flex-wrap", "md:flex"])(
    "does not switch to flex layout for %s",
    (cls) => {
      const { container } = renderCard({ className: cls });
      expect(isFlexLayout(container)).toBe(false);
    }
  );

  it("renders header, body and footer", () => {
    render(
      <Card title="Deploy" subtitle="Production" footerContent={<span>footer</span>}>
        <span data-testid="body">body</span>
      </Card>
    );
    expect(screen.getByRole("heading", { name: "Deploy" })).toBeVisible();
    expect(screen.getByText("Production")).toBeVisible();
    expect(screen.getByTestId("body")).toBeVisible();
    expect(screen.getByText("footer")).toBeVisible();
  });
});
