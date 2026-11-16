'use client';

import { useState, useRef } from 'react';
import { 
  Copy, 
  Check, 
  MapPin, 
  Mail,
  ArrowUpRight, 
  GraduationCap, 
  Download, 
  Cpu, 
  Layers, 
  Database,
  Code2, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './SocialIcons';
import { Profile, Skill } from '@/lib/neon/db';
import { useToast } from './Toast';
import { useCommandMenu } from './PortfolioClientShell';

interface InteractiveHeroProps {
  profile: Profile;
  skills?: Skill[];
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
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'terminal'>('profile');
  const [terminalCommand, setTerminalCommand] = useState<'about' | 'projects' | 'skills' | 'contact'>('about');
  const [cliInput, setCliInput] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

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

  const copyProfileCode = () => {
    const code = `export const saran = {
  name: "${profile.full_name}",
  role: "AI & ML Student / Software Developer",
  college: "${profile.college}",
  graduation: "${profile.graduation_year}",
  location: "${profile.location}",
  languages: ["Java", "Python", "TypeScript", "SQL"],
  status: "Open for Opportunities"
};`;
    try {
      navigator.clipboard.writeText(code);
      toast('Profile code copied to clipboard', 'success');
    } catch {
      toast('Failed to copy code', 'error');
    }
  };

  // Languages & Frameworks
  const languages = ['Java', 'Python', 'TypeScript', 'SQL'];
  const frameworks = ['Next.js', 'React', 'PyTorch', 'OpenCV'];

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase().replace(/^--/, '');
    if (cmd === 'about' || cmd === 'projects' || cmd === 'skills' || cmd === 'contact') {
      setTerminalCommand(cmd);
      setCliInput('');
    } else if (cmd === 'clear') {
      setTerminalCommand('about');
      setCliInput('');
    } else {
      toast(`Unknown command. Available: about, projects, skills, contact`, 'info');
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-16 border-b border-white/[0.06] bg-grid-faded">
      {/* World-Class Ambient Multi-Mesh Aurora */}
      <div className="absolute -top-24 left-1/4 w-[520px] h-[360px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full animate-aurora-1" />
      <div className="absolute -top-16 right-1/4 w-[460px] h-[320px] bg-cyan-500/12 blur-[130px] pointer-events-none rounded-full animate-aurora-2" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Bio & Core Info (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Open for Internships &amp; SDE Roles</span>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-slate-400 backdrop-blur-md">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span>{profile.location}</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                <span className="text-gradient-titanium">{profile.full_name}</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-gradient-brand">
                Artificial Intelligence &amp; Machine Learning Engineer
              </p>
            </div>

            {/* Clean, Grounded Bio */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Engineering student at {profile.college} pursuing B.Tech in Artificial Intelligence &amp; Data Science. Experienced in architecting full-stack web applications with Next.js and PostgreSQL, implementing real-time computer vision inference with PyTorch, and practicing algorithmic problem solving in Java.
            </p>

            {/* Education Tag */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 backdrop-blur-md max-w-full">
                <GraduationCap className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="break-words">{profile.college} &middot; B.Tech AI &amp; ML ({profile.graduation_year})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <a
                href="#projects"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-100 hover:to-white px-4 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-[0_0_25px_rgba(255,255,255,0.22)] hover:shadow-[0_0_35px_rgba(99,102,241,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Projects</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-950" />
              </a>

              <a
                href="#contact"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-indigo-400/40 px-4 py-2.5 text-xs font-semibold text-white transition-all backdrop-blur-md"
              >
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Contact Me</span>
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/35 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/60 px-4 py-2.5 text-xs font-semibold text-indigo-300 transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>Resume (PDF)</span>
              </a>

              {onOpenCommandMenu && (
                <button
                  type="button"
                  onClick={handleOpenCommand}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-amber-400/40 px-3 py-2.5 text-xs font-mono text-slate-400 hover:text-white transition-all backdrop-blur-md cursor-pointer"
                  title="Search (⌘K)"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Search</span>
                  <span className="text-[10px] text-slate-500 font-mono">⌘K</span>
                </button>
              )}
            </div>

            {/* Social Links & Copy Email */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={profile.github_url || 'https://github.com/technosaran'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/20 transition-all"
                title="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.linkedin_url || 'https://linkedin.com/in/saran-r-b2b1a5275'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                title="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>

              <a
                href={profile.leetcode_url || 'https://leetcode.com/u/Saran-R/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:border-amber-500/40 transition-all"
                title="LeetCode (90+ Solved)"
              >
                <LeetCodeIcon className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-indigo-400/30 transition-all max-w-full cursor-pointer"
                title="Click to copy email"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-sans">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[190px] xs:max-w-none">{profile.email}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Clean Interactive Card (5 cols) */}
          <div className="lg:col-span-5">
            <div 
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              className="rounded-2xl border border-white/[0.08] bg-[#090b16]/90 p-1 shadow-2xl backdrop-blur-2xl card-shine card-spotlight"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#060810]/80 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    {activeTab === 'profile' ? 'profile.ts' : activeTab === 'stats' ? 'highlights.json' : 'terminal'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06] text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stats')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      activeTab === 'stats'
                        ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Highlights
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('terminal')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      activeTab === 'terminal'
                        ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CLI
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 font-mono text-xs leading-relaxed min-h-[290px] flex flex-col justify-between">
                
                {/* TAB 1: PROFILE CODE (Tokyo Night / Vercel Modern Syntax) */}
                {activeTab === 'profile' && (
                  <div className="space-y-1 text-slate-300 overflow-x-auto scrollbar-thin max-w-full pb-1">
                    <p className="text-slate-500 text-[11px]">{'// saran.ts'}</p>
                    <p>
                      <span className="text-purple-400 font-bold">export const </span>
                      <span className="text-white font-bold">developer</span> = {'{'}
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">name</span>: <span className="text-emerald-300">&quot;{profile.full_name}&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">college</span>: <span className="text-emerald-300">&quot;Panimalar Engineering College&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">graduation</span>: <span className="text-emerald-300">&quot;2027&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">languages</span>: <span className="text-amber-300">[{languages.map(l => `"${l}"`).join(', ')}]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">frameworks</span>: <span className="text-indigo-300">[{frameworks.map(f => `"${f}"`).join(', ')}]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-cyan-400">status</span>: <span className="text-emerald-400 font-bold">&quot;Open to Opportunities&quot;</span>
                    </p>
                    <p>{'}'};</p>
                  </div>
                )}

                {/* TAB 2: HIGHLIGHTS */}
                {activeTab === 'stats' && (
                  <div className="space-y-3 font-sans">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-2xl font-bold font-mono text-amber-400">90+</div>
                        <div className="text-xs text-slate-200 mt-0.5 font-medium">LeetCode Solved</div>
                        <div className="text-[10px] text-slate-400 font-mono">81 Easy &middot; 9 Medium</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-2xl font-bold font-mono text-cyan-400">{projectCount}</div>
                        <div className="text-xs text-slate-200 mt-0.5 font-medium">Featured Projects</div>
                        <div className="text-[10px] text-slate-400 font-mono">Full-Stack, CV &amp; NLP</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-2xl font-bold font-mono text-emerald-400">{internshipCount}</div>
                        <div className="text-xs text-slate-200 mt-0.5 font-medium">Internships</div>
                        <div className="text-[10px] text-slate-400 font-mono">AI/ML &amp; Cloud (AWS)</div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-2xl font-bold font-mono text-indigo-400">{certCount}</div>
                        <div className="text-xs text-slate-200 mt-0.5 font-medium">Certifications</div>
                        <div className="text-[10px] text-slate-400 font-mono">Oracle, IBM, AWS, Infosys</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CLI */}
                {activeTab === 'terminal' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.06] pb-2">
                      <span className="text-slate-500">$</span>
                      {(['about', 'projects', 'skills', 'contact'] as const).map((cmd) => (
                        <button
                          key={cmd}
                          type="button"
                          onClick={() => setTerminalCommand(cmd)}
                          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                            terminalCommand === cmd ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          --{cmd}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1 text-slate-300 min-h-[120px]">
                      {terminalCommand === 'about' && (
                        <div className="space-y-1">
                          <p>&bull; Name: <span className="text-white font-bold">{profile.full_name}</span></p>
                          <p>&bull; Degree: <span className="text-slate-300">{profile.degree}</span></p>
                          <p>&bull; College: <span className="text-slate-300">{profile.college} ({profile.graduation_year})</span></p>
                          <p>&bull; Location: <span className="text-slate-300">{profile.location}</span></p>
                        </div>
                      )}

                      {terminalCommand === 'projects' && (
                        <div className="space-y-1">
                          <p>1. <span className="text-cyan-400 font-bold">arthaX:</span> Personal wealth &amp; finance terminal (Next.js, PostgreSQL)</p>
                          <p>2. <span className="text-indigo-400 font-bold">Object Detection:</span> Real-time video stream detection (Python, OpenCV, PyTorch)</p>
                          <p>3. <span className="text-purple-400 font-bold">NER Pipeline:</span> Named entity recognition from text (Python, SpaCy)</p>
                        </div>
                      )}

                      {terminalCommand === 'skills' && (
                        <div className="space-y-1">
                          <p>&bull; Languages: Java, Python, TypeScript, SQL</p>
                          <p>&bull; Frameworks: Next.js, React, PyTorch, OpenCV</p>
                          <p>&bull; Databases: PostgreSQL, Supabase, MongoDB</p>
                          <p>&bull; Cloud/Tools: AWS, Docker, Git</p>
                        </div>
                      )}

                      {terminalCommand === 'contact' && (
                        <div className="space-y-1">
                          <p>&bull; Email: {profile.email}</p>
                          <p>&bull; Phone: {profile.phone}</p>
                          <p>&bull; GitHub: github.com/technosaran</p>
                          <p>&bull; LinkedIn: linkedin.com/in/saran-r-b2b1a5275</p>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                      <span className="text-cyan-400">&gt;</span>
                      <input
                        type="text"
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        placeholder="Type about, projects, skills, contact..."
                        className="w-full bg-transparent text-sm sm:text-[11px] text-white placeholder-slate-600 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTerminalCommand('about');
                          setCliInput('');
                        }}
                        className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                    </form>
                  </div>
                )}

                {/* Bottom card footer */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Panimalar Engineering College</span>
                  <button
                    type="button"
                    onClick={copyProfileCode}
                    className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Config</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* 4 Clean Focus Cards */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 card-shine hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-2.5 text-purple-400 text-xs font-semibold">
              <Cpu className="h-4 w-4" />
              <span>AI &amp; Machine Learning</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">PyTorch, OpenCV, Scikit-Learn, SpaCy</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 card-shine hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-2.5 text-indigo-400 text-xs font-semibold">
              <Layers className="h-4 w-4" />
              <span>Full-Stack Development</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Next.js 16, React, TypeScript, Tailwind CSS</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 card-shine hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-semibold">
              <Database className="h-4 w-4" />
              <span>Databases &amp; Cloud</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">PostgreSQL, Supabase, AWS, Docker</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 card-shine hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-2.5 text-amber-400 text-xs font-semibold">
              <Code2 className="h-4 w-4" />
              <span>Problem Solving</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">90+ LeetCode Solved in Java (DSA)</p>
          </div>
        </div>

      </div>
    </section>
  );
}
