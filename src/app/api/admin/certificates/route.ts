import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { certificatesService } from '@/services/certificates.service';
import { certificateCreateSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const json = await req.json().catch(() => null);
    const validation = certificateCreateSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid certificate payload' },
        { status: 400 }
      );
    }

    const created = await certificatesService.createCertificate(validation.data);
    return NextResponse.json({ success: true, certificate: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error creating certificate';
    const status = message.includes('already exists') ? 409 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
