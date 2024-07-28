import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';
import { buildZodSchema } from '@/utils/zod-columns';
import { Column } from '@/types/column';

// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { columns, count = 10 } = await req.json();

  if (!Array.isArray(columns) || columns.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid or empty columns array' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  });

  const itemSchema = buildZodSchema(columns);
  const schema = z.object({
    items: z.array(itemSchema).length(count)
  });

  const prompt = generatePrompt(columns, count);

  const stream = await streamObject({
    // model: groq("llama-3.1-70b-versatile"),
    model: groq("llama-3.1-8b-instant"),
    schema,
    prompt,
  });

  return stream.toTextStreamResponse();

//   return new Response(stream.readable, {
//     headers: { 'Content-Type': 'text/event-stream' },
//   });
}

function generatePrompt(columns: Column[], count: number): string {
  const columnDescriptions = columns.map(col => 
    `${col.name} (${col.type}): ${col.description}`
  ).join('\n');

  return `Generate an array of ${count} objects, where each object has the following properties:

${columnDescriptions}

Please ensure the generated data matches the specified type and description for each property. The data should be diverse and realistic. Return the result as an array of objects.

Example format:
{
  "items": [
    { "property1": value1, "property2": value2, ... },
    { "property1": value1, "property2": value2, ... },
    ...
  ]
}`;
}