import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { hashPassword, verifyPassword } from '../src/lib/auth/password';

describe('Password Security and Hashing', () => {
  it('hashes passwords using Scrypt format with random salt', async () => {
    const pwd = 'CorrectHorseBatteryStaple2026!';
    const hash = await hashPassword(pwd);

    expect(hash.startsWith('scrypt$N=16384,r=8,p=1$')).toBe(true);

    // Salting check: hashing same password twice yields different hashes
    const hash2 = await hashPassword(pwd);
    expect(hash).not.toBe(hash2);
  });

  it('verifies valid password against modern Scrypt hash', async () => {
    const pwd = 'SuperSecretAdminPassword#99';
    const hash = await hashPassword(pwd);

    const checkValid = await verifyPassword(pwd, hash);
    expect(checkValid.valid).toBe(true);
    expect(checkValid.needsRehash).toBe(false);

    const checkInvalid = await verifyPassword('WrongPassword', hash);
    expect(checkInvalid.valid).toBe(false);
  });

  it('supports zero-downtime legacy SHA-256 password migration with needsRehash flag', async () => {
    const pwd = 'LegacyPassword2025';
    const legacyHash = crypto.createHash('sha256').update(pwd).digest('hex');

    // Verification should succeed and signal that password needs rehash to Scrypt
    const checkLegacy = await verifyPassword(pwd, legacyHash);
    expect(checkLegacy.valid).toBe(true);
    expect(checkLegacy.needsRehash).toBe(true);

    // Wrong password with legacy hash
    const checkWrong = await verifyPassword('Incorrect', legacyHash);
    expect(checkWrong.valid).toBe(false);
    expect(checkWrong.needsRehash).toBe(false);
  });
});
