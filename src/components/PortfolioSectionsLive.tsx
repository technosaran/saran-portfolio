'use client';

import React from 'react';
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
import { ArrowUp, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

interface PortfolioSectionsLiveProps {
  initialGithubData?: GitHubActivityData;
  initialLeetcodeData?: LeetCodeActivityData;
}

export default function PortfolioSectionsLive({
  initialGithubData,
  initialLeetcodeData,
}: PortfolioSectionsLiveProps) {
  const { profile, projects, skills, experience, certificates, isRealtimeConnected } = useRealtimeData();

  // Extract core coursework dynamically from real-time database skills
  const coreCoursework = skills
    .filter((s) => s.category === 'Core CS Fundamentals')
    .map((s) => s.name);
  const displayedCoursework = coreCoursework.length > 0 ? coreCoursework : [
    'Data Structures & Algorithms',
    'Object-Oriented Programming (Java)',
    'Database Management Systems (DBMS)',
    'Operating Systems',
    'Computer Networks & Protocols',
    'Software Engineering (SDLC)'
  ];

  return (
    <>
      {/* Realtime Status Live Indicator Badge */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center gap-2 rounded-full border border-[#23293a] bg-[#0c0e15]/90 px-3 py-1.5 shadow-2xl backdrop-blur-md text-[11px] font-mono select-none">
        <span className="relative flex h-2 w-2">
          {isRealtimeConnected ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          )}
        </span>
        <span className="text-zinc-300">
          {isRealtimeConnected ? 'Live Real-Time Sync' : 'Reconnecting Sync...'}
        </span>
      </div>

      {/* Hero Section */}
      <InteractiveHero 
        profile={profile} 
        projectCount={projects.length} 
        certCount={certificates.length} 
        internshipCount={experience.length} 
      />

      {/* Featured Projects Section */}
      <section id="projects" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="flex items-center gap-2">
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

          <ScrollReveal delay={100}>
            <ProjectsShowcase projects={projects} />
          </ScrollReveal>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="py-14 md:py-20 border-b border-[#1b1f2b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-8 space-y-1">
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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

          <ScrollReveal delay={100}>
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

          <ScrollReveal delay={100}>
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
              <div className="flex items-center gap-2">
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

          <ScrollReveal delay={100}>
            <CertificatesShowcase certificates={certificates} />
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-14 md:py-20 border-b border-[#1b1f2b]">
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
      <footer className="border-t border-[#1b1f2b] bg-[#090a0f] py-6 text-xs text-zinc-400">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span className="font-semibold text-zinc-200 tracking-tight">
              {profile.full_name || 'SARAN R'}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] font-mono text-zinc-500">
              Next.js 16 &amp; Neon Live Sync
            </span>
            <span className="text-zinc-600">·</span>
            <Link
              href="/admin"
              className="text-zinc-600 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[11px] font-mono"
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
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-sky-400 transition-colors"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-400 transition-colors"
              title="LeetCode"
              aria-label="LeetCode"
            >
              <LeetCodeIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
              title="Email"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </>
  );
}
