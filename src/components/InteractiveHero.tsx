'use client';

import { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Download,
  MapPin,
  Clock,
  Search,
  Layers,
  Cpu,
  Activity,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile, Project } from '@/lib/neon/db';
import { GitHubActivityData } from '@/services/github.service';
import { LeetCodeActivityData } from '@/services/leetcode.service';
import { useToast } from './Toast';
import { useCommandMenu } from './PortfolioClientShell';
import BrandLogo from './BrandLogo';
import SpotlightCard from './SpotlightCard';

interface InteractiveHeroProps {
  profile: Profile;
  flagshipProject?: Project;
  projectCount?: number;
  certCount?: number;
  internshipCount?: number;
  githubData?: GitHubActivityData;
  leetcodeData?: LeetCodeActivityData;
  isRealtimeConnected?: boolean;
}

function formatHeroName(name?: string): string {
  if (!name) return 'Saran R';
  if (name === 'SARAN R') return 'Saran R';
  return name;
}

export default function InteractiveHero({
  profile,
  flagshipProject,
  projectCount = 3,
  certCount = 6,
  internshipCount = 2,
  githubData,
  leetcodeData,
  isRealtimeConnected = false,
}: InteractiveHeroProps) {
  const { toast } = useToast();
  const { openCommandMenu } = useCommandMenu();
  const [copied, setCopied] = useState(false);
  const [hudTab, setHudTab] = useState<'overview' | 'architecture' | 'telemetry'>('overview');
  const [istTime, setIstTime] = useState<string>('IST (UTC+5:30)');

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date());
        setIstTime(`${formatted} IST`);
      } catch {
        setIstTime('IST (UTC+5:30)');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

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

  const heroDisplayName = formatHeroName(profile.full_name);
  const flagshipTitle = flagshipProject?.title?.split('–')[0]?.trim() || 'arthaX';
  const flagshipDesc =
    flagshipProject?.description ||
    'Personal wealth & financial terminal with real-time portfolio tracking, PostgreSQL schemas, and Next.js 16.';
  const flagshipLiveUrl = flagshipProject?.live_url || 'https://arthax.vercel.app';

  const leetcodeSolved = leetcodeData?.totalSolved ?? 90;
  const leetcodeAcceptance = leetcodeData?.acceptanceRate ?? 61.1;
  const leetcodeStreak = leetcodeData?.streak ?? 9;
  const githubContribs = githubData?.totalContributions ?? 67;
  const githubRepos = githubData?.publicRepos ?? 3;

  return (
    <section
      id="home"
      className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-[#1b1f2b] overflow-hidden"
    >
      {/* Atmospheric Technical Grid & Ambient Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-subtle-grid opacity-75 -z-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[340px] rounded-full bg-emerald-500/[0.07] blur-[110px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-1/6 w-[440px] h-[300px] rounded-full bg-sky-500/[0.055] blur-[110px] -z-10"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Narrative & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status & Live Local Context */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>Available for 2026/2027 Roles</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <span>{profile.location || 'Chennai, Tamil Nadu'}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <Clock className="h-3.5 w-3.5 text-emerald-500/70 shrink-0" />
                <span>{istTime}</span>
              </div>
            </div>

            {/* Editorial Display Title & Value Proposition */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{profile.title || 'Artificial Intelligence & Machine Learning Engineer'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-[-0.035em] leading-[1.08] text-zinc-50">
                Building intelligent systems with{' '}
                <span className="text-gradient-emerald">{heroDisplayName}</span>.
              </h1>

              <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed">
                {profile.headline ||
                  'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect'}
              </p>
            </div>

            {/* Grounded Narrative */}
            <p className="text-sm sm:text-[15px] text-zinc-400 leading-relaxed max-w-2xl font-normal">
              {profile.bio ||
                `Artificial Intelligence & Machine Learning engineering student at ${profile.college} (${
                  profile.graduation_year || '2023 – 2027'
                }). Architecting resilient web platforms with Next.js and PostgreSQL, training computer vision and NLP models with PyTorch, and deploying cloud workloads on AWS.`}
            </p>

            {/* Academic Credential Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-[#202636] bg-[#0e1119]/90 card-bevel px-3.5 py-2 text-zinc-300">
                <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="font-medium text-zinc-100">{profile.college}</strong> ·{' '}
                  {profile.degree || 'B.Tech AI & ML'} ({profile.graduation_year})
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-white to-zinc-200 text-zinc-950 hover:from-white hover:to-white px-4.5 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] shadow-[0_6px_24px_-6px_rgba(255,255,255,0.28)] whitespace-nowrap"
              >
                <span>Explore Engineering Work</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#272e40] bg-[#11141e] hover:bg-[#171b28] hover:border-zinc-500 px-4 py-2.5 text-xs font-medium text-zinc-200 transition-all whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume (PDF)</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#272e40] bg-[#11141e] hover:bg-[#171b28] hover:border-zinc-500 px-3.5 py-2.5 text-xs font-mono text-zinc-300 transition-all cursor-pointer whitespace-nowrap"
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
                onClick={openCommandMenu}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#202636] bg-[#0c0e15] hover:bg-[#141824] hover:border-zinc-600 px-3 py-2.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer whitespace-nowrap"
                title="Open command spotlight (⌘K)"
              >
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                <span>⌘K</span>
              </button>
            </div>

            {/* Direct Social Links */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
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

              <span className="text-zinc-700" aria-hidden="true">
                ·
              </span>

              <a
                href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-sky-300 transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="h-4 w-4 text-zinc-400" />
                <span>LinkedIn</span>
              </a>

              <span className="text-zinc-700" aria-hidden="true">
                ·
              </span>

              <a
                href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-300 transition-colors"
                title={`LeetCode (${leetcodeSolved}+ Solved)`}
              >
                <LeetCodeIcon className="h-4 w-4 text-amber-500/90" />
                <span>LeetCode ({leetcodeSolved}+)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Engineering Telemetry Console (5 cols) */}
          <div className="lg:col-span-5">
            <SpotlightCard
              tone="emerald"
              className="rounded-2xl border border-[#242b3e] bg-[#0d1018]/95 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)]"
            >
              {/* Console Top Chrome + Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-[#1b2030] bg-[#0a0c12]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-zinc-300">
                    System Dossier
                  </span>
                </div>

                {/* Interactive Console Mode Switcher */}
                <div className="flex items-center gap-1 rounded-lg border border-[#1d2231] bg-[#0f121b] p-0.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setHudTab('overview')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      hudTab === 'overview'
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setHudTab('architecture')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      hudTab === 'architecture'
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Stack
                  </button>
                  <button
                    type="button"
                    onClick={() => setHudTab('telemetry')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      hudTab === 'telemetry'
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Live
                  </button>
                </div>
              </div>

              {/* Console Body */}
              <div className="p-5 space-y-5 text-xs relative z-10">
                {hudTab === 'overview' && (
                  <>
                    {/* Flagship Spotlight */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        <span>Flagship System</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Production
                        </span>
                      </div>
                      <div className="rounded-xl border border-[#22283a] bg-[#121622]/90 p-3.5 transition-colors hover:border-[#323c57]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-zinc-100 text-sm">{flagshipTitle}</span>
                          <a
                            href={flagshipLiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline whitespace-nowrap shrink-0"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
                          {flagshipDesc}
                        </p>
                      </div>
                    </div>

                    {/* 4-Metric Interactive KPI Grid */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Verified Metrics
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <a
                          href="#projects"
                          className="rounded-xl border border-[#1d2232] bg-[#111520] hover:border-emerald-500/45 hover:bg-[#151a27] p-2.5 text-center transition-all"
                        >
                          <div className="font-mono tabular-nums text-base sm:text-lg font-semibold text-emerald-400">
                            {projectCount}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">Projects</div>
                        </a>
                        <a
                          href="#activity"
                          className="rounded-xl border border-[#1d2232] bg-[#111520] hover:border-amber-500/45 hover:bg-[#151a27] p-2.5 text-center transition-all"
                        >
                          <div className="font-mono tabular-nums text-base sm:text-lg font-semibold text-amber-400">
                            {leetcodeSolved}+
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">LeetCode</div>
                        </a>
                        <a
                          href="#experience"
                          className="rounded-xl border border-[#1d2232] bg-[#111520] hover:border-sky-500/45 hover:bg-[#151a27] p-2.5 text-center transition-all"
                        >
                          <div className="font-mono tabular-nums text-base sm:text-lg font-semibold text-sky-400">
                            {internshipCount}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">Internships</div>
                        </a>
                        <a
                          href="#certifications"
                          className="rounded-xl border border-[#1d2232] bg-[#111520] hover:border-indigo-500/45 hover:bg-[#151a27] p-2.5 text-center transition-all"
                        >
                          <div className="font-mono tabular-nums text-base sm:text-lg font-semibold text-indigo-400">
                            {certCount}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">Certificates</div>
                        </a>
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#202636] bg-[#121622] px-2.5 py-1 text-[11px] font-mono text-zinc-300"
                          >
                            <BrandLogo name={tool.name} size={13} badgeVariant="none" />
                            <span>{tool.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {hudTab === 'architecture' && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Production System Topology
                    </div>
                    <div className="space-y-2.5">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" />
                            01 · Interface &amp; App Router
                          </span>
                          <span className="text-zinc-500">Edge / SSR</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                          Next.js 16 · React 19 · TypeScript · Tailwind 4
                        </p>
                      </div>

                      <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-3">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-violet-300 font-semibold flex items-center gap-1.5">
                            <Cpu className="h-3.5 w-3.5" />
                            02 · AI / ML Inference
                          </span>
                          <span className="text-zinc-500">CV &amp; NLP</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                          PyTorch · OpenCV · SpaCy · Scikit-Learn · Pandas
                        </p>
                      </div>

                      <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-3">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-sky-300 font-semibold flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5" />
                            03 · Data &amp; Cloud Infra
                          </span>
                          <span className="text-zinc-500">ACID / RLS</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                          PostgreSQL · Neon · Drizzle ORM · AWS · Docker
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {hudTab === 'telemetry' && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      <span>Engineering Activity Snapshot</span>
                      <span className="text-emerald-400">
                        {isRealtimeConnected ? 'Neon SSE Connected' : 'Verified Snapshot'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 font-mono">
                      <div className="rounded-xl border border-[#1d2232] bg-[#111520] p-3">
                        <div className="text-[10px] text-zinc-500 uppercase">GitHub Contribs</div>
                        <div className="text-lg font-bold text-sky-400 tabular-nums mt-0.5">
                          {githubContribs}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {githubRepos} public repos
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#1d2232] bg-[#111520] p-3">
                        <div className="text-[10px] text-zinc-500 uppercase">LeetCode Solved</div>
                        <div className="text-lg font-bold text-amber-400 tabular-nums mt-0.5">
                          {leetcodeSolved}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {leetcodeAcceptance}% acceptance
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#1d2232] bg-[#111520] p-3">
                        <div className="text-[10px] text-zinc-500 uppercase">Active Streak</div>
                        <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">
                          {leetcodeStreak} days
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">Python &amp; SQL</div>
                      </div>

                      <div className="rounded-xl border border-[#1d2232] bg-[#111520] p-3">
                        <div className="text-[10px] text-zinc-500 uppercase">Class Standing</div>
                        <div className="text-lg font-bold text-zinc-100 tabular-nums mt-0.5">
                          2027
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">B.Tech AI &amp; ML</div>
                      </div>
                    </div>

                    <a
                      href="#activity"
                      className="flex items-center justify-between rounded-xl border border-[#202636] bg-[#111520] hover:border-emerald-500/35 px-3.5 py-2.5 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors"
                    >
                      <span>Inspect full GitHub &amp; LeetCode breakdown</span>
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                    </a>
                  </div>
                )}

                {/* Console Footer */}
                <div className="pt-2.5 border-t border-[#1b2030] flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 font-mono">
                  <span>Open to full-time &amp; internship roles</span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Get in touch</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
