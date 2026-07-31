import { streamText, generateText, convertToModelMessages } from "ai";
import {
  getCurrentModel,
  getCurrentModelId,
  fallbackToNextModel,
  resetModel,
  FREE_MODELS,
} from "@/lib/ai";
import { tools } from "@/lib/tools";

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

export async function POST(req) {
  const body = await req.json();
  const messages = body.messages;

  // Validate that messages is an array.
  if (!Array.isArray(messages)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request: messages must be an array.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Convert UI messages to model messages for the AI SDK v7.
  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(messages);
  } catch (error) {
    console.error("convertToModelMessages error:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to process messages: ${error.message}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Ensure modelMessages is an array.
  if (!Array.isArray(modelMessages)) {
    modelMessages = [];
  }

  // Reset to the first free model at the start of each request.
  resetModel();

  // ── Find a working free model ───────────────────────────────────────────
  // We test each model with a minimal generateText call. If the model is
  // unavailable, the call fails immediately and we try the next one.
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
      console.error(
        `[Model: ${modelId}] unavailable:`,
        error?.message || "Unknown error",
      );

      if (!fallbackToNextModel()) {
        break;
      }
    }
  }

  // If no model is available, return an error.
  if (!workingModel) {
    console.error("All free models are unavailable.");
    return new Response(
      JSON.stringify({
        error:
          "All free models are currently unavailable. Please try again later or add your own OpenRouter API key in .env.local.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // ── Stream with the working model ───────────────────────────────────────
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
        console.error(
          `[Model: ${workingModelId}] UI stream error:`,
          error?.message || "Unknown error",
        );
        return (
          error?.message ||
          "An error occurred during streaming. Please try again."
        );
      },
    });
  } catch (error) {
    console.error(
      `[Model: ${workingModelId}] streamText initialization error:`,
      error?.message,
    );
    return new Response(
      JSON.stringify({
        error: `Failed to start streaming: ${error?.message || "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}