"use client";

import Icon from "@/components/Icons";

/**
 * WelcomeScreen — the designed empty / first-run state shown when the
 * conversation has zero messages.
 *
 * Renders a welcome illustration, a short description, and a set of
 * suggestion buttons that let the user jump straight into analyzing a
 * website.
 */
export default function WelcomeScreen({ onSuggestion }) {
  const suggestions = [
    {
      label: "Analyze vercel.com",
      text: "Analyze https://vercel.com",
      icon: (
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
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ),
    },
    {
      label: "Analyze github.com",
      text: "Analyze https://github.com",
      icon: (
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
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ),
    },
    {
      label: "Analyze react.dev",
      text: "Analyze https://react.dev",
      icon: (
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
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ),
    },
    {
      label: "Analyze nextjs.org",
      text: "Analyze https://nextjs.org",
      icon: (
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
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 animate-fade-in">
      {/* Logo */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-xl">
        <Icon name="logo" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
        AI Website Metadata Analyzer
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mb-6 sm:mb-8 leading-relaxed">
        Enter any website URL and the assistant will extract its metadata —
        title, meta description, Open Graph tags, favicon, and HTTP status —
        in real time.
      </p>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-lg">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion?.(s.text)}
            className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-sm text-gray-700 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 hover:text-primary-700 dark:hover:text-primary-400 cursor-pointer transition-all text-left active:scale-[0.98]"
          >
            <span className="text-primary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <Icon name="arrowRight" className="w-4 h-4" />
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        {[
          "Real-time streaming",
          "Tool calling",
          "Open Graph",
          "Favicon",
          "Dark mode",
        ].map((feature) => (
          <span
            key={feature}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#2a2a2a]"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}