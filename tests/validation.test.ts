import { describe, it, expect } from 'vitest';
import {
  adminLoginSchema,
  changePasswordSchema,
  projectCreateSchema,
  skillCreateSchema,
  certificateCreateSchema,
} from '../src/lib/validation/schemas';

describe('Validation Schemas', () => {
  describe('adminLoginSchema', () => {
    it('validates a correct email and password', () => {
      const res = adminLoginSchema.safeParse({
        email: 'iamsaran.ai@gmail.com',
        password: 'secure_password_123',
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.email).toBe('iamsaran.ai@gmail.com');
      }
    });

    it('rejects an invalid email format', () => {
      const res = adminLoginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(res.success).toBe(false);
    });

    it('rejects empty password', () => {
      const res = adminLoginSchema.safeParse({
        email: 'iamsaran.ai@gmail.com',
        password: '',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('accepts passwords >= 8 characters', () => {
      const res = changePasswordSchema.safeParse({ newPassword: 'StrongPassword1!' });
      expect(res.success).toBe(true);
    });

    it('rejects passwords < 8 characters', () => {
      const res = changePasswordSchema.safeParse({ newPassword: 'short' });
      expect(res.success).toBe(false);
    });
  });

  describe('projectCreateSchema', () => {
    it('validates project payload and normalizes string tech stack', () => {
      const res = projectCreateSchema.safeParse({
        title: 'arthaX Terminal',
        description: 'Personal Wealth Platform',
        tech_stack: 'Next.js 16, TypeScript, Neon PostgreSQL',
        github_url: 'https://github.com/technosaran/arthax',
        live_url: 'https://arthax.vercel.app',
        highlights: ['Engineered secure PostgreSQL schemas', 'Designed dark UI'],
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.tech_stack).toEqual(['Next.js 16', 'TypeScript', 'Neon PostgreSQL']);
        expect(res.data.highlights.length).toBe(2);
      }
    });

    it('rejects empty project title', () => {
      const res = projectCreateSchema.safeParse({
        title: ' ',
        description: 'Valid description text here',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('skillCreateSchema', () => {
    it('accepts valid skill and defaults level to Proficient', () => {
      const res = skillCreateSchema.safeParse({
        name: 'Java 21',
        category: 'Programming Languages',
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.level).toBe('Proficient');
      }
    });
  });

  describe('certificateCreateSchema', () => {
    it('accepts valid certificate credentials', () => {
      const res = certificateCreateSchema.safeParse({
        credential_id: 'ORACLE-OCI-DS',
        title: 'Oracle Cloud Infrastructure Certified Data Science Professional',
        provider: 'Oracle University',
        issue_date: '2025',
      });
      expect(res.success).toBe(true);
    });

    it('handles empty or whitespace URL strings gracefully by converting to null', () => {
      const res = certificateCreateSchema.safeParse({
        title: 'Java Certification',
        provider: 'Infosys',
        url: '   ',
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.url).toBeNull();
      }
    });
  });
});
