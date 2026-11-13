export const AUTH_CONFIG = {
  ADMIN_EMAIL: 'iamsaran.ai@gmail.com',
  COOKIE_NAME: 'portfolio_admin_token',
  SESSION_DURATION_DAYS: 30,
  SESSION_DURATION_MS: 30 * 24 * 60 * 60 * 1000,
  LOGIN_RATE_LIMIT_MAX: 5,
  LOGIN_RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
} as const;

export function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[CRITICAL SECURITY ERROR] ADMIN_JWT_SECRET environment variable is missing in production!');
    }
    return 'development_secret_key_neon_portfolio_saran';
  }
  return secret;
}

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTH_CONFIG.ADMIN_EMAIL.toLowerCase();
}
