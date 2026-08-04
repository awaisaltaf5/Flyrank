import { z } from "zod";
import { tool } from "ai";
import { assertSafeUrl } from "./url-security";
import { normalizeUrl } from "./url-utils";

// ─── Input Schema ────────────────────────────────────────────────────────────
// Validates the model-provided URL before the tool fetches anything.
const analyzeWebsiteInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The full website URL to analyze, including https://"),
});

// ─── Output Schema ───────────────────────────────────────────────────────────
// Structured, typed output that the model and the UI both rely on. Every field
// is nullable so missing metadata is explicit rather than fabricated.
const analyzeWebsiteOutputSchema = z.object({
  url: z.string(),
  finalUrl: z.string(),
  httpStatus: z.number().nullable(),
  contentType: z.string().nullable(),
  title: z.string().nullable(),
  metaDescription: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  ogImage: z.string().nullable(),
  ogUrl: z.string().nullable(),
  ogType: z.string().nullable(),
  ogSiteName: z.string().nullable(),
  twitterCard: z.string().nullable(),
  twitterTitle: z.string().nullable(),
  twitterDescription: z.string().nullable(),
  twitterImage: z.string().nullable(),
  favicon: z.string().nullable(),
  lang: z.string().nullable(),
  author: z.string().nullable(),
  robots: z.string().nullable(),
  analyzedAt: z.string(),
  error: z.string().nullable(),
  missingFields: z.array(z.string()),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract an attribute value from a raw HTML string using a regex.
 * Returns the trimmed value or null if not found.
 */
function extractAttr(html, pattern) {
  const match = html.match(pattern);
  if (!match || !match[1]) return null;
  return match[1].trim();
}

/**
 * Extract a meta tag by name OR property, e.g. "description", "og:title".
 * Handles both attribute orders: <meta name="..." content="..."> and
 * <meta content="..." name="...">.
 */
function extractMeta(html, key) {
  // Match any meta tag that contains either name="{key}" or property="{key}".
  const metaTagPattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${key.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    )}["'][^>]*>`,
    "i",
  );
  const tag = html.match(metaTagPattern);
  if (!tag) return null;

  const contentMatch = tag[0].match(/content=["']([\s\S]*?)["']/i);
  if (!contentMatch || !contentMatch[1]) return null;
  return contentMatch[1].trim();
}

/**
 * Resolve a possibly-relative URL against a base URL. Returns the absolute
 * URL, or null if resolution fails.
 */
function resolveUrl(value, base) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).href;
    } catch {
      return null;
    }
  }
  if (value.startsWith("//")) {
    try {
      return new URL(`https:${value}`).href;
    } catch {
      return null;
    }
  }
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

/**
 * Extract <link rel="..."> href values.
 */
function extractLink(html, relPattern) {
  const pattern = new RegExp(
    `<link[^>]+rel=["']${relPattern}["'][^>]+href=["']([\\s\\S]*?)["']`,
    "i",
  );
  const match = html.match(pattern);
  if (!match || !match[1]) return null;
  return match[1].trim();
}

/**
 * Extract the html lang attribute.
 */
function extractLang(html) {
  const match = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  return match ? match[1].trim() : null;
}

/**
 * Build a structured error result that satisfies the output schema.
 */
