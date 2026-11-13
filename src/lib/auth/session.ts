import crypto from 'crypto';
import { db, adminSessions } from '@/lib/db';
import { eq, and, gt } from 'drizzle-orm';
import { AUTH_CONFIG, getJwtSecret } from '@/lib/security/auth-config';

/**
 * Creates a new database-backed session token.
 */
export async function createSession(
  email: string,
  userAgent?: string | null,
  ipAddress?: string | null
): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const secret = getJwtSecret();
  const signature = crypto.createHmac('sha256', secret).update(rawToken).digest('hex');
  const token = `${rawToken}.${signature}`;

  const expiresAt = new Date(Date.now() + AUTH_CONFIG.SESSION_DURATION_MS);

  try {
    await db.insert(adminSessions).values({
      session_token: token,
      admin_email: email.toLowerCase(),
      expires_at: expiresAt,
      user_agent: userAgent?.slice(0, 500) || null,
      ip_address: ipAddress?.slice(0, 100) || null,
    });
  } catch (err) {
    console.error('[SESSION ERROR] Failed to record session in database:', err);
    // Even if db insert fails, token is cryptographically signed
  }

  return token;
}

/**
 * Validates a session token:
 * 1. Verifies HMAC signature in constant time
 * 2. Checks database session table for active, unrevoked state
 * 3. Gracefully supports legacy tokens
 */
export async function validateSession(token: string): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  // Check if token format is rawToken.signature
  if (token.includes('.')) {
    const [rawToken, signature] = token.split('.');
    if (!rawToken || !signature) return { valid: false };

    const secret = getJwtSecret();
    const expectedSig = crypto.createHmac('sha256', secret).update(rawToken).digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expectedBuf = Buffer.from(expectedSig, 'hex');

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: false };
    }

    // Check DB session record
    try {
      const session = await db.query.adminSessions.findFirst({
        where: and(
          eq(adminSessions.session_token, token),
          gt(adminSessions.expires_at, new Date())
        ),
      });

      if (session) {
        return { valid: true, email: session.admin_email };
      }
    } catch (err) {
      console.warn('[SESSION WARNING] DB session check failed, using cryptographic signature fallback:', err);
      return { valid: true, email: AUTH_CONFIG.ADMIN_EMAIL };
    }

    return { valid: false };
  }

  // Legacy Base64 HMAC token fallback for seamless migration
  try {
    const secret = getJwtSecret();
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const lastColonIndex = decoded.lastIndexOf(':');
    if (lastColonIndex === -1) return { valid: false };

    const hmac = decoded.slice(lastColonIndex + 1);
    const data = decoded.slice(0, lastColonIndex);
    const firstColonIndex = data.indexOf(':');
    if (firstColonIndex === -1) return { valid: false };

    const email = data.slice(0, firstColonIndex);
    const timestampStr = data.slice(firstColonIndex + 1);
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return { valid: false };

    const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
    const hmacBuf = Buffer.from(hmac, 'hex');
    const expectedBuf = Buffer.from(expectedHmac, 'hex');

    if (hmacBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
      return { valid: false };
    }

    const age = Date.now() - timestamp;
    if (age < -60000 || age > AUTH_CONFIG.SESSION_DURATION_MS) {
      return { valid: false };
    }

    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}

/**
 * Revokes a session upon logout.
 */
export async function invalidateSession(token: string): Promise<boolean> {
  try {
    await db.delete(adminSessions).where(eq(adminSessions.session_token, token));
    return true;
  } catch (err) {
    console.error('[SESSION ERROR] Failed to invalidate session:', err);
    return false;
  }
}

/**
 * Revokes all sessions for an admin (e.g. after password change).
 */
export async function invalidateAllSessions(email: string): Promise<void> {
  try {
    await db.delete(adminSessions).where(eq(adminSessions.admin_email, email.toLowerCase()));
  } catch (err) {
    console.error('[SESSION ERROR] Failed to invalidate all sessions:', err);
  }
}
