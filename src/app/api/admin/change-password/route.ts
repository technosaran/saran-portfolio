import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateAdminPassword } from '@/lib/neon/db';


export async function POST(req: NextRequest) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const email = verifyToken(token);
  if (!email) {
    return NextResponse.json({ success: false, error: 'Unauthorized session' }, { status: 401 });
  }

  try {
    const { newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await updateAdminPassword(email, newPassword);
    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
