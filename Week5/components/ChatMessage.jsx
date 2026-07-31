"use client";

import { isTextUIPart, isToolUIPart } from "ai";
import ToolInvocation from "./ToolInvocation";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  // In AI SDK v7, message content is in `parts` (array of typed parts).
  const parts = message.parts || [];

  // Separate text parts from tool parts for layout.
  const textParts = parts.filter((p) => isTextUIPart(p));
  const toolParts = parts.filter((p) => isToolUIPart(p));

  // ── User messages: right-aligned, primary color bubble ──────────────────
  if (isUser) {
    const text = textParts.map((p) => p.text).join("");
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%]">
          <div className="rounded-2xl rounded-br-md bg-gradient-to-br from-primary-500 to-primary-700 text-white px-4 py-3 text-sm leading-relaxed break-words shadow-sm">
            {text}
          </div>
          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#262626] flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // ── Assistant messages: left-aligned, with avatar, tool invocations, text ─
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] w-full">
        {/* AI avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* Tool invocations */}
          {toolParts.map((part, index) => (
            <ToolInvocation
              key={`${message.id}-tool-${index}`}
              part={part}
            />
          ))}

          {/* Text content */}
          {textParts.map((part, index) => {
            const text = part.text;
            if (!text) return null;
            return (
              <div
                key={`${message.id}-text-${index}`}
                className="rounded-2xl rounded-bl-md bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] text-gray-800 dark:text-gray-200 px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap"
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}