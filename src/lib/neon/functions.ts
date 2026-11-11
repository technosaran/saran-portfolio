export interface NeonFunctionConfig {
  branchId: string;
  hostSuffix: string;
  helloUrl: string;
}

export function getNeonFunctionConfig(): NeonFunctionConfig {
  const branchId = process.env.NEON_BRANCH_ID || '';
  const hostSuffix = process.env.NEON_FUNCTION_HOST_SUFFIX || '';
  
  // Format: https://<branchId>-<functionName>.<hostSuffix>/
  const cleanSuffix = hostSuffix.replace(/^\.+/, '');
  const helloUrl = branchId && cleanSuffix ? `https://${branchId}-hello.${cleanSuffix}/` : '';

  return {
    branchId,
    hostSuffix: cleanSuffix,
    helloUrl,
  };
}

export async function invokeHelloFunction(): Promise<{
  ok: boolean;
  status: string;
  url: string;
  response?: string;
  error?: string;
}> {
  const config = getNeonFunctionConfig();
  if (!config.helloUrl) {
    return { ok: false, status: 'unconfigured', url: '' };
  }

  try {
    const res = await fetch(config.helloUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    if (res.ok) {
      const text = await res.text();
      return {
        ok: true,
        status: 'invoked',
        url: config.helloUrl,
        response: text.trim(),
      };
    } else {
      return {
        ok: false,
        status: `HTTP ${res.status}`,
        url: config.helloUrl,
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: 'error',
      url: config.helloUrl,
      error: message,
    };
  }
}
