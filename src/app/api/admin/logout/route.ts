import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { AUTH_CONFIG } from '@/lib/security/auth-config';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(AUTH_CONFIG.COOKIE_NAME)?.value;
  if (token) {
    await authService.logout(token);
  }

  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  res.cookies.set({
    name: AUTH_CONFIG.COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
