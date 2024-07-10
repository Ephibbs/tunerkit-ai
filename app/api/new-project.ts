// pages/api/create-project.js or as an Edge Function at pages/api/_middleware.ts (adjust accordingly)
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    // Parse the incoming request's JSON body
    const body = await request.json();
    const { name, auth_provider } = body;

    if (!name || !auth_provider) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, auth_provider }]);

    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
