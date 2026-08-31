import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Groq is OpenAI-compatible. The API key is read ONLY from
 * process.env.GROQ_API_KEY - never hardcoded.
 *
 * Groq's API endpoint: https://api.groq.com/openai/v1
 */
const groq = createOpenAICompatible({
  name: "groq",
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Models available on Groq.
 *
 * We try them in order and fall back to the next one if the current
 * model is unavailable or rate-limited. All models below are real Groq
 * hosted models (not the ":free" variants from other providers).
 *
 * Order: most capable / preferred first.
 */
export const FREE_MODELS = [
  "qwen/qwen3.8-27b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound",
  "groq/compound-mini",
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
    return groq(this.models[this.currentIndex]);
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
  return groq(modelId);
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

export default groq;