"use client";

import { useEffect } from "react";

/**
 * Root error boundary for the FlyRank AI application.
 * Catches unhandled React errors (client + server) and renders a
 * friendly, branded fallback with a retry button.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the real error server-side but never expose it to the user.
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#0f0f0f] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-500 dark:text-red-400"
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
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          We encountered an unexpected problem. Your conversation data was not
          affected. Please try again and the issue should resolve itself.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium hover:from-primary-600 hover:to-primary-800 active:scale-95 transition-all shadow-md hover:shadow-lg"
        >
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
              d="M4 4v5h5M20 12a8 8 0 00-16 0 8 8 0 0016 0z"
            />
          </svg>
          Try again
        </button>
      </div>
    </div>
  );
}
