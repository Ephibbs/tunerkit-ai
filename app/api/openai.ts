// pages/api/chat.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import modelEndpoints from '@/utils/model-endpoints';
import { saveLogToSupabase } from '@/utils/log-helper';
import { verifyUser, createUser } from '@/utils/user-helper';

// Assuming HandleUploadBody has the same structure as OpenAiRequestBody previously defined
type HandleUploadBody = {
  body: object;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

type EndpointKeys = keyof typeof modelEndpoints;

interface LogType {
  endpoint: string;
  type: string;
  client_key: string;
  user_id: string;
  project_id: string;
  response_type: string;
  request_body: HandleUploadBody;
  response_body?: any; // Assuming response_body can be of any type
  response_code?: number;
  response_error?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  const jwt = request?.headers?.get('Authorization')?.split('Bearer ')[1];
  const client_key = request?.headers?.get('X-Client-Id');
  const user_id = request?.headers?.get('X-User-Id');
  const project_id = request?.headers?.get('X-Project-Id');
  const endpointKey = request?.url.split('/').pop() as EndpointKeys;

  if (!jwt || !client_key || !user_id || !project_id) {
    return new NextResponse(JSON.stringify({ error: 'Missing required headers' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const endpoint = modelEndpoints[endpointKey];

  if (!endpoint) {
    return new NextResponse(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  const user = await verifyUser(user_id, jwt);
  if (!user.exists) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  if (!user.tracked) {
    await createUser(user.id, jwt);
  }

  const log: LogType = {
    endpoint: endpoint.url,
    type: endpoint.type,
    response_type: endpoint.responseType,
    client_key: client_key,
    user_id: user_id,
    project_id: project_id,
    request_body: body,
  }

  const openaiKey = await supabase.from('accounts').select('openai_key')
    .eq('client_key', client_key)
    .single();

  try {
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': endpoint.contentType
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.message = await response.text();
      throw error;
    }

    const data = await response.json();

    log['response_body'] = data;
    saveLogToSupabase(log);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    log['response_code'] = error.status;
    log['response_error'] = error.message;
    saveLogToSupabase(log);
    console.error('Error during fetch:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: error.status,
      headers: {
        'Content-Type': 'application/json'
      },

    });
  }
}
