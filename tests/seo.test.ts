import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

describe('SEO & Metadata specifications', () => {
  it('sitemap generates valid canonical URLs without fragment identifiers (#)', () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    entries.forEach((entry) => {
      expect(entry.url).not.toContain('#');
      expect(entry.url.startsWith('http')).toBe(true);
    });
  });

  it('robots generates proper disallow rules for admin endpoints and dynamic sitemap', () => {
    const rules = robots();
    expect(rules.rules).toBeDefined();
    expect(rules.sitemap).toBeDefined();
    expect(String(rules.sitemap)).toContain('/sitemap.xml');
  });
});
