// utils/logHelpers.js

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface LogType {
  endpoint: string;
  type: string;
  account_id: string;
  project_user_id: string;
  project_id: string;
  response_type: string;
  request_body: JSON;
  response_body?: JSON; // Assuming response_body can be of any type
  response_code?: number;
  response_error?: string;
}

export async function saveLogToSupabase({endpoint, type, account_id, project_id, project_user_id, response_type, request_body, response_body, response_error, response_code}: any) {
    const { data, error } = await supabase
        .from('requests')
        .insert([
            {
                endpoint,
                type,
                account_id,
                project_user_id,
                project_id,
                request_body,
                response_type,
                response_body,
                response_error,
                response_code
            }
        ]);

    if (error) {
        console.error('Error inserting log:', error);
        return { success: false, error: error };
    }

    console.log('Log saved:', data);
    return { success: true, data: data };
}
