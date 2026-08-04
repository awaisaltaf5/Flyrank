import { describe, it, expect } from "vitest";
import {
  normalizeUrl,
  validateUrlInput,
  looksLikeUrl,
} from "@/lib/url-utils";

describe("normalizeUrl", () => {
  it("adds https:// when no protocol is present", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });

  it("preserves http:// protocol", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com/");
  });

  it("preserves https:// protocol", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com/");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeUrl("  https://example.com  ")).toBe(
      "https://example.com/",
    );
  });

  it("returns null for empty string", () => {
    expect(normalizeUrl("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(normalizeUrl("   ")).toBeNull();
  });

  it("returns null for non-string input", () => {
    expect(normalizeUrl(null)).toBeNull();
    expect(normalizeUrl(undefined)).toBeNull();
    expect(normalizeUrl(123)).toBeNull();
  });

  it("returns null for strings with spaces (likely a question)", () => {
    expect(normalizeUrl("what is the title of example.com")).toBeNull();
  });

  it("returns null for non-http protocols", () => {
    expect(normalizeUrl("ftp://example.com")).toBeNull();
    expect(normalizeUrl("file:///etc/passwd")).toBeNull();
  });

  it("returns null for malformed URLs", () => {
    expect(normalizeUrl("not a url at all")).toBeNull();
  });
});

describe("validateUrlInput", () => {
  it("returns ok:true with normalized URL for valid input", () => {
    const result = validateUrlInput("example.com");
    expect(result.ok).toBe(true);
    expect(result.url).toBe("https://example.com/");
  });

  it("returns ok:true for full https URL", () => {
    const result = validateUrlInput("https://vercel.com");
    expect(result.ok).toBe(true);
    expect(result.url).toBe("https://vercel.com/");
  });

  it("returns ok:false with error for empty input", () => {
    const result = validateUrlInput("");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("valid URL");
  });

  it("returns ok:false with error for invalid input", () => {
    const result = validateUrlInput("not a url");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("valid URL");
  });

  it("returns ok:false with error for null", () => {
    const result = validateUrlInput(null);
    expect(result.ok).toBe(false);
  });
});

describe("looksLikeUrl", () => {
  it("returns true for explicit http URL", () => {
    expect(looksLikeUrl("https://example.com")).toBe(true);
  });

  it("returns true for explicit http:// URL", () => {
    expect(looksLikeUrl("http://example.com")).toBe(true);
  });

  it("returns true for a bare domain with a dot", () => {
    expect(looksLikeUrl("example.com")).toBe(true);
  });

  it("returns false for a question", () => {
    expect(looksLikeUrl("what is the title of this site?")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(looksLikeUrl("")).toBe(false);
  });

  it("returns false for non-string input", () => {
    expect(looksLikeUrl(null)).toBe(false);
    expect(looksLikeUrl(undefined)).toBe(false);
  });
});