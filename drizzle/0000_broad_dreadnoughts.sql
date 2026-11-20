CREATE TABLE "admin_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_token" text NOT NULL,
	"admin_email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_agent" text,
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"credential_id" text,
	"title" text NOT NULL,
	"provider" text NOT NULL,
	"issue_date" text,
	"url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"intern_id" text NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"period" text NOT NULL,
	"location" text,
	"description" text[],
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guestbook_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"title" text NOT NULL,
	"headline" text NOT NULL,
	"bio" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"location" text NOT NULL,
	"college" text NOT NULL,
	"degree" text NOT NULL,
	"graduation_year" text NOT NULL,
	"github_url" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"website_url" text NOT NULL,
	"leetcode_url" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tech_stack" text[] NOT NULL,
	"github_url" text,
	"live_url" text,
	"highlights" text[],
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"level" text DEFAULT 'Proficient',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_sessions_token_key" ON "admin_sessions" USING btree ("session_token");--> statement-breakpoint
CREATE INDEX "admin_sessions_email_idx" ON "admin_sessions" USING btree ("admin_email");--> statement-breakpoint
CREATE INDEX "admin_sessions_expires_idx" ON "admin_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "certificates_title_provider_idx" ON "certificates" USING btree ("title","provider");--> statement-breakpoint
CREATE INDEX "certificates_credential_id_idx" ON "certificates" USING btree ("credential_id");--> statement-breakpoint
CREATE UNIQUE INDEX "experience_intern_id_key" ON "experience" USING btree ("intern_id");--> statement-breakpoint
CREATE INDEX "experience_role_company_idx" ON "experience" USING btree ("role","company");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_github_url_key" ON "projects" USING btree ("github_url");--> statement-breakpoint
CREATE INDEX "projects_id_asc_idx" ON "projects" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_name_key" ON "skills" USING btree ("name");--> statement-breakpoint
CREATE INDEX "skills_category_id_idx" ON "skills" USING btree ("category","id");