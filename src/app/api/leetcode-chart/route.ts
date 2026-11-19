import { NextResponse } from 'next/server';
import dns from 'node:dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore
}

export const revalidate = 3600;

const FALLBACK_SUBMISSIONS: Record<string, number> = {
  "1788048000": 29,
  "1788134400": 2,
  "1788220800": 12,
  "1788307200": 11,
  "1788393600": 2,
  "1788480000": 4,
  "1788566400": 7,
  "1788652800": 8,
  "1788739200": 2,
  "1788912000": 3,
  "1792627200": 13,
  "1793664000": 17,
  "1794268800": 25,
  "1794787200": 1,
};

function generateCalendarSvg(submissionMap: Record<string, number>): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Map submissions by YYYY-MM-DD
  const dateSubmissions = new Map<string, number>();
  let totalSubmissions = 0;
  for (const [ts, count] of Object.entries(submissionMap)) {
    const d = new Date(parseInt(ts, 10) * 1000);
    const key = d.toISOString().slice(0, 10);
    const c = Number(count) || 0;
    dateSubmissions.set(key, (dateSubmissions.get(key) || 0) + c);
    totalSubmissions += c;
  }

  // 53 weeks ending on the current week's Saturday
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + (6 - now.getDay()));
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(end.getDate() - (53 * 7 - 1));
  start.setHours(0, 0, 0, 0);

  const rects: string[] = [];
  const monthLabels: string[] = [];
  let lastMonth = -1;
  let lastLabelWeek = -10;

  const current = new Date(start);

  for (let w = 0; w < 53; w++) {
    const x = 27 + w * 12;

    for (let d = 0; d < 7; d++) {
      const y = 20 + d * 12;
      const dateStr = current.toISOString().slice(0, 10);
      const count = dateSubmissions.get(dateStr) || 0;

      const m = current.getMonth();
      if (m !== lastMonth && w - lastLabelWeek >= 3 && w < 51) {
        monthLabels.push(
          `<text style="fill:#71717a;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;font-size:10px;" x="${x}" y="10">${months[m]}</text>`
        );
        lastMonth = m;
        lastLabelWeek = w;
      }

      let fill = '#161b22';
      if (count > 0) {
        if (count >= 15) fill = '#f59e0b';
        else if (count >= 8) fill = '#d97706';
        else if (count >= 4) fill = '#b45309';
        else fill = '#78350f';
      }

      rects.push(
        `<rect style="fill:${fill};" data-score="${count}" data-date="${dateStr}" x="${x}" y="${y}" width="10" height="10" rx="2"><title>${count} submissions on ${dateStr}</title></rect>`
      );

      current.setDate(current.getDate() + 1);
    }
  }

  const svgWidth = 663;
  const svgHeight = 126;
  const legendX = svgWidth - 110;
  const legendY = svgHeight - 12;
  const leetColors = ['#161b22', '#78350f', '#b45309', '#d97706', '#f59e0b'];

  const legendSvg = `
    <text x="${legendX - 28}" y="${legendY + 7}" fill="#71717a" font-family="monospace" font-size="8">Less</text>
    ${leetColors.map((c, i) => `<rect x="${legendX + i * 11}" y="${legendY}" width="8" height="8" rx="1.5" fill="${c}"/>`).join('')}
    <text x="${legendX + 5 * 11 + 4}" y="${legendY + 7}" fill="#71717a" font-family="monospace" font-size="8">More</text>
  `;

  const summarySvg = `
    <text x="27" y="${legendY + 7}" fill="#a1a1aa" font-family="monospace" font-size="9" font-weight="bold">
      ${totalSubmissions} submissions in the last year
    </text>
  `;

  return `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <style>
    rect { transition: transform 0.15s ease, opacity 0.15s ease; }
    rect:hover { opacity: 0.8; stroke: #fcd34d; stroke-width: 1px; }
  </style>
  <rect width="100%" height="100%" fill="transparent"/>
  <text style="fill:#71717a;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;font-size:9px;" x="0" y="40">Mon</text>
  <text style="fill:#71717a;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;font-size:9px;" x="0" y="64">Wed</text>
  <text style="fill:#71717a;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;font-size:9px;" x="0" y="89">Fri</text>
  ${monthLabels.join('\n  ')}
  ${rects.join('\n  ')}
  ${summarySvg}
  ${legendSvg}
</svg>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'Saran-R';

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: JSON.stringify({
        query: `
          query userProfileCalendar($username: String!) {
            matchedUser(username: $username) {
              userCalendar {
                streak
                totalActiveDays
                submissionCalendar
              }
            }
          }
        `,
        variables: { username },
      }),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      throw new Error(`LeetCode GraphQL error: ${res.statusText}`);
    }

    const json = await res.json();
    const calendarStr = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
    let submissionMap: Record<string, number> = FALLBACK_SUBMISSIONS;

    if (calendarStr) {
      try {
        submissionMap = JSON.parse(calendarStr);
      } catch {
        submissionMap = FALLBACK_SUBMISSIONS;
      }
    }

    const svg = generateCalendarSvg(submissionMap);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.warn('[LEETCODE CHART WARNING] Fallback engaged:', err instanceof Error ? err.message : String(err));
    const fallbackSvg = generateCalendarSvg(FALLBACK_SUBMISSIONS);
    return new NextResponse(fallbackSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }
}
