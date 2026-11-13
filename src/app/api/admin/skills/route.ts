import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { skillsService } from '@/services/skills.service';
import { skillCreateSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const json = await req.json().catch(() => null);
    const validation = skillCreateSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid skill payload' },
        { status: 400 }
      );
    }

    const created = await skillsService.createSkill(validation.data);
    return NextResponse.json({ success: true, skill: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error creating skill';
    const status = message.includes('already exists') ? 409 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
