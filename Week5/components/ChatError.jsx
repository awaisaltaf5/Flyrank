"use client";

import { getFriendlyErrorMessage } from "@/lib/error-utils";

export default function ChatError({ error, onRetry, isRetrying }) {
  const safeMessage = getFriendlyErrorMessage(error) || error?.message || "Something went wrong. Please try again.";

  const isRateLimit = safeMessage.toLowerCase().includes("high demand");
  const isNetwork = safeMessage.toLowerCase().includes("connect");

  let Icon;
  let iconColor;
  let bgColor;
  let borderColor;
  let textColor;

  if (isRateLimit) {
    Icon = (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    );
    iconColor = "text-amber-500";
    bgColor = "bg-amber-50 dark:bg-amber-900/20";
    borderColor = "border-amber-200 dark:border-amber-800";
    textColor = "text-amber-700 dark:text-amber-300";
  } else if (isNetwork) {
    Icon = (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.767 3.767m0 0L12 11.023m2.697-2.697L9 17.293M5.636 5.636A9 9 0 112.32 9 9 9 0 015.636 5.636z" />
    );
    iconColor = "text-red-500";
    bgColor = "bg-red-50 dark:bg-red-900/20";
    borderColor = "border-red-200 dark:border-red-800";
    textColor = "text-red-700 dark:text-red-300";
  } else {
    Icon = (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    );
    iconColor = "text-red-500";
    bgColor = "bg-red-50 dark:bg-red-900/20";
    borderColor = "border-red-200 dark:border-red-800";
    textColor = "text-red-700 dark:text-red-300";
  }

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto my-4">
      <div className="flex justify-start">
        <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
          {/* AI avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className={`rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed border ${bgColor} ${borderColor}`}>
              <div className="flex items-start gap-2">
                <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {Icon}
                </svg>
                <p className={`break-words ${textColor}`}>{safeMessage}</p>
              </div>
            </div>

            {/* Retry button */}
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              {isRetrying ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Retrying...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 12a8 8 0 00-16 0 8 8 0 0016 0z" />
                  </svg>
                  Retry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
