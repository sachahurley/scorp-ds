import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Badge } from "../components/Badge";

describe("Badge", () => {
  it("renders bracket-wrapped label", () => {
    render(<Badge>Beta</Badge>);
    expect(screen.getByText("Beta")).toBeVisible();
  });

  it("calls onClose when remove control is activated", () => {
    const onClose = vi.fn();
    render(
      <Badge onClose={onClose}>
        removable
      </Badge>
    );
    fireEvent.click(screen.getByRole("button", { name: /remove badge/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
