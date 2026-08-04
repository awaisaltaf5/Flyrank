import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// OpenRouter is OpenAI-compatible. The API key is read ONLY from
// process.env.OPENROUTER_API_KEY - never hardcoded.
const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "MetaSpark AI Metadata Analyzer",
  },
});

// Free models on OpenRouter. We try them in order and fall back to the next
// one if the current model is unavailable. These are currently available free
// models on OpenRouter (verified via the /api/v1/models endpoint).
export const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "inclusionai/ling-3.0-flash:free",
  "poolside/laguna-s-2.1:free",
  "poolside/laguna-xs-2.1:free",
];

/**
 * Request-scoped model manager.
 *
 * The previous implementation used module-level mutable state
 * (`currentModelIndex`), which is unsafe under concurrent requests: two
 * simultaneous requests could advance each other's model index. This class
 * keeps the fallback cursor local to a single request.
 */
export class ModelManager {
  constructor(models = FREE_MODELS) {
    this.models = models;
    this.currentIndex = 0;
  }

  /** Get the model instance for the current index. */
  getCurrentModel() {
    return openrouter(this.models[this.currentIndex]);
  }

  /** Get the current model id string. */
  getCurrentModelId() {
    return this.models[this.currentIndex];
  }

  /**
   * Advance to the next model. Returns true if a fallback was available,
   * false if all models have been exhausted.
   */
  fallbackToNextModel() {
    if (this.currentIndex < this.models.length - 1) {
      this.currentIndex += 1;
      return true;
    }
    return false;
  }

  /** Reset to the first model. */
  reset() {
    this.currentIndex = 0;
  }
}

// Backwards-compatible helpers for callers that don't need request scoping.
// These create a fresh manager per call so no shared mutable state exists.
export function getCurrentModel() {
  return new ModelManager().getCurrentModel();
}

export function getModel(modelId) {
  return openrouter(modelId);
}

export function fallbackToNextModel() {
  return new ModelManager().fallbackToNextModel();
}

export function resetModel() {
  // No-op: model state is now request-scoped.
}

export function getCurrentModelId() {
  return new ModelManager().getCurrentModelId();
}

export default openrouter;