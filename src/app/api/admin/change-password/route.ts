import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { authService } from '@/services/auth.service';
import { changePasswordSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const json = await req.json().catch(() => null);
    const validation = changePasswordSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid password payload' },
        { status: 400 }
      );
    }

    const { newPassword } = validation.data;
    const updated = await authService.changePassword(auth.email, newPassword);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Admin account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update password';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
