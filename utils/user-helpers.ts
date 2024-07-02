import { createClient } from '@supabase/supabase-js';
import hash from './hasher';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const verifyUser = async (user_id: string, widget_user_id: string, jwt: string, verify_endpoint: string) => {
    try {
        // 1. Check if the user_id and 1-way encrypted jwt already exist in the jwts table in Supabase
        const hashedJwt = hash(jwt);
        const { data: jwtData, error: jwtError } = await supabase
            .from('jwts')
            .select('*')
            .eq('widget_user_id', widget_user_id)
            .eq('user_id', user_id)
            .eq('encrypted_token', hashedJwt)
            .single();

        // Handle possible errors from the Supabase query
        if (jwtError) {
            console.error('Error fetching JWT:', jwtError);
            return { verified: false, tracked: false, error: jwtError.message };
        }

        // 2. If they do, return the user_id and tracked status
        if (jwtData) {
            return { verified: true, tracked: true, user_id: jwtData.user_id };
        }

        // 3. If they don't, call the verify_endpoint with the jwt and verify the user
        const response = await fetch(verify_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            // If the response is not OK, log the error and return the negative status
            console.error('Failed to verify user:', response.statusText);
            return { verified: false, error: response.statusText };
        }

        const data = await response.json();

        // Verify the user_id in your application to prevent JWT substitution attacks
        if (data.sub !== user_id) {
            return { verified: false, error: 'User ID does not match the expected user ID.' };
        }

        // Optionally, insert the JWT into the 'jwts' table if verification is successful
        const { data: insertData, error: insertError } = await supabase
            .from('jwts')
            .insert([{ user_id: user_id, widget_user_id: widget_user_id, encrypted_token: hashedJwt }]);

        if (insertError) {
            console.error('Error inserting JWT:', insertError);
            return { exists: false, tracked: false, error: insertError.message };
        }

        return { exists: true, tracked: true, user_id: user_id };
    } catch (error) {
        console.error('Error in verifyUser function:', error);
        return { exists: false, tracked: false, error: error.message };
    }
};

/**
 * Creates a user in the widget_users table if they don't already exist.
 * 
 * @param {string} userId - The unique user ID.
 * @param {string} externalId - An external identifier for the user.
 * @param {Object} metadata - Additional metadata about the user.
 * @returns {Promise<Object>} - Returns a result object containing data or error information.
 */
async function createUserIfNotExists(userId: string, externalId: string, metadata?: Object) {
    try {
        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('widget_users')
            .select('*')
            .eq('user_id', userId)
            .eq('external_id', externalId)
            .single();

        if (fetchError && fetchError.message !== 'Item not found') {
            console.error('Error fetching user:', fetchError);
            return { error: fetchError.message };
        }

        if (existingUser) {
            return { data: existingUser, status: 'User already exists' };  // User exists, no need to create
        }

        // Create new user since it doesn't exist
        const { data: newUser, error: insertError } = await supabase
            .from('widget_users')
            .insert([
                {
                    user_id: userId,
                    external_id: externalId,
                    metadata: metadata
                }
            ]);

        if (insertError) {
            console.error('Error inserting new user:', insertError);
            return { error: insertError.message };
        }

        return { data: newUser, status: 'User created successfully' };  // Successfully created user
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error: error.message };
    }
}


export {verifyUser, createUser};