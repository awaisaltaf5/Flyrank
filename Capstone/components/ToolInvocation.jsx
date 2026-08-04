"use client";

import { isToolUIPart } from "ai";
import ResultSections from "./ResultSections";
import Icon from "@/components/Icons";

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ state }) {
  const config = {
    "input-streaming": {
      label: "Preparing",
      classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      dot: "bg-blue-500 animate-pulse",
    },
    "input-available": {
      label: "Fetching",
      classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      dot: "bg-amber-500 animate-pulse",
    },
    "output-available": {
      label: "Complete",
      classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      dot: "bg-green-500",
    },
    error: {
      label: "Error",
      classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      dot: "bg-red-500",
    },
  };

  const c = config[state] || config["input-streaming"];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} aria-hidden="true" />
      {c.label}
    </span>
  );
}

// ─── Format timestamp ───────────────────────────────────────────────────────
function formatTimestamp(iso) {
  if (!iso) return null;
  try {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

// ─── Error classification ───────────────────────────────────────────────────
function classifyError(message) {
  if (!message) return { title: "Analysis Failed", hint: "" };
  const lower = message.toLowerCase();

  if (lower.includes("timed out") || lower.includes("timeout")) {
    return {
      title: "Request Timed Out",
      hint: "The website took too long to respond. It may be slow, overloaded, or blocking automated requests.",
    };
  }
  if (lower.includes("blocked") || lower.includes("private") || lower.includes("reserved")) {
    return {
      title: "URL Blocked",
      hint: "This URL points to a private or reserved address. For security, only public websites can be analyzed.",
    };
  }
  if (lower.includes("resolve") || lower.includes("dns") || lower.includes("enotfound")) {
    return {
      title: "Domain Not Found",
      hint: "The domain could not be resolved. Check that the URL is spelled correctly and the domain exists.",
    };
  }
  if (lower.includes("content type") || lower.includes("unexpected content")) {
    return {
      title: "Not an HTML Page",
      hint: "The URL did not return an HTML page, so metadata could not be extracted.",
    };
  }
  if (lower.includes("fetch") || lower.includes("network") || lower.includes("connection")) {
    return {
      title: "Connection Failed",
      hint: "The website could not be reached. It may be down or blocking automated requests.",
    };
  }
  return {
    title: "Analysis Failed",
    hint: "The website may be down, blocking automated requests, or returning an error. Please check the URL and try again.",
  };
}

// ─── Error Card ─────────────────────────────────────────────────────────────
function ErrorCard({ url, error, favicon }) {
  const { title, hint } = classifyError(error);

  return (
    <div
      className="animate-fade-in my-2 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10 overflow-hidden"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium text-red-900 dark:text-red-300">{title}</span>
        </div>
        <StatusBadge state="error" />
      </div>
      <div className="px-4 py-3">
        {url && (
          <div className="flex items-center gap-2 mb-2">
            {favicon && (
              <img src={favicon} alt="Favicon" className="w-5 h-5 rounded object-contain bg-white dark:bg-gray-800 p-0.5 border border-gray-200 dark:border-[#2a2a2a]" />
            )}
            <p className="text-sm text-red-800 dark:text-red-300 font-mono break-all">{url}</p>
          </div>
        )}
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        {hint && (
          <p className="text-xs text-red-500 dark:text-red-500/70 mt-2">{hint}</p>
        )}
      </div>
    </div>
  );
}

// ─── Tool Invocation Card ───────────────────────────────────────────────────
export default function ToolInvocation({ part }) {
  if (!isToolUIPart(part)) return null;

  const { state, input, output } = part;

  // ─── State: input-streaming ──────────────────────────────────────────────
  if (state === "input-streaming") {
    return (
      <div className="animate-fade-in my-2 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 overflow-hidden" aria-live="polite">
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <Icon name="spinner" className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Preparing analysis...</span>
          </div>
          <StatusBadge state={state} />
        </div>
        <div className="px-4 py-3">
          {input?.url ? (
            <p className="text-sm text-blue-800 dark:text-blue-300 font-mono break-all">{input.url}</p>
          ) : (
            <div className="space-y-2">
              <div className="h-3 bg-blue-200/50 dark:bg-blue-800/30 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-blue-200/50 dark:bg-blue-800/30 rounded animate-pulse w-1/2" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── State: input-available ──────────────────────────────────────────────
  if (state === "input-available") {
    return (
      <div className="animate-fade-in my-2 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 overflow-hidden" aria-live="polite">
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <Icon name="link" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-300">Analyzing website</span>
          </div>
          <StatusBadge state={state} />
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Icon name="link" className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300 font-mono break-all">{input?.url || "Unknown URL"}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1" aria-hidden="true">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce-dot" />
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce-dot" style={{ animationDelay: "0.2s" }} />
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce-dot" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">Fetching page and extracting metadata...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── State: output-available ─────────────────────────────────────────────
  if (state === "output-available") {
    const data = output;

    // Check if the output itself contains an error.
    if (data?.error) {
      return <ErrorCard url={data?.url || input?.url} error={data.error} favicon={data?.favicon} />;
    }

    const timestamp = formatTimestamp(data?.analyzedAt);

    return (
      <div className="animate-fade-in-up my-2 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] shadow-sm overflow-hidden" aria-live="polite">
      {/* Card Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#222] dark:to-[#1a1a1a] border-b border-gray-200 dark:border-[#2a2a2a]">
          <div className="flex items-center gap-2.5 min-w-0">
            {data?.favicon && (
              <img src={data.favicon} alt="Website favicon" className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-[#2a2a2a]" />
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">Website Analysis Report</h3>
              <a
                href={data?.finalUrl || data?.url || input?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline truncate block max-w-full transition-colors"
              >
                {data?.finalUrl || data?.url || input?.url}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge state={state} />
          </div>
        </div>

        {/* Structured Result Sections */}
        <div className="px-4 py-4">
          <ResultSections data={data} input={input} />
        </div>

        {/* Footer with timestamp */}
        {timestamp && (
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#222]/50">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Icon name="time" className="w-3 h-3" />
              Analyzed at {timestamp}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── State: error (or unknown) ────────────────────────────────────────────
  return <ErrorCard url={input?.url} error={output?.error || "Tool execution failed"} />;
}