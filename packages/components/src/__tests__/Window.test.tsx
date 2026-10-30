import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Window } from "../components/Window";

describe("Window", () => {
  afterEach(cleanup);

  it("is a region named by its title", () => {
    render(<Window title="Logs">body</Window>);
    const region = screen.getByRole("region", { name: "Logs" });
    expect(screen.getByRole("heading", { level: 2, name: "Logs" })).toBeInTheDocument();
    expect(region).toHaveTextContent("body");
  });

  it("renders the title with the requested heading level", () => {
    render(<Window title="Queue" titleAs="h3">body</Window>);
    expect(screen.getByRole("heading", { level: 3, name: "Queue" })).toBeInTheDocument();
  });

  it("makes a scrolling body reachable by keyboard and names it after the title", () => {
    render(<Window title="Logs">body</Window>);
    const body = screen.getByRole("group", { name: "Logs" });
    expect(body).toHaveAttribute("tabindex", "0");
  });

  it("leaves a non-scrolling body out of the tab order", () => {
    render(<Window title="Logs" scroll={false}>body</Window>);
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.getByText("body")).not.toHaveAttribute("tabindex");
  });

  it("marks the active window and shows a decorative chevron", () => {
    const { container } = render(<Window title="Logs" active>body</Window>);
    expect(screen.getByRole("region")).toHaveAttribute("data-active", "true");
    expect(container.querySelector('[aria-hidden="true"] svg')).not.toBeNull();
  });

  it("shows status and actions in the title bar when given", () => {
    render(
      <Window title="Logs" status="3 new" actions={<button type="button">Clear</button>}>
        body
      </Window>
    );
    expect(screen.getByText("3 new")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });
});

