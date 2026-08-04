"use client";

export default function ThinkingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-2 sm:gap-3">
        {/* AI avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg
            className="w-4 h-4 text-white"
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
        </div>

        {/* Thinking bubble */}
        <div className="inline-flex items-center gap-2.5 rounded-2xl rounded-bl-md bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce-dot" />
            <div
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce-dot"
              style={{ animationDelay: "0.15s" }}
            />
            <div
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce-dot"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Thinking...
          </span>
        </div>
      </div>
    </div>
  );
}