/**
 * Error handling utilities for the FlyRank AI chat application.
 *
 * These helpers ensure that:
 *  - Internal errors (stack traces, API keys, raw provider responses) are
 *    NEVER leaked to the client.
 *  - Users always see a friendly, actionable message.
 *  - Errors are categorised so the UI can render context-specific messaging
 *    (e.g. rate-limit vs. network failure vs. AI/API error).
 */

// ── Sensitive patterns that must never reach the user ───────────────────────

// Matches common API-key formats (OpenRouter, OpenAI, Anthropic, etc.)
const API_KEY_REGEX =
  /(?:sk-[a-zA-Z0-9-]{20,}|key_[a-zA-Z0-9-]{20,}|Bearer\s+[a-zA-Z0-9-_.]+)/g;

// Matches anything that looks like a full HTTP request/response snippet
const RAW_HTTP_REGEX =
  /(?:fetch|request|response|POST|GET|status:|headers?:|body:|connection)/gi;

// Generic internal detail leakage
const INTERNAL_DETAIL_REGEX =
  /(?:at\s+.*\(.+\)|\bnode:|\bprocess\.env|\.env|stacktrace|traceback)/gi;

/**
 * Scrub a raw error string so it is safe to show the user.
 * Removes API keys, environment variable references, stack traces,
 * and other internal implementation details.
 */
function scrubErrorMessage(raw) {
  if (typeof raw !== "string") {
    return "An unexpected error occurred.";
  }

  let scrubbed = raw;

  // Remove API keys and bearer tokens
  scrubbed = scrubbed.replace(API_KEY_REGEX, "[REDACTED]");

  // Remove environment variable references
  scrubbed = scrubbed.replace(/process\.env\.\w+/g, "[REDACTED]");
  scrubbed = scrubbed.replace(/\.env\.local/g, "[REDACTED]");

  // Truncate stack traces (anything after a newline that looks like a trace)
  scrubbed = scrubbed.replace(/\n\s*at\b[\s\S]*$/, "");

  // Remove raw HTTP details
  scrubbed = scrubbed.replace(
    /status:\s*\d+/gi,
    "a server error occurred",
  );

  // If the message is too long or contains internal jargon, replace it
  if (
    scrubbed.length > 200 ||
    INTERNAL_DETAIL_REGEX.test(scrubbed)
  ) {
    return "An unexpected error occurred. Please try again.";
  }

  return scrubbed.trim() || "An unexpected error occurred.";
}

/**
 * Categorise a raw error into a typed classification and produce a
 * user-friendly message.
 *
 * Returns: { type, message, isRateLimit }
 */
export function categorizeError(error) {
  // The error could be anything: an Error object, a fetch response,
  // a string, or an object with statusCode/body.
  if (!error) {
    return {
      type: "unknown",
      message: "Something went wrong. Please try again.",
      isRateLimit: false,
    };
  }

  // Normalize: extract a string + numeric status if available.
  let message = "";
  let status = null;
  let isRateLimit = false;

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message || "An error occurred";
  } else if (typeof error === "object" && error !== null) {
    message =
      error.message ||
      error.error ||
      error.description ||
      error.detail ||
      "An error occurred";
    status = error.status || error.statusCode || error.code || null;
  } else {
    message = "An error occurred";
  }

  // ── Detect rate limiting ──────────────────────────────────────────────
  const messageLower = String(message).toLowerCase();
  const statusNum = typeof status === "number" ? status : null;

  if (
    statusNum === 429 ||
    messageLower.includes("rate limit") ||
    messageLower.includes("too many requests") ||
    messageLower.includes("quota exceeded") ||
    messageLower.includes("rate_limit") ||
    messageLower.includes("capacity reached")
  ) {
    isRateLimit = true;
    return {
      type: "rate-limit",
      message:
        "We're experiencing high demand right now. Please wait a moment and try again.",
      isRateLimit: true,
    };
  }

  // ── Detect network failure ────────────────────────────────────────────
  if (
    messageLower.includes("network") ||
    messageLower.includes("networkerror") ||
    messageLower.includes("failed to fetch") ||
    messageLower.includes("fetch") ||
    messageLower.includes("connection") ||
    messageLower.includes("timeout") ||
    messageLower.includes("econnrefused") ||
    messageLower.includes("etimedout") ||
    messageLower.includes("enotfound") ||
    messageLower.includes("aborted") ||
    (typeof messageLower === "string" &&
      messageLower.includes("err_")) ||
    statusNum === 502 ||
    statusNum === 503 ||
    statusNum === 504
  ) {
    return {
      type: "network",
      message:
        "Unable to connect to the AI service. Please check your internet connection and try again.",
      isRateLimit: false,
    };
  }

  // ── Detect authentication / API key errors ────────────────────────────
  const authStatus = [401, 403];
  if (
    authStatus.includes(statusNum) ||
    messageLower.includes("unauthorized") ||
    messageLower.includes("authentication") ||
    messageLower.includes("api key") ||
    messageLower.includes("api_key") ||
    messageLower.includes("forbidden") ||
    messageLower.includes("access denied")
  ) {
    return {
      type: "auth",
      message:
        "Authentication failed. Please verify your API configuration and try again.",
      isRateLimit: false,
    };
  }

  // ── Generic API / AI error ───────────────────────────────────────────
  if (
    messageLower.includes("model") ||
    messageLower.includes("overloaded") ||
    messageLower.includes("unavailable") ||
    messageLower.includes("context") ||
    statusNum === 400 ||
    statusNum === 408 ||
    statusNum === 413 ||
    statusNum === 500
  ) {
    return {
      type: "api",
      message: scrubErrorMessage(message) || "The AI service returned an error. Please try again.",
      isRateLimit: false,
    };
  }

  // ── Fallback: never expose internals ──────────────────────────────────
  return {
    type: "unknown",
    message: "Something went wrong while talking to the AI service. Please try again.",
    isRateLimit: false,
  };
}

/**
 * Extract a friendly, safe message from any error thrown during the chat
 * lifecycle (network, API, streaming, etc.).
 */
export function getFriendlyErrorMessage(error) {
  const categorised = categorizeError(error);
  return categorised.message;
}

/**
 * Returns true if the error looks like a rate-limit condition.
 */
export function isRateLimitError(error) {
  return categorizeError(error).isRateLimit;
}
