import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// OpenRouter is OpenAI-compatible. The API key is read ONLY from
// process.env.OPENROUTER_API_KEY - never hardcoded.
const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "FlyRank AI Metadata Analyzer",
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

// Index of the currently selected free model.
let currentModelIndex = 0;

// Get the current free model.
export function getCurrentModel() {
  return openrouter(FREE_MODELS[currentModelIndex]);
}

// Get a model by id.
export function getModel(modelId) {
  return openrouter(modelId);
}

// Advance to the next free model. Returns true if a fallback was available,
// false if we've exhausted all models.
export function fallbackToNextModel() {
  if (currentModelIndex < FREE_MODELS.length - 1) {
    currentModelIndex += 1;
    return true;
  }
  return false;
}

// Reset to the first free model.
export function resetModel() {
  currentModelIndex = 0;
}

// Get the current model id string.
export function getCurrentModelId() {
  return FREE_MODELS[currentModelIndex];
}

export default openrouter;