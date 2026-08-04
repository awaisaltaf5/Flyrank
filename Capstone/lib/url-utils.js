/**
 * Client-safe URL utilities for the MetaSpark AI Website Metadata Analyzer.
 *
 * These helpers are used on both the client (input validation) and the server
 * (tool input normalization). They must NOT import any Node.js built-ins so
 * they can be bundled for the browser.
 */

/**
 * Normalize a user-supplied URL string.
 *
 * - Trims whitespace
 * - Adds https:// when no protocol is present
 * - Validates the result is a parseable http(s) URL
 *
 * Returns the normalized URL string, or null if invalid.
 */
export function normalizeUrl(input) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // If it has spaces, it's probably a question, not a URL.
  if (/\s/.test(trimmed)) return null;

  // Reject non-HTTP(S) protocols explicitly.
  const protocolMatch = trimmed.match(/^([a-z][a-z0-9+.-]*):\/\//i);
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase();
    if (protocol !== "http" && protocol !== "https") {
      return null;
    }
  }

  // Add https:// when no protocol is present.
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

/**
 * Validate a user-supplied URL input.
 *
 * Returns { ok: true, url } on success, or { ok: false, error } on failure.
 */
export function validateUrlInput(input) {
  const url = normalizeUrl(input);
  if (!url) {
    return {
      ok: false,
      error: "Please enter a valid URL, e.g. https://example.com",
    };
  }
  return { ok: true, url };
}

/**
 * Heuristic: does this input look like the user is trying to enter a URL
 * (as opposed to asking a general question)?
 */
export function looksLikeUrl(input) {
  if (typeof input !== "string") return false;
  const trimmed = input.trim();
  if (!trimmed) return false;

  // Explicit http(s):// prefix is always a URL attempt.
  if (/^https?:\/\//i.test(trimmed)) return true;

  // A single token with a dot and no spaces is likely a domain.
  if (!/\s/.test(trimmed) && trimmed.includes(".")) return true;

  return false;
}