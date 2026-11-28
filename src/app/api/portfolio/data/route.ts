import { NextResponse } from 'next/server';
import { profileService } from '@/services/profile.service';
import { projectsService } from '@/services/projects.service';
import { skillsService } from '@/services/skills.service';
import { experienceService } from '@/services/experience.service';
import { certificatesService } from '@/services/certificates.service';
import {
  FALLBACK_PROFILE,
  FALLBACK_PROJECTS,
  FALLBACK_SKILLS,
  FALLBACK_EXPERIENCE,
  FALLBACK_CERTIFICATES,
} from '@/lib/fallback-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        success: true,
        source: 'fallback',
        data: {
          profile: FALLBACK_PROFILE,
          projects: FALLBACK_PROJECTS,
          skills: FALLBACK_SKILLS,
          experience: FALLBACK_EXPERIENCE,
          certificates: FALLBACK_CERTIFICATES,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  }

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
        source: 'database',
        data: {
          profile: profile || FALLBACK_PROFILE,
          projects,
          skills,
          experience,
          certificates,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database query error';
    console.warn('[PORTFOLIO DATA FALLBACK]', message);
    return NextResponse.json(
      {
        success: true,
        source: 'fallback',
        data: {
          profile: FALLBACK_PROFILE,
          projects: FALLBACK_PROJECTS,
          skills: FALLBACK_SKILLS,
          experience: FALLBACK_EXPERIENCE,
          certificates: FALLBACK_CERTIFICATES,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  }
}
