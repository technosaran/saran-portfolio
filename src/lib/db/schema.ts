import { pgTable, serial, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

// 1. Admin Users Table
export const adminUsers = pgTable(
  'admin_users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    password_hash: text('password_hash').notNull(),
    role: text('role').default('admin'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('admin_users_email_key').on(table.email),
  ]
);

// 2. Admin Sessions Table (Database-backed session management & instant invalidation)
export const adminSessions = pgTable(
  'admin_sessions',
  {
    id: serial('id').primaryKey(),
    session_token: text('session_token').notNull(),
    admin_email: text('admin_email').notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    user_agent: text('user_agent'),
    ip_address: text('ip_address'),
  },
  (table) => [
    uniqueIndex('admin_sessions_token_key').on(table.session_token),
    index('admin_sessions_email_idx').on(table.admin_email),
    index('admin_sessions_expires_idx').on(table.expires_at),
  ]
);

// 3. Profile Table
export const profile = pgTable(
  'profile',
  {
    id: serial('id').primaryKey(),
    full_name: text('full_name').notNull(),
    title: text('title').notNull(),
    headline: text('headline').notNull(),
    bio: text('bio').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    location: text('location').notNull(),
    college: text('college').notNull(),
    degree: text('degree').notNull(),
    graduation_year: text('graduation_year').notNull(),
    github_url: text('github_url').notNull(),
    linkedin_url: text('linkedin_url').notNull(),
    website_url: text('website_url').notNull(),
    leetcode_url: text('leetcode_url'),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  }
);

// 4. Projects Table
export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    tech_stack: text('tech_stack').array().notNull(),
    github_url: text('github_url'),
    live_url: text('live_url'),
    highlights: text('highlights').array(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('projects_github_url_key').on(table.github_url),
    index('projects_id_asc_idx').on(table.id),
  ]
);

// 5. Skills Table
export const skills = pgTable(
  'skills',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    level: text('level').default('Proficient'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('skills_name_key').on(table.name),
    index('skills_category_id_idx').on(table.category, table.id),
  ]
);

// 6. Experience Table
export const experience = pgTable(
  'experience',
  {
    id: serial('id').primaryKey(),
    intern_id: text('intern_id').notNull(),
    role: text('role').notNull(),
    company: text('company').notNull(),
    period: text('period').notNull(),
    location: text('location'),
    description: text('description').array(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('experience_intern_id_key').on(table.intern_id),
    index('experience_role_company_idx').on(table.role, table.company),
  ]
);

// 7. Certificates Table
export const certificates = pgTable(
  'certificates',
  {
    id: serial('id').primaryKey(),
    credential_id: text('credential_id'),
    title: text('title').notNull(),
    provider: text('provider').notNull(),
    issue_date: text('issue_date'),
    url: text('url'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('certificates_title_provider_idx').on(table.title, table.provider),
    index('certificates_credential_id_idx').on(table.credential_id),
  ]
);

// 8. Guestbook Messages Table
export const guestbookMessages = pgTable(
  'guestbook_messages',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email'),
    message: text('message').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  }
);

// Infer TypeScript Types directly from Schema
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;

export type ProfileRecord = typeof profile.$inferSelect;
export type NewProfileRecord = typeof profile.$inferInsert;

export type ProjectRecord = typeof projects.$inferSelect;
export type NewProjectRecord = typeof projects.$inferInsert;

export type SkillRecord = typeof skills.$inferSelect;
export type NewSkillRecord = typeof skills.$inferInsert;

export type ExperienceRecord = typeof experience.$inferSelect;
export type NewExperienceRecord = typeof experience.$inferInsert;

export type CertificateRecord = typeof certificates.$inferSelect;
export type NewCertificateRecord = typeof certificates.$inferInsert;

export type GuestbookMessageRecord = typeof guestbookMessages.$inferSelect;
export type NewGuestbookMessageRecord = typeof guestbookMessages.$inferInsert;
