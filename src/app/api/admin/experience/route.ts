import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createExperience } from '@/lib/neon/db';

export const dynamic = 'force-dynamic';

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
    if (!body.role || !String(body.role).trim()) {
      return NextResponse.json({ success: false, error: 'Internship/job role is required' }, { status: 400 });
    }
    if (!body.company || !String(body.company).trim()) {
      return NextResponse.json({ success: false, error: 'Company name is required' }, { status: 400 });
    }

    const created = await createExperience({
      intern_id: body.intern_id || `exp-${Date.now()}`,
      role: body.role,
      company: body.company,
      period: body.period || '2025',
      location: body.location || 'Remote',
      description: body.description || []
    });
    return NextResponse.json({ success: true, experience: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message.includes('already exists') ? 409 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
