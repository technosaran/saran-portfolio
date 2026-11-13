'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  MapPin, 
  Mail,
  ArrowUpRight,
  GraduationCap,
  Download,
  Terminal,
  Cpu,
  Layers,
  Zap
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
  const [activeTab, setActiveTab] = useState<'profile' | 'metrics' | 'terminal'>('profile');
  const [terminalCommand, setTerminalCommand] = useState<'status' | 'stack' | 'contact'>('status');

  const handleCopyEmail = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
        return;
      }
    } catch {
      // Fallback
    }

    try {
      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = profile.email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      setCopied(false);
    }
  };

  // Derive dynamic stacks from database skills
  const dbLanguages = skills
    .filter((s) => (s.category || '').toLowerCase().includes('language'))
    .map((s) => s.name);
  const languagesToDisplay = dbLanguages.length > 0 ? dbLanguages.slice(0, 5) : ['Java', 'Python', 'TypeScript', 'SQL'];

  const dbFrameworks = skills
    .filter((s) => (s.category || '').toLowerCase().includes('framework') || (s.category || '').toLowerCase().includes('ai'))
    .map((s) => s.name);
  const frameworksToDisplay = dbFrameworks.length > 0 ? dbFrameworks.slice(0, 4) : ['Next.js', 'PyTorch', 'OpenCV', 'React'];

  const dbDatabases = skills
    .filter((s) => (s.category || '').toLowerCase().includes('database') || (s.category || '').toLowerCase().includes('tool'))
    .map((s) => s.name);
  const databasesToDisplay = dbDatabases.length > 0 ? dbDatabases.slice(0, 3) : ['PostgreSQL', 'Supabase', 'MongoDB'];

  return (
    <section id="home" className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-white/[0.08] bg-grid-faded">
      {/* Refined ambient lighting: Deep sapphire and indigo gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-sky-500/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-40 right-[-100px] w-[350px] h-[350px] bg-blue-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Identity, Bio & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Beacon Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1 text-xs font-mono font-medium text-blue-300 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Open to AI/ML &amp; Software Engineering Roles</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Hi, I&apos;m{' '}
                <span className="text-gradient-titanium">
                  {profile.full_name}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-blue-300/90 tracking-tight">
                {profile.title}
              </p>
            </div>

            {/* Bio summary */}
            <p className="text-sm sm:text-base text-zinc-300/90 leading-relaxed max-w-2xl font-normal">
              {profile.bio}
            </p>

            {/* Quick Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>{profile.location}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                <span>{profile.college} ({profile.graduation_year})</span>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Systems</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-950" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/40 px-5 py-2.5 text-xs font-semibold text-zinc-100 transition-all cursor-pointer backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>Contact Me</span>
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2.5 text-xs font-semibold text-blue-300 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Resume (PDF)</span>
              </a>
            </div>

            {/* Social Icons row & Quick Copy Email */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
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
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:text-blue-400 hover:border-blue-500/40 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/15 transition-all cursor-pointer"
                title="LeetCode (90+ Java DSA Solved)"
              >
                <LeetCodeIcon className="h-4 w-4" />
              </a>

              {/* Inline copy email pill */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
                title="Click to copy email address"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-zinc-400" />
                    <span>{profile.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Sleek Architectural Snapshot Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/[0.1] bg-[#0b0d14]/90 p-1 shadow-2xl backdrop-blur-2xl card-shine">
              
              {/* Outer Glow */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent blur-xl opacity-60 -z-10" />

              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#08090e]/80 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">
                    {activeTab === 'profile' ? 'saran.config.ts' : activeTab === 'metrics' ? 'telemetry.json' : 'cli.sh'}
                  </span>
                </div>

                {/* Tab selector */}
                <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06] text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('metrics')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'metrics'
                        ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Telemetry
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('terminal')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'terminal'
                        ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    CLI
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 font-mono text-xs leading-relaxed min-h-[300px] flex flex-col justify-between">
                {activeTab === 'profile' && (
                  <div className="space-y-1.5 text-zinc-300">
                    <p className="text-zinc-500 text-[11px]">{'// Verified Core Configuration (Neon PostgreSQL Synced)'}</p>
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
                      <span className="text-sky-400">discipline</span>: <span className="text-emerald-300">&quot;Artificial Intelligence &amp; Systems&quot;</span>,
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
                      <span className="text-sky-400">status</span>: <span className="text-emerald-400 font-semibold">&quot;Open to Opportunities&quot;</span>
                    </p>
                    <p className="text-zinc-100">{'}'};</p>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="space-y-3 font-sans">
                    <p className="text-xs font-mono text-zinc-500">{'// Verified Engineering Metrics'}</p>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center hover:border-amber-500/30 transition-colors">
                        <div className="text-xl font-bold font-mono text-amber-400">90+</div>
                        <div className="text-[11px] text-zinc-300 mt-0.5 font-medium">LeetCode Solved</div>
                        <div className="text-[10px] text-zinc-500 font-mono">81 Easy · 9 Med (Java)</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center hover:border-blue-500/30 transition-colors">
                        <div className="text-xl font-bold font-mono text-blue-400">{projectCount}+</div>
                        <div className="text-[11px] text-zinc-300 mt-0.5 font-medium">Core Systems</div>
                        <div className="text-[10px] text-zinc-500 font-mono">FinTech, CV &amp; NLP</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center hover:border-indigo-500/30 transition-colors">
                        <div className="text-xl font-bold font-mono text-indigo-400">{certCount}</div>
                        <div className="text-[11px] text-zinc-300 mt-0.5 font-medium">Certifications</div>
                        <div className="text-[10px] text-zinc-500 font-mono">AWS, Oracle, IBM, Infosys</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center hover:border-emerald-500/30 transition-colors">
                        <div className="text-xl font-bold font-mono text-emerald-400">{internshipCount}</div>
                        <div className="text-[11px] text-zinc-300 mt-0.5 font-medium">Applied Internships</div>
                        <div className="text-[10px] text-zinc-500 font-mono">IBM SkillsBuild &amp; Cloud</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2">
                      <span className="text-zinc-500">$</span>
                      <span className="text-zinc-400">saran --help</span>
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setTerminalCommand('status')}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                            terminalCommand === 'status' ? 'bg-blue-500/20 text-blue-300' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          --status
                        </button>
                        <button
                          type="button"
                          onClick={() => setTerminalCommand('stack')}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                            terminalCommand === 'stack' ? 'bg-blue-500/20 text-blue-300' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          --stack
                        </button>
                        <button
                          type="button"
                          onClick={() => setTerminalCommand('contact')}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                            terminalCommand === 'contact' ? 'bg-blue-500/20 text-blue-300' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          --contact
                        </button>
                      </div>
                    </div>

                    {terminalCommand === 'status' && (
                      <div className="space-y-1.5 text-zinc-300">
                        <p><span className="text-emerald-400">✓</span> Candidate: <span className="text-white font-bold">{profile.full_name}</span></p>
                        <p><span className="text-emerald-400">✓</span> Standing: <span className="text-blue-300">Undergrad Student (2023–2027)</span></p>
                        <p><span className="text-emerald-400">✓</span> Availability: <span className="text-emerald-400 font-semibold">Immediate for 2026/2027 roles</span></p>
                        <p><span className="text-emerald-400">✓</span> Focus: <span className="text-zinc-400">Production Systems, Cloud &amp; AI</span></p>
                      </div>
                    )}

                    {terminalCommand === 'stack' && (
                      <div className="space-y-1.5 text-zinc-300">
                        <p><span className="text-sky-400">Languages:</span> Java 21, TypeScript, Python 3, SQL</p>
                        <p><span className="text-sky-400">Frameworks:</span> Next.js 16, React 19, PyTorch, OpenCV</p>
                        <p><span className="text-sky-400">Cloud / DB:</span> Neon Postgres, Supabase, AWS, Docker</p>
                      </div>
                    )}

                    {terminalCommand === 'contact' && (
                      <div className="space-y-1.5 text-zinc-300">
                        <p><span className="text-indigo-400">Email:</span> {profile.email}</p>
                        <p><span className="text-indigo-400">Phone:</span> {profile.phone}</p>
                        <p><span className="text-indigo-400">Location:</span> {profile.location}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Status Bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-zinc-300 font-mono text-[11px]">Neon DB Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{profile.location} (IST)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Minimalist 4-Pillar Architectural Telemetry Strip */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold">
              <Cpu className="h-3.5 w-3.5" />
              <span>01 / AI &amp; Deep Learning</span>
            </div>
            <p className="mt-1 text-xs text-zinc-300 font-medium">PyTorch · OpenCV · Computer Vision</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
              <Layers className="h-3.5 w-3.5" />
              <span>02 / Full-Stack Architecture</span>
            </div>
            <p className="mt-1 text-xs text-zinc-300 font-medium">Next.js 16 · TypeScript · Tailwind CSS 4</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold">
              <Zap className="h-3.5 w-3.5" />
              <span>03 / Database Engineering</span>
            </div>
            <p className="mt-1 text-xs text-zinc-300 font-medium">Neon PostgreSQL · Supabase RLS</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
              <Terminal className="h-3.5 w-3.5" />
              <span>04 / Algorithmic Rigor</span>
            </div>
            <p className="mt-1 text-xs text-zinc-300 font-medium">90+ LeetCode Solved · Java 21 DSA</p>
          </div>
        </div>

      </div>
    </section>
  );
}
