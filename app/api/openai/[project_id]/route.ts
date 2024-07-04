// pages/api/chat.ts
import { createClient } from '@supabase/supabase-js';
import fetcher from 'node-fetch';
import { NextRequest, NextResponse } from 'next/server';
import modelEndpoints from '@/utils/model-endpoints';
import { saveLogToSupabase } from '@/utils/log-helper';
import { verifyTrackUser, convertRatePeriod, getProjectAccount, getAccountRateLimit, getOpenaiKey } from '@/utils/user-helpers';
import { rateLimitAccountRequests, rateLimitProjectUserRequests, rateLimitProjectRequests } from '@/utils/rate-limiter';

// Assuming HandleUploadBody has the same structure as OpenAiRequestBody previously defined
type HandleUploadBody = {
  body: object;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

type EndpointKeys = keyof typeof modelEndpoints;

async function checkInput({
  project_id,
  jwt,
  endpointKey
}: {
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
  console.log('project_account', project_account);
  if (!project_account) {
    return new NextResponse(JSON.stringify({ error: 'Project not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  if (project_account.user_group_id && !jwt) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
          const error = new Error(`HTTP error! status: ${response.status}`);
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
          controller.close();
          break;
        }
        controller.enqueue(decoder.decode(value));
      }
    }
  });

  const data = await new Response(stream).text();
  logData.response_body = data;
  logData.response_code = response.status;

  await saveLogToSupabase(logData);

  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json'
    }
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


async function handleOpenAICall({ account_id, project_user_id, project_id, endpoint, body }: any) {
  const openaiKey = await getOpenaiKey(account_id);

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
      return await handleStreamingResponse(response, logData);
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

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const jwt = request?.headers?.get('Authorization')?.split('Bearer ')[1];
  const external_user_id = request?.headers?.get('X-User-Id');
  const project_id = request?.headers?.get('X-Project-Id');
  const endpointKey = request?.url.split('/').pop() as EndpointKeys;

  console.log('external_user_id', external_user_id);
  console.log('project_id', project_id);
  console.log('jwt', jwt);
  console.log('endpointKey', endpointKey);
  console.log('body', body);

  // Check if the request is valid
  const inputCheck = await checkInput({ project_id, jwt: jwt || '', endpointKey });
  if (inputCheck instanceof NextResponse) {
    return inputCheck;
  }
  const { project_account, endpoint } = inputCheck;

  // Verify and track the user
  const ip = request.headers.get('x-forwarded-for')?.split(',').shift();
  const project_user_id = await verifyTrackUser({
    account_id: project_account.account_id,
    project_id: project_id || '',
    ip_address: ip || '',
    external_user_id: external_user_id || '',
    jwt: jwt || '',
    verify_endpoint: project_account.verify_endpoint
  });
  if (!project_user_id) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Rate limit the requests
  try {
    const accountPromise = rateLimitAccountRequests(project_account.account_id, getAccountRateLimit(project_account));
    const projectUserPromise = rateLimitProjectUserRequests(project_account.id, project_user_id, project_account.user_rate_limit, convertRatePeriod(project_account.user_rate_period));
    const projectPromise = rateLimitProjectRequests(project_account.id, project_account.rate_limit, convertRatePeriod(project_account.rate_period));
    await Promise.all([accountPromise, projectUserPromise, projectPromise]);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Make the OpenAI call
  return await handleOpenAICall({ account_id: project_account.account_id, project_user_id, project_id, endpoint, body });
}