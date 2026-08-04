"use client";

/**
 * LandingScreen — the first screen users see when they open MetaSpark AI.
 * Shows the logo, product name, tagline, and a "Get Started" button that
 * navigates to the main analyzer.
 *
 * Animations respect prefers-reduced-motion via CSS media queries.
 */
export default function LandingScreen({ onGetStarted }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f] px-4 py-8 transition-colors duration-200">
      <div className="flex flex-col items-center text-center max-w-2xl w-full">
        {/* Logo with scale-in animation */}
        <div className="landing-scale-in mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-white"
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
        </div>

        {/* Product name with fade-up animation */}
        <h1 className="landing-fade-up landing-fade-up-delay-1 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
          MetaSpark AI
        </h1>

        {/* Tagline with fade-up animation */}
        <p className="landing-fade-up landing-fade-up-delay-2 text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2 max-w-md leading-relaxed">
          Turn any website into meaningful insights.
        </p>

        {/* Supporting text with fade-up animation */}
        <p className="landing-fade-up landing-fade-up-delay-2 text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-8 sm:mb-10 max-w-lg leading-relaxed">
          Analyze website metadata, Open Graph information, favicons, and HTTP
          details with AI-powered insights.
        </p>

        {/* Get Started button with fade-up animation */}
        <button
          onClick={onGetStarted}
          className="landing-fade-up landing-fade-up-delay-3 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white text-sm sm:text-base font-medium hover:from-primary-600 hover:to-primary-800 active:scale-95 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-[#0f0f0f]"
          aria-label="Get started with MetaSpark AI"
        >
          Get Started
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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
        </button>
      </div>
    </div>
  );
}