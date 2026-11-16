'use client';

import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Layers,
  Copy,
  Check,
  X,
  FileCode,
  Workflow
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

interface ProjectShowcaseProps {
  projects: Project[];
}

export default function ProjectsShowcase({ projects }: ProjectShowcaseProps) {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'all' | 'fullstack' | 'vision' | 'nlp'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [copiedCloneId, setCopiedCloneId] = useState<number | null>(null);
  const [inspectingProject, setInspectingProject] = useState<Project | null>(null);

  // Tab states for right-hand previews
  const [arthaxTab, setArthaxTab] = useState<'overview' | 'features' | 'architecture'>('overview');
  const [cvTab, setCvTab] = useState<'pipeline' | 'classes' | 'specs'>('pipeline');
  const [nlpTab, setNlpTab] = useState<'tester' | 'pipeline' | 'json'>('tester');

  // NLP Interactive State
  const nlpPresetSamples = [
    {
      text: 'Saran R engineered machine learning models with IBM SkillsBuild in Chennai.',
      entities: [
        { text: 'Saran R', tag: 'PERSON', color: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300' },
        { text: 'IBM SkillsBuild', tag: 'ORG', color: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' },
        { text: 'Chennai', tag: 'LOCATION', color: 'border-purple-500/40 bg-purple-500/15 text-purple-300' },
      ]
    },
    {
      text: 'arthaX integrates Next.js 16 and PostgreSQL with Supabase Row Level Security.',
      entities: [
        { text: 'arthaX', tag: 'PROJECT', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' },
        { text: 'Next.js 16', tag: 'FRAMEWORK', color: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' },
        { text: 'PostgreSQL', tag: 'DATABASE', color: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300' },
        { text: 'Supabase', tag: 'SECURITY', color: 'border-teal-500/40 bg-teal-500/15 text-teal-300' }
      ]
    },
    {
      text: 'PyTorch deep learning model processes video frames using OpenCV in real time.',
      entities: [
        { text: 'PyTorch', tag: 'FRAMEWORK', color: 'border-purple-500/40 bg-purple-500/15 text-purple-300' },
        { text: 'OpenCV', tag: 'LIBRARY', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' },
        { text: 'video frames', tag: 'INPUT', color: 'border-amber-500/40 bg-amber-500/15 text-amber-300' }
      ]
    }
  ];
  const [selectedNlpIdx, setSelectedNlpIdx] = useState(0);
  const [customNlpInput, setCustomNlpInput] = useState('');
  const [customResult, setCustomResult] = useState<{ text: string; tag: string; color: string }[] | null>(null);

  // Mouse spotlight handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Categorize projects
  const categorized = useMemo(() => {
    return projects.map((p) => {
      const t = p.title.toLowerCase();
      let category: 'fullstack' | 'vision' | 'nlp' = 'fullstack';
      let categoryLabel = 'Full-Stack & Web';
      let badgeColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';

      if (t.includes('object') || t.includes('detection') || t.includes('vision')) {
        category = 'vision';
        categoryLabel = 'Computer Vision & AI';
        badgeColor = 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      } else if (t.includes('entity') || t.includes('ner') || t.includes('nlp')) {
        category = 'nlp';
        categoryLabel = 'NLP & Text Analytics';
        badgeColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
      }

      return {
        ...p,
        category,
        categoryLabel,
        badgeColor,
      };
    });
  }, [projects]);

  // Unique tech stack
  const availableTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.tech_stack?.forEach((tech) => set.add(tech));
    });
    return Array.from(set).slice(0, 8);
  }, [projects]);

  // Combined filters
  const filteredProjects = useMemo(() => {
    return categorized.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesTech = selectedTech === 'all' || p.tech_stack?.includes(selectedTech);
      
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tech_stack?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesTech && matchesQuery;
    });
  }, [categorized, activeCategory, selectedTech, searchQuery]);

  const copyCloneCommand = (project: Project) => {
    const gitUrl = project.github_url || 'https://github.com/technosaran/arthax';
    const cmd = `git clone ${gitUrl}.git`;
    try {
      navigator.clipboard.writeText(cmd);
      setCopiedCloneId(project.id);
      toast(`Copied "${cmd}"`, 'success');
      setTimeout(() => setCopiedCloneId(null), 2000);
    } catch {
      toast('Failed to copy clone command', 'error');
    }
  };

  const handleCustomNlpAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNlpInput.trim()) {
      toast('Please enter a sentence to analyze', 'info');
      return;
    }

    const words = customNlpInput.trim().split(/\s+/);
    const parsed: { text: string; tag: string; color: string }[] = [];

    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (/^(saran|john|alice|bob)$/i.test(cleanWord)) {
        parsed.push({ text: word, tag: 'PERSON', color: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300' });
      } else if (/^(google|ibm|microsoft|oracle|infosys|nasscom)$/i.test(cleanWord)) {
        parsed.push({ text: word, tag: 'ORGANIZATION', color: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' });
      } else if (/^(chennai|india|london|tokyo|ny|california)$/i.test(cleanWord)) {
        parsed.push({ text: word, tag: 'LOCATION', color: 'border-purple-500/40 bg-purple-500/15 text-purple-300' });
      } else if (/^(python|java|react|nextjs|pytorch|opencv|sql|postgres|docker)$/i.test(cleanWord)) {
        parsed.push({ text: word, tag: 'TECHNOLOGY', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300' });
      }
    });

    if (parsed.length === 0) {
      parsed.push({ text: words[0], tag: 'ENTITY', color: 'border-slate-500/40 bg-slate-500/15 text-slate-300' });
    }

    setCustomResult(parsed);
    toast('Sentence parsed successfully', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Category Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        
        {/* Category Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'all', label: `All Systems (${projects.length})` },
              { key: 'fullstack', label: 'Full-Stack & Web' },
              { key: 'vision', label: 'Computer Vision & AI' },
              { key: 'nlp', label: 'NLP & Analytics' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-white via-slate-100 to-slate-200 text-slate-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects &amp; tech..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 font-mono"
          />
        </div>
      </div>

      {/* Tech Filter Quick Chips */}
      {availableTechs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-500 mr-1">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Filter Tech:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedTech('all')}
            className={`px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
              selectedTech === 'all'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold shadow-sm'
                : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            All Tech
          </button>
          {availableTechs.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSelectedTech(selectedTech === tech ? 'all' : tech)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                selectedTech === tech
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold shadow-sm'
                  : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <BrandLogo name={tech} size={14} badgeVariant="none" />
              <span>{tech}</span>
            </button>
          ))}
        </div>
      )}

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#090b16]/60 p-12 text-center backdrop-blur-xl">
          <p className="text-slate-400 font-mono text-sm">No projects found matching your search.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSelectedTech('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
        {filteredProjects.map((project) => {
          const isArthaX = project.title.toLowerCase().includes('arthax');
          const isVision = project.category === 'vision';
          const isNLP = project.category === 'nlp';

          return (
            <div
              key={project.id}
              onMouseMove={handleCardMouseMove}
              className="group relative rounded-3xl border border-white/[0.08] bg-[#090b16]/85 p-6 sm:p-8 lg:p-9 backdrop-blur-2xl hover:border-indigo-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/20 card-shine card-spotlight"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Project Details & Actions (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Category & Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${project.badgeColor} backdrop-blur-md`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {project.categoryLabel}
                    </span>

                    {project.live_url ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                        </span>
                        Live Demo Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-2.5 py-0.5 text-[11px] font-mono text-slate-400 backdrop-blur-md">
                        Open-Source System
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setInspectingProject(project)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan-400/40 px-2.5 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md"
                      title="Inspect Architecture"
                    >
                      <Layers className="h-3 w-3 text-cyan-400" />
                      <span>Architecture Specs</span>
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <div className="flex items-center gap-3">
                      <BrandLogo
                        name={project.tech_stack?.[0] || 'Next.js'}
                        size={36}
                        badgeVariant="glass"
                        showGlow
                        className="shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <p className="mt-2.5 text-sm text-slate-300/90 leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                    {project.highlights?.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech_stack?.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => setSelectedTech(tech)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono transition-all cursor-pointer ${
                          selectedTech === tech
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm'
                            : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20'
                        }`}
                        title={`Filter by ${tech}`}
                      >
                        <BrandLogo name={tech} size={14} badgeVariant="none" />
                        <span>{tech}</span>
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-100 hover:to-white px-5 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.22)] hover:shadow-[0_0_35px_rgba(99,102,241,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-950" />
                      </a>
                    )}

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-indigo-500/40 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>GitHub Repository</span>
                      </a>
                    )}

                    {project.github_url && (
                      <button
                        type="button"
                        onClick={() => copyCloneCommand(project)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-indigo-500/30 px-3.5 py-2.5 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Copy Git clone command"
                      >
                        {copiedCloneId === project.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Cloned!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>git clone</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>

                {/* Right Column: Clean Interactive Feature Preview (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#060812] overflow-hidden shadow-2xl card-shine">
                    
                    {/* Window Titlebar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0d18] border-b border-white/[0.06] text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        <span className="ml-1 text-[11px] text-slate-400">
                          {isArthaX ? 'arthax.vercel.app' : isVision ? 'realtime_detection.py' : 'ner_nlp_pipeline.py'}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono">Interactive</span>
                    </div>

                    {/* Window Visual Body */}
                    <div className="p-5 font-mono text-xs space-y-4">
                      
                      {/* PREVIEW 1: arthaX Real Feature Overview */}
                      {isArthaX && (
                        <div className="space-y-4">
                          {/* Subtabs */}
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              {(['overview', 'features', 'architecture'] as const).map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  onClick={() => setArthaxTab(tab)}
                                  className={`text-[10px] uppercase font-mono cursor-pointer transition-colors ${
                                    arthaxTab === tab ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono">Production Ready</span>
                          </div>

                          {arthaxTab === 'overview' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                  <div className="text-[10px] text-slate-400 font-sans">Multi-Asset Tracking</div>
                                  <div className="text-sm font-bold text-white font-mono mt-0.5">Equities &amp; Funds</div>
                                </div>
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                  <div className="text-[10px] text-slate-400 font-sans">Data Privacy</div>
                                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Supabase RLS</div>
                                </div>
                              </div>

                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2 font-sans text-xs">
                                <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Platform Overview</div>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  Personal wealth tracking dashboard engineered with Next.js 16 App Router. Designed for users to log assets, track net worth progression, and categorize transactions securely.
                                </p>
                              </div>
                            </div>
                          )}

                          {arthaxTab === 'features' && (
                            <div className="space-y-2 text-xs font-sans">
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-white text-[11px]">Dynamic Asset Allocation</div>
                                  <div className="text-[10px] text-slate-400">Categorize equities, fixed income, savings, and investments.</div>
                                </div>
                              </div>
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-white text-[11px]">Dark Mode UI</div>
                                  <div className="text-[10px] text-slate-400">Tailwind CSS dark palette with rapid client-side rendering.</div>
                                </div>
                              </div>
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-white text-[11px]">User Row-Level Security</div>
                                  <div className="text-[10px] text-slate-400">PostgreSQL policies ensure strict data isolation per authenticated user.</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {arthaxTab === 'architecture' && (
                            <div className="space-y-2 font-mono text-[11px]">
                              <div className="rounded-xl border border-white/[0.06] bg-black/50 p-3 space-y-1.5">
                                <div className="text-slate-500 text-[10px] uppercase">Stack Flow</div>
                                <div className="text-cyan-300">Frontend: Next.js 16 + React 19 + TypeScript</div>
                                <div className="text-indigo-300">Backend: Next.js Route Handlers &amp; Server Actions</div>
                                <div className="text-emerald-300">Database: PostgreSQL (Supabase with RLS)</div>
                                <div className="text-amber-300">Hosting: Vercel Edge Network</div>
                              </div>
                            </div>
                          )}

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                            <span>PostgreSQL + Supabase</span>
                            <span className="text-cyan-400 font-semibold font-mono">Next.js 16 App Router</span>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW 2: Computer Vision Pipeline Overview */}
                      {isVision && (
                        <div className="space-y-4">
                          {/* Subtabs */}
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              {(['pipeline', 'classes', 'specs'] as const).map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  onClick={() => setCvTab(tab)}
                                  className={`text-[10px] uppercase font-mono cursor-pointer transition-colors ${
                                    cvTab === tab ? 'text-purple-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-purple-400 font-mono">PyTorch / OpenCV</span>
                          </div>

                          {cvTab === 'pipeline' && (
                            <div className="space-y-2.5">
                              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 space-y-2 text-xs font-sans">
                                <div className="text-[11px] font-mono text-purple-300 font-semibold uppercase">Inference Flow</div>
                                <div className="space-y-1.5 text-[11px] text-slate-300">
                                  <div className="flex items-center gap-2">
                                    <span className="h-5 w-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                                    <span>Video Frame Capture (OpenCV)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="h-5 w-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                                    <span>Tensor Preprocessing &amp; Normalization</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="h-5 w-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                                    <span>Deep Learning Inference (PyTorch)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="h-5 w-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">4</span>
                                    <span>Bounding Box Rendering &amp; Class Labeling</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {cvTab === 'classes' && (
                            <div className="space-y-2 text-xs font-sans">
                              <div className="text-[10px] font-mono text-slate-400 uppercase">Recognized Object Categories</div>
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-slate-200">
                                  • People &amp; Pedestrians
                                </div>
                                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-slate-200">
                                  • Vehicles &amp; Bicycles
                                </div>
                                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-slate-200">
                                  • Electronics &amp; Laptops
                                </div>
                                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-slate-200">
                                  • Indoor Objects &amp; Chairs
                                </div>
                              </div>
                            </div>
                          )}

                          {cvTab === 'specs' && (
                            <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-mono">
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                <div className="text-white font-bold">OpenCV</div>
                                <div className="text-[10px] text-slate-500">Video Processing</div>
                              </div>
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                <div className="text-purple-400 font-bold">PyTorch</div>
                                <div className="text-[10px] text-slate-500">Neural Network</div>
                              </div>
                            </div>
                          )}

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                            <span>OpenCV + Deep Learning</span>
                            <span className="text-purple-400 font-semibold font-mono">Computer Vision</span>
                          </div>
                        </div>
                      )}

                      {/* PREVIEW 3: Named Entity Recognition Parser */}
                      {isNLP && (
                        <div className="space-y-4">
                          {/* Subtabs */}
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              {(['tester', 'pipeline', 'json'] as const).map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  onClick={() => setNlpTab(tab)}
                                  className={`text-[10px] uppercase font-mono cursor-pointer transition-colors ${
                                    nlpTab === tab ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-indigo-400 font-mono">SpaCy / NLP</span>
                          </div>

                          {nlpTab === 'tester' && (
                            <div className="space-y-3">
                              {/* Sample Selector */}
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>Preset Samples:</span>
                                <div className="flex items-center gap-1">
                                  {nlpPresetSamples.map((_, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => {
                                        setSelectedNlpIdx(sIdx);
                                        setCustomResult(null);
                                        setCustomNlpInput('');
                                      }}
                                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                                        selectedNlpIdx === sIdx && !customResult
                                          ? 'bg-indigo-500/25 text-indigo-300 font-bold'
                                          : 'text-slate-500 hover:text-slate-300'
                                      }`}
                                    >
                                      Sample #{sIdx + 1}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Active Sentence & Extracted Entities */}
                              <div className="rounded-xl border border-white/[0.08] bg-black/60 p-3 space-y-2 text-xs font-sans leading-relaxed">
                                <p className="text-slate-300 text-[11px]">
                                  {customResult ? customNlpInput : nlpPresetSamples[selectedNlpIdx].text}
                                </p>
                                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/[0.06]">
                                  {(customResult || nlpPresetSamples[selectedNlpIdx].entities).map((ent) => (
                                    <span
                                      key={ent.text}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono ${ent.color}`}
                                    >
                                      <strong>{ent.text}</strong>
                                      <span className="opacity-75">[{ent.tag}]</span>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Custom input form */}
                              <form onSubmit={handleCustomNlpAnalyze} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={customNlpInput}
                                  onChange={(e) => setCustomNlpInput(e.target.value)}
                                  placeholder="Type a sentence (e.g., Saran used Python in Chennai)..."
                                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 font-mono"
                                />
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold hover:bg-indigo-500/30 transition-colors shrink-0 cursor-pointer"
                                >
                                  Extract
                                </button>
                              </form>
                            </div>
                          )}

                          {nlpTab === 'pipeline' && (
                            <div className="space-y-2 text-xs font-sans">
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                <div className="text-[11px] font-semibold text-white">1. Tokenization</div>
                                <div className="text-[10px] text-slate-400">Splits input sentences into discrete linguistic tokens.</div>
                              </div>
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                <div className="text-[11px] font-semibold text-white">2. Part-of-Speech Tagging</div>
                                <div className="text-[10px] text-slate-400">Identifies grammatical categories (nouns, verbs, adjectives).</div>
                              </div>
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                                <div className="text-[11px] font-semibold text-white">3. Named Entity Classification</div>
                                <div className="text-[10px] text-slate-400">Tags entities into Person, Organization, Location, and Tech.</div>
                              </div>
                            </div>
                          )}

                          {nlpTab === 'json' && (
                            <div className="rounded-xl border border-white/[0.08] bg-black/80 p-3 font-mono text-[10px] text-slate-300 max-h-36 overflow-y-auto">
                              <pre>{JSON.stringify({
                                pipeline: "SpaCy NLP Entity Extraction",
                                sentence: nlpPresetSamples[selectedNlpIdx].text,
                                entities: nlpPresetSamples[selectedNlpIdx].entities.map(e => ({
                                  entity: e.text,
                                  type: e.tag
                                }))
                              }, null, 2)}</pre>
                            </div>
                          )}

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
                            <span>SpaCy + Scikit-Learn</span>
                            <span className="text-indigo-400 font-semibold font-mono">NLP Pipeline</span>
                          </div>
                        </div>
                      )}

                      {/* Generic fallback preview */}
                      {!isArthaX && !isVision && !isNLP && (
                        <div className="space-y-3 font-sans text-xs">
                          <div className="text-white font-semibold">{project.title}</div>
                          <p className="text-slate-400 text-[11px]">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {project.tech_stack?.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>

              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* SYSTEM ARCHITECTURE & SCHEMAS MODAL */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/[0.12] bg-[#090b16] p-6 sm:p-8 shadow-2xl card-shine max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Technical Architecture
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  {inspectingProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingProject(null)}
                className="p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs text-slate-300 font-mono">
              {/* Architecture Blueprint */}
              <div className="space-y-2">
                <div className="text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Key Engineering Implementations</span>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-4 space-y-2 font-sans text-xs">
                  {inspectingProject.highlights?.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-200">
                      <span className="text-cyan-400 font-mono font-bold">0{i+1}.</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Applied */}
              <div className="space-y-2">
                <div className="text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Technology Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {inspectingProject.tech_stack?.map((t) => (
                    <div key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white">
                      <BrandLogo name={t} size={15} badgeVariant="none" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Access */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-sans">Repository on GitHub</span>
                {inspectingProject.github_url && (
                  <a
                    href={inspectingProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-white via-slate-100 to-slate-200 text-slate-950 font-bold hover:from-slate-100 hover:to-white transition-all shadow-md"
                  >
                    <span>View Repository</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-950" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
