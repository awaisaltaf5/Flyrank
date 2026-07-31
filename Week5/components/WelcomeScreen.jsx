"use client";

export default function WelcomeScreen({ onSuggestion }) {
  const suggestions = [
    {
      label: "Analyze vercel.com",
      text: "Analyze https://vercel.com",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      ),
    },
    {
      label: "Analyze github.com",
      text: "Analyze https://github.com",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      ),
    },
    {
      label: "Analyze react.dev",
      text: "Analyze https://react.dev",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      ),
    },
    {
      label: "Analyze nextjs.org",
      text: "Analyze https://nextjs.org",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 animate-fade-in">
      {/* Logo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-5 sm:mb-6 shadow-lg">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
        AI Website Metadata Analyzer
      </h2>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mb-6 sm:mb-8 leading-relaxed">
        Enter any website URL and I'll analyze its metadata — title, meta
        description, Open Graph tags, favicon, and HTTP status — in real time.
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
              {s.icon}
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