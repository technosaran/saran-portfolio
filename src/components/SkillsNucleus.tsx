'use client';

import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
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

function getOrbitCategory(name: string, category: string): 'languages' | 'frameworks' | 'aiml' | 'cloud' | 'database' {
  const c = category.toLowerCase();
  const n = name.toLowerCase();
  if (c.includes('language') || ['java', 'python', 'typescript', 'javascript', 'sql'].includes(n)) {
    return 'languages';
  }
  if (c.includes('framework') || c.includes('web')) {
    return 'frameworks';
  }
  if (c.includes('cloud') || n.includes('aws') || n.includes('docker') || n.includes('git')) {
    return 'cloud';
  }
  if (c.includes('database') || n.includes('sql') || n.includes('postgres') || n.includes('mongo') || n.includes('supabase')) {
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

export default function SkillsNucleus({ skills }: SkillsNucleusProps) {
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; category: string } | null>(null);

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

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      
      {/* Main Atomic Orbital Stage */}
      <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[620px] flex items-center justify-center select-none overflow-visible my-4">
        
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
            // Exact polar coordinates on ring circumference (radius = 50%)
            const angle = (index / outerOrbit.length) * 2 * Math.PI - Math.PI / 2;
            const left = 50 + 50 * Math.cos(angle);
            const top = 50 + 50 * Math.sin(angle);
            const LogoComponent = getSkillLogo(skill.name);
            
            return (
              <div
                key={skill.name}
                className="absolute pointer-events-auto"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Counter-rotation keeps the logo level and upright */}
                <div
                  style={{
                    animation: 'orbit-counter 56s linear infinite',
                  }}
                  onMouseEnter={() => setHoveredSkill({ name: skill.name, category: skill.categoryLabel })}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="relative group cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50"
                >
                  {/* High-Resolution Circular Logo Emblem */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/[0.12] bg-[#0c0d16]/95 p-2 sm:p-2.5 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 ${skill.ringGlow} group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]`}>
                    <LogoComponent className="w-full h-full object-contain filter drop-shadow-sm group-hover:brightness-110 transition-all" />
                  </div>

                  {/* Sleek Hover Tooltip Label */}
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
                key={skill.name}
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
                  {/* High-Resolution Circular Logo Emblem */}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/[0.12] bg-[#0c0d16]/95 p-2 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 ${skill.ringGlow} group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]`}>
                    <LogoComponent className="w-full h-full object-contain filter drop-shadow-sm group-hover:brightness-110 transition-all" />
                  </div>

                  {/* Sleek Hover Tooltip Label */}
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
                key={skill.name}
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
                  {/* High-Resolution Circular Logo Emblem */}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/[0.12] bg-[#0c0d16]/95 p-2 flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 ${skill.ringGlow} group-hover:border-sky-400 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]`}>
                    <LogoComponent className="w-full h-full object-contain filter drop-shadow-sm group-hover:brightness-110 transition-all" />
                  </div>

                  {/* Sleek Hover Tooltip Label */}
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
          {/* Outer Pulsing Nucleus Halo */}
          <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
          
          {/* Core Nucleus Sphere */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-blue-400/50 bg-[#090b14] flex flex-col items-center justify-center p-2 text-center shadow-[0_0_35px_rgba(59,130,246,0.35)] group">
            
            {/* Subtle inner particle ring */}
            <div className="absolute inset-1 rounded-full border border-blue-400/20 border-dotted" />
            
            {/* Energy Core Equation (E = mc²) */}
            <span className="text-sm sm:text-base font-serif italic font-black text-white tracking-wide group-hover:scale-110 transition-transform">
              E = mc²
            </span>
            
            {/* Subtext */}
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-blue-300 mt-0.5">
              Nucleus
            </span>
          </div>
        </div>

      </div>

      {/* Orbit Dynamic Status Readout */}
      <div className="mt-4 text-center min-h-[32px] flex items-center justify-center">
        {hoveredSkill ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300 animate-in fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>Active Competency: <strong>{hoveredSkill.name}</strong> · <span className="text-zinc-400">{hoveredSkill.category}</span></span>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>{totalCount} high-resolution technology logos in orbit · Revolving around energy nucleus (E = mc²)</span>
          </div>
        )}
      </div>

    </div>
  );
}
