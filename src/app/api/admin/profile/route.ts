import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { profileService } from '@/services/profile.service';
import { profileUpdateSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const json = await req.json().catch(() => null);
    const validation = profileUpdateSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid profile payload' },
        { status: 400 }
      );
    }

    const updated = await profileService.updateProfile(validation.data);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error updating profile';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
