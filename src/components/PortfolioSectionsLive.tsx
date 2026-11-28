'use client';

import React, { useMemo } from 'react';
import InteractiveHero from '@/components/InteractiveHero';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsNucleus from '@/components/SkillsNucleus';
import CertificatesShowcase from '@/components/CertificatesShowcase';
import ActivityShowcase from '@/components/ActivityShowcase';
import ContactSection from '@/components/ContactSection';
import ScrollReveal from '@/components/ScrollReveal';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from '@/components/SocialIcons';
import { useRealtimeData } from '@/components/RealtimePortfolioProvider';
import { GitHubActivityData } from '@/services/github.service';
import { LeetCodeActivityData } from '@/services/leetcode.service';
import { ArrowUp, Mail, Lock, Phone } from 'lucide-react';
import Link from 'next/link';

interface PortfolioSectionsLiveProps {
  initialGithubData?: GitHubActivityData;
  initialLeetcodeData?: LeetCodeActivityData;
}

export default function PortfolioSectionsLive({
  initialGithubData,
  initialLeetcodeData,
}: PortfolioSectionsLiveProps) {
  const { profile, projects, skills, experience, certificates, isRealtimeConnected, dataSource } =
    useRealtimeData();

  const flagshipProject = useMemo(
    () => projects.find((p) => p.title.toLowerCase().includes('arthax')) || projects[0],
    [projects]
  );

  // Extract core coursework dynamically from real-time database skills
  const coreCoursework = skills
    .filter((s) => s.category === 'Core CS Fundamentals')
    .map((s) => s.name);
  const displayedCoursework =
    coreCoursework.length > 0
      ? coreCoursework
      : [
          'Data Structures & Algorithms',
          'Object-Oriented Programming (Java)',
          'Database Management Systems (DBMS)',
          'Operating Systems',
          'Computer Networks & Protocols',
          'Software Engineering (SDLC)',
        ];

  return (
    <>
      {/* Hero Section */}
      <InteractiveHero
        profile={profile}
        flagshipProject={flagshipProject}
        projectCount={projects.length}
        certCount={certificates.length}
        internshipCount={experience.length}
      />

      {/* Featured Projects Section */}
      <section id="projects" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  Featured Projects
                </h2>
                <span className="inline-flex items-center rounded-md border border-[#222838] bg-[#121520] px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Full-stack platforms, computer vision pipelines, and natural language processing applications.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  Experience &amp; Education
                </h2>
                <span className="inline-flex items-center rounded-md border border-[#222838] bg-[#121520] px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                  {experience.length} {experience.length === 1 ? 'role' : 'roles'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Hands-on engineering internships, cloud infrastructure deployments, and core academic foundations.
              </p>
            </div>
            <ExperienceTimeline
              experience={experience}
              profile={profile}
              displayedCoursework={displayedCoursework}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  Technical Tooling
                </h2>
                <span className="inline-flex items-center rounded-md border border-[#222838] bg-[#121520] px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                  {skills.length} skills tracked
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Core technologies used in production applications, deep learning architectures, and cloud deployments.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <SkillsNucleus skills={skills} />
          </ScrollReveal>
        </div>
      </section>

      {/* Engineering Activity Section (GitHub & LeetCode) */}
      <section id="activity" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Activity &amp; Problem Solving
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Open-source contributions on GitHub and algorithmic problem-solving on LeetCode.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <ActivityShowcase
              initialGithubData={initialGithubData}
              initialLeetcodeData={initialLeetcodeData}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  Certifications
                </h2>
                <span className="inline-flex items-center rounded-md border border-[#222838] bg-[#121520] px-2 py-0.5 text-[11px] font-mono text-zinc-400">
                  {certificates.length} verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Professional certifications across cloud computing, machine learning, and software development.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <CertificatesShowcase certificates={certificates} />
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Get in Touch
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Open to full-time software engineering roles, AI/ML opportunities, and collaborative discussions.
              </p>
            </div>
            <ContactSection profile={profile} />
          </ScrollReveal>
        </div>
      </section>

      {/* Compact Minimal Footer */}
      <footer className="border-t border-[#1b1f2b] bg-[#090a0f] py-7 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-zinc-400 text-xs">
            <span className="text-zinc-500">
              © {new Date().getFullYear()}
            </span>
            <Link
              href="/"
              className="font-semibold text-zinc-200 tracking-tight hover:text-emerald-400 transition-colors"
            >
              {profile.full_name === 'SARAN R' ? 'Saran R' : profile.full_name || 'Saran R'}
            </Link>
            <span className="text-zinc-600" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isRealtimeConnected
                    ? 'bg-emerald-400'
                    : dataSource === 'database'
                    ? 'bg-amber-400'
                    : 'bg-sky-400'
                }`}
              />
              <span>
                {isRealtimeConnected
                  ? 'Neon Live Sync'
                  : dataSource === 'database'
                  ? 'Reconnecting Sync'
                  : 'Next.js 16'}
              </span>
            </span>
            <span className="text-zinc-600" aria-hidden="true">
              ·
            </span>
            <Link
              href="/admin"
              className="text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[11px] font-mono"
              title="Admin Portal"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.github_url || 'https://github.com/technosaran'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              title="GitHub"
              aria-label="GitHub profile"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-sky-400 transition-colors"
              title="LinkedIn"
              aria-label="LinkedIn profile"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-400 transition-colors"
              title="LeetCode"
              aria-label="LeetCode profile"
            >
              <LeetCodeIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
              title={`Email ${profile.email}`}
              aria-label="Send email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s+/g, '')}`}
              className="text-zinc-400 hover:text-sky-300 transition-colors sm:hidden"
              title={`Call ${profile.phone}`}
              aria-label="Call phone number"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>

          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-100 transition-colors whitespace-nowrap"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </>
  );
}
