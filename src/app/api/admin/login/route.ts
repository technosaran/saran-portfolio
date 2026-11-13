import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { adminLoginSchema } from '@/lib/validation/schemas';
import { AUTH_CONFIG } from '@/lib/security/auth-config';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = adminLoginSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent');

    const result = await authService.authenticate(email, password, ip, userAgent);

    if (!result.success || !result.token) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      email: email.toLowerCase(),
    });

    response.cookies.set({
      name: AUTH_CONFIG.COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_DURATION_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal authentication error';
    console.error('[LOGIN API ERROR]', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
