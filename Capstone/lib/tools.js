import { z } from "zod";
import { tool } from "ai";

// ─── Schema ────────────────────────────────────────────────────────────────
// Input schema: a single website URL.
const analyzeWebsiteInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe("The full website URL to analyze, including https://"),
});

// ─── Tool ──────────────────────────────────────────────────────────────────
// Server-side tool that fetches a website and extracts metadata.
export const analyzeWebsiteTool = tool({
  description:
    "Analyze a website's metadata. Fetches the page and extracts the title, meta description, Open Graph title, Open Graph image, favicon, and HTTP status code.",
  inputSchema: analyzeWebsiteInputSchema,
  execute: async ({ url }) => {
    try {
      // Fetch the page with a reasonable timeout and user agent.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; FlyRank-Metadata-Analyzer/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      clearTimeout(timeout);

      const httpStatus = response.status;
      const contentType = response.headers.get("content-type") || "";
      const finalUrl = response.url || url;

      // Extract the origin for favicon resolution.
      let origin;
      try {
        origin = new URL(finalUrl).origin;
      } catch {
        origin = url;
      }

      // Default favicon from Google's favicon service as fallback.
      const defaultFavicon = `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;

      // Only parse HTML responses.
      if (
        !contentType.includes("text/html") &&
        !contentType.includes("application/xhtml")
      ) {
        return {
          url,
          finalUrl,
          httpStatus,
          title: null,
          metaDescription: null,
          ogTitle: null,
          ogImage: null,
          favicon: defaultFavicon,
          analyzedAt: new Date().toISOString(),
          error: `Unexpected content type: ${contentType}`,
        };
      }

      const html = await response.text();

      // ─── Extract <title> ────────────────────────────────────────────────
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : null;

      // ─── Extract meta description ───────────────────────────────────────
      const metaDescMatch = html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i,
      );
      const metaDescription = metaDescMatch
        ? metaDescMatch[1].trim()
        : null;

      // ─── Extract Open Graph title (og:title) ────────────────────────────
      const ogTitleMatch = html.match(
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i,
      );
      const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;

      // ─── Extract Open Graph image (og:image) ────────────────────────────
      const ogImageMatch = html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([\s\S]*?)["']/i,
      );
      let ogImage = ogImageMatch ? ogImageMatch[1].trim() : null;

      // Resolve relative OG image URLs to absolute.
      if (ogImage && !ogImage.startsWith("http")) {
        try {
          ogImage = new URL(ogImage, finalUrl).href;
        } catch {
          // Keep the original if URL resolution fails.
        }
      }

      // ─── Extract favicon ────────────────────────────────────────────────
      // Try <link rel="icon">, <link rel="shortcut icon">, and <link rel="apple-touch-icon">
      let favicon = null;
      const faviconPatterns = [
        /<link[^>]+rel=["']icon["'][^>]+href=["']([\s\S]*?)["']/i,
        /<link[^>]+rel=["']shortcut icon["'][^>]+href=["']([\s\S]*?)["']/i,
        /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([\s\S]*?)["']/i,
        /<link[^>]+rel=["']mask-icon["'][^>]+href=["']([\s\S]*?)["']/i,
      ];

      for (const pattern of faviconPatterns) {
        const match = html.match(pattern);
        if (match) {
          favicon = match[1].trim();
          break;
        }
      }

      // Resolve relative favicon URLs to absolute.
      if (favicon && !favicon.startsWith("http")) {
        try {
          favicon = new URL(favicon, finalUrl).href;
        } catch {
          favicon = defaultFavicon;
        }
      }

      // Fall back to Google's favicon service if no favicon found.
      if (!favicon) {
        favicon = defaultFavicon;
      }

      return {
        url,
        finalUrl,
        httpStatus,
        title,
        metaDescription,
        ogTitle,
        ogImage,
        favicon,
        analyzedAt: new Date().toISOString(),
        error: null,
      };
    } catch (error) {
      // Extract origin for default favicon.
      let defaultFavicon;
      try {
        const origin = new URL(url).origin;
        defaultFavicon = `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;
      } catch {
        defaultFavicon = null;
      }

      // Return a structured error so the UI can render the error state.
      return {
        url,
        finalUrl: url,
        httpStatus: null,
        title: null,
        metaDescription: null,
        ogTitle: null,
        ogImage: null,
        favicon: defaultFavicon,
        analyzedAt: new Date().toISOString(),
        error:
          error.name === "AbortError"
            ? "Request timed out after 15 seconds. The website may be slow or unresponsive."
            : error.message || "Failed to fetch the website.",
      };
    }
  },
});

// Tools registry - exposed to the model via streamText.
export const tools = {
  analyzeWebsite: analyzeWebsiteTool,
};