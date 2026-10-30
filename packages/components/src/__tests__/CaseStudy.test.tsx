import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { asciiFontSize, CaseStudyContent, CaseStudyPage, type CaseStudy } from "../components/CaseStudy";

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

  it("shrinks a diagram to fit its longest line, capped at text-xs", () => {
    // 50 characters at 0.62em each: the figure width (less p-5 padding) / 31em
    expect(asciiFontSize("ab\n" + "x".repeat(50))).toBe(
      "min(var(--font-size-xs), calc((100cqw - var(--spacing-10)) / 31.00))",
    );
    render(<CaseStudyContent blocks={[{ type: "ascii", text: "┌─┐", label: "small" }]} />);
    expect(screen.getByRole("img", { name: "small" }).className).not.toContain("text-xs");
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

describe("items with identical text", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders every item without a duplicate key warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const twice = (title: string) => [
      { title, text: "text" },
      { title, text: "text" },
    ];
    render(
      <CaseStudyPage
        study={{
          title: "Repeats",
          summary: "Authored items that share their text.",
          outcomes: [
            { value: "1", label: "same outcome" },
            { value: "1", label: "same outcome" },
          ],
          meta: [
            { label: "same meta", value: "value" },
            { label: "same meta", value: "value" },
          ],
          sections: [
            {
              kicker: "repeats",
              title: "Repeats",
              blocks: [
                { type: "list", items: twice("same list") },
                { type: "insights", items: twice("same insight") },
                { type: "callouts", items: twice("same callout") },
              ],
            },
          ],
        }}
      />,
    );
    expect(error).not.toHaveBeenCalled();
    for (const text of ["same outcome", "same meta", "same list", "same insight", "same callout"]) {
      expect(screen.getAllByText(text)).toHaveLength(2);
    }
  });
});
