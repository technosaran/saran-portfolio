'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Layers, 
  Copy, 
  Check, 
  X,
  Atom,
  Sparkles
} from 'lucide-react';
import { Skill } from '@/lib/neon/db';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';

interface SkillsNucleusProps {
  skills?: Skill[];
}

export interface SkillItem {
  id: number | string;
  name: string;
  category: 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database';
  categoryLabel: string;
  context: string;
  projects: string[];
  orbit?: number; // 1: Inner, 2: Mid-Inner, 3: Mid-Outer, 4: Outer
  proficiency?: string;
}

// Quantum formulas that power the quantum core
interface QuantumFormula {
  id: string;
  title: string;
  formula: string;
  symbolHtml: React.ReactNode;
  badge: string;
}

const QUANTUM_FORMULAS: QuantumFormula[] = [
  {
    id: 'mass-energy',
    title: 'Mass-Energy Equivalence',
    formula: 'E = mc²',
    symbolHtml: (
      <span className="font-mono font-black tracking-wider">
        E = mc<sup className="text-sm font-bold text-cyan-300">2</sup>
      </span>
    ),
    badge: 'Universal Invariant'
  },
  {
    id: 'field-equations',
    title: 'Field Equations',
    formula: 'G_μν = (8πG/c⁴) T_μν',
    symbolHtml: (
      <span className="font-mono font-bold tracking-tight">
        G<sub className="text-[10px]">μν</sub> = <span className="text-xs">8πG</span>/<span className="text-xs">c⁴</span> T<sub className="text-[10px]">μν</sub>
      </span>
    ),
    badge: 'Gravitational Metric'
  },
  {
    id: 'energy-momentum',
    title: 'Energy-Momentum Relation',
    formula: 'E² = (pc)² + (m₀c²)²',
    symbolHtml: (
      <span className="font-mono font-bold tracking-tight text-base sm:text-lg">
        E<sup className="text-[10px]">2</sup> = (pc)<sup className="text-[10px]">2</sup> + (m₀c<sup className="text-[10px]">2</sup>)<sup className="text-[10px]">2</sup>
      </span>
    ),
    badge: 'Quantum Momentum'
  },
  {
    id: 'lorentz',
    title: 'Lorentz Transformation',
    formula: 'γ = 1 / √(1 - v²/c²)',
    symbolHtml: (
      <span className="font-mono font-bold tracking-tight text-base sm:text-lg">
        γ = 1 / √(1 - v<sup className="text-[10px]">2</sup>/c<sup className="text-[10px]">2</sup>)
      </span>
    ),
    badge: 'Spacetime Metric'
  }
];

