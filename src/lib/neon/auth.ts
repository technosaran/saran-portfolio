export interface NeonAuthConfig {
  baseUrl: string;
  jwksUrl: string;
  isConfigured: boolean;
}

export function getNeonAuthConfig(): NeonAuthConfig {
  const baseUrl = process.env.NEON_AUTH_BASE_URL || '';
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL || '';

  return {
    baseUrl,
    jwksUrl,
    isConfigured: Boolean(baseUrl && jwksUrl),
  };
}

export async function checkNeonAuthStatus(): Promise<{
  ok: boolean;
  status: string;
  baseUrl: string;
  error?: string;
}> {
  const config = getNeonAuthConfig();
  if (!config.baseUrl) {
    return { ok: false, status: 'unconfigured', baseUrl: '' };
  }

  try {
    const res = await fetch(`${config.baseUrl}/ok`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, status: 'connected', baseUrl: config.baseUrl, ...data };
    } else {
      return { ok: false, status: `HTTP ${res.status}`, baseUrl: config.baseUrl };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 'connection_error', baseUrl: config.baseUrl, error: message };
  }
}
