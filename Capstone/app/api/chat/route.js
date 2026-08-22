import { streamText, convertToModelMessages } from "ai";
import { getModel, FREE_MODELS } from "@/lib/ai";
import { tools } from "@/lib/tools";
import { categorizeError, getFriendlyErrorMessage } from "@/lib/error-utils";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Build a sanitised JSON error response so that internal details, API keys,
 * and stack traces are NEVER sent to the client.
 */
function jsonErrorResponse(message, status = 500, code = "unknown") {
  return new Response(JSON.stringify({ error: message, code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  try {
    // ── Environment validation: fail fast if the API key is missing ───────
    if (!process.env.OPENROUTER_API_KEY) {
      console.error(
        "POST /api/chat: OPENROUTER_API_KEY is not set. Add it to .env.local",
      );
      return jsonErrorResponse(
        "The AI service is not configured. Please contact the administrator.",
        503,
        "not-configured",
      );
    }

    const body = await req.json();
    const messages = body.messages;

    // ── Validate messages ──────────────────────────────────────────────────
    if (!Array.isArray(messages) || messages.length === 0) {
      console.warn("POST /api/chat: missing or empty messages array");
      return jsonErrorResponse(
        "Your message was not received. Please try sending it again.",
        400,
        "bad-request",
      );
    }

    // ── Convert UI messages → model messages ───────────────────────────────
    let modelMessages;
    try {
      modelMessages = await convertToModelMessages(messages);
    } catch (error) {
      console.error("convertToModelMessages error:", error);
      return jsonErrorResponse(
        "There was a problem formatting your request. Please try again.",
        400,
        "bad-request",
      );
    }

    if (!Array.isArray(modelMessages)) {
      modelMessages = [];
    }

    // Start the real request immediately. Probing every fallback model first
    // can consume the entire serverless function timeout before streaming.
    const workingModelId = FREE_MODELS[0];
    const workingModel = getModel(workingModelId);

    try {
      const result = streamText({
        model: workingModel,
        messages: modelMessages,
        tools,
        maxSteps: 2,
        maxOutputTokens: 700,
        system: SYSTEM_PROMPT,
        onError: (error) => {
          console.error(
            `[Model: ${workingModelId}] Streaming error:`,
            error?.error?.message || error?.message || "Unknown error",
          );
        },
      });

      return result.toUIMessageStreamResponse({
        onError: (error) => {
          const rawError =
            error?.error?.message || error?.message || "Unknown error";
          console.error(
            `[Model: ${workingModelId}] UI stream error:`,
            rawError,
          );

          return getFriendlyErrorMessage(error);
        },
      });
    } catch (error) {
      console.error(
        `[Model: ${workingModelId}] streamText initialization error:`,
        error?.message,
      );
      return jsonErrorResponse(
        getFriendlyErrorMessage(error),
        500,
        "stream-init-error",
      );
    }
  } catch (error) {
    console.error("[API Route] Unhandled error:", error);
    return jsonErrorResponse(
      getFriendlyErrorMessage(error),
      500,
      "internal-error",
    );
  }
}