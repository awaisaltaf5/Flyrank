import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolInvocation from "@/components/ToolInvocation";

const createStreamingPart = (url = "https://example.com") => ({
  type: "tool-analyzeWebsite",
  state: "input-streaming",
  input: { url },
  output: null,
});

const createAvailablePart = (url = "https://example.com") => ({
  type: "tool-analyzeWebsite",
  state: "input-available",
  input: { url },
  output: null,
});

const createSuccessPart = (data = {
  url: "https://example.com",
  finalUrl: "https://example.com/",
  httpStatus: 200,
  contentType: "text/html; charset=utf-8",
  title: "Example Domain",
  metaDescription: "Example description.",
  canonicalUrl: "https://example.com/",
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
  favicon: "https://example.com/favicon.ico",
  lang: "en",
  author: null,
  robots: null,
  analyzedAt: "2026-08-02T12:00:00.000Z",
  error: null,
  missingFields: [],
}) => ({
  type: "tool-analyzeWebsite",
  state: "output-available",
  input: { url: data.url },
  output: data,
});

const createErrorPart = (errorMessage = "Request timed out.") => ({
  type: "tool-analyzeWebsite",
  state: "error",
  input: { url: "https://example.com" },
  output: { error: errorMessage },
});

describe("ToolInvocation", () => {
  it("renders nothing for non-tool parts", () => {
    const { container } = render(
      <ToolInvocation part={{ type: "text", text: "Hello" }} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("shows Preparing state during input-streaming", () => {
    render(<ToolInvocation part={createStreamingPart()} />);
    expect(screen.getByText("Preparing analysis...")).toBeInTheDocument();
    expect(screen.getByText("Preparing")).toBeInTheDocument();
  });

  it("shows the URL during input-streaming when available", () => {
    render(<ToolInvocation part={createStreamingPart("https://vercel.com")} />);
    expect(screen.getByText("https://vercel.com")).toBeInTheDocument();
  });

  it("shows Analyzing state during input-available", () => {
    render(<ToolInvocation part={createAvailablePart()} />);
    expect(screen.getByText("Analyzing website")).toBeInTheDocument();
    expect(screen.getByText("Fetching")).toBeInTheDocument();
  });

  it("renders the report card on successful analysis", () => {
    render(<ToolInvocation part={createSuccessPart()} />);
    expect(screen.getByText("Website Analysis Report")).toBeInTheDocument();
    expect(screen.getAllByText(/Example Domain/).length).toBeGreaterThan(0);
  });

  it("renders an error card when output contains an error", () => {
    render(
      <ToolInvocation part={createSuccessPart({
        ...createSuccessPart().output,
        error: "Unexpected content type: application/pdf",
      })} />,
    );
    expect(screen.getByText("Not an HTML Page")).toBeInTheDocument();
  });

  it("renders an error card for timeout errors", () => {
    render(<ToolInvocation part={createErrorPart("Request timed out after 15 seconds.")} />);
    expect(screen.getByText("Request Timed Out")).toBeInTheDocument();
  });

  it("renders a generic Analysis Failed card for unknown errors", () => {
    render(<ToolInvocation part={createErrorPart("Something broke.")} />);
    expect(screen.getByText("Analysis Failed")).toBeInTheDocument();
  });

  it("shows Complete badge when output is available", () => {
    render(<ToolInvocation part={createSuccessPart()} />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("shows Error badge on error states", () => {
    render(<ToolInvocation part={createErrorPart()} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});