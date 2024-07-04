import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from 'crypto';

// Encryption function
export function encryptKey(data: string, password: string) {
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

export function decryptKey(encryptedData: { iv: string, salt: string, encrypted: string }, password: string): string {
    const { iv, salt, encrypted } = encryptedData;
    const key = scryptSync(password, Buffer.from(salt, 'hex'), 24);
    const decipher = createDecipheriv('aes-192-cbc', key, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
    return decrypted.toString('utf8');
}