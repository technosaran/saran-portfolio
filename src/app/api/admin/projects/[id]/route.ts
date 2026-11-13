import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { projectsService } from '@/services/projects.service';
import { projectUpdateSchema } from '@/lib/validation/schemas';

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
    const validation = projectUpdateSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid update payload' },
        { status: 400 }
      );
    }

    const updated = await projectsService.updateProject(numericId, validation.data);
    return NextResponse.json({ success: true, project: updated });
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

    const deleted = await projectsService.deleteProject(numericId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
