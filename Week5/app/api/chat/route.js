import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { config } from '@/lib/ai.js';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: groq(config.model),
      system: config.systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxOutputTokens: config.generationConfig.maxOutputTokens,
      temperature: config.generationConfig.temperature,
    });

    // Convert to proper Web Stream for streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}