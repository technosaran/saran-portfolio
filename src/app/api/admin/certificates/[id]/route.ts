import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { certificatesService } from '@/services/certificates.service';
import { certificateUpdateSchema } from '@/lib/validation/schemas';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID parameter' }, { status: 400 });
    }

    const json = await req.json().catch(() => null);
    const validation = certificateUpdateSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid certificate update payload' },
        { status: 400 }
      );
    }

    const updated = await certificatesService.updateCertificate(numericId, validation.data);
    return NextResponse.json({ success: true, certificate: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID parameter' }, { status: 400 });
    }

    const deleted = await certificatesService.deleteCertificate(numericId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Certificate deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
