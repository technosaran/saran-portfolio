import { NextResponse } from 'next/server';
import { fetchProjects, fetchSkills, fetchExperience, fetchCertificates } from '@/lib/neon/db';


export async function GET() {
  try {
    const [projects, skills, experience, certificates] = await Promise.all([
      fetchProjects(),
      fetchSkills(),
      fetchExperience(),
      fetchCertificates(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
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
