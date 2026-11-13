import { NextResponse } from 'next/server';

export const revalidate = 3600;

function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, '');
}

export async function GET() {
  const username = 'technosaran';
  try {
    const res = await fetch(`https://ghchart.rshah.org/3b82f6/${username}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch chart: ${res.statusText}`);
    }

    const rawSvgText = await res.text();
    const sanitizedSvg = sanitizeSvg(rawSvgText);

    // Transform light-theme empty squares (#EEEEEE) to dark obsidian (#161b22) and muted text labels
    const darkSvg = sanitizedSvg
      .replace(/fill:#EEEEEE/gi, 'fill:#161b22')
      .replace(/fill:#eee/gi, 'fill:#161b22')
      .replace(/fill:#767676/gi, 'fill:#71717a');

    return new NextResponse(darkSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.warn('[GITHUB CHART WARNING] Proxy fallback engaged:', err instanceof Error ? err.message : String(err));
    // Return a clean fallback dark SVG
    const fallbackSvg = `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="663" height="104" viewBox="0 0 663 104">
        <rect width="100%" height="100%" fill="#09090b" rx="8" />
        <text x="50%" y="55%" text-anchor="middle" fill="#60a5fa" font-family="monospace" font-size="12">
          github.com/${username} · Continuous Contribution Stream Active
        </text>
      </svg>
    `.trim();

    return new NextResponse(fallbackSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}
