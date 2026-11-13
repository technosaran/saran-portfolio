'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import { Sparkles, Search, Layers, Atom } from 'lucide-react';
import { Skill } from '@/lib/neon/db';
import { getSkillLogo } from './TechLogos';

interface OrbitSkill {
  name: string;
  category: 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database';
  categoryLabel: string;
  ringGlow: string;
}

const DEFAULT_INNER: OrbitSkill[] = [
  { name: 'Java', category: 'languages', categoryLabel: 'Programming Languages', ringGlow: 'hover:border-amber-400 hover:shadow-amber-500/30' },
  { name: 'Python', category: 'languages', categoryLabel: 'Programming Languages', ringGlow: 'hover:border-sky-400 hover:shadow-sky-500/30' },
  { name: 'TypeScript', category: 'languages', categoryLabel: 'Programming Languages', ringGlow: 'hover:border-blue-400 hover:shadow-blue-500/30' },
  { name: 'JavaScript', category: 'languages', categoryLabel: 'Programming Languages', ringGlow: 'hover:border-yellow-400 hover:shadow-yellow-500/30' },
  { name: 'SQL', category: 'database', categoryLabel: 'Database & SQL', ringGlow: 'hover:border-indigo-400 hover:shadow-indigo-500/30' },
];

const DEFAULT_MIDDLE: OrbitSkill[] = [
  { name: 'Next.js', category: 'frameworks', categoryLabel: 'Frameworks', ringGlow: 'hover:border-white hover:shadow-white/20' },
  { name: 'React.js', category: 'frameworks', categoryLabel: 'Frameworks', ringGlow: 'hover:border-cyan-400 hover:shadow-cyan-500/30' },
  { name: 'Node.js', category: 'frameworks', categoryLabel: 'Frameworks', ringGlow: 'hover:border-emerald-400 hover:shadow-emerald-500/30' },
  { name: 'TailwindCSS', category: 'frameworks', categoryLabel: 'Styling', ringGlow: 'hover:border-sky-400 hover:shadow-sky-500/30' },
  { name: 'AWS Cloud', category: 'cloud', categoryLabel: 'Cloud Platform', ringGlow: 'hover:border-amber-400 hover:shadow-amber-500/30' },
  { name: 'Docker', category: 'cloud', categoryLabel: 'DevOps & Containers', ringGlow: 'hover:border-blue-400 hover:shadow-blue-500/30' },
  { name: 'Express.js', category: 'frameworks', categoryLabel: 'Frameworks', ringGlow: 'hover:border-zinc-300 hover:shadow-white/20' },
];

const DEFAULT_OUTER: OrbitSkill[] = [
  { name: 'PyTorch', category: 'aiml', categoryLabel: 'Deep Learning', ringGlow: 'hover:border-rose-400 hover:shadow-rose-500/30' },
  { name: 'OpenCV', category: 'aiml', categoryLabel: 'Computer Vision', ringGlow: 'hover:border-emerald-400 hover:shadow-emerald-500/30' },
  { name: 'PostgreSQL', category: 'database', categoryLabel: 'Databases', ringGlow: 'hover:border-blue-400 hover:shadow-blue-500/30' },
  { name: 'Supabase', category: 'database', categoryLabel: 'Cloud DB', ringGlow: 'hover:border-emerald-400 hover:shadow-emerald-500/30' },
  { name: 'Scikit-Learn', category: 'aiml', categoryLabel: 'Machine Learning', ringGlow: 'hover:border-amber-400 hover:shadow-amber-500/30' },
  { name: 'MongoDB', category: 'database', categoryLabel: 'Databases', ringGlow: 'hover:border-green-400 hover:shadow-green-500/30' },
  { name: 'Pandas', category: 'aiml', categoryLabel: 'Data Science', ringGlow: 'hover:border-indigo-400 hover:shadow-indigo-500/30' },
  { name: 'NumPy', category: 'aiml', categoryLabel: 'Scientific Computing', ringGlow: 'hover:border-cyan-400 hover:shadow-cyan-500/30' },
  { name: 'Git & GitHub', category: 'cloud', categoryLabel: 'Version Control', ringGlow: 'hover:border-orange-400 hover:shadow-orange-500/30' },
];

function getOrbitCategory(name: string, category?: string): 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database' {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();
  if (c.includes('language') || ['java', 'python', 'typescript', 'javascript', 'sql'].includes(n)) {
    return 'languages';
  }
  if (c.includes('framework') || c.includes('web')) {
    return 'frameworks';
  }
  if (c.includes('cloud') || n.includes('aws') || n.includes('docker') || n.includes('git')) {
    return 'cloud';
  }
  if (c.includes('database') || n.includes('sql') || n.includes('postgres') || n.includes('mongo') || n.includes('supabase') || n.includes('dbms')) {
    return 'database';
  }
  return 'aiml';
}

