// pages/api/saveKey.js
import { createClient } from '@supabase/supabase-js';
import { randomBytes, scryptSync, createCipheriv } from 'crypto';
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Encryption function
function encryptKey(data, password) {
    const salt = randomBytes(16);
    const key = scryptSync(password, salt, 24);
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-192-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        encrypted: encrypted.toString('hex')
    };
}

export async function POST(request: Request): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    try {
        const body = await request.json();
        const { openAIKey } = body;
        const jwt = request?.headers?.get('Authorization')?.split(' ')[1] || '';
        console.log('jwt', jwt);
        // Auth session handling (Mockup for demonstration)
        const { data: { user } } = await supabase.auth.getUser(jwt)
        if (!user) {
            console.log('user', user);
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const userId = user.id;
        const encryptedKey = encryptKey(openAIKey, process.env.ENCRYPTION_PASSWORD);

        const { data, error: dbError } = await supabase
            .from('accounts')
            .upsert({ user_id: userId, openai_key: JSON.stringify(encryptedKey) })
            .match({ user_id: userId });

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