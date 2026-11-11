'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Send, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile } from '@/lib/neon/db';

export default function InteractiveHero({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'stack' | 'terminal'>('overview');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-white/[0.08] bg-grid">
      {/* Dynamic ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Bio & Value Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Radar Pill */}
            <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-medium text-emerald-300 backdrop-blur-xl shadow-lg shadow-emerald-950/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span>Available for Software Engineering & AI/ML Roles</span>
              <span className="hidden sm:inline text-zinc-500">|</span>
              <span className="hidden sm:inline text-zinc-400">{profile.graduation_year}</span>
            </div>

            {/* Main Headline */}
            <div>
              <p className="text-sm font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
                Hello World · I am
              </p>
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.06]">
                <span className="text-white">{profile.full_name.split(' ')[0]} </span>
                <span className="text-gradient-emerald">
                  {profile.full_name.split(' ').slice(1).join(' ') || 'R'}
                </span>
              </h1>
              <p className="mt-3 text-xl sm:text-2xl font-semibold text-zinc-200 tracking-tight">
                {profile.title}
              </p>
            </div>

            {/* Bio summary */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl font-normal">
              {profile.bio}
            </p>

            {/* Quick Contact & Info Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-zinc-300 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                {profile.location}
              </span>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-zinc-300 hover:text-white hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                {profile.phone}
              </a>

              {/* Interactive Copy Email button */}
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm group"
                title="Click to copy email address"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400 transition-transform scale-110" />
                    <span className="font-semibold text-white">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{profile.email}</span>
                    <Copy className="h-3 w-3 text-emerald-400/70 group-hover:text-emerald-300 ml-0.5" />
                  </>
                )}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 px-6 py-3.5 text-xs font-bold text-black shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Featured Work</span>
                <ChevronRight className="h-4 w-4" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-emerald-500/40 px-5 py-3.5 text-xs font-semibold text-zinc-100 transition-all cursor-pointer backdrop-blur-xl"
              >
                <Send className="h-3.5 w-3.5 text-emerald-400" />
                <span>Contact Saran</span>
              </a>

              <a
                href={profile.github_url || "https://github.com/technosaran"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.linkedin_url || "https://linkedin.com/in/saran-r-b2b1a5275"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.leetcode_url || "https://leetcode.com/u/technosaran/"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all cursor-pointer"
                title="LeetCode (Java DSA)"
              >
                <LeetCodeIcon className="h-4 w-4" />
              </a>
            </div>

            {/* University & Degree Credentials Pill */}
            <div className="pt-2 flex items-center gap-3 text-xs text-zinc-400 border-t border-white/[0.06]">
              <span className="font-semibold text-zinc-300">{profile.college}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-400">{profile.degree}</span>
            </div>
          </div>

          {/* Right Column: Interactive Developer Terminal Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/[0.12] bg-[#0c0d14]/90 p-1 shadow-2xl backdrop-blur-2xl card-shine">
              {/* Outer Glow */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-indigo-500/20 blur-xl opacity-50 -z-10" />

              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#09090e]/60 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] font-mono text-zinc-400">saran@production:~</span>
                </div>

                {/* Tab selector */}
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06] text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    bio.ts
                  </button>
                  <button
                    onClick={() => setActiveTab('stack')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'stack'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    stack.json
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeTab === 'terminal'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    health.sh
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto min-h-[300px] flex flex-col justify-between">
                {activeTab === 'overview' && (
                  <div className="space-y-1.5 text-zinc-300">
                    <p className="text-zinc-500">// Saran R - Architectural Profile</p>
                    <p>
                      <span className="text-purple-400">export const </span>
                      <span className="text-emerald-400 font-bold">engineer</span>
                      <span className="text-zinc-400"> = </span>
                      <span className="text-zinc-100">{'{'}</span>
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">name</span>: <span className="text-emerald-300">&quot;Saran R&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">role</span>: <span className="text-teal-300">&quot;AI/ML &amp; Cloud Infrastructure&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">database</span>: <span className="text-amber-300">&quot;PostgreSQL / Cloud Database&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">primaryDSA</span>: <span className="text-indigo-300">&quot;Java (LeetCode 90+ Solved)&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">cloudDevOps</span>: <span className="text-emerald-300">[&quot;AWS&quot;, &quot;Docker&quot;, &quot;CI/CD&quot;]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">frameworks</span>: <span className="text-cyan-300">[&quot;Next.js 16&quot;, &quot;PyTorch&quot;, &quot;OpenCV&quot;]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-blue-400">status</span>: <span className="text-emerald-400 font-semibold">&quot;Ready for High-Impact Roles&quot;</span>
                    </p>
                    <p className="text-zinc-100">{'}'};</p>
                  </div>
                )}

                {activeTab === 'stack' && (
                  <div className="space-y-1 text-zinc-300">
                    <p className="text-zinc-500">// Technical Competency Stack</p>
                    <p className="text-zinc-100">{'{'}</p>
                    <p className="pl-4">
                      <span className="text-cyan-400">&quot;languages&quot;</span>: [<span className="text-amber-300">&quot;Java&quot;</span>, <span className="text-amber-300">&quot;TypeScript&quot;</span>, <span className="text-amber-300">&quot;Python&quot;</span>, <span className="text-amber-300">&quot;SQL&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">&quot;machineLearning&quot;</span>: [<span className="text-emerald-300">&quot;PyTorch&quot;</span>, <span className="text-emerald-300">&quot;OpenCV&quot;</span>, <span className="text-emerald-300">&quot;NLP SpaCy&quot;</span>, <span className="text-emerald-300">&quot;Scikit-Learn&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">&quot;cloudAndDevOps&quot;</span>: [<span className="text-purple-300">&quot;AWS Cloud&quot;</span>, <span className="text-purple-300">&quot;Docker&quot;</span>, <span className="text-purple-300">&quot;Vercel&quot;</span>, <span className="text-purple-300">&quot;Git/GitHub&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">&quot;storage&quot;</span>: [<span className="text-teal-300">&quot;PostgreSQL&quot;</span>, <span className="text-teal-300">&quot;Supabase&quot;</span>, <span className="text-teal-300">&quot;MongoDB&quot;</span>]
                    </p>
                    <p className="text-zinc-100">{'}'}</p>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div className="space-y-2 text-zinc-300">
                    <div>
                      <span className="text-emerald-400 font-bold">$ </span>
                      <span className="text-white">check-cluster-health --all</span>
                    </div>
                    <div className="text-zinc-400 pl-3">
                      Target: production-cluster-01 · Latency: 12ms · Status: CONNECTED
                    </div>

                    <div className="pt-1">
                      <span className="text-emerald-400 font-bold">$ </span>
                      <span className="text-white">check-services --all</span>
                    </div>
                    <div className="text-zinc-400 pl-3 space-y-0.5">
                      <p className="text-emerald-400">✓ PostgreSQL Database: ACTIVE (Pooler Ready)</p>
                      <p className="text-emerald-400">✓ Next.js 16 App Router: ONLINE</p>
                      <p className="text-emerald-400">✓ AWS &amp; Cloud Infra: READY</p>
                      <p className="text-amber-400">✓ LeetCode Java Problem Solver: 90+ Solved</p>
                    </div>
                  </div>
                )}

                {/* Bottom status indicator inside terminal */}
                <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-zinc-400">Cloud Infrastructure: Operational</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{copied ? 'Copied' : 'copy email'}</span>
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
