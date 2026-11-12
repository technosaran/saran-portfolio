import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createProject } from '@/lib/neon/db';

export const dynamic = 'force-dynamic';

const AUTHORIZED_ADMIN = 'iamsaran.ai@gmail.com';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const email = verifyToken(token);
  if (!email || email !== AUTHORIZED_ADMIN) {
    return NextResponse.json({ success: false, error: 'Access Denied: Only iamsaran.ai@gmail.com has rights to change data.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.title || !String(body.title).trim()) {
      return NextResponse.json({ success: false, error: 'Project title is required' }, { status: 400 });
    }

    const created = await createProject(body);
    return NextResponse.json({ success: true, project: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message.includes('already exists') ? 409 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
