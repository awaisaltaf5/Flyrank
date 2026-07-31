"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import ThinkingIndicator from "@/components/ThinkingIndicator";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";

export default function Home() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    api: "/api/chat",
  });

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const isLoading = status === "submitted" || status === "streaming";

  // ── Dark mode initialization ─────────────────────────────────────────────
  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // ── Scroll detection ─────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isNearBottom);
    setAutoScroll(isNearBottom);
  }, []);

  // ── Auto-scroll when new messages arrive (if autoScroll is enabled) ──────
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, status, autoScroll]);

  // ── Force scroll to bottom on new user message ───────────────────────────
  const handleSend = useCallback(
    (msg) => {
      setAutoScroll(true);
      sendMessage(msg);
    },
    [sendMessage],
  );

  // ── Jump to latest ───────────────────────────────────────────────────────
  const jumpToLatest = useCallback(() => {
    setAutoScroll(true);
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // ── Check if last assistant message has visible content ──────────────────
  const lastMessage = messages[messages.length - 1];
  const lastMessageHasContent =
    lastMessage &&
    lastMessage.role === "assistant" &&
    lastMessage.parts &&
    lastMessage.parts.some(
      (p) =>
        (p.type === "text" && p.text) ||
        p.type?.startsWith("tool-") ||
        p.type === "dynamic-tool",
    );

  const showThinking = isLoading && !lastMessageHasContent;

  // ── Handle suggestion clicks ─────────────────────────────────────────────
  const handleSuggestion = useCallback(
    (text) => {
      handleSend({ text });
    },
    [handleSend],
  );

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto w-full bg-white dark:bg-[#0f0f0f] transition-colors duration-200">
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-[#2a2a2a] bg-white/80 dark:bg-[#0f0f0f]/80 glass px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
              FlyRank AI
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              Website Metadata Analyzer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isLoading
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLoading ? "bg-blue-500 animate-pulse" : "bg-green-500"
              }`}
            />
            {isLoading ? "Analyzing" : "Ready"}
          </span>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Chat Container ────────────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 relative"
      >
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestion={handleSuggestion} />
        ) : (
          <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Thinking indicator */}
            {showThinking && <ThinkingIndicator />}

            {/* Error display */}
            {error && (
              <div className="animate-fade-in-up p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
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
                  <div>
                    <p className="font-medium">Something went wrong</p>
                    <p className="text-red-600 dark:text-red-400 mt-0.5">
                      {error.message ||
                        "Please check your OPENROUTER_API_KEY in .env.local and try again."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Jump to Latest button ─────────────────────────────────────────── */}
      <ScrollToBottomButton
        onClick={jumpToLatest}
        visible={showScrollButton && messages.length > 0}
      />

      {/* ── Floating Input Area ───────────────────────────────────────────── */}
      <ChatInput
        sendMessage={handleSend}
        status={status}
        onStop={stop}
        onRegenerate={regenerate}
        canRegenerate={messages.length > 0 && !isLoading}
      />
    </main>
  );
}