import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from "../components/Accordion";

function Faq(props: Partial<AccordionProps>) {
  return (
    <Accordion {...(props as AccordionProps)}>
      <AccordionItem value="a">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in two days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Thirty days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c" disabled>
        <AccordionTrigger>Warranty</AccordionTrigger>
        <AccordionContent>One year.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
  afterEach(() => cleanup());

  it("wires the WAI-ARIA accordion pattern", () => {
    render(<Faq />);
    const t = trigger("Shipping");
    expect(t.closest("h3")).not.toBeNull();
    expect(t).toHaveAttribute("aria-expanded", "false");
    const region = document.getElementById(t.getAttribute("aria-controls")!)!;
    expect(region).toHaveAttribute("role", "region");
    expect(region).toHaveAttribute("aria-labelledby", t.id);
    expect(trigger("Warranty")).toBeDisabled();
  });

  it("single: opening one closes the other; not collapsible by default", () => {
    const onValueChange = vi.fn();
    render(<Faq type="single" onValueChange={onValueChange} />);
    fireEvent.click(trigger("Shipping"));
    expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Shipping")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(trigger("Returns"));
    expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "false");
    expect(trigger("Returns")).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).toHaveBeenLastCalledWith("b");
    // Clicking the open item does nothing without `collapsible`
    fireEvent.click(trigger("Returns"));
    expect(trigger("Returns")).toHaveAttribute("aria-expanded", "true");
  });

  it("single collapsible: the open item can close", () => {
    render(<Faq type="single" collapsible defaultValue="a" />);
    expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Shipping")).not.toHaveAttribute("aria-disabled");
    fireEvent.click(trigger("Shipping"));
    expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "false");
  });

  it("multiple: items open independently", () => {
    const onValueChange = vi.fn();
    render(<Faq type="multiple" onValueChange={onValueChange} />);
    fireEvent.click(trigger("Shipping"));
    fireEvent.click(trigger("Returns"));
    expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Returns")).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
    fireEvent.click(trigger("Shipping"));
    expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("respects a controlled value", () => {
    render(<Faq type="single" value="b" />);
    fireEvent.click(trigger("Shipping"));
    expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "false");
    expect(trigger("Returns")).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus between enabled triggers with arrows, Home and End", () => {
    render(<Faq />);
    trigger("Shipping").focus();
    fireEvent.keyDown(trigger("Shipping"), { key: "ArrowDown" });
    expect(trigger("Returns")).toHaveFocus();
    fireEvent.keyDown(trigger("Returns"), { key: "ArrowDown" }); // Warranty disabled, wraps
    expect(trigger("Shipping")).toHaveFocus();
    fireEvent.keyDown(trigger("Shipping"), { key: "End" });
    expect(trigger("Returns")).toHaveFocus();
    fireEvent.keyDown(trigger("Returns"), { key: "Home" });
    expect(trigger("Shipping")).toHaveFocus();
  });

  it("supports a custom heading level", () => {
    render(<Faq headingLevel={2} />);
    expect(trigger("Shipping").closest("h2")).not.toBeNull();
  });
});
