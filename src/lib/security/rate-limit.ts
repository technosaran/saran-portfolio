interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 30 * 60 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitOptions {
  key: string;
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit({ key, max, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter out timestamps outside window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= max) {
    const oldestTimestamp = record.timestamps[0];
    const resetInSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  record.timestamps.push(now);
  const remaining = max - record.timestamps.length;
  const resetInSeconds = Math.ceil(windowMs / 1000);

  return {
    success: true,
    remaining,
    resetInSeconds,
  };
}
