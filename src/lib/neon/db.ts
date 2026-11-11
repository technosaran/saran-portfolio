import { Pool } from 'pg';
import crypto from 'crypto';

// Cache pool globally for Next.js hot reload
declare global {
  // eslint-disable-next-line no-var
  var __neon_pool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL || '';

export function getPool(): Pool {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  if (!global.__neon_pool) {
    global.__neon_pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return global.__neon_pool;
}

export interface Profile {
  id: number;
  full_name: string;
  title: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  college: string;
  degree: string;
  graduation_year: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
  leetcode_url?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  highlights: string[];
  created_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
}

export interface Experience {
  id: number;
  intern_id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export interface Certificate {
  id: number;
  credential_id: string | null;
  title: string;
  provider: string;
  issue_date: string | null;
  url: string | null;
}

export interface GuestbookMessage {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
}

// Password hashing helper
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateToken(email: string): string {
  const secret = process.env.ADMIN_JWT_SECRET || 'neon_portfolio_secret_key_saran_2026';
  const data = `${email}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(`${data}:${hmac}`).toString('base64');
}

export function verifyToken(token: string): string | null {
  try {
    const secret = process.env.ADMIN_JWT_SECRET || 'neon_portfolio_secret_key_saran_2026';
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [email, timestamp, hmac] = parts;
    const expectedHmac = crypto.createHmac('sha256', secret).update(`${email}:${timestamp}`).digest('hex');
    if (hmac !== expectedHmac) return null;
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 30 * 24 * 60 * 60 * 1000) return null;
    return email;
  } catch {
    return null;
  }
}

// Queries
export async function fetchProfile(): Promise<Profile | null> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.profile ORDER BY id ASC LIMIT 1');
  return res.rows[0] || null;
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const pool = getPool();
  const res = await pool.query(`
    UPDATE public.profile SET
      full_name = COALESCE($1, full_name),
      title = COALESCE($2, title),
      headline = COALESCE($3, headline),
      bio = COALESCE($4, bio),
      email = COALESCE($5, email),
      phone = COALESCE($6, phone),
      location = COALESCE($7, location),
      college = COALESCE($8, college),
      degree = COALESCE($9, degree),
      graduation_year = COALESCE($10, graduation_year),
      github_url = COALESCE($11, github_url),
      linkedin_url = COALESCE($12, linkedin_url),
      website_url = COALESCE($13, website_url),
      updated_at = NOW()
    WHERE id = 1
    RETURNING *;
  `, [
    data.full_name, data.title, data.headline, data.bio,
    data.email, data.phone, data.location, data.college,
    data.degree, data.graduation_year, data.github_url,
    data.linkedin_url, data.website_url
  ]);
  return res.rows[0];
}

export async function fetchProjects(): Promise<Project[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.projects ORDER BY id ASC');
  return res.rows;
}

export async function fetchSkills(): Promise<Skill[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.skills ORDER BY category ASC, id ASC');
  return res.rows;
}

export async function fetchExperience(): Promise<Experience[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.experience ORDER BY id ASC');
  return res.rows;
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.certificates ORDER BY id ASC');
  return res.rows;
}

export async function fetchGuestbookMessages(): Promise<GuestbookMessage[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.guestbook_messages ORDER BY created_at DESC LIMIT 50');
  return res.rows;
}

export async function insertGuestbookMessage(name: string, email: string | null, message: string): Promise<GuestbookMessage> {
  const pool = getPool();
  const res = await pool.query(
    'INSERT INTO public.guestbook_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
    [name, email, message]
  );
  return res.rows[0];
}

// Admin CRUD
export async function createProject(p: Omit<Project, 'id'>): Promise<Project> {
  const pool = getPool();
  const res = await pool.query(`
    INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, highlights)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `, [p.title, p.description, p.tech_stack, p.github_url, p.live_url, p.highlights]);
  return res.rows[0];
}

export async function updateProject(id: number, p: Partial<Project>): Promise<Project> {
  const pool = getPool();
  const res = await pool.query(`
    UPDATE public.projects SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      tech_stack = COALESCE($3, tech_stack),
      github_url = COALESCE($4, github_url),
      live_url = COALESCE($5, live_url),
      highlights = COALESCE($6, highlights)
    WHERE id = $7
    RETURNING *;
  `, [p.title, p.description, p.tech_stack, p.github_url, p.live_url, p.highlights, id]);
  return res.rows[0];
}

export async function deleteProject(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM public.projects WHERE id = $1', [id]);
}

export async function createExperience(e: Omit<Experience, 'id'>): Promise<Experience> {
  const pool = getPool();
  const res = await pool.query(`
    INSERT INTO public.experience (intern_id, role, company, period, location, description)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `, [e.intern_id, e.role, e.company, e.period, e.location, e.description]);
  return res.rows[0];
}

export async function updateExperience(id: number, e: Partial<Experience>): Promise<Experience> {
  const pool = getPool();
  const res = await pool.query(`
    UPDATE public.experience SET
      intern_id = COALESCE($1, intern_id),
      role = COALESCE($2, role),
      company = COALESCE($3, company),
      period = COALESCE($4, period),
      location = COALESCE($5, location),
      description = COALESCE($6, description)
    WHERE id = $7
    RETURNING *;
  `, [e.intern_id, e.role, e.company, e.period, e.location, e.description, id]);
  return res.rows[0];
}

export async function deleteExperience(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM public.experience WHERE id = $1', [id]);
}

export async function createSkill(s: Omit<Skill, 'id'>): Promise<Skill> {
  const pool = getPool();
  const res = await pool.query(`
    INSERT INTO public.skills (name, category, level)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [s.name, s.category, s.level || 'Proficient']);
  return res.rows[0];
}

export async function deleteSkill(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM public.skills WHERE id = $1', [id]);
}

export async function createCertificate(c: Omit<Certificate, 'id'>): Promise<Certificate> {
  const pool = getPool();
  const res = await pool.query(`
    INSERT INTO public.certificates (credential_id, title, provider, issue_date, url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `, [c.credential_id, c.title, c.provider, c.issue_date, c.url]);
  return res.rows[0];
}

export async function updateCertificate(id: number, c: Partial<Certificate>): Promise<Certificate> {
  const pool = getPool();
  const res = await pool.query(`
    UPDATE public.certificates SET
      credential_id = COALESCE($1, credential_id),
      title = COALESCE($2, title),
      provider = COALESCE($3, provider),
      issue_date = COALESCE($4, issue_date),
      url = COALESCE($5, url)
    WHERE id = $6
    RETURNING *;
  `, [c.credential_id, c.title, c.provider, c.issue_date, c.url, id]);
  return res.rows[0];
}

export async function deleteCertificate(id: number): Promise<void> {
  const pool = getPool();
  await pool.query('DELETE FROM public.certificates WHERE id = $1', [id]);
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const pool = getPool();
  const hash = hashPassword(password);
  const res = await pool.query('SELECT * FROM public.admin_users WHERE email = $1 AND password_hash = $2', [email, hash]);
  return res.rows.length > 0;
}

export async function updateAdminPassword(email: string, newPassword: string): Promise<boolean> {
  const pool = getPool();
  const hash = hashPassword(newPassword);
  const res = await pool.query('UPDATE public.admin_users SET password_hash = $1 WHERE email = $2', [hash, email]);
  return (res.rowCount ?? 0) > 0;
}
