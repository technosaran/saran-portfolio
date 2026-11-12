import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, generateToken } from '@/lib/neon/db';

export const dynamic = 'force-dynamic';

const AUTHORIZED_ADMIN_EMAIL = 'iamsaran.ai@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Strict Authorization Check: Only iamsaran.ai@gmail.com is authorized
    if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
      return NextResponse.json({ 
        success: false, 
        error: 'Access Denied: Only the portfolio owner (iamsaran.ai@gmail.com) has rights to access the admin panel.' 
      }, { status: 403 });
    }

    const isValid = await verifyAdminCredentials(normalizedEmail, String(password));

    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid password. Please check your credentials.' 
      }, { status: 401 });
    }

    const token = generateToken(normalizedEmail);
    const response = NextResponse.json({ success: true, email: normalizedEmail });

    response.cookies.set({
      name: 'portfolio_admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
