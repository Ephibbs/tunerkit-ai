import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const model = groq('llama-3.1-8b-instant');

interface User {
  [key: string]: any;
}

interface Tool {
  name: string;
  description: string;
}

interface Message {
  role: 'user' | 'assistant' | 'tool';
  tool_call_id?: string;
  tool_calls?: ToolCall[];
  content: string;
}

interface RequestBody {
  prompt: string;
  tools: Tool[];
  judges: string[];
  userList: User[];
  numGenerations: number;
  numMessages: number;
}

async function saveDataRow(datasetId: number, conversation: Message[], user: User, userId: string) {
  const { error } = await supabase
    .from('datarows')
    .insert({
      dataset_id: datasetId,
      data: conversation,
      user,
      user_id: userId
    });

  if (error) {
    console.error('Error saving data row:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const { name, prompt, tools, judges, userList: userListName, numGenerations, numMessages } = await req.json();
  const {data: userList} = await supabase
    .from('user_lists')
    .select()
    .eq('name', userListName)
    .single();
  const userListData = userList.data.items;
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    // Optionally, validate the token manually or via Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    console.log('user:', user);

    if (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

  if (!prompt || !tools || !judges || !userList || !numGenerations || !numMessages) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const { data: dataset, error: datasetError } = await supabase
  .from('datasets')
  .insert({
    name,
    prompt,
    tools: JSON.stringify(tools),
    judges: JSON.stringify(judges),
    user_list: JSON.stringify(userList),
    num_generations: numGenerations,
    num_messages: numMessages,
    user_id: user.id,
  })
  .select()
  .single();

  if (datasetError) {
    console.error('Error saving dataset:', datasetError);
    return NextResponse.json({ error: 'An error occurred while saving the dataset' }, { status: 500 });
  }

  console.log('dataset:', dataset);

  try {
    const conversations: Message[][] = [];

    for (let i = 0; i < numGenerations; i++) {
      const userPersona = userListData[Math.floor(Math.random() * userListData.length)];
      console.log('userPersona:', userPersona);
      const conversation = await generateConversation(prompt, tools, judges, userPersona, numMessages);
      saveDataRow(dataset.id, conversation, userPersona, user.id);
      conversations.push(conversation);
    }

    return NextResponse.json({
        dataset
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while generating the response' }, { status: 500 });
  }
}

async function generateConversation(
  prompt: string,
  tools: Tool[],
  judges: string[],
  user: User,
  numMessages: number
): Promise<Message[]> {
  let conversation: Message[] = [];
  let context = `${prompt}\n\nUser information: ${JSON.stringify(user)}`;

  for (let i = 0; i < numMessages; i++) {
    // Generate user message
    console.log("user:", conversation);
    const userMessage = await generateText({
      model: model,
      system: `You are role-playing as the following user. Respond as they would:\n${JSON.stringify(user)}`,
      messages: conversation,
    });

    conversation.push({ role: 'user', content: userMessage.text });
    // context += `\nUser: ${userMessage}`;

    // Generate assistant response and handle tool usage
    const assistantResponses = await generateAssistantResponse(context, tools, conversation);
    conversation = conversation.concat(assistantResponses);
    // context += assistantResponses.map(msg => `\n${msg.role === 'tool' ? 'Tool' : 'Assistant'}: ${msg.content}`).join('');

    // Apply judges and refine the final assistant response
    // const lastAssistantResponse = assistantResponses[assistantResponses.length - 1];
    // if (lastAssistantResponse.role === 'assistant') {
    //   let refinedResponse = lastAssistantResponse.content;
    //   for (const judge of judges) {
    //     const judgement = await generateText(groq, {
    //       messages: [
    //         { role: 'system', content: judge },
    //         { role: 'user', content: `Evaluate this response: ${refinedResponse}` },
    //       ],
    //     });

    //     refinedResponse = await generateText(groq, {
    //       messages: [
    //         { role: 'system', content: context },
    //         ...conversation.map(msg => ({ role: msg.role, content: msg.content })),
    //         { role: 'user', content: `Refine your last response considering this feedback: ${judgement}` },
    //       ],
    //     });
    //   }
    //   conversation[conversation.length - 1] = { role: 'assistant', content: refinedResponse };
    //   context = context.replace(lastAssistantResponse.content, refinedResponse);
    // }
  }

  return conversation;
}

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content?: string;
  tool_calls?: ToolCall[];
}

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface Tool {
  name: string;
  description: string;
  parameters: z.ZodObject<any>;
}

async function generateAssistantResponse(
  context: string,
  tools: Tool[],
  conversation: Message[]
): Promise<Message[]> {
  const toolsFormatted = tools.reduce((acc, tool) => {
    acc[tool.name] = {
      description: tool.description,
      parameters: tool.parameters,
      execute: async (args: any) => {
        return await spoofToolOutput(tool.name, JSON.stringify(args));
      }
    };
    return acc;
  }, {} as Record<string, any>);

  console.log('conversation:', conversation);
  console.log('context:', context);
  console.log('tools:', toolsFormatted);
  const { text, toolResults } = await generateText({
    model: model,
    system: context,
    messages: conversation,
    tools: toolsFormatted,
  });

  const responses: Message[] = [];

  if (toolResults && toolResults.length > 0) {
    const toolCalls: ToolCall[] = toolResults.map((result, index) => ({
      id: `call_${index}`,
      type: 'function',
      function: {
        name: result.name,
        arguments: JSON.stringify(result.arguments)
      }
    }));

    responses.push({
      role: 'assistant',
      tool_calls: toolCalls
    });

    // Execute tool calls and add their responses
    for (let i = 0; i < toolCalls.length; i++) {
      const toolCall = toolCalls[i];
      const toolOutput = await toolsFormatted[toolCall.function.name].execute(
        JSON.parse(toolCall.function.arguments)
      );

      responses.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: toolOutput
      });
    }
  }

  // Add the final assistant response
  responses.push({
    role: 'assistant',
    content: text
  });

  return responses;
}

// This function remains the same as before
async function spoofToolOutput(toolName: string, input: string): Promise<string> {
  const toolOutput = await generateText({
    model: model,
    messages: [
      { role: 'system', content: `You are the ${toolName} tool. Generate a plausible output based on this input: ${input}` },
      { role: 'user', content: 'What is the tool output?' },
    ],
  });

  return toolOutput.text;
}