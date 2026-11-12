import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateSkill, deleteSkill } from '@/lib/neon/db';

export const dynamic = 'force-dynamic';

const AUTHORIZED_ADMIN = 'iamsaran.ai@gmail.com';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const email = verifyToken(token);
  if (!email || email !== AUTHORIZED_ADMIN) {
    return NextResponse.json({ success: false, error: 'Access Denied: Only iamsaran.ai@gmail.com has rights to change data.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID parameter' }, { status: 400 });
    }

    const body = await req.json();
    const updated = await updateSkill(numericId, body);
    return NextResponse.json({ success: true, skill: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const email = verifyToken(token);
  if (!email || email !== AUTHORIZED_ADMIN) {
    return NextResponse.json({ success: false, error: 'Access Denied: Only iamsaran.ai@gmail.com has rights to change data.' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID parameter' }, { status: 400 });
    }

    const deleted = await deleteSkill(numericId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
