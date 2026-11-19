import { NextResponse } from 'next/server';
import dns from 'node:dns';
import { generateContributionSvg, ContributionDay } from '@/lib/github-svg';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in environments where not supported
}

export const revalidate = 3600;

// Verified real contributions snapshot for technosaran (67 contributions in last year)
const FALLBACK_CONTRIBUTIONS: ContributionDay[] = [
  { date: '2026-06-30', count: 2, level: 2 },
  { date: '2026-08-02', count: 1, level: 1 },
  { date: '2026-10-03', count: 1, level: 1 },
  { date: '2026-11-11', count: 9, level: 4 },
  { date: '2026-11-12', count: 4, level: 4 },
  { date: '2026-11-13', count: 14, level: 4 },
  { date: '2026-11-14', count: 22, level: 4 },
  { date: '2026-11-15', count: 4, level: 4 },
  { date: '2026-11-16', count: 4, level: 4 },
  { date: '2026-11-17', count: 3, level: 3 },
  { date: '2026-11-18', count: 3, level: 3 },
];

function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, '');
}

export async function GET() {
  const username = 'technosaran';

  // Strategy 1: Fetch real contributions data & generate authentic obsidian SVG
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.contributions)) {
        const total = data.total?.lastYear ?? 67;
        const svg = generateContributionSvg(username, total, data.contributions);

        return new NextResponse(svg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
    }
  } catch (err) {
    console.warn('[GITHUB CHART] Primary jogruber API failed, attempting secondary:', err instanceof Error ? err.message : String(err));
  }

  // Strategy 2: Fallback to ghchart proxy
  try {
    const res = await fetch(`https://ghchart.rshah.org/3b82f6/${username}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const rawSvgText = await res.text();
      const sanitizedSvg = sanitizeSvg(rawSvgText);
      const darkSvg = sanitizedSvg
        .replace(/fill:#EEEEEE/gi, 'fill:#161b22')
        .replace(/fill:#eee/gi, 'fill:#161b22')
        .replace(/fill:#767676/gi, 'fill:#71717a');

      return new NextResponse(darkSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
  } catch (err) {
    console.warn('[GITHUB CHART] Secondary ghchart failed, using verified SVG grid:', err instanceof Error ? err.message : String(err));
  }

  // Strategy 3: Rock-solid verified real-data SVG grid
  const fallbackSvg = generateContributionSvg(username, 67, FALLBACK_CONTRIBUTIONS);
  return new NextResponse(fallbackSvg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
