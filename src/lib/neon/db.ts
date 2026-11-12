import { Pool } from 'pg';
import crypto from 'crypto';

// Cache pool globally for Next.js hot reload in development & serverless lambdas
declare global {
  var __neon_pool: Pool | undefined;
}

function getNormalizedConnectionString(): string {
  const url = process.env.DATABASE_URL || '';
  if (!url) return '';
  // Normalize sslmode=require to sslmode=verify-full to avoid pg/pg-connection-string security deprecation warning
  return url.replace(/([?&])sslmode=require\b/g, '$1sslmode=verify-full');
}

export function getPool(): Pool {
  const connectionString = getNormalizedConnectionString();
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  if (!global.__neon_pool) {
    global.__neon_pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Handle unexpected idle client errors gracefully without crashing the Node.js process
    global.__neon_pool.on('error', (err) => {
      console.error('Unexpected error on idle Neon PostgreSQL client:', err);
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

// Helper: Normalize string or array inputs into a clean string array for PostgreSQL text[]
export function normalizeArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

// Password hashing helper
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Constant-time HMAC token generator
export function generateToken(email: string): string {
  const secret = process.env.ADMIN_JWT_SECRET || 'neon_portfolio_secret_key_saran_2026';
  const data = `${email}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(`${data}:${hmac}`).toString('base64');
}

// Constant-time HMAC token verification
export function verifyToken(token: string): string | null {
  try {
    const secret = process.env.ADMIN_JWT_SECRET || 'neon_portfolio_secret_key_saran_2026';
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const lastColonIndex = decoded.lastIndexOf(':');
    if (lastColonIndex === -1) return null;

    const hmac = decoded.slice(lastColonIndex + 1);
    const data = decoded.slice(0, lastColonIndex);
    const firstColonIndex = data.indexOf(':');
    if (firstColonIndex === -1) return null;

    const email = data.slice(0, firstColonIndex);
    const timestampStr = data.slice(firstColonIndex + 1);
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return null;

    const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
    const hmacBuf = Buffer.from(hmac, 'hex');
    const expectedBuf = Buffer.from(expectedHmac, 'hex');

    // Constant-time comparison to prevent timing attacks
    if (hmacBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(hmacBuf, expectedBuf)) {
      return null;
    }

    const age = Date.now() - timestamp;
    // Disallow future tokens (>1 minute skew) or expired tokens (>30 days)
    if (age < -60000 || age > 30 * 24 * 60 * 60 * 1000) return null;

    return email;
  } catch {
    return null;
  }
}

// Queries: Profile
export async function fetchProfile(): Promise<Profile | null> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.profile ORDER BY id ASC LIMIT 1');
  return res.rows[0] || null;
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const pool = getPool();
  
  // Use subquery to guarantee updating the active primary profile regardless of ID sequence
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
      leetcode_url = COALESCE($14, leetcode_url),
      updated_at = NOW()
    WHERE id = (SELECT id FROM public.profile ORDER BY id ASC LIMIT 1)
    RETURNING *;
  `, [
    data.full_name ?? null, data.title ?? null, data.headline ?? null, data.bio ?? null,
    data.email ?? null, data.phone ?? null, data.location ?? null, data.college ?? null,
    data.degree ?? null, data.graduation_year ?? null, data.github_url ?? null,
    data.linkedin_url ?? null, data.website_url ?? null, data.leetcode_url ?? null
  ]);

  if (res.rows.length === 0) {
    // If profile table is empty, initialize default record
    const insertRes = await pool.query(`
      INSERT INTO public.profile (
        full_name, title, headline, bio, email, phone, location, college, degree, graduation_year, github_url, linkedin_url, website_url, leetcode_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `, [
      data.full_name || 'SARAN R',
      data.title || 'Artificial Intelligence & Machine Learning Engineer',
      data.headline || 'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect',
      data.bio || 'Innovative AI/ML engineering student with hands-on experience in AWS cloud and full-stack development.',
      data.email || 'iamsaran.ai@gmail.com',
      data.phone || '+91 6384957740',
      data.location || 'Chennai, Tamil Nadu',
      data.college || 'Panimalar Engineering College',
      data.degree || 'Bachelor of Technology in Artificial Intelligence and Machine Learning',
      data.graduation_year || '2023 – 2027',
      data.github_url || 'https://github.com/technosaran',
      data.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275',
      data.website_url || 'https://technosaran.vercel.app',
      data.leetcode_url || 'https://leetcode.com/u/technosaran/'
    ]);
    return insertRes.rows[0];
  }

  return res.rows[0];
}

// Queries: Projects
export async function fetchProjects(): Promise<Project[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.projects ORDER BY id ASC');
  return res.rows;
}

export async function createProject(p: Omit<Project, 'id'>): Promise<Project> {
  const pool = getPool();
  const techStack = normalizeArray(p.tech_stack);
  const highlights = normalizeArray(p.highlights);

  // WHERE NOT EXISTS duplicate check as mandated by portfolio database rules
  const res = await pool.query(`
    INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, highlights)
    SELECT $1, $2, $3, $4, $5, $6
    WHERE NOT EXISTS (
      SELECT 1 FROM public.projects 
      WHERE ($4::text IS NOT NULL AND $4::text <> '' AND github_url = $4)
         OR LOWER(title) = LOWER($1)
    )
    RETURNING *;
  `, [p.title, p.description, techStack, p.github_url || null, p.live_url || null, highlights]);

  if (res.rows.length === 0) {
    const existing = await pool.query(
      'SELECT * FROM public.projects WHERE ($1::text IS NOT NULL AND $1::text <> \'\' AND github_url = $1) OR LOWER(title) = LOWER($2) LIMIT 1',
      [p.github_url || null, p.title]
    );
    if (existing.rows[0]) return existing.rows[0];
    throw new Error('Project with this title or repository URL already exists');
  }

  return res.rows[0];
}

export async function updateProject(id: number, p: Partial<Project>): Promise<Project> {
  const pool = getPool();
  const techStack = p.tech_stack !== undefined ? normalizeArray(p.tech_stack) : null;
  const highlights = p.highlights !== undefined ? normalizeArray(p.highlights) : null;

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
  `, [
    p.title ?? null,
    p.description ?? null,
    techStack,
    p.github_url !== undefined ? p.github_url : null,
    p.live_url !== undefined ? p.live_url : null,
    highlights,
    id
  ]);

  if (res.rows.length === 0) {
    throw new Error(`Project with ID ${id} not found`);
  }

  return res.rows[0];
}

export async function deleteProject(id: number): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query('DELETE FROM public.projects WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// Queries: Skills
export async function fetchSkills(): Promise<Skill[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.skills ORDER BY category ASC, id ASC');
  return res.rows;
}

export async function createSkill(s: Omit<Skill, 'id'>): Promise<Skill> {
  const pool = getPool();

  // WHERE NOT EXISTS duplicate check on name
  const res = await pool.query(`
    INSERT INTO public.skills (name, category, level)
    SELECT $1, $2, $3
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills 
      WHERE LOWER(name) = LOWER($1)
    )
    RETURNING *;
  `, [s.name, s.category, s.level || 'Proficient']);

  if (res.rows.length === 0) {
    const existing = await pool.query(
      'SELECT * FROM public.skills WHERE LOWER(name) = LOWER($1) LIMIT 1',
      [s.name]
    );
    if (existing.rows[0]) return existing.rows[0];
    throw new Error(`Skill "${s.name}" already exists`);
  }

  return res.rows[0];
}

export async function updateSkill(id: number, s: Partial<Skill>): Promise<Skill> {
  const pool = getPool();
  const res = await pool.query(`
    UPDATE public.skills SET
      name = COALESCE($1, name),
      category = COALESCE($2, category),
      level = COALESCE($3, level)
    WHERE id = $4
    RETURNING *;
  `, [s.name ?? null, s.category ?? null, s.level ?? null, id]);

  if (res.rows.length === 0) {
    throw new Error(`Skill with ID ${id} not found`);
  }

  return res.rows[0];
}

export async function deleteSkill(id: number): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query('DELETE FROM public.skills WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// Queries: Experience
export async function fetchExperience(): Promise<Experience[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.experience ORDER BY id ASC');
  return res.rows;
}

export async function createExperience(e: Omit<Experience, 'id'>): Promise<Experience> {
  const pool = getPool();
  const description = normalizeArray(e.description);

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
  `, [e.intern_id, e.role, e.company, e.period, e.location, description]);

  if (res.rows.length === 0) {
    const existing = await pool.query(
      'SELECT * FROM public.experience WHERE intern_id = $1 OR (LOWER(role) = LOWER($2) AND LOWER(company) = LOWER($3)) LIMIT 1',
      [e.intern_id, e.role, e.company]
    );
    if (existing.rows[0]) return existing.rows[0];
    throw new Error('Experience record with this ID or role already exists');
  }

  return res.rows[0];
}

export async function updateExperience(id: number, e: Partial<Experience>): Promise<Experience> {
  const pool = getPool();
  const description = e.description !== undefined ? normalizeArray(e.description) : null;

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
  `, [
    e.intern_id ?? null,
    e.role ?? null,
    e.company ?? null,
    e.period ?? null,
    e.location ?? null,
    description,
    id
  ]);

  if (res.rows.length === 0) {
    throw new Error(`Experience with ID ${id} not found`);
  }

  return res.rows[0];
}

export async function deleteExperience(id: number): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query('DELETE FROM public.experience WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// Queries: Certificates
export async function fetchCertificates(): Promise<Certificate[]> {
  const pool = getPool();
  const res = await pool.query('SELECT * FROM public.certificates ORDER BY id ASC');
  return res.rows;
}

export async function createCertificate(c: Omit<Certificate, 'id'>): Promise<Certificate> {
  const pool = getPool();

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
  `, [c.credential_id || null, c.title, c.provider, c.issue_date || null, c.url || null]);

  if (res.rows.length === 0) {
    const existing = await pool.query(
      'SELECT * FROM public.certificates WHERE ($1::text IS NOT NULL AND $1::text <> \'\' AND credential_id = $1) OR (LOWER(title) = LOWER($2) AND LOWER(provider) = LOWER($3)) LIMIT 1',
      [c.credential_id || null, c.title, c.provider]
    );
    if (existing.rows[0]) return existing.rows[0];
    throw new Error('Certificate with this credential ID or title already exists');
  }

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
  `, [
    c.credential_id !== undefined ? c.credential_id : null,
    c.title ?? null,
    c.provider ?? null,
    c.issue_date !== undefined ? c.issue_date : null,
    c.url !== undefined ? c.url : null,
    id
  ]);

  if (res.rows.length === 0) {
    throw new Error(`Certificate with ID ${id} not found`);
  }

  return res.rows[0];
}

export async function deleteCertificate(id: number): Promise<boolean> {
  const pool = getPool();
  const res = await pool.query('DELETE FROM public.certificates WHERE id = $1', [id]);
  return (res.rowCount ?? 0) > 0;
}

// Queries: Admin Authentication
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const pool = getPool();
  const inputHash = hashPassword(password);
  const res = await pool.query(
    'SELECT password_hash FROM public.admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1',
    [email]
  );
  if (res.rows.length === 0) return false;

  const storedHash = res.rows[0].password_hash;
  const inputBuf = Buffer.from(inputHash, 'hex');
  const storedBuf = Buffer.from(storedHash, 'hex');

  // Constant-time comparison protects against timing analysis
  if (inputBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(inputBuf, storedBuf);
}

export async function updateAdminPassword(email: string, newPassword: string): Promise<boolean> {
  const pool = getPool();
  const hash = hashPassword(newPassword);
  const res = await pool.query(
    'UPDATE public.admin_users SET password_hash = $1 WHERE LOWER(email) = LOWER($2)',
    [hash, email]
  );
  return (res.rowCount ?? 0) > 0;
}
