import { createClient } from '@supabase/supabase-js';
import hash from './hasher';
import PLANS from './PLANS.json';
import { decryptKey } from '@/utils/encrypt';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getProjectAccount = async (project_id: string) => {
    console.time('getProjectAccount');

    const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      accounts:account_id (
        id,
        plan
      ),
      user_groups:user_group_id (
        id,
        type,
        metadata
      )
    `)
    .eq('id', project_id)
    .single();

    // const { data: project } = await supabase
    //     .from('projects')
    //     .select('*')
    //     .eq('id', project_id)
    //     .single();

    console.timeEnd('getProjectAccount');

    // const { account_id, user_group_id } = project;

    // console.time('getProjectAccount:account');
    
    // const { data: account } = await supabase
    //     .from('accounts')
    //     .select('*')
    //     .eq('id', account_id)
    //     .single();

    // console.timeEnd('getProjectAccount:account');

    // console.time('getProjectAccount:user_group');

    // const { data: user_group } = await supabase
    //     .from('user_groups')
    //     .select('*')
    //     .eq('id', user_group_id)
    //     .single();

    // console.timeEnd('getProjectAccount:user_group');

    // if (error) {
    //     console.error('Error fetching project with account details:', error);
    //     return null;
    // }

    // return {
    //     ...project,
    //     accounts: account,
    //     user_groups: user_group
    // };

    return data;
}

export const verifyTrackIp = async (ip_address: string, account_id: string, project_id: string) => {
  const { data, error } = await supabase
    .from('project_users')
    .upsert([{ ip_address, account_id, project_id }], { onConflict: 'ip_address,account_id,project_id' })
    .select('id')
    .single();

  if (error) {
    console.error('Error upserting project user:', error);
    return null;
  }

  return data.id;
};

const getTrackedUser = async ({hashedJwt, account_id, external_user_id}: {hashedJwt: string, account_id: string, external_user_id: string}) => {
    const { data: jwtData, error: jwtError } = await supabase
        .from('jwts')
        .select('*')
        .eq('account_id', account_id)
        .eq('encrypted_token', hashedJwt)
        .eq('external_user_id', external_user_id)
        .single();

    // Handle possible errors from the Supabase query
    if (jwtError) {
        console.error('Error fetching JWT:', jwtError);
        return null;
    }

    // 2. If they do, return the user_id
    if (jwtData) {
        return jwtData.project_user_id;
    }
}

const verifyUser = async ({jwt, verify_endpoint, external_user_id}: {jwt: string, verify_endpoint: string, external_user_id: string}) => {
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
        return false
    }

    const data = await response.json();

    // Verify the user_id in your application to prevent JWT substitution attacks
    if (data.sub !== external_user_id) {
        return false;
    }

    return true;
}

export const trackUser = async ({account_id, project_id, external_user_id, hashedJwt}: {account_id: string, project_id: string, external_user_id: string, hashedJwt: string}) => {
    const { data: projectUser, error: upsertError } = await supabase
        .from('project_users')
        .upsert([{ external_user_id, account_id, project_id }]);

    if (upsertError) {
        console.error('Error upserting project user:', upsertError);
        return false;
    }

    const project_user_id = (projectUser as any).id;

    // Insert the JWT into the 'jwts' table if verification is successful
    const { data: insertData, error: insertError } = await supabase
        .from('jwts')
        .insert([{ external_user_id, account_id, encrypted_token: hashedJwt, project_user_id }]);

    if (insertError) {
        console.error('Error inserting JWT:', insertError);
        return false;
    }

    return project_user_id;
}

export const verifyTrackUser = async ({
    account_id,
    project_id,
    ip_address,
    external_user_id,
    jwt,
    verify_endpoint
}: {account_id: string, project_id: string, ip_address: string, external_user_id: string, jwt: string, verify_endpoint: string}) => {
    // console.log('verifyTrackUser', {account_id, project_id, ip_address, external_user_id, jwt, verify_endpoint});
    try {
        // If the user is not authenticated, track them by IP address
        console.time('verifyTrackUser');
        const isPublicProject = !jwt && ip_address
        if (isPublicProject) {
            return verifyTrackIp(ip_address, account_id, project_id);
        }
        console.timeEnd('verifyTrackUser');
        const hashedJwt = hash(jwt);

        // Have we already seen this user?
        console.time('getTrackedUser');
        let trackedUser = await getTrackedUser({hashedJwt, account_id, external_user_id});
        if (trackedUser) {
            return trackedUser;
        }
        console.timeEnd('getTrackedUser');

        // Verify the user with the external service
        console.time('verifyUser');
        const isVerifiedUser = await verifyUser({jwt, verify_endpoint, external_user_id});
        if (!isVerifiedUser) {
            return false;
        }
        console.timeEnd('verifyUser');

        // Create a new project user and/or JWT record
        console.time('trackUser');
        trackedUser = await trackUser({account_id, project_id, external_user_id, hashedJwt});
        if (!trackedUser) {
            return false;
        }
        console.timeEnd('trackUser');

        return trackedUser.project_user_id;
    } catch (error: any) {
        console.error('Error in verifyUser function:', error);
        return { exists: false, tracked: false, error: error.message };
    }
};

export const convertRatePeriod = (period: string) => {
    switch (period) {
        case 'minute':
            return 60;
        case 'hour':
            return 3600;
        case 'day':
            return 86400;
        case 'week':
            return 604800;
        case 'month':
            return 2628000;
        default:
            throw new Error('Invalid rate period');
    }
}

export const getAccountRateLimit = (account: any) => {
    switch (account.plan) {
        case 'small':
            return PLANS['small'].requests
        case 'medium':
            return PLANS['medium'].requests
        case 'large':
            return PLANS['large'].requests
        case 'enterprise':
            return account.custom_limit;
        default:
            return 1000;
    }
}

export const getOpenaiKey = async (account_id: string) => {
    const { data, error: error } = await supabase
        .from('secret_keys')
        .select('openai_key')
        .eq('account_id', account_id)
        .single();

    const encrypted_key = data?.openai_key;

    const openai_key = decryptKey(encrypted_key, process.env.ENCRYPTION_PASSWORD as string);

    if (error) {
        console.error('Error fetching openai key:', error);
        return null;
    }

    return openai_key;
}

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
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return { error: error.message };
    }
}