'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  MapPin, 
  Mail,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile, Skill } from '@/lib/neon/db';

interface InteractiveHeroProps {
  profile: Profile;
  skills?: Skill[];
  projectCount?: number;
  certCount?: number;
  internshipCount?: number;
}

export default function InteractiveHero({ 
  profile, 
  skills = [], 
  projectCount = 3, 
  certCount = 6, 
  internshipCount = 2 
}: InteractiveHeroProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'metrics'>('profile');

  const handleCopyEmail = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback: silently ignore or handle without throwing unhandled rejection
      setCopied(false);
    }
  };

  // Derive dynamic stacks from database skills
  const dbLanguages = skills
    .filter((s) => s.category.toLowerCase().includes('language'))
    .map((s) => s.name);
  const languagesToDisplay = dbLanguages.length > 0 ? dbLanguages.slice(0, 5) : ['Java', 'Python', 'TypeScript', 'SQL'];

  const dbFrameworks = skills
    .filter((s) => s.category.toLowerCase().includes('framework') || s.category.toLowerCase().includes('ai'))
    .map((s) => s.name);
  const frameworksToDisplay = dbFrameworks.length > 0 ? dbFrameworks.slice(0, 4) : ['Next.js', 'PyTorch', 'OpenCV', 'React'];

  const dbDatabases = skills
    .filter((s) => s.category.toLowerCase().includes('database') || s.category.toLowerCase().includes('tool'))
    .map((s) => s.name);
  const databasesToDisplay = dbDatabases.length > 0 ? dbDatabases.slice(0, 3) : ['PostgreSQL', 'Supabase', 'MongoDB'];

  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/[0.08] bg-grid">
      {/* Refined ambient lighting: Deep indigo and soft sapphire blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Identity, Bio & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Beacon Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-mono font-medium text-blue-300 backdrop-blur-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </span>
              <span>Available for Software Engineering &amp; AI/ML Roles</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I&apos;m{' '}
                <span className="text-gradient-titanium">
                  {profile.full_name}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-blue-300/90">
                {profile.title}
              </p>
            </div>

            {/* Bio summary */}
            <p className="text-sm sm:text-base text-zinc-300/90 leading-relaxed max-w-2xl font-normal">
              {profile.bio}
            </p>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-300">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                {profile.location}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                {profile.college} ({profile.graduation_year})
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-5 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>View Projects</span>
                <ChevronRight className="h-4 w-4 text-zinc-950" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/40 px-5 py-3 text-xs font-semibold text-zinc-100 transition-all cursor-pointer backdrop-blur-xl"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>Contact Me</span>
              </a>

              {/* Instant Copy Email button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-xs font-mono font-medium text-blue-300 hover:bg-blue-500/20 transition-all cursor-pointer shadow-sm group"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-blue-400" />
                    <span className="font-semibold text-white">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-blue-400/80 group-hover:text-blue-300" />
                    <span>{profile.email}</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Icons row */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={profile.github_url || 'https://github.com/technosaran'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:border-blue-500/40 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="GitHub Profile"
              >
                <GithubIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-white hover:border-blue-500/40 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.leetcode_url || 'https://leetcode.com/u/technosaran/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/15 transition-all cursor-pointer"
                title="LeetCode (Java DSA)"
              >
                <LeetCodeIcon className="h-4 w-4" />
              </a>

              <span className="text-xs text-zinc-500 font-mono ml-2">
                @technosaran
              </span>
            </div>
          </div>

          {/* Right Column: Sleek Architectural Snapshot Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/[0.1] bg-[#0b0d14]/90 p-1 shadow-2xl backdrop-blur-xl">
              
              {/* Outer Glow */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent blur-xl opacity-60 -z-10" />

              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#08090e]/80 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">saran.config.ts</span>
                </div>

                {/* Tab selector */}
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06] text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('metrics')}
                    className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'metrics'
                        ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Highlights
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 font-mono text-xs leading-relaxed min-h-[300px] flex flex-col justify-between">
                {activeTab === 'profile' ? (
                  <div className="space-y-1.5 text-zinc-300">
                    <p className="text-zinc-500">{'// Engineering Profile & Core Stack (Database Synced)'}</p>
                    <p>
                      <span className="text-indigo-400">export const </span>
                      <span className="text-blue-400 font-bold">engineer</span>
                      <span className="text-zinc-400"> = </span>
                      <span className="text-zinc-100">{'{'}</span>
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-400">name</span>: <span className="text-zinc-100">&quot;{profile.full_name}&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-400">education</span>: <span className="text-zinc-300">&quot;{profile.degree} ({profile.graduation_year})&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-400">languages</span>: <span className="text-amber-300">[{languagesToDisplay.map(l => `"${l}"`).join(', ')}]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-400">frameworks</span>: <span className="text-indigo-300">[{frameworksToDisplay.map(f => `"${f}"`).join(', ')}]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-400">databases</span>: <span className="text-teal-300">[{databasesToDisplay.map(d => `"${d}"`).join(', ')}]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-sky-400">status</span>: <span className="text-emerald-400 font-semibold">&quot;Open to Engineering Roles&quot;</span>
                    </p>
                    <p className="text-zinc-100">{'}'};</p>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans">
                    <p className="text-xs font-mono text-zinc-500">{'// Verified Engineering Telemetry (Database Synced)'}</p>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                        <div className="text-xl font-bold font-mono text-blue-400">90+</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">LeetCode Solved</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Java DSA</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                        <div className="text-xl font-bold font-mono text-indigo-400">{projectCount}+</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">Core Projects</div>
                        <div className="text-[10px] text-zinc-500 font-mono">AI/ML &amp; Systems</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                        <div className="text-xl font-bold font-mono text-sky-400">{certCount}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">Certifications</div>
                        <div className="text-[10px] text-zinc-500 font-mono">AWS, Oracle, IBM</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
                        <div className="text-xl font-bold font-mono text-amber-400">{internshipCount}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">Applied Internships</div>
                        <div className="text-[10px] text-zinc-500 font-mono">AI/ML &amp; Cloud</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Status Bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-zinc-300 font-mono text-[11px]">Database Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{profile.location}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
