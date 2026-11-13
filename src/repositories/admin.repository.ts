import { db, adminUsers, AdminUser } from '@/lib/db';
import { sql } from 'drizzle-orm';

export class AdminRepository {
  async findByEmail(email: string): Promise<AdminUser | null> {
    const res = await db
      .select()
      .from(adminUsers)
      .where(sql`LOWER(${adminUsers.email}) = LOWER(${email.trim()})`)
      .limit(1);
    return res[0] || null;
  }

  async updatePasswordHash(email: string, passwordHash: string): Promise<boolean> {
    const res = await db
      .update(adminUsers)
      .set({ password_hash: passwordHash })
      .where(sql`LOWER(${adminUsers.email}) = LOWER(${email.trim()})`)
      .returning({ id: adminUsers.id });
    return res.length > 0;
  }
}

export const adminRepository = new AdminRepository();
