import { db, getDbPool, projects, ProjectRecord, NewProjectRecord } from '@/lib/db';
import { asc, eq } from 'drizzle-orm';

export class ProjectsRepository {
  async getAll(): Promise<ProjectRecord[]> {
    return db.select().from(projects).orderBy(asc(projects.id));
  }

  async getById(id: number): Promise<ProjectRecord | null> {
    const res = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return res[0] || null;
  }

  async create(data: Omit<NewProjectRecord, 'id'>): Promise<ProjectRecord> {
    const pool = getDbPool();
    const techStack = Array.isArray(data.tech_stack) ? data.tech_stack : [];
    const highlights = Array.isArray(data.highlights) ? data.highlights : [];

    // Duplicate prevention using WHERE NOT EXISTS check on unique columns
    const res = await pool.query(`
      INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, highlights)
      SELECT $1, $2, $3, $4, $5, $6
      WHERE NOT EXISTS (
        SELECT 1 FROM public.projects 
        WHERE ($4::text IS NOT NULL AND $4::text <> '' AND github_url = $4)
           OR LOWER(title) = LOWER($1)
      )
      RETURNING *;
    `, [data.title, data.description, techStack, data.github_url || null, data.live_url || null, highlights]);

    if (res.rows.length === 0) {
      const existing = await pool.query(
        'SELECT * FROM public.projects WHERE ($1::text IS NOT NULL AND $1::text <> \'\' AND github_url = $1) OR LOWER(title) = LOWER($2) LIMIT 1',
        [data.github_url || null, data.title]
      );
      if (existing.rows[0]) return existing.rows[0];
      throw new Error('Project with this title or repository URL already exists');
    }

    return res.rows[0];
  }

  async update(id: number, data: Partial<NewProjectRecord>): Promise<ProjectRecord> {
    const updated = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();

    if (!updated[0]) {
      throw new Error(`Project with ID ${id} not found`);
    }

    return updated[0];
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
    return deleted.length > 0;
  }
}

export const projectsRepository = new ProjectsRepository();
