// pages/api/chat.ts
import { createClient } from '@supabase/supabase-js';
import fetcher from 'node-fetch';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import modelEndpoints from '@/utils/model-endpoints';
import { saveLogToSupabase } from '@/utils/log-helper';
import { verifyTrackUser, convertRatePeriod, getProjectAccount, getAccountRateLimit, getOpenaiKey } from '@/utils/user-helpers';
import { rateLimitAccountRequests, rateLimitProjectUserRequests, rateLimitProjectRequests } from '@/utils/rate-limiter';

// Assuming HandleUploadBody has the same structure as OpenAiRequestBody previously defined
type HandleUploadBody = {
  body: object;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

type EndpointKeys = keyof typeof modelEndpoints;

async function checkInput({
  request,
  project_id,
  jwt,
  endpointKey
}: {
  request: NextRequest;
  project_id: string | null;
  jwt: string | null;
  endpointKey: string | null;
}) {
  if (!project_id) {
    return new NextResponse(JSON.stringify({ error: 'Missing required headers' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const endpoint = modelEndpoints[endpointKey as EndpointKeys];
  if (!endpoint) {
    return new NextResponse(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const project_account = await getProjectAccount(project_id);
  if (!project_account) {
    return new NextResponse(JSON.stringify({ error: 'Project not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  if (project_account.user_auth && !jwt) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Retrieve CORS domains from the project account
  const corsDomains = project_account.cors_domains || [];

  // Get the origin of the request
  const requestOrigin = request.headers.get('Origin');

  // If CORS domains are specified, check that the request origin is one of the allowed domains
  if (corsDomains.length > 0 && requestOrigin) {
    if (!corsDomains.includes(requestOrigin)) {
      return new NextResponse(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }

  return { project_account, endpoint };
}

async function fetchWithRetries(url: string, options = {}, retries = 3, timeout = 60000) {
  const { method, headers, body }: any = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal
      });

      clearTimeout(id);

      if (!response.ok) {
        const shouldRetry = [408, 409, 429].includes(response.status) || response.status >= 500;
        if (shouldRetry) {
          const error = new Error(`HTTP error! status: ${response.status}`) as any;
          error.response = response;
          throw error;
        }
        return response;
      }

      return response;
    } catch (error: any) {
      clearTimeout(id);

      const isRetryableError = error.name === 'AbortError' || error.name === 'FetchError' ||
        [408, 409, 429].includes(error.response?.status) || error.response?.status >= 500;

      if (attempt === retries || !isRetryableError) {
        throw error;
      }
      
      console.warn(`Attempt ${attempt} failed. Retrying...`);
    }
  }
}

async function handleStreamingResponse(response: any, logData: any) {
  const reader = response?.body?.getReader();
  if (!reader) {
    return new NextResponse(JSON.stringify({ error: 'Failed to read response' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const decoder = new TextDecoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // logData.response_body = data;
          // logData.response_code = response.status;
          // await saveLogToSupabase(logData);
          controller.close();
          break;
        }
        controller.enqueue(decoder.decode(value));
      }
    }
  });

  // const data = await new Response(stream).text();
  // logData.response_body = data;
  // logData.response_code = response.status;

  // await saveLogToSupabase(logData);

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

async function handleNonStreamingResponse(response: any, logData: any) {
  const data = await response.json();
  logData.response_body = data;
  logData.response_code = response.status;

  await saveLogToSupabase(logData);

  return new NextResponse(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


async function handleOpenAICall({ account_id, project_user_id, project_id, endpoint, body }: any): Promise<NextResponse> {
  console.time(' - getOpenaiKey');
  const openaiKey = await getOpenaiKey(account_id);
  console.timeEnd(' - getOpenaiKey');
  
  try {
    const response = await fetchWithRetries(endpoint.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': endpoint.contentType
      },
      body: JSON.stringify(body)
    });

    const logData = {
      endpoint: endpoint.url,
      type: endpoint.type,
      response_type: endpoint.responseType,
      account_id: account_id,
      project_user_id: project_user_id,
      project_id: project_id,
      request_body: body,
    };

    if (body.stream) {
      return handleStreamingResponse(response, logData);
    } else {
      return await handleNonStreamingResponse(response, logData);
    }

  } catch (error: any) {
    if (error.message.includes('rate limit exceeded')) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    saveLogToSupabase({
      endpoint: endpoint.url,
      type: endpoint.type,
      response_type: endpoint.responseType,
      account_id: account_id,
      project_user_id: project_user_id,
      project_id: project_id,
      request_body: body,
      response_code: error.response ? error.response.status : 500,
      response_error: error.message
    });
    console.error('Error during fetch:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: error.response ? error.response.status : 500,
      headers: {
        'Content-Type': 'application/json'
      },

    });
  }
}

export async function OPTIONS(request: Request): Promise<NextResponse> {
  // const corsHeaders = {
  //   'Access-Control-Allow-Origin': '*', // Adjust as necessary
  //   'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  // };

  return new NextResponse(null, {
    status: 200,
    // headers: corsHeaders
  });
}

async function handleCreateSpeechCall({ account_id, project_user_id, project_id, endpoint, body }: any): Promise<NextResponse> {
  console.time(' - getOpenaiKey');
  const openaiKey = await getOpenaiKey(account_id);
  console.timeEnd(' - getOpenaiKey');
  const openai = new OpenAI({
    apiKey: openaiKey as string
  });
  const mp3 = await openai.audio.speech.create(
    body
  );

  // Convert ArrayBuffer to Buffer
  const buffer = Buffer.from(await mp3.arrayBuffer());

  // Return the MP3 buffer directly
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mp3'
    }
  });
}

async function handleCreateTranscriptionCall({ account_id, project_user_id, project_id, endpoint, body }: any): Promise<NextResponse> {
  console.time(' - getOpenaiKey');
  const openaiKey = await getOpenaiKey(account_id);
  console.timeEnd(' - getOpenaiKey');
  const openai = new OpenAI({
    apiKey: openaiKey as string
  });
  const transcription = await openai.audio.transcriptions.create(body);

  return new NextResponse(JSON.stringify(transcription), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const jwt = request?.headers?.get('Authorization')?.split('Bearer ')[1];
  const external_user_id = request?.headers?.get('X-User-Id');
  const project_id = request?.headers?.get('X-Project-Id');
  const endpointKey = request?.url.split('/').pop() as EndpointKeys;

  // Check if the request is valid
  console.time('checkInput');
  const inputCheck = await checkInput({ request, project_id, jwt: jwt || '', endpointKey });
  if (inputCheck instanceof NextResponse) {
    return inputCheck;
  }
  const { project_account, endpoint } = inputCheck;
  console.timeEnd('checkInput');

  // Verify and track the user
  console.time('verifyTrackUser');
  const ip = request.headers.get('x-forwarded-for')?.split(',').shift();
  const project_user_id = await verifyTrackUser({
    account_id: project_account.account_id,
    project_id: project_id || '',
    ip_address: ip || '',
    external_user_id: external_user_id || '',
    jwt: jwt || '',
    user_auth: project_account.user_auth
  });
  if (!project_user_id) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  console.timeEnd('verifyTrackUser');

  // Rate limit the requests
  console.time('rateLimitRequests');
  try {
    const accountPromise = rateLimitAccountRequests(project_account.account_id, getAccountRateLimit(project_account));
    const projectUserPromise = rateLimitProjectUserRequests(project_account.id, project_user_id, project_account.user_rate_limit, convertRatePeriod(project_account.user_rate_period));
    const projectPromise = rateLimitProjectRequests(project_account.id, project_account.rate_limit, convertRatePeriod(project_account.rate_period));
    await Promise.all([accountPromise, projectUserPromise, projectPromise]);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  console.timeEnd('rateLimitRequests');

  // Make the OpenAI call
  console.time('handleOpenAICall');
  let response = new NextResponse(JSON.stringify({ error: 'Invalid endpoint' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (endpointKey === 'create_chat_completion') {
    response = await handleOpenAICall({ account_id: project_account.account_id, project_user_id, project_id, endpoint, body });
  } else if (endpointKey === 'create_speech') {
    response = await handleCreateSpeechCall({ account_id: project_account.account_id, project_user_id, project_id, endpoint, body });
  } else if (endpointKey === 'create_transcription') {
    response = await handleCreateTranscriptionCall({ account_id: project_account.account_id, project_user_id, project_id, endpoint, body });
  }
  console.timeEnd('handleOpenAICall');

  return response;
}