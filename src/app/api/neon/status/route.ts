import { NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/db';
import { checkNeonAuthStatus } from '@/lib/neon/auth';
import { invokeHelloFunction } from '@/lib/neon/functions';
import { checkRealtimeStatus } from '@/lib/neon/realtime';

export async function GET() {
  const results: Record<string, { ok: boolean; status: string; latencyMs: number; details: unknown }> = {};

  // 1. Test Postgres
  const pgStart = Date.now();
  try {
    const pool = getPool();
    const res = await pool.query('SELECT current_database() as db, version() as ver, count(*) as project_count FROM public.projects');
    results.postgres = {
      ok: true,
      status: 'Connected',
      latencyMs: Date.now() - pgStart,
      details: {
        database: res.rows[0].db,
        projectsInDb: Number(res.rows[0].project_count),
        version: res.rows[0].ver.split(' ')[0] + ' ' + res.rows[0].ver.split(' ')[1],
      },
    };
  } catch (err: unknown) {
    results.postgres = {
      ok: false,
      status: 'Error',
      latencyMs: Date.now() - pgStart,
      details: { error: err instanceof Error ? err.message : String(err) },
    };
  }

  // 2. Test Auth
  const authStart = Date.now();
  const authStatus = await checkNeonAuthStatus();
  results.auth = {
    ok: authStatus.ok,
    status: authStatus.ok ? 'Active (Managed Better Auth)' : authStatus.status,
    latencyMs: Date.now() - authStart,
    details: authStatus,
  };

  // 3. Test Functions
  const fnStart = Date.now();
  const fnStatus = await invokeHelloFunction();
  results.functions = {
    ok: fnStatus.ok,
    status: fnStatus.ok ? `Live: "${fnStatus.response}"` : fnStatus.status,
    latencyMs: Date.now() - fnStart,
    details: fnStatus,
  };

  // 4. Test Realtime
  const rtStart = Date.now();
  const rtStatus = await checkRealtimeStatus();
  results.realtime = {
    ok: rtStatus.ok,
    status: rtStatus.ok ? 'Configured & Ready' : rtStatus.status,
    latencyMs: Date.now() - rtStart,
    details: rtStatus,
  };

  const allOk = Object.values(results).every(r => r.ok);

  return NextResponse.json({
    success: allOk,
    timestamp: new Date().toISOString(),
    branch: process.env.NEON_BRANCH || 'production',
    services: results,
  });
}
