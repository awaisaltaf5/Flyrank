import { groq } from '@ai-sdk/groq';

export { groq };

export const config = {
  model: 'llama-3.3-70b-versatile',
  systemPrompt: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  },
};