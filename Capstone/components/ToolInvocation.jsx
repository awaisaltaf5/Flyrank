"use client";

import { isToolUIPart } from "ai";

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ state }) {
  const config = {
    "input-streaming": {
      label: "Preparing",
      classes:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      dot: "bg-blue-500 animate-pulse",
    },
    "input-available": {
      label: "Fetching",
      classes:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      dot: "bg-amber-500 animate-pulse",
    },
    "output-available": {
      label: "Complete",
      classes:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── HTTP Status Badge ──────────────────────────────────────────────────────
function HttpStatusBadge({ status }) {
  if (!status) return null;

  const isSuccess = status >= 200 && status < 300;
  const isRedirect = status >= 300 && status < 400;
  const isError = status >= 400;

  const classes = isSuccess
    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
    : isRedirect
      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      : isError
        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${classes}`}
    >
      {status}
    </span>
  );
}

// ─── Metadata Row ───────────────────────────────────────────────────────────
function MetadataRow({ label, value, icon }) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2.5 border-b border-gray-100 dark:border-[#2a2a2a] last:border-0">
      <div className="flex items-center gap-2 sm:w-36 sm:flex-shrink-0">
        {icon}
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-sm text-gray-800 dark:text-gray-200 break-words flex-1 min-w-0">
        {hasValue ? (
          value
        ) : (
          <span className="text-gray-400 dark:text-gray-600 italic">
            Not found
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Favicon ────────────────────────────────────────────────────────────────
function Favicon({ src, alt, size = "w-8 h-8" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${size} rounded-lg flex-shrink-0 object-contain bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-[#2a2a2a]`}
      onError={(e) => {
        e.currentTarget.style.opacity = "0.3";
        e.currentTarget.src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'/%3E%3C/svg%3E";
      }}
    />
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

// ─── Tool Invocation Card ───────────────────────────────────────────────────
export default function ToolInvocation({ part }) {
  if (!isToolUIPart(part)) return null;

  const { state, input, output } = part;

  // ─── State: input-streaming ──────────────────────────────────────────────
  if (state === "input-streaming") {
    return (
      <div className="animate-fade-in my-2 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Preparing analysis...
            </span>
          </div>
          <StatusBadge state={state} />
        </div>
        <div className="px-4 py-3">
          {input?.url ? (
            <p className="text-sm text-blue-800 dark:text-blue-300 font-mono break-all">
              {input.url}
            </p>
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
      <div className="animate-fade-in my-2 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
              />
            </svg>
            <span className="text-sm font-medium text-amber-900 dark:text-amber-300">
              Analyzing website
            </span>
          </div>
          <StatusBadge state={state} />
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <p className="text-sm text-amber-800 dark:text-amber-300 font-mono break-all">
              {input?.url || "Unknown URL"}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce-dot" />
              <div
                className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce-dot"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce-dot"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Fetching page and extracting metadata...
            </p>
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
      return (
        <ErrorCard
          url={data?.url || input?.url}
          error={data.error}
          favicon={data?.favicon}
        />
      );
    }

    const timestamp = formatTimestamp(data?.analyzedAt);

    return (
      <div className="animate-fade-in-up my-2 rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#222] dark:to-[#1a1a1a] border-b border-gray-200 dark:border-[#2a2a2a]">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Favicon */}
            {data?.favicon && (
              <Favicon src={data.favicon} alt="Website favicon" />
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                Website Analysis Report
              </h3>
              <a
                href={data?.url || input?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 truncate block max-w-full transition-colors"
              >
                {data?.url || input?.url}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <HttpStatusBadge status={data?.httpStatus} />
            <StatusBadge state={state} />
          </div>
        </div>

        {/* Card Body - Metadata */}
        <div className="px-4 py-2">
          <MetadataRow
            label="Title"
            value={data?.title}
            icon={
              <svg
                className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />
          <MetadataRow
            label="Description"
            value={data?.metaDescription}
            icon={
              <svg
                className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h7"
                />
              </svg>
            }
          />
          <MetadataRow
            label="OG Title"
            value={data?.ogTitle}
            icon={
              <svg
                className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            }
          />
        </div>

        {/* OG Image Preview */}
        {data?.ogImage && (
          <div className="px-4 pb-3">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Open Graph Image
            </div>
            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#222]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.ogImage}
                alt="Open Graph preview"
                className="w-full max-h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = "flex";
                  }
                }}
              />
              <div
                style={{ display: "none" }}
                className="text-sm text-gray-400 dark:text-gray-600 italic p-6 items-center justify-center bg-gray-50 dark:bg-[#222]"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Image could not be loaded
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer with timestamp */}
        {timestamp && (
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#222]/50">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Analyzed at {timestamp}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── State: error (or unknown) ────────────────────────────────────────────
  return <ErrorCard url={input?.url} error="Tool execution failed" />;
}

// ─── Error Card ─────────────────────────────────────────────────────────────
function ErrorCard({ url, error, favicon }) {
  return (
    <div className="animate-fade-in my-2 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm font-medium text-red-900 dark:text-red-300">
            Analysis Failed
          </span>
        </div>
        <StatusBadge state="error" />
      </div>
      <div className="px-4 py-3">
        {url && (
          <div className="flex items-center gap-2 mb-2">
            {favicon && <Favicon src={favicon} alt="Favicon" size="w-5 h-5" />}
            <p className="text-sm text-red-800 dark:text-red-300 font-mono break-all">
              {url}
            </p>
          </div>
        )}
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        <p className="text-xs text-red-500 dark:text-red-500/70 mt-2">
          The website may be down, blocking automated requests, or returning an
          error. Please check the URL and try again.
        </p>
      </div>
    </div>
  );
}