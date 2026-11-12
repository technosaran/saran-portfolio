import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

    const svgText = await res.text();

    // Transform light-theme empty squares (#EEEEEE) to dark obsidian (#161b22) and muted text labels
    const darkSvg = svgText
      .replace(/fill:#EEEEEE/gi, 'fill:#161b22')
      .replace(/fill:#eee/gi, 'fill:#161b22')
      .replace(/fill:#767676/gi, 'fill:#71717a');

    return new NextResponse(darkSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('GitHub chart proxy error:', err);
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
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
