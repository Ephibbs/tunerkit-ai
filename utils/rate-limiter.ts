import { redis } from './redis';

const fixedLuaScript = `
local key = KEYS[1]
local window = tonumber(ARGV[1])
local max_requests = tonumber(ARGV[2])
local requests = redis.call('INCR',key)
redis.call('EXPIRE', key, window)
if requests <= max_requests then
    return 0
else
  redis.call('DECR',key)
  return 1
end
`;

// Function to execute the rate limit check
export async function fixedWindowRequest(key: string, windowSize: number, limit: number) {
  try {
    const result = await redis.eval(fixedLuaScript, 1, key, windowSize, limit);
    // console.log(result === 0 ? 'Request allowed' : 'Rate limit exceeded');
    return result === 0;
  } catch (error) {
    console.error('Error executing Lua script:', error);
  }
}

const slidingLuaScript = `
local key = KEYS[1] -- First key name passed to the script
local window = tonumber(ARGV[1]) -- Window size for the rate limiting, as a number
local max_requests = tonumber(ARGV[2]) -- Maximum number of requests allowed in the window

-- Get the current UNIX time from Redis
local current_time = redis.call('TIME') -- Returns a two-element table with [seconds, microseconds]
local trim_time = tonumber(current_time[1]) - window

-- Clean up old entries in the sorted set
redis.call('ZREMRANGEBYSCORE', key, 0, trim_time)

-- Get the number of requests within the current window
local request_count = redis.call('ZCARD', key)

-- Check if the new request can be added
if request_count < max_requests then
    -- Add the current time as the score
    redis.call('ZADD', key, current_time[1], current_time[1] .. "-" .. current_time[2])
    redis.call('EXPIRE', key, window)
    return 0 -- Indicating the request is allowed
end

return 1 -- Indicating the rate limit is exceeded
`;

/**
 * Rate limit the requests for a specific key
 * @param key The key to rate limit
 * @param windowSize The window size for the rate limiting in seconds
 * @param limit The maximum number of requests allowed in the window
 * @returns true if the rate limit is exceeded, false otherwise
 * @example
 * slidingWindowRequest('project:123:rate-limit', 60, 100);
**/
export async function slidingWindowRequest(key: string, windowSize: number, limit: number) {
  try {
    const result = await redis.eval(
      slidingLuaScript,
      1,
      key,
      windowSize,
      limit
    );
    return result === 0;
  } catch (error) {
    console.error('Error executing slidingWindowRequest Lua script:', error);
  }
}


export async function rateLimitProjectRequests(projectId: string, rateLimit: number, ratePeriod: number) {
  const key = `project:${projectId}:rate-limit`;
  const windowSize = ratePeriod;
  const limit = rateLimit;

  const isAllowed = await slidingWindowRequest(key, windowSize, limit);

  if (!isAllowed) {
    throw new Error('Project rate limit exceeded');
  }
}

/**
 * Rate limit the requests for a specific user in a project
 * @param projectId The project ID
 * @param userId The user ID
 * @param rateLimit The rate limit
 * @param ratePeriod The rate period
 * @param unit The unit of the rate limit
 * @returns
 * @throws Error if the rate limit is exceeded
 * @example
 * rateLimitProjectUser('project-id', 'user-id', 100, 60, 'seconds');
 **/
export async function rateLimitProjectUserRequests(projectId: string, userId: string, rateLimit: number, ratePeriod: number) {
    const key = `project:${projectId}:user:${userId}:rate-limit`;
    const windowSize = ratePeriod;
    const limit = rateLimit;
    
    const isAllowed = await slidingWindowRequest(key, windowSize, limit);
    
    if (!isAllowed) {
        throw new Error('User rate limit exceeded');
    }
}

export async function rateLimitAccountRequests(accountId: string, rateLimit: number) {
    const key = `account:${accountId}:rate-limit`;
    const windowSize = 2628288; // 31 days in seconds
    const limit = rateLimit;
    
    const isAllowed = await fixedWindowRequest(key, windowSize, limit);
    
    if (!isAllowed) {
        throw new Error('Account rate limit exceeded');
    }
}