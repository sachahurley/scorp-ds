import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/Button";

describe("Button", () => {
  it("renders visible label", () => {
    render(<Button>Save draft</Button>);
    expect(screen.getByRole("button", { name: /save draft/i })).toBeVisible();
  });
});
