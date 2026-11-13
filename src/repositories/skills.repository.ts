import { db, getDbPool, skills, SkillRecord, NewSkillRecord } from '@/lib/db';
import { asc, eq } from 'drizzle-orm';

export class SkillsRepository {
  async getAll(): Promise<SkillRecord[]> {
    return db.select().from(skills).orderBy(asc(skills.category), asc(skills.id));
  }

  async getById(id: number): Promise<SkillRecord | null> {
    const res = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return res[0] || null;
  }

  async create(data: Omit<NewSkillRecord, 'id'>): Promise<SkillRecord> {
    const pool = getDbPool();

    // WHERE NOT EXISTS duplicate check on unique name column
    const res = await pool.query(`
      INSERT INTO public.skills (name, category, level)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT 1 FROM public.skills 
        WHERE LOWER(name) = LOWER($1)
      )
      RETURNING *;
    `, [data.name, data.category, data.level || 'Proficient']);

    if (res.rows.length === 0) {
      const existing = await pool.query(
        'SELECT * FROM public.skills WHERE LOWER(name) = LOWER($1) LIMIT 1',
        [data.name]
      );
      if (existing.rows[0]) return existing.rows[0];
      throw new Error(`Skill "${data.name}" already exists`);
    }

    return res.rows[0];
  }

  async update(id: number, data: Partial<NewSkillRecord>): Promise<SkillRecord> {
    const updated = await db
      .update(skills)
      .set(data)
      .where(eq(skills.id, id))
      .returning();

    if (!updated[0]) {
      throw new Error(`Skill with ID ${id} not found`);
    }

    return updated[0];
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(skills).where(eq(skills.id, id)).returning({ id: skills.id });
    return deleted.length > 0;
  }
}

export const skillsRepository = new SkillsRepository();
