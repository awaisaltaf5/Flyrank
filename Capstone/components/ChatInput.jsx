"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { validateUrlInput, looksLikeUrl } from "@/lib/url-utils";
import Icon from "@/components/Icons";

export default function ChatInput({
  sendMessage,
  status,
  onStop,
  onRegenerate,
  canRegenerate,
}) {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const textareaRef = useRef(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-resize the textarea.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    // Clear validation error as the user types.
    if (validationError) setValidationError("");
  }, [validationError]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // ── Client-side URL validation ────────────────────────────────────────
    // If the input looks like a URL attempt, validate it before sending.
    if (looksLikeUrl(trimmed)) {
      const result = validateUrlInput(trimmed);
      if (!result.ok) {
        setValidationError(result.error);
        return;
      }
      // Send the normalized URL so the server gets a clean value.
      sendMessage({ text: `Analyze ${result.url}` });
      setInput("");
      return;
    }

    // AI SDK v7: sendMessage accepts { text: string }.
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] px-3 sm:px-6 py-3 sm:py-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          {/* Input container with URL icon */}
          <div className={`relative flex items-end gap-2 sm:gap-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border transition-all p-2 sm:p-3 ${
            validationError
              ? "border-red-400 dark:border-red-600 focus-within:ring-2 focus-within:ring-red-500/20"
              : "border-gray-200 dark:border-[#2a2a2a] focus-within:border-primary-500 dark:focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
          }`}>
            {/* URL icon */}
            <div className="flex-shrink-0 pb-1 pl-1">
              <Icon
                name="link"
                className={`w-5 h-5 ${validationError ? "text-red-400 dark:text-red-500" : "text-gray-400 dark:text-gray-500"}`}
              />
            </div>

            {/* Textarea - fixed invisible text bug with explicit colors */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter a website URL to analyze (e.g. https://vercel.com)..."
              rows={1}
              disabled={isLoading}
              aria-label="Website URL input"
              aria-invalid={validationError ? "true" : "false"}
              aria-describedby={validationError ? "url-validation-error" : undefined}
              className="flex-1 resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm leading-relaxed py-2 focus:outline-none disabled:opacity-50 caret-primary-600 dark:caret-primary-400 min-w-0"
              style={{
                color: "var(--text-primary)",
                caretColor: "var(--accent)",
              }}
            />

            {/* Send / Stop button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 dark:hover:bg-gray-600 active:scale-95 transition-all"
                aria-label="Stop generation"
                title="Stop"
              >
                <Icon name="stop" className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600 active:scale-95 transition-all shadow-sm"
                aria-label="Send message"
                title="Send"
              >
                <Icon name="send" className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Validation error message */}
          {validationError && (
            <p
              id="url-validation-error"
              role="alert"
              className="mt-2 px-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5"
            >
              <Icon name="alert" className="w-3.5 h-3.5 flex-shrink-0" />
              {validationError}
            </p>
          )}
        </form>

        {/* Helper text */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#262626] text-gray-500 dark:text-gray-400 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#262626] text-gray-500 dark:text-gray-400 font-mono text-[10px]">
              Shift+Enter
            </kbd>{" "}
            for new line
          </p>
          {canRegenerate && (
            <button
              onClick={onRegenerate}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            >
              ↻ Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}