"use client";

export default function ScrollToBottomButton({ onClick, visible }) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium shadow-lg hover:bg-primary-700 active:scale-95 transition-all animate-fade-in-up"
      aria-label="Jump to latest message"
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
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
      Jump to Latest
    </button>
  );
}