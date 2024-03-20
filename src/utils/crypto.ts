import * as crypto from 'crypto';

export function generateSecret(): string {
    return crypto.randomBytes(64).toString('hex');
}
