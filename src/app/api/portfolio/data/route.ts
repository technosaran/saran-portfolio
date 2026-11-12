import { NextResponse } from 'next/server';
import { fetchProfile, fetchProjects, fetchSkills, fetchExperience, fetchCertificates } from '@/lib/neon/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [profile, projects, skills, experience, certificates] = await Promise.all([
      fetchProfile(),
      fetchProjects(),
      fetchSkills(),
      fetchExperience(),
      fetchCertificates(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        projects,
        skills,
        experience,
        certificates,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
