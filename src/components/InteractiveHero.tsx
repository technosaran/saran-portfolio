'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  ArrowDown, 
  ArrowUpRight, 
  GraduationCap, 
  Download, 
  Sparkles,
  MapPin,
  Briefcase,
  Code2,
  Terminal,
  Layers,
  Database
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile } from '@/lib/neon/db';
import { useToast } from './Toast';
import { useCommandMenu } from './PortfolioClientShell';

interface InteractiveHeroProps {
  profile: Profile;
  projectCount?: number;
  certCount?: number;
  internshipCount?: number;
  onOpenCommandMenu?: () => void;
}

export default function InteractiveHero({ 
  profile, 
  projectCount = 3, 
  certCount = 6, 
  internshipCount = 2,
  onOpenCommandMenu
}: InteractiveHeroProps) {
  const { toast } = useToast();
  const { openCommandMenu } = useCommandMenu();
  const handleOpenCommand = onOpenCommandMenu || openCommandMenu;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(profile.email);
        setCopied(true);
        toast('Email copied to clipboard', 'success');
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // fallback
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
        toast('Email copied to clipboard', 'success');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast('Failed to copy email', 'error');
    }
  };

  const coreTools = [
    { name: 'TypeScript', tag: 'Language' },
    { name: 'Python', tag: 'AI & Data' },
    { name: 'Java', tag: 'OOP & DSA' },
    { name: 'Next.js 16', tag: 'Full-Stack' },
    { name: 'PostgreSQL', tag: 'Database' },
    { name: 'PyTorch', tag: 'Deep Learning' },
    { name: 'AWS Cloud', tag: 'Infra' },
    { name: 'Docker', tag: 'DevOps' },
  ];

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-16 md:pb-24 border-b border-[#20222a]">
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[480px] h-[300px] bg-emerald-500/[0.03] blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[420px] h-[260px] bg-sky-500/[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Human Story & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real Status Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available for 2026/2027 Engineering Opportunities</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                <span>{profile.location || 'Chennai, India'}</span>
              </div>
            </div>

            {/* Main Statement */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-100 leading-[1.18]">
                Hey, I&apos;m {profile.full_name}.
                <br />
                <span className="text-zinc-400 font-normal">
                  {profile.headline || 'I build web platforms, cloud infrastructure, and practical machine learning systems.'}
                </span>
              </h1>
            </div>

            {/* Grounded Human Narrative */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
              {profile.bio || `I'm an Artificial Intelligence & Machine Learning engineering student at ${profile.college} (graduating in ${profile.graduation_year || '2027'}). I love architecting robust full-stack applications with Next.js and PostgreSQL, training computer vision and NLP models with PyTorch, and deploying cloud workloads on AWS.`}
            </p>

            {/* Academic Credential Tag */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#20222a] bg-[#111216] px-3 py-2 text-zinc-300">
                <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{profile.college} · {profile.degree || 'B.Tech AI & ML'} ({profile.graduation_year})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-white px-4.5 py-2.5 text-xs font-semibold transition-all active:scale-[0.98]"
              >
                <span>View Projects</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2b2e38] bg-[#14151b] hover:bg-[#1a1c24] hover:border-zinc-500 px-4 py-2.5 text-xs font-medium text-zinc-200 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume (PDF)</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2b2e38] bg-[#14151b] hover:bg-[#1a1c24] hover:border-zinc-500 px-3.5 py-2.5 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{profile.email}</span>
                  </>
                )}
              </button>

              {onOpenCommandMenu && (
                <button
                  type="button"
                  onClick={handleOpenCommand}
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#20222a] bg-[#111216] hover:bg-[#16171e] px-3 py-2.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                  title="Search (⌘K)"
                >
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  <span>Search</span>
                  <kbd className="text-[10px] text-zinc-500 bg-zinc-800/80 px-1 py-0.5 rounded font-mono">⌘K</kbd>
                </button>
              )}
            </div>

            {/* Direct Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={profile.github_url || 'https://github.com/technosaran'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                title="GitHub Profile"
              >
                <GithubIcon className="h-4 w-4 text-zinc-400" />
                <span>GitHub</span>
              </a>

              <span className="text-zinc-700">·</span>

              <a
                href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-sky-400 transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="h-4 w-4 text-zinc-400" />
                <span>LinkedIn</span>
              </a>

              <span className="text-zinc-700">·</span>

              <a
                href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
                title="LeetCode (90+ Solved)"
              >
                <LeetCodeIcon className="h-4 w-4 text-amber-500/90" />
                <span>LeetCode (90+)</span>
              </a>
            </div>

          </div>

          {/* Right Column: High-Utility Engineering Summary Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[#20222a] bg-[#111216] shadow-xl overflow-hidden">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#20222a] bg-[#0d0e12]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">overview.md</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>active</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-5 text-xs">
                
                {/* Current Project Spotlight */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Latest Flagship Work
                  </div>
                  <div className="rounded-lg border border-[#252834] bg-[#161820] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-100 text-sm">arthaX</span>
                      <a 
                        href="https://arthax.vercel.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Personal wealth &amp; financial terminal with real-time portfolio tracking, PostgreSQL schemas, and Next.js 16.
                    </p>
                  </div>
                </div>

                {/* Key Numbers */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    At a Glance
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-[#20222a] bg-[#14151b] p-2.5 text-center">
                      <div className="font-mono text-lg font-bold text-zinc-100">90+</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">LeetCode Solved</div>
                    </div>
                    <div className="rounded-lg border border-[#20222a] bg-[#14151b] p-2.5 text-center">
                      <div className="font-mono text-lg font-bold text-zinc-100">{internshipCount}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Internships</div>
                    </div>
                    <div className="rounded-lg border border-[#20222a] bg-[#14151b] p-2.5 text-center">
                      <div className="font-mono text-lg font-bold text-zinc-100">{certCount}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Certifications</div>
                    </div>
                  </div>
                </div>

                {/* Core Stack Pills */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Primary Technologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {coreTools.map((tool) => (
                      <span 
                        key={tool.name}
                        className="inline-flex items-center rounded-md border border-[#252834] bg-[#161820] px-2 py-1 text-[11px] font-mono text-zinc-300"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-2 border-t border-[#20222a] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Open to full-time &amp; internship roles</span>
                  <a href="#contact" className="text-zinc-300 hover:text-white transition-colors underline">
                    Get in touch →
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
