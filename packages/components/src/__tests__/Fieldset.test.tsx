import { createRef } from "react";
import { afterEach, describe, expect, expectTypeOf, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Fieldset, type FieldsetGap } from "../components/Fieldset";
import type { StackGap } from "../primitives/Stack";
import { Checkbox } from "../components/Checkbox";
import { Input } from "../components/Input";
import { Radio } from "../components/Radio";

describe("Fieldset", () => {
  afterEach(cleanup);

  it("renders its legend and children", () => {
    render(
      <Fieldset legend="Notifications">
        <Checkbox label="Email digests" />
      </Fieldset>
    );
    expect(screen.getByText("Notifications").tagName).toBe("LEGEND");
    expect(screen.getByRole("checkbox", { name: "Email digests" })).toBeInTheDocument();
  });

  it("forwards its ref to the fieldset", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Fieldset ref={ref} legend="Group">
        <Checkbox label="One" />
      </Fieldset>
    );
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it("is a group named by its legend", () => {
    render(
      <Fieldset legend="Email notifications">
        <Checkbox label="Product updates" />
      </Fieldset>
    );
    const group = screen.getByRole("group", { name: "Email notifications" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).not.toHaveAttribute("role");
  });

  it("links the description with aria-describedby", () => {
    render(
      <Fieldset legend="Theme" description="Applies to every device you sign in on">
        <Radio name="theme" value="light" label="Light" />
      </Fieldset>
    );
    const group = screen.getByRole("group", { name: "Theme" });
    expect(group).toHaveAccessibleDescription("Applies to every device you sign in on");
  });

  it("keeps a caller's aria-describedby in front of its own", () => {
    render(
      <>
        <p id="outside">Saved automatically</p>
        <Fieldset legend="Theme" description="Pick one" aria-describedby="outside">
          <Radio name="theme" value="light" label="Light" />
        </Fieldset>
      </>
    );
    expect(screen.getByRole("group", { name: "Theme" })).toHaveAccessibleDescription(
      "Saved automatically Pick one"
    );
  });

  it("disables every control inside it natively", () => {
    render(
      <Fieldset legend="Profile" disabled>
        <Input label="Display name" />
        <Checkbox label="Public" />
        <Radio name="vis" value="all" label="Everyone" />
      </Fieldset>
    );
    expect(screen.getByRole("group", { name: "Profile" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Display name" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "Public" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Everyone" })).toBeDisabled();
  });

  it("carries the invalid state and message on a radiogroup", () => {
    render(
      <Fieldset legend="Plan" role="radiogroup" errorMessage="Pick a plan to continue">
        <Radio name="plan" value="free" label="Free" error />
        <Radio name="plan" value="pro" label="Pro" error />
      </Fieldset>
    );
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Pick a plan to continue");
    // The radios never carry aria-invalid themselves (Radio.md, decision 0029).
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toHaveAttribute("aria-invalid");
    }
  });

  it("sets aria-invalid on a radiogroup from error alone", () => {
    render(
      <Fieldset legend="Plan" role="radiogroup" error>
        <Radio name="plan" value="free" label="Free" />
      </Fieldset>
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid on a radiogroup that is valid", () => {
    render(
      <Fieldset legend="Plan" role="radiogroup">
        <Radio name="plan" value="free" label="Free" />
      </Fieldset>
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).not.toHaveAttribute("aria-invalid");
  });

  it("keeps its gap scale in step with Stack's", () => {
    // Fieldset repeats the scale instead of importing the primitive (see the file);
    // this fails type-check if the two drift apart.
    expectTypeOf<FieldsetGap>().toEqualTypeOf<StackGap>();
  });

  it("never sets aria-invalid on a plain group, but still links the message", () => {
    render(
      <Fieldset legend="Topics" errorMessage="Choose at least one topic">
        <Checkbox label="Product" />
      </Fieldset>
    );
    const group = screen.getByRole("group", { name: "Topics" });
    expect(group).not.toHaveAttribute("aria-invalid");
    expect(group).toHaveAccessibleDescription("Choose at least one topic");
  });
});
