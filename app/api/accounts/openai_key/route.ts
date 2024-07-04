// pages/api/saveKey.js
import { createClient } from '@supabase/supabase-js';
import { getAccountId } from '@/utils/account-helpers';
import { NextResponse } from "next/server";
import { encryptKey } from '@/utils/encrypt';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);


export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { openAIKey } = body;
        const jwt = request?.headers?.get('Authorization')?.split(' ')[1] || '';
        // Auth session handling (Mockup for demonstration)
        const accountId = await getAccountId(supabase, jwt);

        if (!accountId) {
            return new NextResponse(JSON.stringify({ error: 'Account not found' }), { status: 404 });
        }

        let key;
        if (openAIKey) {
            const encryptedKey = encryptKey(openAIKey, process.env.ENCRYPTION_PASSWORD as string);
            key = encryptedKey;
        } else {
            key = null;
        }

        const { data, error: dbError } = await supabase
            .from('secret_keys')
            .upsert({ account_id: accountId, openai_key: key });

        if (dbError) {
            console.log('dbError', dbError);
            return new NextResponse(JSON.stringify({ error: dbError.message }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ message: 'Key saved successfully', data }), { status: 200 });

    } catch (error) {
        console.log('error', error);
        return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

export async function GET(request: Request): Promise<NextResponse> {
    const jwt = request?.headers?.get('Authorization')?.split(' ')[1] || '';
    // Auth session handling (Mockup for demonstration)
    const accountId = await getAccountId(supabase, jwt);

    if (!accountId) {
        return new NextResponse(JSON.stringify({ error: 'Account not found' }), { status: 404 });
    }

    const { data, error: dbError } = await supabase
        .from('secret_keys')
        .select('openai_key')
        .eq('account_id', accountId)
        .single()

    if (dbError) {
        console.log('dbError', dbError);
        return new NextResponse(JSON.stringify({ error: dbError.message }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ openai_key_set: !!data.openai_key }), { status: 200 });
}