"use client";

/**
 * LoadingSkeleton — renders placeholder bubbles that mimic the shape of
 * assistant and user messages while the chat is initialising or while
 * we are waiting for the first streaming chunk.
 */
export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-fade-in-up`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div
            className={`flex items-start gap-2 sm:gap-3 ${
              i % 2 === 0 ? "max-w-[90%] sm:max-w-[85%]" : "max-w-[85%] sm:max-w-[75%]"
            }`}
          >
            {i % 2 === 0 && (
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
            )}

            <div
              className={`rounded-2xl skeleton h-4 space-y-2 py-3 ${
                i % 2 === 0
                  ? "rounded-bl-md bg-gray-50 dark:bg-[#1a1a1a] w-full"
                  : "bg-primary-100 dark:bg-primary-900/30 w-full"
              }`}
              style={{
                // Vary widths for a more natural skeleton look
                width: `${80 - i * 10}%`,
                minHeight: "1.5rem",
              }}
            />

            {i % 2 === 1 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#262626] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
