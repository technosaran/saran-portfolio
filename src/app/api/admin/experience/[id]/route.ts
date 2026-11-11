import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateExperience, deleteExperience } from '@/lib/neon/db';

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
    const body = await req.json();
    const updated = await updateExperience(parseInt(id, 10), body);
    return NextResponse.json({ success: true, experience: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
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
    await deleteExperience(parseInt(id, 10));
    return NextResponse.json({ success: true, message: 'Experience deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
