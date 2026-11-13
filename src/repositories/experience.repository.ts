import { db, getDbPool, experience, ExperienceRecord, NewExperienceRecord } from '@/lib/db';
import { asc, eq } from 'drizzle-orm';

export class ExperienceRepository {
  async getAll(): Promise<ExperienceRecord[]> {
    return db.select().from(experience).orderBy(asc(experience.id));
  }

  async getById(id: number): Promise<ExperienceRecord | null> {
    const res = await db.select().from(experience).where(eq(experience.id, id)).limit(1);
    return res[0] || null;
  }

  async create(data: Omit<NewExperienceRecord, 'id'>): Promise<ExperienceRecord> {
    const pool = getDbPool();
    const description = Array.isArray(data.description) ? data.description : [];

    // WHERE NOT EXISTS duplicate check on intern_id or role+company
    const res = await pool.query(`
      INSERT INTO public.experience (intern_id, role, company, period, location, description)
      SELECT $1, $2, $3, $4, $5, $6
      WHERE NOT EXISTS (
        SELECT 1 FROM public.experience 
        WHERE intern_id = $1 
           OR (LOWER(role) = LOWER($2) AND LOWER(company) = LOWER($3))
      )
      RETURNING *;
    `, [data.intern_id, data.role, data.company, data.period, data.location || null, description]);

    if (res.rows.length === 0) {
      const existing = await pool.query(
        'SELECT * FROM public.experience WHERE intern_id = $1 OR (LOWER(role) = LOWER($2) AND LOWER(company) = LOWER($3)) LIMIT 1',
        [data.intern_id, data.role, data.company]
      );
      if (existing.rows[0]) return existing.rows[0];
      throw new Error('Experience record with this ID or role already exists');
    }

    return res.rows[0];
  }

  async update(id: number, data: Partial<NewExperienceRecord>): Promise<ExperienceRecord> {
    const updated = await db
      .update(experience)
      .set(data)
      .where(eq(experience.id, id))
      .returning();

    if (!updated[0]) {
      throw new Error(`Experience with ID ${id} not found`);
    }

    return updated[0];
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(experience).where(eq(experience.id, id)).returning({ id: experience.id });
    return deleted.length > 0;
  }
}

export const experienceRepository = new ExperienceRepository();
