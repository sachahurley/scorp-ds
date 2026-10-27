import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CaseStudyContent, CaseStudyPage, type CaseStudy } from "../components/CaseStudy";

const study: CaseStudy = {
  title: "Example study",
  summary: "One line on what this was.",
  outcomes: [
    { value: "43", label: "components" },
    { value: "3", label: "sites" },
  ],
  meta: [{ label: "Role", value: "Designer" }],
  sections: [
    { kicker: "overview", title: "First", blocks: [{ type: "image", caption: "one" }] },
    { kicker: "skipped", title: "Hidden", hidden: true, blocks: [{ type: "image", caption: "never" }] },
    {
      kicker: "the problem",
      title: "Second",
      blocks: [{ type: "imagePair", captions: ["two", "three"] }, { type: "image", caption: "four" }],
    },
  ],
};

describe("CaseStudyPage", () => {
  afterEach(() => cleanup());

  it("renders the title as the page's only h1 and section titles as h2", () => {
    render(<CaseStudyPage study={study} />);
    expect(screen.getAllByRole("heading", { level: 1 }).map((h) => h.textContent)).toEqual(["Example study"]);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["First", "Second"]);
  });

  it("leaves hidden sections out and numbers the rest without a gap", () => {
    const { container } = render(<CaseStudyPage study={study} />);
    expect(screen.queryByText("Hidden")).toBeNull();
    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(2);
    expect(sections[0].textContent).toContain("01overview");
    expect(sections[1].textContent).toContain("02the problem");
  });

  it("anchors each section on its slugified kicker", () => {
    const { container } = render(<CaseStudyPage study={study} />);
    expect([...container.querySelectorAll("section")].map((s) => s.id)).toEqual(["overview", "the-problem"]);
  });

  it("numbers figures across sections in reading order, skipping hidden ones", () => {
    const { container } = render(<CaseStudyPage study={study} />);
    const captions = [...container.querySelectorAll("figcaption")].map((c) => c.textContent);
    expect(captions).toEqual(["fig. 01one", "fig. 02two", "fig. 03three", "fig. 04four"]);
  });

  it("keeps outcome terms before their figures in the DOM", () => {
    const { container } = render(<CaseStudyPage study={study} />);
    const first = container.querySelector("dl dt");
    expect(first?.textContent).toBe("components");
    expect(first?.nextElementSibling?.tagName).toBe("DD");
  });

  it("draws rules with the hairline token only", () => {
    render(<CaseStudyPage study={study} />);
    expect(document.body.innerHTML).toContain("hairline");
    expect(document.body.innerHTML).not.toContain("0.5px");
  });
});

describe("CaseStudyContent", () => {
  afterEach(() => cleanup());

  it("labels box-drawing diagrams for screen readers", () => {
    render(<CaseStudyContent blocks={[{ type: "ascii", text: "┌─┐", label: "A box" }]} />);
    expect(screen.getByRole("img", { name: "A box" })).toBeTruthy();
  });

  it("falls back to the placeholder for an empty slot and renders a filled one", () => {
    render(
      <CaseStudyContent
        slots={{ live: <span>live content</span> }}
        blocks={[
          { type: "slot", name: "live", caption: "filled" },
          { type: "slot", name: "missing", caption: "empty" },
        ]}
      />,
    );
    expect(screen.getByText("live content")).toBeTruthy();
    expect(screen.getByText("empty")).toBeTruthy();
  });
});
