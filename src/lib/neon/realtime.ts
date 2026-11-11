export interface NeonRealtimeConfig {
  url: string;
  isConfigured: boolean;
}

export function getNeonRealtimeConfig(): NeonRealtimeConfig {
  const url = process.env.NEON_REALTIME_URL || '';
  const secret = process.env.NEON_REALTIME_SECRET || '';

  return {
    url,
    isConfigured: Boolean(url && secret),
  };
}

export async function checkRealtimeStatus(): Promise<{
  ok: boolean;
  status: string;
  url: string;
  protocol: string;
}> {
  const config = getNeonRealtimeConfig();
  if (!config.url) {
    return { ok: false, status: 'unconfigured', url: '', protocol: 'none' };
  }

  return {
    ok: true,
    status: 'configured',
    url: config.url,
    protocol: config.url.startsWith('wss://') ? 'WebSocket (WSS)' : 'HTTP/WS',
  };
}
