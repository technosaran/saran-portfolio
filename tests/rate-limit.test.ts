import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/security/rate-limit';

describe('Sliding Window Rate Limiter', () => {
  it('allows requests within max threshold', () => {
    const key = 'test-ip-1';
    const res1 = checkRateLimit({ key, max: 3, windowMs: 10000 });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit({ key, max: 3, windowMs: 10000 });
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit({ key, max: 3, windowMs: 10000 });
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('throttles requests that exceed max threshold', () => {
    const key = 'test-ip-blocked';
    checkRateLimit({ key, max: 2, windowMs: 10000 });
    checkRateLimit({ key, max: 2, windowMs: 10000 });

    const blocked = checkRateLimit({ key, max: 2, windowMs: 10000 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetInSeconds).toBeGreaterThan(0);
  });
});
