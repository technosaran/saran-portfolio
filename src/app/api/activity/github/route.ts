import { NextResponse } from 'next/server';
import { fetchGitHubData } from '@/services/github.service';

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await fetchGitHubData('technosaran');
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
