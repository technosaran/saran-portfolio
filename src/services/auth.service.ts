import { adminRepository } from '@/repositories/admin.repository';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { createSession, validateSession, invalidateSession, invalidateAllSessions } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { AUTH_CONFIG, isAuthorizedAdmin } from '@/lib/security/auth-config';

export class AuthService {
  async authenticate(
    email: string,
    password: string,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<{ success: boolean; token?: string; error?: string; status: number }> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Rate limiting check (per IP and per email)
    const rateLimitKey = `login:${ipAddress || 'unknown'}:${normalizedEmail}`;
    const rateLimit = checkRateLimit({
      key: rateLimitKey,
      max: AUTH_CONFIG.LOGIN_RATE_LIMIT_MAX,
      windowMs: AUTH_CONFIG.LOGIN_RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimit.success) {
      return {
        success: false,
        error: `Too many failed login attempts. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        status: 429,
      };
    }

    // 2. Strict authorization check
    if (!isAuthorizedAdmin(normalizedEmail)) {
      return {
        success: false,
        error: 'Access Denied: Only the portfolio owner is authorized to access the admin panel.',
        status: 403,
      };
    }

    // 3. User lookup
    const user = await adminRepository.findByEmail(normalizedEmail);
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials. Please verify your email and password.',
        status: 401,
      };
    }

    // 4. Constant-time password verification
    const { valid, needsRehash } = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return {
        success: false,
        error: 'Invalid password. Please verify your credentials.',
        status: 401,
      };
    }

    // 5. Zero-downtime credential upgrade: If legacy SHA-256 hash was matched, auto-upgrade to Scrypt!
    if (needsRehash) {
      try {
        const upgradedHash = await hashPassword(password);
        await adminRepository.updatePasswordHash(normalizedEmail, upgradedHash);
        console.log(`[AUTH SECURITY] Transparently upgraded password hash for ${normalizedEmail} to Scrypt`);
      } catch (err) {
        console.error('[AUTH ERROR] Could not auto-upgrade password hash:', err);
      }
    }

    // 6. Create database-backed session
    const token = await createSession(normalizedEmail, userAgent, ipAddress);

    return {
      success: true,
      token,
      status: 200,
    };
  }

  async verifySession(token?: string | null): Promise<{ valid: boolean; email?: string }> {
    if (!token) return { valid: false };
    return validateSession(token);
  }

  async logout(token?: string | null): Promise<boolean> {
    if (!token) return true;
    return invalidateSession(token);
  }

  async changePassword(email: string, newPassword: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isAuthorizedAdmin(normalizedEmail)) {
      throw new Error('Access Denied: Unauthorized admin email');
    }

    const newHash = await hashPassword(newPassword);
    const updated = await adminRepository.updatePasswordHash(normalizedEmail, newHash);

    if (updated) {
      // Invalidate existing sessions on password change for security
      await invalidateAllSessions(normalizedEmail);
    }

    return updated;
  }
}

export const authService = new AuthService();
