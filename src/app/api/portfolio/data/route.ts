import { NextResponse } from 'next/server';
import { profileService } from '@/services/profile.service';
import { projectsService } from '@/services/projects.service';
import { skillsService } from '@/services/skills.service';
import { experienceService } from '@/services/experience.service';
import { certificatesService } from '@/services/certificates.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [profile, projects, skills, experience, certificates] = await Promise.all([
      profileService.getProfile(),
      projectsService.getAllProjects(),
      skillsService.getAllSkills(),
      experienceService.getAllExperience(),
      certificatesService.getAllCertificates(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          profile,
          projects,
          skills,
          experience,
          certificates,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database query error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
