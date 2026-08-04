"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import ThinkingIndicator from "@/components/ThinkingIndicator";
import ChatError from "@/components/ChatError";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";

export default function Home() {
  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
    clearError,
  } = useChat({
    api: "/api/chat",
    onError: (error) => {
      console.error("[useChat] error:", error?.message || "Unknown");
    },
  });

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isSlowResponse, setIsSlowResponse] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isLoading = status === "submitted" || status === "streaming";

  // Slow-response detection: after 10s of loading, show a hint.
  useEffect(() => {
    let timer;
    if (isLoading) {
      setIsSlowResponse(false);
      timer = setTimeout(() => setIsSlowResponse(true), 10000);
    } else {
      setIsSlowResponse(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Dark mode init
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
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

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    setAutoScroll(isNearBottom);
  }, []);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, status, autoScroll]);

  const handleSend = useCallback(
    (msg) => {
      setAutoScroll(true);
      sendMessage(msg);
    },
    [sendMessage],
  );

  const jumpToLatest = useCallback(() => {
    setAutoScroll(true);
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  // Retry: clear error then regenerate the last user turn.
  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      clearError();
      await regenerate();
    } catch (e) {
      console.error("[handleRetry]", e);
    } finally {
      setIsRetrying(false);
    }
  }, [clearError, regenerate]);

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

  const showThinking = isLoading && !lastMessageHasContent && messages.length > 0;

  // No results: finished turn with no visible assistant content
  const showNoResults =
    messages.length > 0 &&
    !isLoading &&
    !error &&
    lastMessage?.role === "assistant" &&
    !lastMessageHasContent;

  const handleSuggestion = useCallback(
    (text) => handleSend({ text }),
    [handleSend],
  );

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto w-full bg-white dark:bg-[#0f0f0f] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-[#2a2a2a] bg-white/80 dark:bg-[#0f0f0f]/80 glass px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">FlyRank AI</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Website Metadata Analyzer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            error ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : isLoading ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${error ? "bg-red-500 animate-pulse" : isLoading ? "bg-blue-500 animate-pulse" : "bg-green-500"}`} />
            {error ? "Error" : isLoading ? "Analyzing" : "Ready"}
          </span>
          <button onClick={toggleDarkMode} className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors" aria-label="Toggle dark mode" title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 relative">
        {messages.length === 0 && !isLoading && !error ? (
          <WelcomeScreen onSuggestion={handleSuggestion} />
        ) : messages.length === 0 && (isLoading || error) ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {showThinking && <ThinkingIndicator isSlow={isSlowResponse} />}

            {isLoading && messages.length > 0 && !lastMessageHasContent && (
              <div className="animate-fade-in"><LoadingSkeleton count={1} /></div>
            )}

            {error && (
              <ChatError error={error} onRetry={handleRetry} isRetrying={isRetrying} />
            )}

            {showNoResults && (
              <div className="animate-fade-in-up max-w-2xl mx-auto my-4">
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="rounded-2xl rounded-bl-md bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        I couldn't find any metadata for that website or the response was empty. Please make sure the URL is correct and publicly accessible, then try again.
                      </div>
                      <button onClick={() => {
                        const lastUserText = messages.filter((m) => m.role === "user" && m.parts?.some((p) => p.type === "text")).slice(-1)[0]?.parts?.find((p) => p.type === "text")?.text;
                        if (lastUserText) handleSend({ text: lastUserText });
                      }} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 active:scale-95 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 12a8 8 0 00-16 0 8 8 0 0016 0z" /></svg>
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ScrollToBottomButton onClick={jumpToLatest} visible={showScrollButton && messages.length > 0} />

      <ChatInput
        sendMessage={handleSend}
        status={status}
        onStop={stop}
        onRegenerate={handleRetry}
        canRegenerate={messages.length > 0 && !isLoading}
      />
    </main>
  );
}
