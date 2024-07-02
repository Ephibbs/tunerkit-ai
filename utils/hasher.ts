import crypto from 'crypto';

/**
 * Hashes an input using SHA-256.
 *
 * @param {string} input - The JWT to be hashed.
 * @returns {string} The resulting SHA-256 hash of the JWT.
 */
export default function hash(input: string) {
    return crypto.createHash('sha256').update(input).digest('hex');
}