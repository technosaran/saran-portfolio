import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { AUTH_CONFIG, isAuthorizedAdmin } from '@/lib/security/auth-config';

export interface AuthenticatedAdminContext {
  email: string;
}

export type AuthenticatedHandler = (
  req: NextRequest,
  ctx: AuthenticatedAdminContext
) => Promise<NextResponse>;

export async function requireAdminAuth(
  req: NextRequest
): Promise<{ authorized: true; email: string } | { authorized: false; response: NextResponse }> {
  const token = req.cookies.get(AUTH_CONFIG.COOKIE_NAME)?.value;

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, error: 'Unauthorized: Authentication required' }, { status: 401 }),
    };
  }

  const { valid, email } = await authService.verifySession(token);

  if (!valid || !email) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, error: 'Unauthorized: Session invalid or expired' }, { status: 401 }),
    };
  }

  if (!isAuthorizedAdmin(email)) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, error: 'Forbidden: Insufficient privileges' }, { status: 403 }),
    };
  }

  return { authorized: true, email };
}
