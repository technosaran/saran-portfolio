import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyToken, 
  fetchProfile, 
  fetchProjects, 
  fetchExperience, 
  fetchSkills, 
  fetchCertificates 
} from '@/lib/neon/db';


export async function GET(req: NextRequest) {
  const token = req.cookies.get('portfolio_admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [profile, projects, experience, skills, certificates] = await Promise.all([
      fetchProfile(),
      fetchProjects(),
      fetchExperience(),
      fetchSkills(),
      fetchCertificates(),
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
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
