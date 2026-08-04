import { streamText, generateText, convertToModelMessages } from "ai";
import {
  getCurrentModel,
  getCurrentModelId,
  fallbackToNextModel,
  resetModel,
  FREE_MODELS,
} from "@/lib/ai";
import { tools } from "@/lib/tools";
import { categorizeError, getFriendlyErrorMessage } from "@/lib/error-utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are FlyRank AI, a website metadata analyzer assistant.

Your primary job is to help users analyze website metadata. When a user gives you a
URL (or asks you to analyze a website), you MUST ALWAYS use the analyzeWebsite tool
to fetch the page and extract its metadata. Even if you have analyzed the same URL
before in this conversation, you must call the tool again to get fresh data.

CRITICAL RULE: When a URL is provided, do NOT answer from memory. ALWAYS call the
analyzeWebsite tool first, then present the tool results in a clear summary.

After receiving the tool results, present the findings in a clear, friendly summary.
If the tool returns an error, explain what went wrong and suggest possible fixes.

If the user asks a general question (not about analyzing a website), answer
helpfully and concisely.`;

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

    // ── Reset to the first free model at the start of each request ────────
    resetModel();

    // ── Find a working free model ─────────────────────────────────────────
    let workingModel = null;
    let workingModelId = null;

    for (let attempt = 0; attempt < FREE_MODELS.length; attempt++) {
      const modelId = getCurrentModelId();
      const model = getCurrentModel();

      try {
        // Quick availability check with a minimal prompt.
        await generateText({
          model,
          prompt: "Say OK",
          maxOutputTokens: 5,
        });
        workingModel = model;
        workingModelId = modelId;
        console.log(`[Model: ${modelId}] available, starting stream...`);
        break;
      } catch (error) {
        const categorised = categorizeError(error);
        console.error(
          `[Model: ${modelId}] unavailable:`,
          error?.message || "Unknown error",
        );

        // If this is a rate-limit error, don't try other models —
        // they will almost certainly be rate-limited too.
        if (categorised.isRateLimit) {
          return jsonErrorResponse(categorised.message, 429, "rate-limit");
        }

        if (!fallbackToNextModel()) {
          break;
        }
      }
    }

    // ── No working model found ────────────────────────────────────────────
    if (!workingModel) {
      console.error("All free models are unavailable.");
      return jsonErrorResponse(
        "Sorry, the AI models are temporarily unavailable. Please try again in a few minutes.",
        503,
        "service-unavailable",
      );
    }

    // ── Stream with the working model ─────────────────────────────────────
    try {
      const result = streamText({
        model: workingModel,
        messages: modelMessages,
        tools,
        maxSteps: 5,
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
