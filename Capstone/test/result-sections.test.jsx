import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultSections from "@/components/ResultSections";

const fullData = {
  url: "https://example.com",
  finalUrl: "https://example.com/",
  httpStatus: 200,
  contentType: "text/html; charset=utf-8",
  title: "Example Domain",
  metaDescription: "This domain is for use in illustrative examples.",
  canonicalUrl: "https://example.com/",
  ogTitle: "Example Domain - OG",
  ogDescription: "Open Graph description",
  ogImage: "https://example.com/og-image.png",
  ogUrl: "https://example.com/",
  ogType: "website",
  ogSiteName: "Example",
  twitterCard: "summary_large_image",
  twitterTitle: "Example Domain - Twitter",
  twitterDescription: "Twitter description",
  twitterImage: "https://example.com/twitter-image.png",
  favicon: "https://example.com/favicon.ico",
  lang: "en",
  author: "Example Author",
  robots: "index, follow",
  analyzedAt: "2026-08-02T12:00:00.000Z",
  error: null,
  missingFields: [],
};

const missingData = {
  url: "https://example.com",
  finalUrl: "https://example.com/",
  httpStatus: 200,
  contentType: "text/html; charset=utf-8",
  title: null,
  metaDescription: null,
  canonicalUrl: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
  ogUrl: null,
  ogType: null,
  ogSiteName: null,
  twitterCard: null,
  twitterTitle: null,
  twitterDescription: null,
  twitterImage: null,
  favicon: null,
  lang: null,
  author: null,
  robots: null,
  analyzedAt: "2026-08-02T12:00:00.000Z",
  error: null,
  missingFields: [
    "title",
    "metaDescription",
    "canonicalUrl",
    "ogTitle",
    "ogDescription",
    "ogImage",
    "ogUrl",
    "ogType",
    "ogSiteName",
    "twitterCard",
    "twitterTitle",
    "twitterDescription",
    "twitterImage",
    "lang",
    "author",
    "robots",
  ],
};

describe("ResultSections", () => {
  it("renders the website overview with title and URL", () => {
    render(
      <ResultSections
        data={fullData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getAllByText("Example Domain").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /https:\/\/example\.com\// }).length).toBeGreaterThan(0);
  });

  it("renders quick stats with HTTP status and metadata presence", () => {
    render(
      <ResultSections
        data={fullData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
    expect(screen.getByText("HTTP")).toBeInTheDocument();
    expect(screen.getByText("14 chars")).toBeInTheDocument();
  });

  it("renders metadata section with title and description", () => {
    render(
      <ResultSections
        data={fullData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getByText("Metadata")).toBeInTheDocument();
    expect(
      screen.getByText("This domain is for use in illustrative examples."),
    ).toBeInTheDocument();
  });

  it("renders Open Graph section with OG image", () => {
    render(
      <ResultSections
        data={fullData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getByText("Open Graph")).toBeInTheDocument();
    expect(screen.getByText("Example Domain - OG")).toBeInTheDocument();
    expect(screen.getByAltText("Open Graph preview")).toBeInTheDocument();
  });

  it("renders Twitter Card section", () => {
    render(
      <ResultSections
        data={fullData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getAllByText("Twitter Card").length).toBeGreaterThan(0);
    expect(screen.getByText("summary_large_image")).toBeInTheDocument();
  });

  it("renders missing metadata warnings when fields are absent", () => {
    render(
      <ResultSections
        data={missingData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getByText("Missing Metadata")).toBeInTheDocument();
    expect(screen.getByText("Title is not set")).toBeInTheDocument();
    expect(screen.getByText("Meta Description is not set")).toBeInTheDocument();
    expect(screen.getByText("Canonical URL is not set")).toBeInTheDocument();
  });

  it("does not render missing metadata warnings when all fields present", () => {
    render(
      <ResultSections
        data={fullData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.queryByText("Missing Metadata")).not.toBeInTheDocument();
  });

  it("shows 'Not found' for missing values in rows", () => {
    render(
      <ResultSections
        data={missingData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getAllByText("Not found").length).toBeGreaterThan(0);
  });

  it("shows 'No Open Graph image found' when ogImage is missing", () => {
    render(
      <ResultSections
        data={missingData}
        input={{ url: "https://example.com" }}
      />,
    );
    expect(screen.getByText("No Open Graph image found")).toBeInTheDocument();
  });

  it("handles null data gracefully", () => {
    render(<ResultSections data={null} input={{ url: "https://example.com" }} />);
    expect(screen.getAllByRole("link", { name: /https:\/\/example\.com/ }).length).toBeGreaterThan(0);
  });

  it("handles undefined data gracefully", () => {
    render(<ResultSections data={{}} input={undefined} />);
    expect(screen.getAllByText("Unknown URL").length).toBeGreaterThan(0);
  });
});