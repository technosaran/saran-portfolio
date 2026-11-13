import { getDbPool } from '@/lib/db';
import { profileService } from '@/services/profile.service';
import { projectsService } from '@/services/projects.service';
import { skillsService } from '@/services/skills.service';
import { experienceService } from '@/services/experience.service';
import { certificatesService } from '@/services/certificates.service';
import { authService } from '@/services/auth.service';
import { createSession, validateSession } from '@/lib/auth/session';
import { hashPassword as hashWithScrypt } from '@/lib/auth/password';
import { normalizeArray } from '@/lib/utils/arrays';
import type { Pool } from 'pg';

export { normalizeArray };

export function getPool(): Pool {
  return getDbPool();
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
  leetcode_url?: string | null;
  updated_at?: Date | string | null;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  highlights: string[] | null;
  created_at?: Date | string | null;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: string | null;
  created_at?: Date | string | null;
}

export interface Experience {
  id: number;
  intern_id: string;
  role: string;
  company: string;
  period: string;
  location: string | null;
  description: string[] | null;
  created_at?: Date | string | null;
}

export interface Certificate {
  id: number;
  credential_id: string | null;
  title: string;
  provider: string;
  issue_date: string | null;
  url: string | null;
  created_at?: Date | string | null;
}

export interface GuestbookMessage {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at?: Date | string | null;
}

// Profile queries
export async function fetchProfile(): Promise<Profile | null> {
  return profileService.getProfile();
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const { id: _, updated_at, ...rest } = data;
  void _;
  return profileService.updateProfile({
    ...rest,
    ...(updated_at ? { updated_at: new Date(updated_at) } : {}),
  });
}

// Projects queries
export async function fetchProjects(): Promise<Project[]> {
  return projectsService.getAllProjects();
}

export async function createProject(p: Omit<Project, 'id'>): Promise<Project> {
  const { created_at, ...rest } = p;
  return projectsService.createProject({
    ...rest,
    ...(created_at ? { created_at: new Date(created_at) } : {}),
  });
}

export async function updateProject(id: number, p: Partial<Project>): Promise<Project> {
  const { id: _, created_at, ...rest } = p;
  void _;
  return projectsService.updateProject(id, {
    ...rest,
    ...(created_at ? { created_at: new Date(created_at) } : {}),
  });
}

export async function deleteProject(id: number): Promise<boolean> {
  return projectsService.deleteProject(id);
}

// Skills queries
export async function fetchSkills(): Promise<Skill[]> {
  return skillsService.getAllSkills();
}

export async function createSkill(s: Omit<Skill, 'id'>): Promise<Skill> {
  return skillsService.createSkill({
    name: s.name,
    category: s.category,
    level: s.level || 'Proficient',
  });
}

export async function updateSkill(id: number, s: Partial<Skill>): Promise<Skill> {
  const { id: _, created_at, ...rest } = s;
  void _;
  return skillsService.updateSkill(id, {
    ...rest,
    ...(created_at ? { created_at: new Date(created_at) } : {}),
  });
}

export async function deleteSkill(id: number): Promise<boolean> {
  return skillsService.deleteSkill(id);
}

// Experience queries
export async function fetchExperience(): Promise<Experience[]> {
  return experienceService.getAllExperience();
}

export async function createExperience(e: Omit<Experience, 'id'>): Promise<Experience> {
  return experienceService.createExperience({
    intern_id: e.intern_id,
    role: e.role,
    company: e.company,
    period: e.period,
    location: e.location || null,
    description: e.description || [],
  });
}

export async function updateExperience(id: number, e: Partial<Experience>): Promise<Experience> {
  const { id: _, created_at, ...rest } = e;
  void _;
  return experienceService.updateExperience(id, {
    ...rest,
    ...(created_at ? { created_at: new Date(created_at) } : {}),
  });
}

export async function deleteExperience(id: number): Promise<boolean> {
  return experienceService.deleteExperience(id);
}

// Certificates queries
export async function fetchCertificates(): Promise<Certificate[]> {
  return certificatesService.getAllCertificates();
}

export async function createCertificate(c: Omit<Certificate, 'id'>): Promise<Certificate> {
  return certificatesService.createCertificate({
    credential_id: c.credential_id || null,
    title: c.title,
    provider: c.provider,
    issue_date: c.issue_date || null,
    url: c.url || null,
  });
}

export async function updateCertificate(id: number, c: Partial<Certificate>): Promise<Certificate> {
  const { id: _, created_at, ...rest } = c;
  void _;
  return certificatesService.updateCertificate(id, {
    ...rest,
    ...(created_at ? { created_at: new Date(created_at) } : {}),
  });
}

export async function deleteCertificate(id: number): Promise<boolean> {
  return certificatesService.deleteCertificate(id);
}

// Admin Authentication queries
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const result = await authService.authenticate(email, password);
  return result.success;
}

export async function updateAdminPassword(email: string, newPassword: string): Promise<boolean> {
  return authService.changePassword(email, newPassword);
}

export async function generateToken(email: string): Promise<string> {
  return createSession(email);
}

export async function verifyToken(token: string): Promise<string | null> {
  const result = await validateSession(token);
  return result.valid ? result.email || null : null;
}

export async function hashPassword(password: string): Promise<string> {
  return hashWithScrypt(password);
}
