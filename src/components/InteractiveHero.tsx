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
  Clock
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
    <section id="home" className="relative pt-10 pb-16 md:pt-18 md:pb-24 border-b border-[#1b1f2b]">
      {/* Subtle ambient background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-emerald-500/[0.04] via-sky-500/[0.02] to-transparent blur-3xl -z-10" 
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Human Story & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real Status Badge & Timezone */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Available for 2026/2027 Roles</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                <span>{profile.location || 'Chennai, India'}</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                <Clock className="h-3.5 w-3.5 text-zinc-600" />
                <span>IST (UTC+5:30)</span>
              </div>
            </div>

            {/* Main Statement */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-100 leading-[1.15]">
                Hey, I&apos;m {profile.full_name}.
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
                {profile.headline || 'AI/ML Engineering student building full-stack web platforms, computer vision pipelines, and cloud workloads.'}
              </p>
            </div>

            {/* Grounded Human Narrative */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
              {profile.bio || `I'm an Artificial Intelligence & Machine Learning engineering student at ${profile.college} (graduating in ${profile.graduation_year || '2027'}). I focus on architecting resilient web platforms with Next.js and PostgreSQL, training computer vision and NLP models with PyTorch, and deploying cloud workloads on AWS.`}
            </p>

            {/* Academic Credential Tag */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#1b1f2b] bg-[#0f1118] px-3.5 py-2 text-zinc-300">
                <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{profile.college} · {profile.degree || 'B.Tech AI & ML'} ({profile.graduation_year})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-white px-4.5 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] shadow-sm"
              >
                <span>View Projects</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] hover:border-zinc-500 px-4 py-2.5 text-xs font-medium text-zinc-200 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume (PDF)</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] hover:border-zinc-500 px-3.5 py-2.5 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
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

              <button
                type="button"
                onClick={handleOpenCommand}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#262b3a] bg-[#12151e] hover:bg-[#181c28] hover:border-zinc-500 px-3 py-2.5 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Search portfolio (⌘K)"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Search</span>
                <kbd className="text-[10px] text-zinc-400 bg-zinc-800/90 border border-zinc-700/60 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>
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
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
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
            <div className="rounded-xl border border-[#1f2432] bg-[#0f1118] shadow-lg overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1b1f2b] bg-[#0c0e14]">
                <div className="text-xs font-mono font-medium text-zinc-300">
                  Engineering Overview
                </div>
                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>online</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-5 text-xs">
                
                {/* Current Project Spotlight */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Flagship Project
                  </div>
                  <div className="rounded-lg border border-[#202534] bg-[#131620] p-3">
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

                {/* Key Numbers (Balanced 4-Metric Grid) */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    At a Glance
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-lg border border-[#1b1f2b] bg-[#12151e] p-2.5 text-center">
                      <div className="font-mono text-base sm:text-lg font-semibold text-emerald-400">{projectCount}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Projects</div>
                    </div>
                    <div className="rounded-lg border border-[#1b1f2b] bg-[#12151e] p-2.5 text-center">
                      <div className="font-mono text-base sm:text-lg font-semibold text-amber-400">90+</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">LeetCode</div>
                    </div>
                    <div className="rounded-lg border border-[#1b1f2b] bg-[#12151e] p-2.5 text-center">
                      <div className="font-mono text-base sm:text-lg font-semibold text-sky-400">{internshipCount}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Internships</div>
                    </div>
                    <div className="rounded-lg border border-[#1b1f2b] bg-[#12151e] p-2.5 text-center">
                      <div className="font-mono text-base sm:text-lg font-semibold text-indigo-400">{certCount}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Certificates</div>
                    </div>
                  </div>
                </div>

                {/* Core Stack Pills */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Core Technologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {coreTools.map((tool) => (
                      <span 
                        key={tool.name}
                        className="inline-flex items-center rounded-md border border-[#202534] bg-[#131620] px-2 py-1 text-[11px] font-mono text-zinc-300"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-2 border-t border-[#1b1f2b] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
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
