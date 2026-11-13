import crypto from 'crypto';

const SCRYPT_PARAMS = {
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
  keyLength: 64,
  maxmem: 32 * 1024 * 1024,
};

/**
 * Modern password hashing using Node.js crypto.scryptSync with cryptographically random salt.
 * Produces format: `scrypt$N=16384,r=8,p=1$hexSalt$hexDerivedKey`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_PARAMS.keyLength, {
    cost: SCRYPT_PARAMS.cost,
    blockSize: SCRYPT_PARAMS.blockSize,
    parallelization: SCRYPT_PARAMS.parallelization,
    maxmem: SCRYPT_PARAMS.maxmem,
  });

  return `scrypt$N=${SCRYPT_PARAMS.cost},r=${SCRYPT_PARAMS.blockSize},p=${SCRYPT_PARAMS.parallelization}$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verify password against stored hash with zero-downtime backward compatibility for legacy SHA-256.
 * Returns { valid: boolean, needsRehash: boolean }
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (!password || !storedHash) {
    return { valid: false, needsRehash: false };
  }

  // 1. Check if stored hash is in modern Scrypt format
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return { valid: false, needsRehash: false };

    const [, , salt, keyHex] = parts;
    const derivedKey = crypto.scryptSync(password, salt, SCRYPT_PARAMS.keyLength, {
      cost: SCRYPT_PARAMS.cost,
      blockSize: SCRYPT_PARAMS.blockSize,
      parallelization: SCRYPT_PARAMS.parallelization,
      maxmem: SCRYPT_PARAMS.maxmem,
    });

    const storedBuf = Buffer.from(keyHex, 'hex');
    if (derivedKey.length !== storedBuf.length) {
      return { valid: false, needsRehash: false };
    }

    const valid = crypto.timingSafeEqual(derivedKey, storedBuf);
    return { valid, needsRehash: false };
  }

  // 2. Legacy fallback: Single-round SHA-256
  // Check if hash matches 64-character hex string
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    const inputBuf = Buffer.from(inputHash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');

    if (inputBuf.length !== storedBuf.length) {
      return { valid: false, needsRehash: false };
    }

    const valid = crypto.timingSafeEqual(inputBuf, storedBuf);
    // If valid, flag for automatic transparent re-hash to Scrypt!
    return { valid, needsRehash: valid };
  }

  return { valid: false, needsRehash: false };
}
