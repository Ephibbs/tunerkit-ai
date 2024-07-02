// utils/logHelpers.js

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveLogToSupabase({endpoint, type, widgetUserId, userId, requestBody, responseBody}: any) {
    const { data, error } = await supabase
        .from('logs')
        .insert([
            {
                endpoint: endpoint,
                type: type,
                widget_user_id: widgetUserId,
                user_id: userId,
                request_body: requestBody,
                response_body: responseBody
            }
        ]);

    if (error) {
        console.error('Error inserting log:', error);
        return { success: false, error: error };
    }

    console.log('Log saved:', data);
    return { success: true, data: data };
}