// 32 Complete technologies for Saran R's technical stack
const DEFAULT_SKILLS: SkillItem[] = [
  // 1. Programming Languages (Orbit 1: Core Foundation)
  { id: 'python', name: 'Python', category: 'languages', categoryLabel: 'Programming Languages', context: 'PyTorch Deep Learning, OpenCV Computer Vision, SpaCy NLP pipelines', projects: ['Real-Time Object Detection', 'NER NLP Pipeline', 'IBM SkillsBuild'], orbit: 1, proficiency: 'Expert' },
  { id: 'java', name: 'Java', category: 'languages', categoryLabel: 'Programming Languages', context: '90+ LeetCode DSA Solutions, Object-Oriented Architecture, Enterprise Runtimes', projects: ['LeetCode 90+ Problems', 'Panimalar Coursework'], orbit: 1, proficiency: 'Expert' },
  { id: 'typescript', name: 'TypeScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Type-safe full-stack engineering with Next.js 16, React 19 & Drizzle ORM', projects: ['arthaX Wealth Terminal', 'Portfolio Core'], orbit: 1, proficiency: 'Advanced' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', categoryLabel: 'Programming Languages', context: 'Modern ESNext, asynchronous APIs, event loops & client DOM hydration', projects: ['arthaX Terminal', 'Web Microservices'], orbit: 1, proficiency: 'Advanced' },
  { id: 'sql', name: 'SQL', category: 'languages', categoryLabel: 'Programming Languages', context: 'Complex analytic queries, indexes, ACID transactions & schema normalization', projects: ['arthaX PostgreSQL Schema', 'DBMS Coursework'], orbit: 1, proficiency: 'Advanced' },

  // 2. AI & Machine Learning (Orbit 2: Deep Learning & Vision)
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Deep neural network training, tensor math, autograd & computer vision architectures', projects: ['Real-Time Object Detection System'], orbit: 2, proficiency: 'Advanced' },
  { id: 'opencv', name: 'OpenCV', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Real-time video stream capture, bounding box tracking & frame manipulation', projects: ['Real-Time Object Detection System'], orbit: 2, proficiency: 'Advanced' },
  { id: 'scikitlearn', name: 'Scikit-Learn', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Supervised & unsupervised ML, regression algorithms, classification & PCA', projects: ['IBM SkillsBuild Capstone'], orbit: 2, proficiency: 'Advanced' },
  { id: 'spacy', name: 'SpaCy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Tokenization, Part-of-Speech tagging & Named Entity Recognition (NER)', projects: ['NER System NLP Pipeline'], orbit: 2, proficiency: 'Advanced' },
  { id: 'pandas', name: 'Pandas', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'High-speed DataFrame manipulation, ETL pipelines & exploratory data analysis', projects: ['Financial Data Analysis', 'ML Pipelines'], orbit: 2, proficiency: 'Advanced' },
  { id: 'numpy', name: 'NumPy', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Vectorized linear algebra, multi-dimensional tensor computation & numerical math', projects: ['Deep Learning & Matrix Math'], orbit: 2, proficiency: 'Advanced' },
  { id: 'computervision', name: 'Computer Vision', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Real-time spatial detection, YOLO models, visual segmentation & camera streams', projects: ['Real-Time Object Detection'], orbit: 2, proficiency: 'Advanced' },
  { id: 'nlp', name: 'NLP', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Sequence tagging, entity extraction, sentiment analysis & linguistic parsing', projects: ['NER NLP Pipeline'], orbit: 2, proficiency: 'Advanced' },
  { id: 'deeplearning', name: 'Deep Learning', category: 'aiml', categoryLabel: 'AI & Machine Learning', context: 'Convolutional neural nets, loss backpropagation & GPU-accelerated inferencing', projects: ['Object Detection', 'IBM Capstone'], orbit: 2, proficiency: 'Advanced' },

  // 3. Frameworks & Web (Orbit 3: Modern Full-Stack)
  { id: 'nextjs', name: 'Next.js 16', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Turbopack, Server Components, Server Actions & App Router micro-frontends', projects: ['arthaX Wealth Terminal', 'Developer Portfolio'], orbit: 3, proficiency: 'Expert' },
  { id: 'react', name: 'React.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'React 19 concurrent features, custom hooks & high-performance interactive interfaces', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 3, proficiency: 'Expert' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Tailwind CSS 4, modern utility design, glassmorphism, responsive grids & tokens', projects: ['arthaX Terminal', 'Developer Portfolio'], orbit: 3, proficiency: 'Expert' },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Asynchronous event runtimes, high-throughput microservices & streaming APIs', projects: ['Full-Stack Microservices'], orbit: 3, proficiency: 'Advanced' },
  { id: 'express', name: 'Express.js', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'RESTful API endpoints, secure middleware chains & routing architecture', projects: ['Backend Microservices'], orbit: 3, proficiency: 'Advanced' },
  { id: 'restapi', name: 'RESTful APIs', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Idempotent HTTP routes, rate limiting, JSON serialization & error schemas', projects: ['arthaX Financial APIs'], orbit: 3, proficiency: 'Advanced' },
  { id: 'microservices', name: 'Microservices', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Modular services architecture, fault isolation & container inter-communication', projects: ['Distributed System Coursework'], orbit: 3, proficiency: 'Proficient' },
  { id: 'html5', name: 'HTML5 / CSS3', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Semantic accessible markup, WCAG 2.2 AA standards & hardware animations', projects: ['Production Web Apps'], orbit: 3, proficiency: 'Expert' },
  { id: 'websockets', name: 'WebSockets', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Low-latency bi-directional sockets for live financial tickers & updates', projects: ['arthaX Market Ticker'], orbit: 3, proficiency: 'Proficient' },
  { id: 'turbopack', name: 'Turbopack', category: 'frameworks', categoryLabel: 'Frameworks & Web', context: 'Rust-based compilation pipeline for instant hot module reloading', projects: ['Developer Portfolio'], orbit: 3, proficiency: 'Advanced' },

  // 4. Cloud & Databases (Orbit 4: Infrastructure & Data)
  { id: 'aws', name: 'AWS Cloud', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'EC2 compute, S3 object storage, IAM role policies & secure cloud architecture', projects: ['CodTech Internship', 'Cloud Architecture'], orbit: 4, proficiency: 'Advanced' },
  { id: 'docker', name: 'Docker', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'OCI container packaging, multi-stage builds & environment reproducibility', projects: ['CodTech Internship', 'Microservices'], orbit: 4, proficiency: 'Advanced' },
  { id: 'git', name: 'Git & GitHub', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Distributed version control, GitHub Actions CI/CD & pull request workflows', projects: ['arthaX', 'All Open-Source Repositories'], orbit: 4, proficiency: 'Expert' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases & Storage', context: 'Relational database schemas, B-tree indexes, transactions & ACID compliance', projects: ['arthaX Wealth Terminal', 'Neon Database'], orbit: 4, proficiency: 'Advanced' },
  { id: 'supabase', name: 'Supabase', category: 'database', categoryLabel: 'Databases & Storage', context: 'Row-Level Security (RLS) policies, PostgreSQL realtime & user authentication', projects: ['arthaX Wealth Terminal'], orbit: 4, proficiency: 'Advanced' },
  { id: 'neon', name: 'Neon Database', category: 'database', categoryLabel: 'Databases & Storage', context: 'Serverless PostgreSQL with instant autoscaling & database branch snapshots', projects: ['Portfolio Production DB'], orbit: 4, proficiency: 'Advanced' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', categoryLabel: 'Databases & Storage', context: 'NoSQL document storage, flexible BSON schemas & aggregation pipelines', projects: ['Full-Stack Data Storage'], orbit: 4, proficiency: 'Proficient' },
  { id: 'linux', name: 'Linux / Bash', category: 'cloud', categoryLabel: 'Cloud & DevOps', context: 'Unix CLI scripting, permissions, process monitoring, systemd & SSH workflows', projects: ['DevOps & Server Deployment'], orbit: 4, proficiency: 'Advanced' },
];

export default function SkillsNucleus({ skills = [] }: SkillsNucleusProps) {
  const { toast } = useToast();

  // State Management
  const [viewMode, setViewMode] = useState<'nucleus' | 'matrix'>('nucleus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [currentFormulaIndex, setCurrentFormulaIndex] = useState(0);
  const [copiedStack, setCopiedStack] = useState(false);

  // Quantum Nucleus Simulation Settings
  const isRotating = true;
  const orbitSpeedMultiplier = 1;
  const isReverse = false;
  const [zoomScale, setZoomScale] = useState(1);
  const arenaRef = useRef<HTMLDivElement>(null);

  // Calculate responsive dynamic scale for orbit container across all device widths
  useEffect(() => {
    const handleResize = () => {
      const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : window.innerWidth;
      // 780 is coordinate diameter of outer orbit; compute fluid scale with safety margin
      const targetScale = Math.min(1, Math.max(0.40, (arenaWidth - 24) / 780));
      setZoomScale(targetScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Merge database skills with default catalog
  const allSkillsList: SkillItem[] = useMemo(() => {
    if (!skills || skills.length === 0) return DEFAULT_SKILLS;

    const mapped = DEFAULT_SKILLS.map((defaultItem) => {
      const match = skills.find(
        (s) => s.name.toLowerCase() === defaultItem.name.toLowerCase()
      );
      if (match) {
        return {
          ...defaultItem,
          id: match.id,
          proficiency: match.level || defaultItem.proficiency
        };
      }
      return defaultItem;
    });

    skills.forEach((s) => {
      const exists = mapped.some((m) => m.name.toLowerCase() === s.name.toLowerCase());
      if (!exists) {
        const catLower = (s.category || '').toLowerCase();
        let category: SkillItem['category'] = 'frameworks';
        let categoryLabel = s.category || 'Frameworks';
        let orbit = 3;

        if (catLower.includes('language') || ['c', 'c++', 'go', 'rust'].includes(s.name.toLowerCase())) {
          category = 'languages';
          categoryLabel = 'Programming Languages';
          orbit = 1;
        } else if (catLower.includes('ai') || catLower.includes('machine')) {
          category = 'aiml';
          categoryLabel = 'AI & Machine Learning';
          orbit = 2;
        } else if (catLower.includes('cloud') || catLower.includes('devops')) {
          category = 'cloud';
          categoryLabel = 'Cloud & DevOps';
          orbit = 4;
        } else if (catLower.includes('database')) {
          category = 'database';
          categoryLabel = 'Databases & Storage';
          orbit = 4;
        }

        mapped.push({
          id: s.id,
          name: s.name,
          category,
          categoryLabel,
          context: s.level || 'Applied in production software',
          projects: ['Production Engineering'],
          orbit,
          proficiency: s.level || 'Proficient'
        });
      }
    });

    return mapped;
  }, [skills]);

  // Filter skills by search query
  const filteredSkills = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allSkillsList;
    return allSkillsList.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.context.toLowerCase().includes(q) ||
      s.categoryLabel.toLowerCase().includes(q)
    );
  }, [allSkillsList, searchQuery]);

  // Group skills into the 4 Bohr orbits
  const orbit1Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 1), [allSkillsList]);
  const orbit2Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 2).slice(0, 6), [allSkillsList]);
  const orbit3Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 3).slice(0, 6), [allSkillsList]);
  const orbit4Skills = useMemo(() => allSkillsList.filter((s) => s.orbit === 4).slice(0, 7), [allSkillsList]);

  // Active Quantum Formula
  const activeFormula = QUANTUM_FORMULAS[currentFormulaIndex];

  const cycleFormula = () => {
    setCurrentFormulaIndex((prev) => (prev + 1) % QUANTUM_FORMULAS.length);
    toast(`Quantum Core: ${QUANTUM_FORMULAS[(currentFormulaIndex + 1) % QUANTUM_FORMULAS.length].title}`, 'info');
  };

  const copyStackJson = () => {
    const listToCopy = allSkillsList.map((s) => ({
      name: s.name,
      category: s.categoryLabel,
      proficiency: s.proficiency,
      context: s.context,
      projects: s.projects,
    }));
    try {
      navigator.clipboard.writeText(JSON.stringify(listToCopy, null, 2));
      setCopiedStack(true);
      toast('Technical stack copied as JSON!', 'success');
      setTimeout(() => setCopiedStack(false), 2000);
    } catch {
      toast('Failed to copy skills', 'error');
    }
  };

  // Base rotation durations (seconds)
  const orbitDurations = {
    orbit1: 34 / orbitSpeedMultiplier,
    orbit2: 44 / orbitSpeedMultiplier,
    orbit3: 56 / orbitSpeedMultiplier,
    orbit4: 68 / orbitSpeedMultiplier,
  };

  const activeInspected = hoveredSkill || selectedSkill;

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* TOP CONTROLS & VIEW MODE SELECTOR                        */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        
        {/* Left: Dual View Mode Switcher */}
        <div className="flex items-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.08] backdrop-blur-md self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('nucleus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              viewMode === 'nucleus'
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Atom className={`h-3.5 w-3.5 ${viewMode === 'nucleus' ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Quantum Nucleus</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-gradient-to-r from-white via-slate-100 to-slate-200 text-slate-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Tech Matrix</span>
          </button>
        </div>

        {/* Right Tools: Live Search, Core Formula Cycle & Copy Stack */}
        <div className="flex items-center gap-2">
          {viewMode === 'nucleus' && (
            <button
              type="button"
              onClick={cycleFormula}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono transition-all cursor-pointer"
              title="Click to cycle quantum core equation"
            >
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span className="font-bold">{activeFormula.formula}</span>
            </button>
          )}

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, AI, tools..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm sm:text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={copyStackJson}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Copy technical stack as JSON"
          >
            {copiedStack ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Stack</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* VIEW 1: QUANTUM NUCLEUS SIMULATION                       */}
      {/* ======================================================== */}
      {viewMode === 'nucleus' && (
        <div className="space-y-4">
          
          {/* Quantum Orbit Arena Stage */}
          <div 
            ref={arenaRef}
            className="relative rounded-3xl border border-[#1e2940] bg-[#0f1726]/95 overflow-hidden shadow-2xl backdrop-blur-2xl p-3 sm:p-6"
            style={{
              minHeight: zoomScale < 0.6 ? '460px' : zoomScale < 0.85 ? '560px' : '680px',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(20, 30, 60, 0.45) 0%, rgba(7, 8, 15, 0.95) 100%)'
            }}
          >
            
            {/* Background Spacetime Grid & Particle Noise */}
            <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
            <div className="absolute inset-0 bg-dots-pattern opacity-15 pointer-events-none" />
            
            {/* Ambient Radial Glowing Nebula */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-cyan-500/15 blur-[80px] pointer-events-none" />

            {/* Orbit Center Interactive Stage */}
            <div className="relative w-full h-[380px] xs:h-[420px] sm:h-[520px] md:h-[640px] flex items-center justify-center overflow-hidden">
              
              {/* Scaled Orbit System (Responsive across devices) */}
              <div 
                className="relative shrink-0 flex items-center justify-center origin-center transition-transform duration-300"
                style={{
                  width: '780px',
                  height: '780px',
                  transform: `scale(${zoomScale})`
                }}
              >

                {/* SVG Concentric Orbit Track Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
                  <defs>
                    <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Crosshairs & Axes */}
                  <line x1="390" y1="30" x2="390" y2="750" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 8" />
                  <line x1="30" y1="390" x2="750" y2="390" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 8" />
                  <circle cx="390" cy="390" r="390" fill="none" stroke="rgba(255,255,255,0.03)" />

                  {/* Orbit Track 1: Languages (r=135px) */}
                  <circle
                    cx="390"
                    cy="390"
                    r="135"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    className="transition-colors duration-300"
                  />

                  {/* Orbit Track 2: AI & ML (r=215px) */}
                  <circle
                    cx="390"
                    cy="390"
                    r="215"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                    className="transition-colors duration-300"
                  />

                  {/* Orbit Track 3: Frameworks & Web (r=290px) */}
                  <circle
                    cx="390"
                    cy="390"
                    r="290"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="6 8"
                    className="transition-colors duration-300"
                  />

                  {/* Orbit Track 4: Cloud & Databases (r=365px) */}
                  <circle
                    cx="390"
                    cy="390"
                    r="365"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="6 10"
                    className="transition-colors duration-300"
                  />
                </svg>

                {/* =================================================== */}
                {/* 1. CENTER QUANTUM NUCLEUS                           */}
                {/* =================================================== */}
                <div 
                  onClick={cycleFormula}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group select-none"
                  title="Quantum Core · Click to cycle equation"
                >
                  
                  {/* Gravitational Wave Ripples */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-spacetime-ripple pointer-events-none" />
                  <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spacetime-ripple pointer-events-none" style={{ animationDelay: '2s' }} />

                  {/* Rotating Event Horizon Ring */}
                  <div 
                    className="absolute -inset-4 rounded-full border border-dashed border-cyan-400/40 animate-event-horizon pointer-events-none" 
                  />
                  <div 
                    className="absolute -inset-7 rounded-full border border-dotted border-blue-400/20 pointer-events-none"
                    style={{ animation: 'event-horizon-spin 30s linear infinite reverse' }} 
                  />

                  {/* Pulsating Quantum Nucleus Core Body */}
                  <div 
                    className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 text-center border-2 border-cyan-400/60 bg-gradient-to-b from-[#0b162c] via-[#091024] to-[#04060c] shadow-[0_0_40px_rgba(56,189,248,0.5),0_0_80px_rgba(99,102,241,0.3),inset_0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 group-hover:border-cyan-300 group-hover:shadow-[0_0_60px_rgba(56,189,248,0.7),0_0_120px_rgba(99,102,241,0.5)] transition-all duration-300 animate-nucleus-pulse"
                  >

                    {/* Prominent Formula */}
                    <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.75)]">
                      {activeFormula.symbolHtml}
                    </div>

                    {/* Subtitle / Physics law */}
                    <div className="text-[8px] font-mono text-cyan-300/80 tracking-tight mt-1 leading-tight">
                      {activeFormula.title}
                    </div>

                    {/* Telemetry Footer */}
                    <div className="mt-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-mono text-cyan-300/90">
                      Tap to switch &rarr;
                    </div>

                  </div>
                </div>

                {/* =================================================== */}
                {/* 2. ORBIT 1: LANGUAGES (Radius: 135px)               */}
                {/* =================================================== */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    animation: isReverse ? 'orbit-spin-ccw' : 'orbit-spin-cw',
                    animationDuration: `${orbitDurations.orbit1}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: !isRotating ? 'paused' : 'running',
                  }}
                >
                  {orbit1Skills.map((skill, idx) => {
                    const angle = (360 / orbit1Skills.length) * idx;
                    const isDimmed = Boolean(searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
                    const isCurrent = activeInspected?.name === skill.name;

                    return (
                      <div
                        key={skill.id}
                        className="absolute left-1/2 top-1/2 pointer-events-auto"
                        style={{
                          transform: `rotate(${angle}deg) translate(135px) rotate(-${angle}deg)`,
                        }}
                      >
                        <div
                          style={{
                            animation: isReverse ? 'counter-spin-ccw' : 'counter-spin-cw',
                            animationDuration: `${orbitDurations.orbit1}s`,
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
                            animationPlayState: !isRotating ? 'paused' : 'running',
                          }}
                        >
                          <div
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                            onClick={() => setSelectedSkill(skill)}
                            className={`group relative -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                              isDimmed
                                ? 'opacity-25 scale-85 bg-black/40 border-white/5'
                                : isCurrent
                                ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-110 z-30'
                                : 'bg-[#0a0f1d]/90 hover:bg-[#101932] border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] hover:scale-105 z-10'
                            } backdrop-blur-md`}
                          >
                            <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                            <span className="text-xs font-mono font-medium text-white group-hover:text-cyan-300 whitespace-nowrap">
                              {skill.name}
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* =================================================== */}
                {/* 3. ORBIT 2: AI & MACHINE LEARNING (Radius: 215px)    */}
                {/* =================================================== */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    animation: isReverse ? 'orbit-spin-cw' : 'orbit-spin-ccw',
                    animationDuration: `${orbitDurations.orbit2}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: !isRotating ? 'paused' : 'running',
                  }}
                >
                  {orbit2Skills.map((skill, idx) => {
                    const angle = (360 / orbit2Skills.length) * idx + 30;
                    const isDimmed = Boolean(searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
                    const isCurrent = activeInspected?.name === skill.name;

                    return (
                      <div
                        key={skill.id}
                        className="absolute left-1/2 top-1/2 pointer-events-auto"
                        style={{
                          transform: `rotate(${angle}deg) translate(215px) rotate(-${angle}deg)`,
                        }}
                      >
                        <div
                          style={{
                            animation: isReverse ? 'counter-spin-cw' : 'counter-spin-ccw',
                            animationDuration: `${orbitDurations.orbit2}s`,
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
                            animationPlayState: !isRotating ? 'paused' : 'running',
                          }}
                        >
                          <div
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                            onClick={() => setSelectedSkill(skill)}
                            className={`group relative -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                              isDimmed
                                ? 'opacity-25 scale-85 bg-black/40 border-white/5'
                                : isCurrent
                                ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-110 z-30'
                                : 'bg-[#100c22]/90 hover:bg-[#1a1236] border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_16px_rgba(168,85,247,0.4)] hover:scale-105 z-10'
                            } backdrop-blur-md`}
                          >
                            <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                            <span className="text-xs font-mono font-medium text-white group-hover:text-purple-300 whitespace-nowrap">
                              {skill.name}
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* =================================================== */}
                {/* 4. ORBIT 3: FRAMEWORKS & WEB (Radius: 290px)         */}
                {/* =================================================== */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    animation: isReverse ? 'orbit-spin-ccw' : 'orbit-spin-cw',
                    animationDuration: `${orbitDurations.orbit3}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: !isRotating ? 'paused' : 'running',
                  }}
                >
                  {orbit3Skills.map((skill, idx) => {
                    const angle = (360 / orbit3Skills.length) * idx + 15;
                    const isDimmed = Boolean(searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
                    const isCurrent = activeInspected?.name === skill.name;

                    return (
                      <div
                        key={skill.id}
                        className="absolute left-1/2 top-1/2 pointer-events-auto"
                        style={{
                          transform: `rotate(${angle}deg) translate(290px) rotate(-${angle}deg)`,
                        }}
                      >
                        <div
                          style={{
                            animation: isReverse ? 'counter-spin-ccw' : 'counter-spin-cw',
                            animationDuration: `${orbitDurations.orbit3}s`,
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
                            animationPlayState: !isRotating ? 'paused' : 'running',
                          }}
                        >
                          <div
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                            onClick={() => setSelectedSkill(skill)}
                            className={`group relative -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                              isDimmed
                                ? 'opacity-25 scale-85 bg-black/40 border-white/5'
                                : isCurrent
                                ? 'bg-indigo-950/90 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.7)] scale-110 z-30'
                                : 'bg-[#0a0f26]/90 hover:bg-[#121a42] border-indigo-500/30 hover:border-indigo-400 hover:shadow-[0_0_16px_rgba(99,102,241,0.4)] hover:scale-105 z-10'
                            } backdrop-blur-md`}
                          >
                            <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                            <span className="text-xs font-mono font-medium text-white group-hover:text-indigo-300 whitespace-nowrap">
                              {skill.name}
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* =================================================== */}
                {/* 5. ORBIT 4: CLOUD & DATABASES (Radius: 365px)        */}
                {/* =================================================== */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    animation: isReverse ? 'orbit-spin-cw' : 'orbit-spin-ccw',
                    animationDuration: `${orbitDurations.orbit4}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: !isRotating ? 'paused' : 'running',
                  }}
                >
                  {orbit4Skills.map((skill, idx) => {
                    const angle = (360 / orbit4Skills.length) * idx;
                    const isDimmed = Boolean(searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
                    const isCurrent = activeInspected?.name === skill.name;

                    return (
                      <div
                        key={skill.id}
                        className="absolute left-1/2 top-1/2 pointer-events-auto"
                        style={{
                          transform: `rotate(${angle}deg) translate(365px) rotate(-${angle}deg)`,
                        }}
                      >
                        <div
                          style={{
                            animation: isReverse ? 'counter-spin-cw' : 'counter-spin-ccw',
                            animationDuration: `${orbitDurations.orbit4}s`,
                            animationTimingFunction: 'linear',
                            animationIterationCount: 'infinite',
                            animationPlayState: !isRotating ? 'paused' : 'running',
                          }}
                        >
                          <div
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                            onClick={() => setSelectedSkill(skill)}
                            className={`group relative -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                              isDimmed
                                ? 'opacity-25 scale-85 bg-black/40 border-white/5'
                                : isCurrent
                                ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-110 z-30'
                                : 'bg-[#091815]/90 hover:bg-[#0f2a24] border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_16px_rgba(16,185,129,0.4)] hover:scale-105 z-10'
                            } backdrop-blur-md`}
                          >
                            <BrandLogo name={skill.name} size={18} badgeVariant="glass" showGlow={isCurrent} />
                            <span className="text-xs font-mono font-medium text-white group-hover:text-emerald-300 whitespace-nowrap">
                              {skill.name}
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: FULL DIRECTORY MATRIX GRID VIEW                  */}
      {/* ======================================================== */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          
          {filteredSkills.length === 0 ? (
            <div className="rounded-2xl border border-[#1e2940] bg-[#0c0d15]/60 p-12 text-center backdrop-blur-xl">
              <p className="text-zinc-400 font-mono text-sm">No skills found matching &quot;{searchQuery}&quot;.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => {
                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className="group relative rounded-2xl border border-[#1e2940] bg-[#0f1726] p-4 sm:p-5 backdrop-blur-xl hover:border-[#334466] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-950/20 cursor-pointer card-shine flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <BrandLogo
                            name={skill.name}
                            size={38}
                            badgeVariant="glass"
                            showGlow
                            className="group-hover:scale-105 transition-transform shrink-0"
                          />
                          <div>
                            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                              {skill.name}
                            </h3>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {skill.categoryLabel}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-500/10 border border-cyan-500/20 rounded-md px-2 py-0.5 shrink-0">
                          {skill.proficiency || 'Active'}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                        {skill.context}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span className="truncate flex-1 mr-2">
                        {skill.projects[0]}
                      </span>
                      <span className="text-cyan-400 group-hover:underline text-[10px] flex items-center gap-1">
                        <span>Details</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Return to Nucleus Callout */}
          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={() => setViewMode('nucleus')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 hover:from-blue-600/30 hover:to-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all shadow-md cursor-pointer"
            >
              <Atom className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Launch 3D Quantum Orbit Simulation</span>
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SKILL DETAIL DOSSIER MODAL                               */}
      {/* ======================================================== */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#0c0d16] p-6 sm:p-7 shadow-2xl card-shine">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <BrandLogo
                  name={selectedSkill.name}
                  size={44}
                  badgeVariant="glass"
                  showGlow
                  className="shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                    {selectedSkill.categoryLabel}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="p-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-5 space-y-4 text-xs font-sans text-zinc-300">
              
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Practical Application &amp; Production Architecture
                </span>
                <p className="text-zinc-200 leading-relaxed bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  {selectedSkill.context}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                  Linked Projects &amp; Work
                </span>
                <div className="space-y-1.5">
                  {selectedSkill.projects.map((proj, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-200 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/[0.06]">
                <span>Proficiency Level: <strong className="text-cyan-400">{selectedSkill.proficiency || 'Advanced'}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedSkill(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