function buildErrorResult(url, errorMessage) {
  // Extract origin for default favicon.
  let defaultFavicon = null;
  try {
    const origin = new URL(url).origin;
    defaultFavicon = `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;
  } catch {
    // Leave null if URL is malformed.
  }

  return {
    url,
    finalUrl: url,
    httpStatus: null,
    contentType: null,
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
    favicon: defaultFavicon,
    lang: null,
    author: null,
    robots: null,
    analyzedAt: new Date().toISOString(),
    error: errorMessage,
    missingFields: [],
  };
}

// ─── Tool ──────────────────────────────────────────────────────────────────
// Server-side tool that fetches a website and extracts structured metadata.
export const analyzeWebsiteTool = tool({
  description:
    "Analyze a website's metadata. Fetches the page and extracts structured metadata including title, meta description, canonical URL, Open Graph fields, Twitter card fields, favicon, language, author, robots directives, and HTTP status.",
  inputSchema: analyzeWebsiteInputSchema,
  outputSchema: analyzeWebsiteOutputSchema,
  execute: async ({ url }) => {
    try {
      // ── Normalize the URL (add https:// if missing) ─────────────────────
      const normalizedUrl = normalizeUrl(url) || url;

      // ── SSRF protection: block private/reserved addresses ───────────────
      try {
        await assertSafeUrl(normalizedUrl);
      } catch (securityError) {
        return buildErrorResult(
          normalizedUrl,
          securityError.message || "This URL is not allowed for security reasons.",
        );
      }

      // ── Fetch with a 15-second timeout ────────────────────────────────────
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MetaSpark-Metadata-Analyzer/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      clearTimeout(timeout);

      const httpStatus = response.status;
      const contentType = response.headers.get("content-type") || "";
      const finalUrl = response.url || normalizedUrl;

      // Extract the origin for favicon resolution.
      let origin;
      try {
        origin = new URL(finalUrl).origin;
      } catch {
        origin = normalizedUrl;
      }

      // Default favicon from Google's favicon service as fallback.
      const defaultFavicon = `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;

      // ── Only parse HTML responses ─────────────────────────────────────────
      if (
        !contentType.includes("text/html") &&
        !contentType.includes("application/xhtml")
      ) {
        return {
          url: normalizedUrl,
          finalUrl,
          httpStatus,
          contentType,
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
          favicon: defaultFavicon,
          lang: null,
          author: null,
          robots: null,
          analyzedAt: new Date().toISOString(),
          error: `Unexpected content type: ${contentType}`,
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
      }

      const html = await response.text();

      // ── Structured extraction ────────────────────────────────────────────
      const title = extractAttr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
      const metaDescription = extractMeta(html, "description");
      const canonicalUrl = resolveUrl(extractLink(html, "canonical"), finalUrl);
      const ogTitle = extractMeta(html, "og:title");
      const ogDescription = extractMeta(html, "og:description");
      const ogImage = resolveUrl(extractMeta(html, "og:image"), finalUrl);
      const ogUrl = extractMeta(html, "og:url") || finalUrl;
      const ogType = extractMeta(html, "og:type");
      const ogSiteName = extractMeta(html, "og:site_name");
      const twitterCard = extractMeta(html, "twitter:card");
      const twitterTitle = extractMeta(html, "twitter:title");
      const twitterDescription = extractMeta(html, "twitter:description");
      const twitterImage = resolveUrl(extractMeta(html, "twitter:image"), finalUrl);
      const lang = extractLang(html);
      const author = extractMeta(html, "author");
      const robots = extractMeta(html, "robots");

      // ── Favicon ───────────────────────────────────────────────────────────
      let favicon =
        extractLink(html, "icon") ||
        extractLink(html, "shortcut icon") ||
        extractLink(html, "apple-touch-icon") ||
        extractLink(html, "mask-icon");

      favicon = resolveUrl(favicon, finalUrl) || defaultFavicon;

      // ── Build missing-fields list for the UI ──────────────────────────────
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!metaDescription) missingFields.push("metaDescription");
      if (!canonicalUrl) missingFields.push("canonicalUrl");
      if (!ogTitle) missingFields.push("ogTitle");
      if (!ogDescription) missingFields.push("ogDescription");
      if (!ogImage) missingFields.push("ogImage");
      if (!ogUrl) missingFields.push("ogUrl");
      if (!ogType) missingFields.push("ogType");
      if (!ogSiteName) missingFields.push("ogSiteName");
      if (!twitterCard) missingFields.push("twitterCard");
      if (!twitterTitle) missingFields.push("twitterTitle");
      if (!twitterDescription) missingFields.push("twitterDescription");
      if (!twitterImage) missingFields.push("twitterImage");
      if (!lang) missingFields.push("lang");
      if (!author) missingFields.push("author");
      if (!robots) missingFields.push("robots");

      return {
        url: normalizedUrl,
        finalUrl,
        httpStatus,
        contentType,
        title,
        metaDescription,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        ogType,
        ogSiteName,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        favicon,
        lang,
        author,
        robots,
        analyzedAt: new Date().toISOString(),
        error: null,
        missingFields,
      };
    } catch (error) {
      // Return a structured error so the UI can render the error state.
      return buildErrorResult(
        url,
        error.name === "AbortError"
          ? "Request timed out after 15 seconds. The website may be slow or unresponsive."
          : error.message || "Failed to fetch the website.",
      );
    }
  },
});

// Tools registry - exposed to the model via streamText.
export const tools = {
  analyzeWebsite: analyzeWebsiteTool,
};

export default tools;