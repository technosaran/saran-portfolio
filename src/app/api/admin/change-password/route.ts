import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateAdminPassword } from '@/lib/neon/db';

export const dynamic = 'force-dynamic';

const AUTHORIZED_ADMIN = 'iamsaran.ai@gmail.com';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const email = verifyToken(token);
  if (!email || email !== AUTHORIZED_ADMIN) {
    return NextResponse.json({ success: false, error: 'Access Denied: Only iamsaran.ai@gmail.com has rights to change password.' }, { status: 403 });
  }

  try {
    const { newPassword } = await req.json();
    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const updated = await updateAdminPassword(email, newPassword.trim());
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