function getRingGlow(category: string): string {
  switch (category) {
    case 'languages':
      return 'hover:border-amber-400 hover:shadow-amber-500/30';
    case 'frameworks':
      return 'hover:border-cyan-400 hover:shadow-cyan-500/30';
    case 'cloud':
      return 'hover:border-blue-400 hover:shadow-blue-500/30';
    case 'database':
      return 'hover:border-indigo-400 hover:shadow-indigo-500/30';
    default:
      return 'hover:border-rose-400 hover:shadow-rose-500/30';
  }
}

interface SkillsNucleusProps {
  skills?: Skill[];
}

export default function SkillsNucleus({ skills = [] }: SkillsNucleusProps) {
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; category: string } | null>(null);
  const [userViewMode, setUserViewMode] = useState<'orbit' | 'matrix' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // React 19 external store subscription for screen size without effect cascading re-renders
  const isSmallScreen = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia('(max-width: 640px)');
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false),
    () => false
  );

  const viewMode = userViewMode ?? (isSmallScreen ? 'matrix' : 'orbit');
  const setViewMode = (mode: 'orbit' | 'matrix') => setUserViewMode(mode);

  // Dynamically map from database skills if available
  const { innerOrbit, middleOrbit, outerOrbit, totalCount } = useMemo(() => {
    if (!skills || skills.length === 0) {
      return {
        innerOrbit: DEFAULT_INNER,
        middleOrbit: DEFAULT_MIDDLE,
        outerOrbit: DEFAULT_OUTER,
        totalCount: DEFAULT_INNER.length + DEFAULT_MIDDLE.length + DEFAULT_OUTER.length,
      };
    }

    const mapped: OrbitSkill[] = skills.map((s) => ({
      name: s.name,
      category: getOrbitCategory(s.name, s.category),
      categoryLabel: s.category,
      ringGlow: getRingGlow(getOrbitCategory(s.name, s.category)),
    }));

    // Partition across 3 concentric orbits
    const languages = mapped.filter((s) => s.category === 'languages');
    const frameworksAndCloud = mapped.filter((s) => s.category === 'frameworks' || s.category === 'cloud');
    const aimlAndDb = mapped.filter((s) => s.category === 'aiml' || s.category === 'database');

    const inner = languages.length >= 3 ? languages.slice(0, 5) : DEFAULT_INNER;
    const middle = frameworksAndCloud.length >= 4 ? frameworksAndCloud.slice(0, 7) : DEFAULT_MIDDLE;
    const outer = aimlAndDb.length >= 4 ? aimlAndDb.slice(0, 9) : DEFAULT_OUTER;

    return {
      innerOrbit: inner,
      middleOrbit: middle,
      outerOrbit: outer,
      totalCount: inner.length + middle.length + outer.length,
    };
  }, [skills]);

  // Filter skills for the matrix view
  const matrixFilteredSkills = useMemo(() => {
    const baseList = skills.length > 0 ? skills : [
      { id: 1, name: 'Java', category: 'Programming Languages', level: 'Core / LeetCode' },
      { id: 2, name: 'Python', category: 'Programming Languages', level: 'AI & Data Science' },
      { id: 3, name: 'TypeScript', category: 'Programming Languages', level: 'Full-Stack' },
      { id: 4, name: 'JavaScript', category: 'Programming Languages', level: 'Web Apps' },
      { id: 5, name: 'SQL', category: 'Programming Languages', level: 'Relational DB' },
      { id: 6, name: 'Next.js 16', category: 'Frameworks & Web', level: 'Production' },
      { id: 7, name: 'React.js', category: 'Frameworks & Web', level: 'Advanced' },
      { id: 8, name: 'Tailwind CSS', category: 'Frameworks & Web', level: 'Advanced' },
      { id: 9, name: 'Node.js', category: 'Frameworks & Web', level: 'Backend' },
      { id: 10, name: 'Express.js', category: 'Frameworks & Web', level: 'REST APIs' },
      { id: 11, name: 'PyTorch', category: 'AI & Machine Learning', level: 'Deep Learning' },
      { id: 12, name: 'OpenCV', category: 'AI & Machine Learning', level: 'Computer Vision' },
      { id: 13, name: 'Scikit-Learn', category: 'AI & Machine Learning', level: 'ML Models' },
      { id: 14, name: 'Pandas', category: 'AI & Machine Learning', level: 'Data Analysis' },
      { id: 15, name: 'NumPy', category: 'AI & Machine Learning', level: 'Array Compute' },
      { id: 16, name: 'AWS Cloud', category: 'Cloud & Infrastructure', level: 'EC2, S3, IAM' },
      { id: 17, name: 'Docker', category: 'Cloud & Infrastructure', level: 'Containers' },
      { id: 18, name: 'Git & GitHub', category: 'Cloud & Infrastructure', level: 'Version Control' },
      { id: 19, name: 'PostgreSQL', category: 'Databases & Storage', level: 'Neon Serverless' },
      { id: 20, name: 'Supabase', category: 'Databases & Storage', level: 'Auth & RLS' },
      { id: 21, name: 'MongoDB', category: 'Databases & Storage', level: 'NoSQL' },
    ];

    return baseList.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, selectedCategory]);

  const allCategories = useMemo(() => {
    const list = skills.length > 0 ? skills : [
      { category: 'Programming Languages' },
      { category: 'Frameworks & Web' },
      { category: 'AI & Machine Learning' },
      { category: 'Cloud & Infrastructure' },
      { category: 'Databases & Storage' },
    ];
    return Array.from(new Set(list.map((s) => s.category || 'General')));
  }, [skills]);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      
      {/* View Switcher Controls */}
      <div className="flex items-center gap-1.5 rounded-2xl bg-white/[0.03] p-1 border border-white/[0.08] backdrop-blur-md mb-8">
        <button
          type="button"
          onClick={() => setViewMode('orbit')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            viewMode === 'orbit'
              ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Atom className="h-3.5 w-3.5" />
          <span>Atomic Orbit ({totalCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('matrix')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
            viewMode === 'matrix'
              ? 'bg-white text-zinc-950 font-bold shadow-md shadow-white/10'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Skills Matrix ({skills.length > 0 ? skills.length : 21})</span>
        </button>
      </div>

      {viewMode === 'orbit' ? (
        <>
          {/* Main Atomic Orbital Stage */}
          <div className="orbit-stage relative w-full aspect-square max-w-[310px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[620px] flex items-center justify-center select-none overflow-visible my-2">
            
            {/* Ambient Core Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-sky-500/10 blur-3xl pointer-events-none" />

            {/* ========================================================= */}
            {/* 1. OUTER ORBIT RING: AI/ML, DATA & CLOUD LOGOS            */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-4 sm:inset-6 rounded-full border border-blue-500/20 border-dashed pointer-events-none"
            />
            <div 
              className="absolute inset-4 sm:inset-6 rounded-full pointer-events-none"
              style={{
                animation: 'orbit-spin 56s linear infinite',
              }}
            >
              {outerOrbit.map((skill, index) => {
                const angle = (index / outerOrbit.length) * 2 * Math.PI - Math.PI / 2;
                const left = 50 + 50 * Math.cos(angle);
                const top = 50 + 50 * Math.sin(angle);
                const LogoComponent = getSkillLogo(skill.name);
                
                return (
                  <div
                    key={`${skill.name}-${index}`}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      style={{
                        animation: 'orbit-counter 56s linear infinite',
                      }}
                      onMouseEnter={() => setHoveredSkill({ name: skill.name, category: skill.categoryLabel })}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="relative group cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50"
                    >
                      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/[0.12] bg-[#0c0d16]/95 p-1.5 sm:p-2.5 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 ${skill.ringGlow} group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]`}>
                        <LogoComponent className="w-full h-full object-contain filter drop-shadow-sm group-hover:brightness-110 transition-all" />
                      </div>

                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 scale-90 group-hover:scale-100">
                        <div className="px-2.5 py-1 rounded-lg bg-[#0b0c14]/95 border border-white/20 text-[11px] font-mono text-white whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-1.5">
                          <span className="font-semibold text-zinc-100">{skill.name}</span>
                          <span className="text-[9px] text-blue-400">· {skill.categoryLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* 2. MIDDLE ORBIT RING: WEB & INFRASTRUCTURE LOGOS          */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-16 sm:inset-22 rounded-full border border-indigo-500/25 border-dashed pointer-events-none"
            />
            <div 
              className="absolute inset-16 sm:inset-22 rounded-full pointer-events-none"
              style={{
                animation: 'orbit-counter 40s linear infinite',
              }}
            >
              {middleOrbit.map((skill, index) => {
                const angle = (index / middleOrbit.length) * 2 * Math.PI - Math.PI / 2;
                const left = 50 + 50 * Math.cos(angle);
                const top = 50 + 50 * Math.sin(angle);
                const LogoComponent = getSkillLogo(skill.name);

                return (
                  <div
                    key={`${skill.name}-${index}`}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      style={{
                        animation: 'orbit-spin 40s linear infinite',
                      }}
                      onMouseEnter={() => setHoveredSkill({ name: skill.name, category: skill.categoryLabel })}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="relative group cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50"
                    >
                      <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/[0.12] bg-[#0c0d16]/95 p-1.5 sm:p-2 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 ${skill.ringGlow} group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]`}>
                        <LogoComponent className="w-full h-full object-contain filter drop-shadow-sm group-hover:brightness-110 transition-all" />
                      </div>

                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 scale-90 group-hover:scale-100">
                        <div className="px-2.5 py-1 rounded-lg bg-[#0b0c14]/95 border border-white/20 text-[11px] font-mono text-white whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-1.5">
                          <span className="font-semibold text-zinc-100">{skill.name}</span>
                          <span className="text-[9px] text-indigo-400">· {skill.categoryLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* 3. INNER ORBIT RING: CORE PROGRAMMING LANGUAGES           */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-28 sm:inset-38 rounded-full border border-blue-400/30 border-dashed pointer-events-none"
            />
            <div 
              className="absolute inset-28 sm:inset-38 rounded-full pointer-events-none"
              style={{
                animation: 'orbit-spin 28s linear infinite',
              }}
            >
              {innerOrbit.map((skill, index) => {
                const angle = (index / innerOrbit.length) * 2 * Math.PI - Math.PI / 2;
                const left = 50 + 50 * Math.cos(angle);
                const top = 50 + 50 * Math.sin(angle);
                const LogoComponent = getSkillLogo(skill.name);

                return (
                  <div
                    key={`${skill.name}-${index}`}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      style={{
                        animation: 'orbit-counter 28s linear infinite',
                      }}
                      onMouseEnter={() => setHoveredSkill({ name: skill.name, category: skill.categoryLabel })}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="relative group cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50"
                    >
                      <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/[0.12] bg-[#0c0d16]/95 p-1.5 sm:p-2 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 ${skill.ringGlow} group-hover:border-sky-400 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]`}>
                        <LogoComponent className="w-full h-full object-contain filter drop-shadow-sm group-hover:brightness-110 transition-all" />
                      </div>

                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 scale-90 group-hover:scale-100">
                        <div className="px-2.5 py-1 rounded-lg bg-[#0b0c14]/95 border border-white/20 text-[11px] font-mono text-white whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-1.5">
                          <span className="font-semibold text-zinc-100">{skill.name}</span>
                          <span className="text-[9px] text-sky-400">· {skill.categoryLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* 4. THE NUCLEUS: E = mc² ENERGY CORE                       */}
            {/* ========================================================= */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
              
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-blue-400/50 bg-[#090b14] flex flex-col items-center justify-center p-2 text-center shadow-[0_0_35px_rgba(59,130,246,0.35)] group">
                <div className="absolute inset-1 rounded-full border border-blue-400/20 border-dotted" />
                
                <span className="text-sm sm:text-base font-serif italic font-black text-white tracking-wide group-hover:scale-110 transition-transform">
                  E = mc²
                </span>
                
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-blue-300 mt-0.5">
                  Nucleus
                </span>
              </div>
            </div>

          </div>

          {/* Orbit Dynamic Status Readout */}
          <div className="mt-4 text-center min-h-[32px] flex items-center justify-center">
            {hoveredSkill ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300 animate-in fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                <span>Active Competency: <strong>{hoveredSkill.name}</strong> · <span className="text-zinc-400">{hoveredSkill.category}</span></span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>Hover over any satellite logo to inspect · Orbit pauses automatically on hover</span>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Categorized Grid Matrix View with Real-Time Search & Category Filters */
        <div className="w-full space-y-6 animate-in fade-in duration-300">
          
          {/* Matrix Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl border border-white/[0.08] bg-[#0c0d15]/80 backdrop-blur-xl">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g. Java, PyTorch)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-white bg-white/[0.02]'
                }`}
              >
                All
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold'
                      : 'text-zinc-400 hover:text-white bg-white/[0.02]'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Skills Output */}
          {matrixFilteredSkills.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-zinc-500 border border-white/[0.08] rounded-2xl bg-[#0c0d15]/60">
              No skills match &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {matrixFilteredSkills.map((s, idx) => {
                const Logo = getSkillLogo(s.name);
                return (
                  <div
                    key={`${s.name}-${idx}`}
                    className="flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-[#0c0d15]/90 p-3 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all group card-shine shadow-sm"
                  >
                    <div className="h-8 w-8 rounded-xl bg-black/50 p-1.5 flex items-center justify-center shrink-0 border border-white/[0.08] group-hover:border-blue-500/40 transition-colors">
                      <Logo className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">
                        {s.level || s.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
