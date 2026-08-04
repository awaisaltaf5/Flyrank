"use client";

import { getFriendlyErrorMessage } from "@/lib/error-utils";
import Icon from "@/components/Icons";

export default function ChatError({ error, onRetry, isRetrying }) {
  const safeMessage = getFriendlyErrorMessage(error) || error?.message || "Something went wrong. Please try again.";

  const isRateLimit = safeMessage.toLowerCase().includes("high demand");
  const isNetwork = safeMessage.toLowerCase().includes("connect");

  let iconName;
  let iconColor;
  let bgColor;
  let borderColor;
  let textColor;

  if (isRateLimit) {
    iconName = "alert";
    iconColor = "text-amber-500";
    bgColor = "bg-amber-50 dark:bg-amber-900/20";
    borderColor = "border-amber-200 dark:border-amber-800";
    textColor = "text-amber-700 dark:text-amber-300";
  } else if (isNetwork) {
    iconName = "network";
    iconColor = "text-red-500";
    bgColor = "bg-red-50 dark:bg-red-900/20";
    borderColor = "border-red-200 dark:border-red-800";
    textColor = "text-red-700 dark:text-red-300";
  } else {
    iconName = "alert";
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
                <Icon name={iconName} className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
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
                  <Icon name="spinner" className="w-3 h-3 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <Icon name="refresh" className="w-3 h-3" />
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
