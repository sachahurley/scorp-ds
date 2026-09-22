import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Meter, getMeterTone } from "../components/Meter";

describe("getMeterTone", () => {
  it("is primary without thresholds", () => {
    expect(getMeterTone({ value: 90 })).toBe("primary");
  });

  it("follows native meter rules when low values are optimal (disk usage)", () => {
    const t = { min: 0, max: 100, low: 60, high: 85, optimum: 0 };
    expect(getMeterTone({ ...t, value: 30 })).toBe("success");
    expect(getMeterTone({ ...t, value: 70 })).toBe("warning");
    expect(getMeterTone({ ...t, value: 95 })).toBe("error");
  });

  it("follows native meter rules when high values are optimal (battery)", () => {
    const t = { min: 0, max: 100, low: 20, high: 60, optimum: 100 };
    expect(getMeterTone({ ...t, value: 90 })).toBe("success");
    expect(getMeterTone({ ...t, value: 40 })).toBe("warning");
    expect(getMeterTone({ ...t, value: 10 })).toBe("error");
  });

  it("treats both extremes as suboptimal when the optimum is in the middle", () => {
    const t = { min: 0, max: 100, low: 30, high: 70, optimum: 50 };
    expect(getMeterTone({ ...t, value: 50 })).toBe("success");
    expect(getMeterTone({ ...t, value: 10 })).toBe("warning");
    expect(getMeterTone({ ...t, value: 90 })).toBe("warning");
  });
});

describe("Meter", () => {
  afterEach(cleanup);

  it("exposes role=meter with value attributes and a visible label", () => {
    render(<Meter label="Disk" value={48} max={64} valueText="48 GB of 64 GB" />);
    const meter = screen.getByRole("meter", { name: "Disk" });
    expect(meter).toHaveAttribute("aria-valuenow", "48");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "64");
    expect(meter).toHaveAttribute("aria-valuetext", "48 GB of 64 GB");
    expect(screen.getByText("48 GB of 64 GB")).toBeInTheDocument();
  });

  it("defaults the value text to a percentage and clamps out-of-range values", () => {
    render(<Meter label="Quota" value={150} />);
    const meter = screen.getByRole("meter", { name: "Quota" });
    expect(meter).toHaveAttribute("aria-valuenow", "100");
    expect(meter).toHaveAttribute("aria-valuetext", "100%");
  });

  it("fills blocks proportionally and applies the threshold tone", () => {
    const { container } = render(
      <Meter label="Disk" value={90} low={60} high={85} optimum={0} segments={10} />
    );
    expect(container.querySelectorAll("[data-filled]")).toHaveLength(9);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "error");
  });

  it("lets `tone` override the thresholds", () => {
    const { container } = render(<Meter label="CPU" value={90} low={60} high={85} optimum={0} tone="primary" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "primary");
  });
});
