import { db, profile, ProfileRecord, NewProfileRecord } from '@/lib/db';
import { asc, eq } from 'drizzle-orm';

export class ProfileRepository {
  async getProfile(): Promise<ProfileRecord | null> {
    const res = await db.select().from(profile).orderBy(asc(profile.id)).limit(1);
    return res[0] || null;
  }

  async updateProfile(data: Partial<NewProfileRecord>): Promise<ProfileRecord> {
    const current = await this.getProfile();

    if (!current) {
      const inserted = await db.insert(profile).values({
        full_name: data.full_name || 'SARAN R',
        title: data.title || 'Artificial Intelligence & Machine Learning Engineer',
        headline: data.headline || 'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect',
        bio: data.bio || 'Innovative AI/ML engineering student with hands-on experience in AWS cloud and full-stack development.',
        email: data.email || 'iamsaran.ai@gmail.com',
        phone: data.phone || '+91 6384957740',
        location: data.location || 'Chennai, Tamil Nadu',
        college: data.college || 'Panimalar Engineering College',
        degree: data.degree || 'Bachelor of Technology in Artificial Intelligence and Machine Learning',
        graduation_year: data.graduation_year || '2023 – 2027',
        github_url: data.github_url || 'https://github.com/technosaran',
        linkedin_url: data.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275',
        website_url: data.website_url || 'https://technosaran.vercel.app',
        leetcode_url: data.leetcode_url || 'https://leetcode.com/u/Saran-R/',
      }).returning();
      return inserted[0];
    }

    const updated = await db
      .update(profile)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(profile.id, current.id))
      .returning();

    return updated[0];
  }
}

export const profileRepository = new ProfileRepository();
