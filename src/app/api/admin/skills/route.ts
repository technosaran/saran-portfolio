import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createSkill } from '@/lib/neon/db';

const AUTHORIZED_ADMIN = 'iamsaran.ai@gmail.com';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const email = verifyToken(token);
  if (!email || email !== AUTHORIZED_ADMIN) {
    return NextResponse.json({ success: false, error: 'Access Denied: Only iamsaran.ai@gmail.com has rights to change data.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const created = await createSkill(body);
    return NextResponse.json({ success: true, skill: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
