import { db, getDbPool, certificates, CertificateRecord, NewCertificateRecord } from '@/lib/db';
import { asc, eq } from 'drizzle-orm';

export class CertificatesRepository {
  async getAll(): Promise<CertificateRecord[]> {
    return db.select().from(certificates).orderBy(asc(certificates.id));
  }

  async getById(id: number): Promise<CertificateRecord | null> {
    const res = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
    return res[0] || null;
  }

  async create(data: Omit<NewCertificateRecord, 'id'>): Promise<CertificateRecord> {
    const pool = getDbPool();

    // WHERE NOT EXISTS duplicate check on credential_id or title+provider
    const res = await pool.query(`
      INSERT INTO public.certificates (credential_id, title, provider, issue_date, url)
      SELECT $1, $2, $3, $4, $5
      WHERE NOT EXISTS (
        SELECT 1 FROM public.certificates 
        WHERE ($1::text IS NOT NULL AND $1::text <> '' AND credential_id = $1)
           OR (LOWER(title) = LOWER($2) AND LOWER(provider) = LOWER($3))
      )
      RETURNING *;
    `, [data.credential_id || null, data.title, data.provider, data.issue_date || null, data.url || null]);

    if (res.rows.length === 0) {
      const existing = await pool.query(
        'SELECT * FROM public.certificates WHERE ($1::text IS NOT NULL AND $1::text <> \'\' AND credential_id = $1) OR (LOWER(title) = LOWER($2) AND LOWER(provider) = LOWER($3)) LIMIT 1',
        [data.credential_id || null, data.title, data.provider]
      );
      if (existing.rows[0]) return existing.rows[0];
      throw new Error('Certificate with this credential ID or title already exists');
    }

    return res.rows[0];
  }

  async update(id: number, data: Partial<NewCertificateRecord>): Promise<CertificateRecord> {
    const updated = await db
      .update(certificates)
      .set(data)
      .where(eq(certificates.id, id))
      .returning();

    if (!updated[0]) {
      throw new Error(`Certificate with ID ${id} not found`);
    }

    return updated[0];
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(certificates).where(eq(certificates.id, id)).returning({ id: certificates.id });
    return deleted.length > 0;
  }
}

export const certificatesRepository = new CertificatesRepository();
