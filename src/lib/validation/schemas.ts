import { z } from 'zod';

// Helper: Transforms comma- or newline-delimited strings or arrays into a clean string array
export const stringArraySchema = z.union([
  z.array(z.string().trim().min(1)),
  z.string().transform((val) =>
    val
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  ),
]).default([]);

// Helper: Safely handles optional URL strings (converting empty/whitespace strings to null)
export const optionalUrlSchema = z.preprocess(
  (val) => {
    if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
      return null;
    }
    return typeof val === 'string' ? val.trim() : val;
  },
  z.string().url('Invalid URL format').nullable().optional()
);

// 1. Admin Authentication Schemas
export const adminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// 2. Profile Schemas
export const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required').optional(),
  title: z.string().trim().min(2, 'Title is required').optional(),
  headline: z.string().trim().min(2, 'Headline is required').optional(),
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters').optional(),
  email: z.string().trim().email('Invalid email address').optional(),
  phone: z.string().trim().min(5, 'Invalid phone number').optional(),
  location: z.string().trim().min(2, 'Location is required').optional(),
  college: z.string().trim().min(2, 'College is required').optional(),
  degree: z.string().trim().min(2, 'Degree is required').optional(),
  graduation_year: z.string().trim().min(4, 'Graduation year is required').optional(),
  github_url: z.string().trim().url('Invalid GitHub URL').optional(),
  linkedin_url: z.string().trim().url('Invalid LinkedIn URL').optional(),
  website_url: z.string().trim().url('Invalid website URL').optional(),
  leetcode_url: optionalUrlSchema,
});

// 3. Project Schemas
export const projectCreateSchema = z.object({
  title: z.string().trim().min(2, 'Project title is required'),
  description: z.string().trim().min(5, 'Project description is required'),
  tech_stack: stringArraySchema,
  github_url: optionalUrlSchema,
  live_url: optionalUrlSchema,
  highlights: stringArraySchema,
});

export const projectUpdateSchema = projectCreateSchema.partial();

// 4. Skill Schemas
export const skillCreateSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required'),
  category: z.string().trim().min(2, 'Category is required'),
  level: z.string().trim().default('Proficient'),
});

export const skillUpdateSchema = skillCreateSchema.partial();

// 5. Experience Schemas
export const experienceCreateSchema = z.object({
  intern_id: z.string().trim().min(2, 'Internship ID is required'),
  role: z.string().trim().min(2, 'Role title is required'),
  company: z.string().trim().min(2, 'Company name is required'),
  period: z.string().trim().min(2, 'Period is required'),
  location: z.string().trim().nullable().optional(),
  description: stringArraySchema,
});

export const experienceUpdateSchema = experienceCreateSchema.partial();

// 6. Certificate Schemas
export const certificateCreateSchema = z.object({
  credential_id: z.string().trim().nullable().optional().or(z.literal('')),
  title: z.string().trim().min(2, 'Certificate title is required'),
  provider: z.string().trim().min(2, 'Provider name is required'),
  issue_date: z.string().trim().nullable().optional().or(z.literal('')),
  url: optionalUrlSchema,
});

export const certificateUpdateSchema = certificateCreateSchema.partial();

// 7. Guestbook Schema
export const guestbookSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address').nullable().optional(),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(1000, 'Message cannot exceed 1000 characters'),
});
