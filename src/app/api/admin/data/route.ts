import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/guards';
import { profileService } from '@/services/profile.service';
import { projectsService } from '@/services/projects.service';
import { experienceService } from '@/services/experience.service';
import { skillsService } from '@/services/skills.service';
import { certificatesService } from '@/services/certificates.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const [profile, projects, experience, skills, certificates] = await Promise.all([
      profileService.getProfile(),
      projectsService.getAllProjects(),
      experienceService.getAllExperience(),
      skillsService.getAllSkills(),
      certificatesService.getAllCertificates(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        projects,
        experience,
        skills,
        certificates,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error fetching admin data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
